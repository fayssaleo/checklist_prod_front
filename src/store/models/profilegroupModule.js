import CustomizedAxios from "../../plugins/axios";

const profilegroupModule = {
  state: {
    profilegroups: [],
    ProfileGroupUsers: [],
    ProfileGroupsByCounters: [],
    ProfileGroupsByCounter: {
      id: null,
      name: "",
      equipmentsCount: null,
      functionalEquipmnet: null,
      damagedCount: null,
      confirmedCount: null,
      closedCount: null,
      nonFunctionalEquipmnet: null,
    },
  },
  mutations: {
    ADD_COMMENT(state, item) {
      console.log("item :", item);
      state.ProfileGroupsByCounters = state.ProfileGroupsByCounters.map((e) => {
        console.log("ee :", e);
        console.log("e.id :", e.id);
        console.log(
          "item.damage?.damage_type?.profile_group_id :",
          item.damage?.damage_type?.profile_group_id
        );
        console.log(
          "e.id==item.damage?.damage_type?.profile_group_id :",
          e.id == item.damage?.damage_type?.profile_group_id
        );
        if (e.id == item.damage?.damage_type?.profile_group_id) {
          console.log("sss :", e);
          e.equipment = e.equipment.map((p) => {
            if (p.id == item.damage.equipment_id) {
              console.log("pp :", p);
              p.damages = p.damages.map((d) => {
                if (d.id == item.damage.id) {
                  console.log("dd :", d);
                  d.comments.push(item.comment);
                }
                return d;
              });
            }
            return p;
          });
        }
        return e;
      });
    },
    SET_ProfileGroupsByCounters_2(state, ProfileGroupsByCounters) {
      state.ProfileGroupsByCounters_ = ProfileGroupsByCounters;
      state.ProfileGroupsByCounters = state.ProfileGroupsByCounters.map((e) => {
        // Find the matching profile group by id
        const r = ProfileGroupsByCounters.find((item) => item.id === e.id);
        if (r) {
          // Safely increment closedCount only once
          e.closedCount = (e.closedCount || 0) + (r.closedCount || 0);
          // Update equipment
          e.equipment = e.equipment.map((p) => {
            // Find matching equipment in r
            const o = (r.equipment || []).find((item) => item.id === p.id);
            if (o) {
              // Safely increment closedCount
              p.closedCount = (p.closedCount || 0) + (o.closedCount || 0);
              // Merge damages without duplicates (by id)
              const existingDamageIds = new Set(
                (p.damages || []).map((d) => d.id)
              );
              const newDamages = (o.damages || []).filter(
                (f) => !existingDamageIds.has(f.id)
              );
              p.damages = [...(p.damages || []), ...newDamages];
              // Store closed damages
              p.closedDamages = [
                ...(p.closedDamages || []),
                ...(o.damages || []).filter((d) => d.status === "closed"),
              ];
            }
            return p;
          });
        }
        return e;
      });
    },
    REMOVE_ClosedDamagesFromProfileGroupsByCounters_2(state) {
      state.ProfileGroupsByCounters = state.ProfileGroupsByCounters.map((e) => {
        const r = state.ProfileGroupsByCounters_.find(
          (item) => item.id === e.id
        );
        if (r) {
          e.closedCount = (e.closedCount || 0) - (r.closedCount || 0);
          e.equipment = e.equipment.map((p) => {
            const o = (r.equipment || []).find((item) => item.id === p.id);
            if (o) {
              p.closedCount = (p.closedCount || 0) - (o.closedCount || 0);
              // Remove closed damages by id
              if (p.closedDamages && o.damages) {
                const removeIds = new Set(
                  (o.damages || [])
                    .filter((d) => d.status === "closed")
                    .map((d) => d.id)
                );
                p.closedDamages = (p.closedDamages || []).filter(
                  (d) => !removeIds.has(d.id)
                );
              }
              // Optionally, also remove from p.damages if needed
              // p.damages = (p.damages || []).filter((d) => !removeIds.has(d.id));
            }
            return p;
          });
        }
        return e;
      });

      state.ProfileGroupsByCounters = state.ProfileGroupsByCounters.map((e) => {
       e.equipment =  e.equipment.map((r) => {
          r.damages= r.damages.filter((d) => {
            return d.status!="closed";
          });
          return r;
        });
        return e;
      });
    },
    DO_REJECT(state, damage) {
      state.ProfileGroupsByCounters = state.ProfileGroupsByCounters.map((e) => {
        if (e.id == damage?.damage_type?.profile_group_id) {
          e.confirmedCount = e.confirmedCount - 1;
          e.damagedCount = e.damagedCount + 1;
          e.equipment = e.equipment.map((p) => {
            if (p.id == damage.equipment_id) {
              p.confirmedCount = p.confirmedCount - 1;
              p.damagedCount = p.damagedCount + 1;
              p.damages = p.damages.map((d) => {
                if (d.id == damage.id) return damage;

                return d;
              });
            }
            return p;
          });
        }
        return e;
      });
    },
    DO_RESOLVE(state, damage) {
      console.log("in damage :", damage);
      state.ProfileGroupsByCounters = state.ProfileGroupsByCounters.map((e) => {
        if (e.id == damage?.damage_type?.profile_group_id) {
          e.confirmedCount = e.confirmedCount + 1;
          e.damagedCount = e.damagedCount - 1;
          e.equipment = e.equipment.map((p) => {
            if (p.id == damage.equipment_id) {
              p.confirmedCount = p.confirmedCount + 1;
              p.damagedCount = p.damagedCount - 1;
              p.damages = p.damages.map((d) => {
                if (d.id == damage.id) return damage;

                return d;
              });
            }
            return p;
          });
        }
        return e;
      });
    },
    DO_CLOSE(state, damage) {
      state.ProfileGroupsByCounters = state.ProfileGroupsByCounters.map((e) => {
        if (e.id == damage.damage?.damage_type?.profile_group_id) {
          if (damage.status == "on progress") {
            e.closedCount = e.closedCount + 1;
            e.damagedCount = e.damagedCount - 1;
          } else {
            e.closedCount = e.closedCount + 1;
            e.confirmedCount = e.confirmedCount - 1;
          }

          e.equipment = e.equipment.map((p) => {
            if (p.id == damage.damage.equipment_id) {
              if (damage.status == "on progress") {
                p.closedCount = p.closedCount + 1;
                p.damagedCount = p.damagedCount - 1;
              } else {
                p.closedCount = p.closedCount + 1;
                p.confirmedCount = p.confirmedCount - 1;
              }

              p.damages = p.damages.map((d) => {
                if (d.id == damage.damage.id) {
                  console.log("in damage 22:", damage);
                  return damage.damage;
                }

                return d;
              });
            }
            return p;
          });
        }
        return e;
      });
    },
    SET_PROFILEDROUPS(state, profilegroups) {
      state.profilegroups = profilegroups;
    },
    SET_ProfileGroupUsers(state, ProfileGroupUsers) {
      state.ProfileGroupUsers = ProfileGroupUsers;
    },
    SET_ProfileGroupsByCounters(state, ProfileGroupsByCounters) {
      state.ProfileGroupsByCounters = ProfileGroupsByCounters;
    },

    SET_ProfileGroupsByCounter(state, ProfileGroupsByCounter) {
      state.ProfileGroupsByCounter.id = ProfileGroupsByCounter.id;
      state.ProfileGroupsByCounter.name = ProfileGroupsByCounter.name;
      state.ProfileGroupsByCounter.equipmentsCount =
        ProfileGroupsByCounter.equipmentsCount;
      state.ProfileGroupsByCounter.functionalEquipmnet =
        ProfileGroupsByCounter.functionalEquipmnet;
      state.ProfileGroupsByCounter.damagedCount =
        ProfileGroupsByCounter.damagedCount;
      state.ProfileGroupsByCounter.confirmedCount =
        ProfileGroupsByCounter.confirmedCount;
      state.ProfileGroupsByCounter.closedCount =
        ProfileGroupsByCounter.closedCount;
      state.ProfileGroupsByCounter.nonFunctionalEquipmnet =
        ProfileGroupsByCounter.nonFunctionalEquipmnet;
    },
    ADD_PROFILEDROUP(state, profilegroups) {
      state.profilegroups.push(profilegroups);
    },
    DELETE_PROFILEDROUP(state, id) {
      state.profilegroups = state.profilegroups.filter((c) => c.id != id);
    },
    EDIT_PROFILEDROUP(state, profilegroups) {
      state.profilegroups = state.profilegroups.map((c) => {
        if (c.id == profilegroups.id) return profilegroups;
        return c;
      });
    },
  },
  actions: {
    setPROFILEDROUPSAction({ commit }) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("profilegroup/")
          .then((response) => {
            commit("SET_PROFILEDROUPS", response.data.payload);
            console.log("set profilegroups ");
            resolve(response);
          })
          .catch((error) => {
            console.log("error :", error);
          });
      });
    },
    setPROFILEDROUPSAction_by_user({ commit },id) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("profilegroup/setPROFILEDROUPSAction_by_user/"+id)
          .then((response) => {
            commit("SET_PROFILEDROUPS", response.data.payload);
            console.log("set profilegroups ");
            resolve(response.data);
          })
          .catch((error) => {
            console.log("error :", error);
          });
      });
    },
    getProfileGroupUsersAction({ commit }, id) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("profilegroup/getProfileGroupUsers/" + id)
          .then((response) => {
            commit("SET_ProfileGroupUsers", response.data.payload);
            resolve(response);
          })
          .catch((error) => {
            console.log("error :", error);
          });
      });
    },
    getProfileGroupsByCountersAction({ commit }, id) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("profilegroup/getProfileGroupsByCounters")
          .then((response) => {
            commit("SET_ProfileGroupsByCounters", response.data.payload);
            resolve(response);
          })
          .catch((error) => {
            console.log("error :", error);
          });
      });
    },
    setgetProfileGroupsByCounters_ALL_Action({ commit }, payload) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("profilegroup/getProfileGroupsByCounters_ALL/"+payload.id)
          .then((response) => {
            if(payload.id==3)
              commit("SET_ProfileGroupsByCounters", response.data.payload.filter((c) => payload.userProfiles_grp.includes(c.name)));
            else
              commit("SET_ProfileGroupsByCounters", response.data.payload);
            resolve(response);
          })
          .catch((error) => {
            console.log("error :", error);
          });
      });
    },
    setgetProfileGroupsByCounters_ALL_Action_2({ commit }, id) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("profilegroup/getProfileGroupsByCounters_ALL_2/"+id)
          .then((response) => {
            commit("SET_ProfileGroupsByCounters_2", response.data.payload);
            resolve(response);
          })
          .catch((error) => {
            console.log("error :", error);
          });
      });
    },
    REMOVE_ClosedDamagesFromProfileGroupsByCounters_2__({ commit }) {
      commit("REMOVE_ClosedDamagesFromProfileGroupsByCounters_2");
    },
    getProfileGroupsByCountersITAction({ commit }, id) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("profilegroup/getProfileGroupsByCountersIT")
          .then((response) => {
            commit("SET_ProfileGroupsByCounters", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            console.log("error :", error);
          });
      });
    },
    getProfileGroupsByCountersTECAction({ commit }, id) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("profilegroup/getProfileGroupsByCountersTEC")
          .then((response) => {
            commit("SET_ProfileGroupsByCounters", response.data.payload);
            resolve(response.data.payload);
          })
          .catch((error) => {
            console.log("error :", error);
          });
      });
    },
    getProfileGroupsByCounterAction({ commit }, id) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("profilegroup/getProfileGroupsByCounter/" + id)
          .then((response) => {
            commit("SET_ProfileGroupsByCounter", response.data.payload);
            resolve(response);
          })
          .catch((error) => {
            console.log("error :", error);
          });
      });
    },
    getProfileGroupsByCounterITAction({ commit }, id) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("profilegroup/getProfileGroupsByCounterIT/" + id)
          .then((response) => {
            commit("SET_ProfileGroupsByCounter", response.data.payload);
            resolve(response);
          })
          .catch((error) => {
            console.log("error :", error);
          });
      });
    },
    getProfileGroupsByCounterTECAction({ commit }, id) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.get("profilegroup/getProfileGroupsByCounterTEC/" + id)
          .then((response) => {
            commit("SET_ProfileGroupsByCounter", response.data.payload);
            resolve(response);
          })
          .catch((error) => {
            console.log("error :", error);
          });
      });
    },
    addPROFILEDROUPAction({ commit }, profilegroup) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("profilegroup/create", {
          name: profilegroup.name,
          department_id: profilegroup.department_id,
        })
          .then((response) => {
            commit("ADD_PROFILEDROUP", response.data.payload);
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    addUserToProfileGroupAction({ commit }, UserToProfileGroup) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("profilegroup/addUserToProfileGroup", {
          user_id: UserToProfileGroup.user_id,
          profile_group_id: UserToProfileGroup.profile_group_id,
        })
          .then((response) => {
            //commit("ADD_PROFILEDROUP", response.data.payload);
            console.log(response.data.payload);
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    deletePROFILEDROUPAction({ commit }, profilegroup) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("profilegroup/delete", {
          id: profilegroup.id,
        })
          .then((response) => {
            commit("DELETE_PROFILEDROUP", profilegroup.id);
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    deleteUserFromProfileGroupAction({ commit }, profilegroup) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("profilegroup/deleteUserFromProfileGroup", {
          profile_group_id: profilegroup.profile_group_id,
          user_id: profilegroup.user_id,
        })
          .then((response) => {
            console.log("res", response.data.payload);
            // commit("DELETE_PROFILEDROUP", profilegroup.id);
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    editPROFILEDROUPAction({ commit }, profilegroup) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post("profilegroup/update", {
          id: profilegroup.id,
          name: profilegroup.name,
          department_id: profilegroup.department_id,
        })
          .then((response) => {
            commit("EDIT_PROFILEDROUP", response.data.payload);
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    doRejectAction({ commit }, payload) {
      commit("DO_REJECT", payload);
    },
    doResolveAction({ commit }, payload) {
      commit("DO_RESOLVE", payload);
    },
    doCloseAction({ commit }, payload) {
      commit("DO_CLOSE", payload);
    },
    add_comment_in_profile_group_action({ commit }, payload) {
      return new Promise((resolve, reject) => {
        CustomizedAxios.post(
          "damages/add_comment_in_profile_group",
          payload.comment
        )
          .then((response) => {
            console.log("response", response);
            console.log("payload", payload);
            commit("ADD_COMMENT", {
              damage: payload.damage,
              comment: response.data.payload,
            });
            resolve(response.data.payload);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  getters: {
    getprofilegroups: (state) => {
      return state.profilegroups;
    },
    getProfileGroupUsers: (state) => {
      return state.ProfileGroupUsers;
    },
    getProfileGroupsByCounters: (state) => {
      return state.ProfileGroupsByCounters;
    },
    getProfileGroupsByCounter: (state) => {
      return state.ProfileGroupsByCounter;
    },
  },
};
export default profilegroupModule;
