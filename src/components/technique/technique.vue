<template>
  <div style="padding: 50px;      padding-top: 0px;">
    <v-col cols="6" md="6">
      <v-btn v-if="false" color="primary" class="pa-2 white--text" @click="changeDepartment">
        Fill in checklist<v-icon medium class="mr-2"> mdi-eye-outline </v-icon>
      </v-btn>
    </v-col>

    <v-row>
      <v-col v-if="step == 1" cols="6" style="padding-top: 0; margin-top: 0;">
        <span class="title_tech_new">DEFECTS BY EQUIPMENT TYPES:</span>
      </v-col>
      <v-col v-else-if="step == 2" cols="6" style="padding-top: 0; margin-top: 0;">
        <span class="title_tech_new_3" @click="step = 1">EQUIPMENT</span>
        <span class="title_tech_new_31">{{ selectedGroup_comp?.name }}</span>
      </v-col>
      <v-col v-else-if="step == 3" cols="6" style="padding-top: 0; margin-top: 0;">
        <span class="title_tech_new_3" @click="step = 1">EQUIPMENT </span>
        <span class="title_tech_new_32" @click="step = 2">{{ selectedEquipment?.nameEquipment }}</span>
        <span class="title_tech_new_33">DEFECTS</span>
      </v-col>
      <v-col v-else cols="6" style="padding-top: 0; margin-top: 0;">
        <span class="title_tech_new_3" @click="step = 1">EQUIPMENT </span>
        <span class="title_tech_new_32" @click="step = 2">{{ selectedEquipment?.nameEquipment }}</span>
        <span class="title_tech_new_34" @click="step = 3">DEFECTS</span>
        <span v-if="selectedDamage?.damage_type.department_id!=1" class="title_tech_new_35">{{ selectedDamage?.damage_type.damage_type_master?.name || 'IT' }}</span>
        <span v-else class="title_tech_new_36">{{ 'IT' }}</span>
      </v-col>





      <v-col v-if="step == 1" cols="6" style="padding-top: 0; margin-top: 0;float: right !important;">
        <v-row style="float: right;">
          <v-col cols="8" style="max-width: fit-content;padding-right: 0;">
            <span class="title_tech_new_2 afterrr" style="padding-top: 0;    padding-left: 0;">
              <span @click="closedShow_archiveShowClose()" v-if="!closedShow_archive"
                class="monitors_1 closedHide_archive">CLOSED</span>
              <span @click="closedHide_archiveHideClose()" v-else style="" class="monitors_1 closedShow_archive">CLOSED:
                {{ countTotal }}</span>
              <br>
              <span style="text-shadow: none;" class="monitors_2">DEFECTS: {{ countDefects }}</span>
            </span>
          </v-col>

          <v-col cols="2" style="max-width: fit-content;padding-right: 0;padding-left: 0;">
            <span style="
            text-shadow: none !important;
                        color: #d43737;
                        text-shadow: 2px 6px 7px #d43737 !important;" class="title_tech_new_2">
              IN PROGRESS<br>{{ countOnProgress }}
            </span>
          </v-col>
          <v-col cols="2" style="max-width: fit-content;padding-left: 0;">
            <span style=" 
              text-shadow: none !important;
              color: rgb(251, 133, 0);
                          border-top-right-radius: 35px;" class="title_tech_new_2 beforee">
              RESOLVED<br>{{ countResolved }}
            </span>
          </v-col>
        </v-row>




      </v-col>
      <v-col v-else-if="step == 2" cols="6" style="padding-top: 0; margin-top: 0;float: right !important;">
        <v-row style="float: right;">
          <v-col cols="8" style="max-width: fit-content;padding-right: 0;">
            <span class="title_tech_new_2 afterrr"
              style="background-color :rgb(21 43 98);padding-top: 0;    padding-left: 0;">
              <span @click="closedShow_archiveShowClose()" v-if="!closedShow_archive"
                class="monitors_1 closedHide_archive">CLOSED</span>
              <span @click="closedHide_archiveHideClose()" v-else style="" class="monitors_1 closedShow_archive">CLOSED:
                {{ countTotal }}</span><br>
              <span style=" font-size: 15px; text-shadow: none;" class="monitors_2">DEFECTS: {{ countDefects }} in {{
                countDefects_equipment }}</span>
            </span>
          </v-col>

          <v-col cols="2" style="max-width: fit-content;padding-right: 0;padding-left: 0;">
            <span
            v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            style="
            text-shadow: none;
                   
                        text-shadow: 2px 6px 7px #d43737 !important;
                           width: 70px !important;
                          padding-left: 2px !important;
                          font-size: 15px !important;
                          padding-top: 11px !important;
                          background-color :rgb(21 43 98);
                        " class="title_tech_new_2">
              CHECKED<br>{{ countChecked }}
            </span>
          </v-col>
          <v-col cols="2" style="max-width: fit-content;padding-right: 0;padding-left: 0;">
            <span style="
            text-shadow: none;
                        color: #d43737;
                            width: 152px !important;
    padding-left: 2px !important;
    font-size: 15px !important;
    padding-top: 11px !important;
                        text-shadow: 2px 6px 7px #d43737 !important;
                        background-color :rgb(21 43 98);
                        " class="title_tech_new_2">
              IN PROGRESS<br>{{ countOnProgress }} in {{ countProgress_equipment }}
            </span>
          </v-col>
          <v-col cols="2" style="max-width: fit-content;padding-left: 0;">
            <span style=" 
              text-shadow: none;color: rgb(251, 133, 0);
                             width: 152px !important;
    padding-left: 2px !important;
    font-size: 15px !important;
    padding-top: 11px !important;
    background-color :rgb(21 43 98);
                          border-top-right-radius: 35px;" class="title_tech_new_2 beforee">
              RESOLVED<br>{{ countResolved }} in {{ countResolve_equipment }}
            </span>
          </v-col>
        </v-row>




      </v-col>
      <v-col v-else-if="step == 3" cols="6" style="padding-top: 0; margin-top: 0;float: right !important;">
        <v-row style="float: right;">
          <v-col cols="8" style="max-width: fit-content;padding-right: 0;">
            <span class="title_tech_new_2 afterrr" style="padding-top: 0;    padding-left: 0;">
              <span @click="closedShow_archiveShowClose()" v-if="!closedShow_archive"
                class="monitors_1 closedHide_archive">CLOSED</span>
              <span @click="closedHide_archiveHideClose()" v-else style="" class="monitors_1 closedShow_archive">CLOSED:
                {{ countTotal }}</span><br>
              <span style="text-shadow: none;" class="monitors_2">DEFECTS: {{ countDefects }}</span>
            </span>
          </v-col>

          <v-col cols="2" style="max-width: fit-content;padding-right: 0;padding-left: 0;">
            <span style="
            text-shadow: none !important;
                        color: #d43737;
                        text-shadow: 2px 6px 7px #d43737 !important;
                        " class="title_tech_new_2">
              IN PROGRESS<br>{{ countOnProgress }}
            </span>
          </v-col>
          <v-col cols="2" style="max-width: fit-content;padding-left: 0;">
            <span style=" 
              text-shadow: none !important;
              color: rgb(251, 133, 0);
                          border-top-right-radius: 35px;
                          
                          " class="title_tech_new_2 beforee">
              RESOLVED<br>{{ countResolved }}
            </span>
          </v-col>
        </v-row>




      </v-col>
      <v-col v-else-if="step == 4" cols="6" style="padding-top: 0; margin-top: 0;float: right !important;">
        <v-row
        v-if=" getUserActive?.fonction?.name=='ADMIN'"
        style="float: right;">

          <v-col cols="1" style="max-width: fit-content;padding-right: 0;">
            <span class="title_tech_new_2 afterrr" style="

                width: 94px !important;
                height: 55px;
                padding-left: 52px;
                padding-top: 9px;
                text-shadow: none !important;
                "><v-icon style="
                        color: white;
                        font-size: 31px;
                " class="monitors_1">{{ selectedDamage?.damage_type?.damage_type_master?.icon || selectedDamage?.damage_type?.icon }}</v-icon></span>
          </v-col>
          <v-col cols="6" style="max-width: fit-content;padding-right: 0;padding-left: 0;">
            <span style="
                    text-shadow: none !important;
    color: white;
    font-size: 20px;
    min-width: 396px !important;
    height: 55px;
    margin-right: -10px;
    text-align: left;
    padding-top: 10px;
                        " class="title_tech_new_2 beforee_2">
              {{ selectedDamage?.damage_type?.name?.toUpperCase() }}
            </span>
          </v-col>

          <v-col cols="3" style="max-width: fit-content;">
            <span class="title_tech_new_2 beforee_2 afterrr_2" style="    padding-top: 0px;
    padding-left: 0px;
    height: 55px;">

              <span v-if="selectedDamage_comp?.status == 'on progress'" style="
                  text-shadow: none;
                  font-size: 14px;
                  padding-right: 32px;
                  padding-top: 0px;
                  height: 23px;
                  margin-top: 0 !important;
                  color: orange;
              " class="monitors_2 resolveInnerButton"
              @click="open_damageTech_cmt_resolve()"
              >RESOLVE</span>
              <span v-else-if="selectedDamage_comp?.status == 'resolved'" style="
                  text-shadow: none;
                  font-size: 14px;
                  padding-right: 32px;
                  padding-top: 0px;
                  height: 23px;
                  margin-top: 0 !important;
                    color: RED !important;"
                     @click="open_damageTech_cmt()"
               class="monitors_2 rejectInnerButton">REJECT</span>
              <span v-else style="
                  text-shadow: none;
                  font-size: 14px;
                  padding-right: 32px;
                  padding-top: 0px;
                  height: 23px;
                  margin-top: 0 !important;
                    color: #ffffffb3 !important;
                    
                    "
                   
               class="monitors_2 ">CLOSED</span>
              <br>
              <span v-if="selectedDamage_comp?.status != 'closed' " style="
                    text-shadow: none;
                    font-size: 14px;
                    padding-right: 0px !important;
                    padding-top: 0 !important;
                    height: 54px;
                    color: white !important;"
                     @click="open_damageTech_cmt_closed()"
               class="monitors_2 closeInnerButton">CLOSE</span>
              <span v-else style="
                    text-shadow: none;
                    font-size: 14px;
                    padding-right: 0px !important;
                    padding-top: 0 !important;
                    height: 54px;
                    color: white !important;"
               class="monitors_2 ">ID: {{ selectedDamage_comp?.id ? selectedDamage_comp.id.toString().padStart(4, '0') : '' }}</span>
               
               
            </span>
           
          
          </v-col>
        </v-row>
        <v-row
        v-else-if=" getUserActive.fonction?.department_id==3"
        style="float: right;">

          <v-col cols="1" style="max-width: fit-content;padding-right: 0;">
            <span class="title_tech_new_2 afterrr" style="

                width: 94px !important;
                height: 55px;
                padding-left: 52px;
                padding-top: 9px;
                text-shadow: none !important;
                "><v-icon style="
                        color: white;
                        font-size: 31px;
                " class="monitors_1">{{ selectedDamage?.damage_type?.damage_type_master?.icon || selectedDamage?.damage_type?.icon }}</v-icon></span>
          </v-col>
          <v-col cols="6" style="max-width: fit-content;padding-right: 0;padding-left: 0;">
            <span style="
                    text-shadow: none !important;
    color: white;
    font-size: 20px;
    min-width: 396px !important;
    height: 55px;
    margin-right: -10px;
    text-align: left;
    padding-top: 10px;
                        " class="title_tech_new_2 beforee_2">
              {{ selectedDamage?.damage_type?.name?.toUpperCase() }}
            </span>
          </v-col>

          <v-col cols="3" style="max-width: fit-content;">
            <span class="title_tech_new_2 beforee_2 afterrr_2" style="    padding-top: 0px;
    padding-left: 0px;
    height: 55px;">


              <span v-if="selectedDamage_comp?.status == 'resolved'" style="
                  text-shadow: none;
                  font-size: 14px;
                  padding-right: 32px;
                  padding-top: 0px;
                  height: 23px;
                  margin-top: 0 !important;
                    color: RED !important;"
                     @click="open_damageTech_cmt()"
               class="monitors_2 rejectInnerButton">REJECT</span>
              <span v-else-if="selectedDamage_comp?.status == 'on progress'" style="
                  text-shadow: none;
                  font-size: 14px;
                  padding-right: 32px;
                  padding-top: 0px;
                  height: 23px;
                  margin-top: 0 !important;
                    color: white !important;"
                   
               class="monitors_2 ">ID: {{ selectedDamage_comp?.id ? selectedDamage_comp.id.toString().padStart(4, '0') : '' }} </span>
              <span v-else style="
                  text-shadow: none;
                  font-size: 14px;
                  padding-right: 32px;
                  padding-top: 0px;
                  height: 23px;
                  margin-top: 0 !important;
                    color: #ffffffb3 !important;
                    
                    "
                   
               class="monitors_2 ">CLOSED</span>
              <br>
              <span v-if="selectedDamage_comp?.status != 'closed' " style="
                    text-shadow: none;
                    font-size: 14px;
                    padding-right: 0px !important;
                    padding-top: 0 !important;
                    height: 54px;
                    color: white !important;"
                     @click="open_damageTech_cmt_closed()"
               class="monitors_2 closeInnerButton">CLOSE</span>
              <span v-else style="
                    text-shadow: none;
                    font-size: 14px;
                    padding-right: 0px !important;
                    padding-top: 0 !important;
                    height: 54px;
                    color: white !important;"
               class="monitors_2 ">ID: {{ selectedDamage_comp?.id ? selectedDamage_comp.id.toString().padStart(4, '0') : '' }}</span>
               
               
            </span>
           
          
          </v-col>
        </v-row>
        <v-row
        v-else-if=" getUserActive.fonction?.department_id==1 || getUserActive.fonction?.department_id==2"
        style="float: right;">

          <v-col cols="1" style="max-width: fit-content;padding-right: 0;">
            <span class="title_tech_new_2 afterrr" style="

                width: 94px !important;
                height: 55px;
                padding-left: 52px;
                padding-top: 9px;
                text-shadow: none !important;
                "><v-icon style="
                        color: white;
                        font-size: 31px;
                " class="monitors_1">{{ selectedDamage?.damage_type?.damage_type_master?.icon || selectedDamage?.damage_type?.icon }}</v-icon></span>
          </v-col>
          <v-col cols="6" style="max-width: fit-content;padding-right: 0;padding-left: 0;">
            <span style="
                    text-shadow: none !important;
    color: white;
    font-size: 20px;
    min-width: 396px !important;
    height: 55px;
    margin-right: -10px;
    text-align: left;
    padding-top: 10px;
                        " class="title_tech_new_2 beforee_2">
              {{ selectedDamage?.damage_type?.name?.toUpperCase() }}
            </span>
          </v-col>

          <v-col cols="3" style="max-width: fit-content;">
            <span class="title_tech_new_2 beforee_2 afterrr_2" style="    padding-top: 0px;
    padding-left: 0px;
    height: 55px;">


              <span v-if="selectedDamage_comp?.status == 'on progress'" style="
                  text-shadow: none;
                  font-size: 14px;
                  padding-right: 32px;
                  padding-top: 0px;
                  height: 23px;
                  margin-top: 0 !important;
                  color: orange;
              " class="monitors_2 resolveInnerButton"
              @click="open_damageTech_cmt_resolve()"
              >RESOLVE</span>
              <span v-else-if="selectedDamage_comp?.status == 'resolved'" style="
                  text-shadow: none;
                  font-size: 14px;
                  padding-right: 32px;
                  padding-top: 0px;
                  height: 23px;
                  margin-top: 0 !important;
                    color: #ffffffb3  !important;"
                   
               class="monitors_2 ">RESOLVED</span>
              <span v-else style="
                  text-shadow: none;
                  font-size: 14px;
                  padding-right: 32px;
                  padding-top: 0px;
                  height: 23px;
                  margin-top: 0 !important;
                    color: #ffffffb3  !important;"
                   
               class="monitors_2 ">CLOSED</span>
              <br>
              <span  style="
                    text-shadow: none;
                    font-size: 14px;
                    padding-right: 0px !important;
                    padding-top: 0 !important;
                    height: 54px;
                    color: white !important;"
               class="monitors_2 ">ID: {{ selectedDamage_comp?.id ? selectedDamage_comp.id.toString().padStart(4, '0') : '' }}</span>
               
               
            </span>
           
          
          </v-col>
        </v-row>




      </v-col>


    </v-row>

    <v-row style="
   border: 1px solid rgba(17, 14, 64, 0.25);
    border-radius: 13px;
    padding-bottom: 43px;
    min-height: 60vh;

    padding-top: 28px;
    position: relative;
">
      <span class="controler" v-if="step != 4">
        <span @click="viewTable = false" :class="(viewTable == false) ? 'viewChecked' : ''" class="viewBoard">
          <v-icon medium class="mr-2"> mdi-rectangle </v-icon>
        </span>
        <span @click="viewTable = true" :class="(viewTable == true) ? 'viewChecked' : ''" class="table_">
          <v-icon medium class="mr-2"> mdi-table-large </v-icon>
        </span>
      </span>


      <span class="controler_filter" v-if="false">
        <span @click="viewTable = false" :class="(viewTable == false) ? 'viewChecked' : ''" class="viewBoard">
          <v-icon medium class="mr-2"> mdi-rectangle </v-icon>
        </span>

      </span>

      <template v-if="step == 1">
        <v-col v-if="viewTable">
          <v-data-table :items-per-page="5" :headers="computedHeaders" :items="profilegroupsBydepartements"
            :search="search" :loading="loading" sort-by="item.id" class="elevation-1 technique_table_new">

            <template v-slot:item="{ item }">
              <tr @click="pageView(item)" class="">


                <td>
                  <img :src="getProfileGroupIcon(item?.name)" alt="">
                </td>
                <td>
                  {{ item?.name }}
                </td>
                <td>
                  {{ item?.equipmentsCount }}
                </td>
                <td
                v-if="getUserActive.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
                >
                  {{ item?.equipmentCheckedCount }}
                </td>
                <td>
                  {{ item?.damagedCount }}
                </td>
                <td>
                  {{ item?.confirmedCount }}
                </td>
                <td>
                  <v-btn style="    border-radius: 146px;" color="transparent" class="mr-2 btn white--text btn"
                    @click="pageView(item)">
                    <v-icon medium class="mr-2"> mdi-eye-outline </v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
            <template v-slot:no-data>
              <v-btn color="#293777" style="color:white;" @click="initialize()"> Reset </v-btn>
            </template>
          </v-data-table>
        </v-col>
        <template v-else-if="!viewTable">
          <v-col cols="6" v-for="profilegroupsBydepartement in profilegroupsBydepartements">
            <span class="profile_group_tickets" @click="pageView(profilegroupsBydepartement)">
              <img :src="require(`@/assets/_${profilegroupsBydepartement?.name}_icon.jpg`)" alt="">

              {{ profilegroupsBydepartement?.name }}
              <span class="t_">TOTAL EQUIPMENT <span class="profile_group_tickets_number"
                  style="font-weight: 900;    font-size: 15px;">{{ profilegroupsBydepartement?.equipment.length
                  }}</span></span>
              <span
              v-if="getUserActive.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
              class="d_">CHECKED<span class="profile_group_tickets_number"
                  style="color:#0ab20a;font-weight: 900;    font-size: 15px;">{{
                    profilegroupsBydepartement?.equipmentCheckedCount }}</span></span>
              <span class="tf_">IN PROGRESS<span class="profile_group_tickets_number"
                  style="color:#d43737;font-weight: 900;    font-size: 15px;">{{
                    (profilegroupsBydepartement?.confirmedCount + profilegroupsBydepartement?.damagedCount)
                  }}</span></span>
              <span class="r_">RESOLVED<span class="profile_group_tickets_number"
                  style="color:#fb8500;font-weight: 900;    font-size: 15px;">{{
                    (profilegroupsBydepartement?.confirmedCount) }}</span></span>

            </span>

          </v-col>
        </template>
      </template>




      <v-col style="height: 100%;" v-else-if="step == 2">
        <TechniqueView :idDomainGroupesid="idDomainGroupesid" :selectEquipmentType="selectEquipmentType"
          :viewTable="viewTable" :closedShow_archive="closedShow_archive" @setStep_3="setStep_3" />
      </v-col>



      <v-col v-else-if="step == 3" style=" padding-bottom: 0; ">
        <TechniqueEquipment :selectEquipmentType="selectEquipmentType" :idEquipment="idEquipment"
          :selectedEquipment="selectedEquipment_comp" :viewTable="viewTable" :showLoading="showLoading"
          :hideLoading="hideLoading" @setStep_4="setStep_4" />
      </v-col>
      <v-col v-else-if="step == 4" class="scoped_Menu">
        <DamageView 
        :selectedDamage="selectedDamage" 
        :viewTable="viewTable" 
        :damageTech_cmt_resolve="damageTech_cmt_resolve" 
        :damageTech_cmt="damageTech_cmt" 
        :damageTech_cmt_closed="damageTech_cmt_closed" 
        :selectedDamage_comp="selectedDamage_comp" 
        @hideLoading="hideLoading"
        @showLoading="showLoading"
        @setStep_4="setStep_4"
        @open_damageTech_cmt="open_damageTech_cmt"
        @close_damageTech_cmt="close_damageTech_cmt"
        @open_damageTech_cmt_resolve="open_damageTech_cmt_resolve"
        @close_damageTech_cmt_resolve="close_damageTech_cmt_resolve"
        @open_damageTech_cmt_closed="open_damageTech_cmt_closed"
        @close_damageTech_cmt_closed="close_damageTech_cmt_closed"
        
        
        />
      </v-col>





    </v-row>
    <LoadingPage v-if="LoadingPage == true" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import TechniqueView from "./techniqueView.vue";
import TechniqueEquipment from "./techniqueEquipment.vue";
import DamageView from "./DamageView.vue";
import swal from "sweetalert";
//import LoadingPage from "../LoadingPage.vue";
const LoadingPage = defineAsyncComponent(() => import("../LoadingPage.vue"));
export default {
  components: {
    LoadingPage,
    TechniqueView,
    TechniqueEquipment,
    DamageView
  },
  data: () => ({
    damageTech_cmt:false,
    damageTech_cmt_closed:false,
    damageTech_cmt_resolve:false,
    closedShow_archive: false,
    selectedEquipment: null,
    selectedDamage: null,
    selectEquipmentType: null,
    idEquipment: 1,
    idDomainGroupesid: 1,
    step: 1,
    viewTable: false,
    loading: false,
    LoadingPage: false,
    search: "",
    fonction: "",
    confirmAddSave: false,
    headers: [
      {
        text: "",
        value: "",
      },
      { text: "NAME", value: "name", sortable: true },
      {
        text: "TOTAL EQUIPMENT",
        value: "equipmentsCount",
        sortable: true,
      },
      {
        text: "CHECKED",
        value: "equipmentCheckedCount",
        sortable: true,
      },
      {
        text: "IN PROGRESS",
        value: "damagedCount",
        sortable: true,
      },
      {
        text: "RESOLVED",
        value: "confirmedCount",
        sortable: true,
      },

      { text: "", value: "actions", sortable: false },
    ],
    profilegroups: [],
    profilegroupsBydepartements: [],
    departements: [],
    test: [],
    merge: [],
    departementId: "",
    editedIndex: -1,
    ProfileGroupsByCounters: {
      id: null,
      equipmentsCount: null,
      damagedCount: null,
      confirmedCount: null,
      closedCount: null,
    },
    editedItem: {
      id: "",
      name: "",
      departement: "",
      domain: {
        id: "",
      },
    },
    defaultItem: {
      id: "",
      name: "",
      departement: "",
      domain: {
        id: "",
      },
    },
    userDepartment: "",
  }),
  mounted() {
    document.title = "CHECKLIST";
    this.fonction = this.getUserActive?.fonction?.name;
    console.log("this.fonctionthis.fonction",this.fonction)
    if (this.fonction == "DRIVER") {
      this.$router.push({ name: "Damage" });
      return;
    }
    this.loading = true;
    this.initialize();
    this.loading = false;
    setTimeout(() => {


    }, 2500);
  },
  computed: {
    ...mapGetters([
      "getProfileGroupsByCounters",
      "getdepartements",
      "getUserActive",
    ]),

    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    computedHeaders() {
            let header=[];
      this.headers.map((r)=>{
        if(this.getUserActive.fonction?.department_id!=3 && this.getUserActive?.fonction?.name!='ADMIN'){
          if(r.value == "equipmentCheckedCount"){
            return;
          }
        }

        header.push(r);
      });
      return header;
    },
    //----------------------------------------------
    countDefects_equipment() {
      let count = 0;
      this.getProfileGroupsByCounters.filter((e) => {
        return e.id == this.selectEquipmentType.id
      })[0].
        equipment.map((e) => {
          if (e.damagedCount > 0 || e.confirmedCount > 0) {
            count++;
          }

        });
      return count;
    },
    countResolve_equipment() {
      let count = 0;
      this.getProfileGroupsByCounters.filter((e) => {
        return e.id == this.selectEquipmentType.id
      })[0].
        equipment.map((e) => {
          if (e.confirmedCount > 0) {
            count++;
          }

        });
      return count;
    },
    countProgress_equipment() {
      let count = 0;
      this.getProfileGroupsByCounters.filter((e) => {
        return e.id == this.selectEquipmentType.id
      })[0].
        equipment.map((e) => {
          if (e.damagedCount > 0) {
            count++;
          }

        });
      return count;
    },
    countAfftected_equipment() {
      let count = 0;
      this.getProfileGroupsByCounters.filter((e) => {
        return e.id == this.selectEquipmentType.id
      })[0].
        equipment.map((e) => {
          if (e.damagedCount > 0 || e.confirmedCount > 0 || e.closedCount > 0) {
            count++;
          }

        });
      return count;
    },
    countTotal() {
      let count = 0;
      this.getProfileGroupsByCounters.map((e) => {
        if (this.step == 1) {
          count += e.closedCount;
        }
        else if (this.step == 2 && this.selectEquipmentType?.id == e?.id) {
          count += e.closedCount;
        }
        else if (this.step == 3 && this.selectEquipmentType?.id == e?.id) {
          e.equipment.map((r) => {
            if (r?.id == this.selectedEquipment?.id) {
              count += r.closedCount;
            }
          })
        }
      });
      return count;
    },
    countDefects() {
      let count = 0;
      this.getProfileGroupsByCounters.map((e) => {
        if (this.step == 1) {
          count += e.damagedCount + e.confirmedCount;
        }
        else if (this.step == 2 && this.selectEquipmentType?.id == e?.id) {
          count += e.damagedCount + e.confirmedCount;
        }
        else if (this.step == 3 && this.selectEquipmentType?.id == e?.id) {
          e.equipment.map((r) => {
            if (r?.id == this.selectedEquipment?.id) {
              count += r.damagedCount + r.confirmedCount;
            }
          })
        }
      });
      return count;
    },
    countOnProgress() {
      let count = 0;
      this.getProfileGroupsByCounters.map((e) => {
        if (this.step == 1) {
          count += e.damagedCount;
        }
        else if (this.step == 2 && this.selectEquipmentType?.id == e?.id) {
          count += e.damagedCount;
        }
        else if (this.step == 3 && this.selectEquipmentType?.id == e?.id) {

          e.equipment.map((r) => {
            if (r?.id == this.selectedEquipment?.id) {
              console.log("countOnProgress", count)
              count += r.damagedCount;
            }
          })
        }
      });
      return count;
    },
    countChecked() {
      let count = 0;
      this.getProfileGroupsByCounters.map((e) => {
        if (this.step == 1) {
          count += e.equipmentCheckedCount;
        }
        else if (this.step == 2 && this.selectEquipmentType?.id == e?.id) {
          count += e.equipmentCheckedCount;
        }
      });
      return count;
    },
    countResolved() {
      let count = 0;
      this.getProfileGroupsByCounters.map((e) => {
        if (this.step == 1) {
          count += e.confirmedCount;
        }
        else if (this.step == 2 && this.selectEquipmentType?.id == e?.id) {
          count += e.confirmedCount;
        }
        else if (this.step == 3 && this.selectEquipmentType?.id == e?.id) {
          e.equipment.map((r) => {
            if (r?.id == this.selectedEquipment?.id) {
              count += r.confirmedCount;
            }
          })
        }
      });
      return count;
    },
    //----------------------------------------------
    selectedGroup_comp() {
      return this.selectEquipmentType = this.profilegroupsBydepartements.filter((z) => {
        return z.id == this.idDomainGroupesid;
      })[0];
    },
    selectedEquipment_comp() {
      return this.selectedEquipment = this.selectEquipmentType.equipment?.filter((z) => {
        return z.id == this.idEquipment;
      })[0];
    },
    selectedDamage_comp() {
      return this.selectedEquipment_comp?.damages?.filter((z) => {
        return z.id == this.selectedDamage?.id;
      })[0];
    },
  },
  watch: {
    dialog(val) {
      if (this.editedIndex == -1) {
        this.editedIndex = -1;
        this.editedItem = {
          id: "",
          name: "",
          departement: "",
          domain: {
            id: "",
          },
        };
      }

      val || this.close();
    },
    step() {
      if (this.step == 1) {
        document.title = "CHECKLIST";

      }


    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() { },
  methods: {
    initialize() {
      this.profilegroupsBydepartements = [];
      this.LoadingPage = true;
      if (this.getUserActive.fonction.name == "ADMIN") {
        this.setgetProfileGroupsByCounters_ALL_Action({id:0}).then(() => {
          this.profilegroupsBydepartements = [
            ...this.getProfileGroupsByCounters,
          ];
          this.LoadingPage = false;
        }).catch((e) => {
          this.LoadingPage = false;
        });
      } else {
        if (this.getUserActive.fonction.department_id == 1) {
          this.setgetProfileGroupsByCounters_ALL_Action({id:1}).then(() => {
            this.profilegroupsBydepartements = [
              ...this.getProfileGroupsByCounters,
            ];
            this.LoadingPage = false;
          }).catch((e) => {
            this.LoadingPage = false;
          });
        } else if (this.getUserActive.fonction.department_id == 2) {
          this.setgetProfileGroupsByCounters_ALL_Action({id:2}).then(() => {
            this.profilegroupsBydepartements = [
              ...this.getProfileGroupsByCounters,
            ];
            this.LoadingPage = false;

          }).catch((e) => {
            this.LoadingPage = false;
          });
        } else {
           let userProfiles_grp = this.getUserActive?.profileGroups.map((r) => r.name)
          this.setgetProfileGroupsByCounters_ALL_Action({id:3,userProfiles_grp:userProfiles_grp}).then(() => {
           
this.profilegroupsBydepartements = [
  ...this.getProfileGroupsByCounters.filter((c) => userProfiles_grp.includes(c.name)),
            ];
            this.LoadingPage = false;
          }).catch((e) => {
            this.LoadingPage = false;
          });
        }
      }

      this.setDepartementsAction().then(() => {
        this.departements = [...this.getdepartements];
      });
    },
    pageView(item) {
      this.idDomainGroupesid = item.id;
      console.log("item", item)
      this.selectEquipmentType = JSON.parse(JSON.stringify(item));
      console.log("this.idDomainGroupesid ", this.idDomainGroupesid);
      this.step = 2;
      //this.$router.push({
      //  name: "techniqueView",
      //  params: { name: item.name },
      //});
      //localStorage.removeItem("idDomainGroupesid");
      //
      //localStorage.setItem("idDomainGroupesid", item.id);
    },
    ...mapActions([
      "getProfileGroupsByCountersAction",
      "setDepartementsAction",
      "getProfileGroupsByCountersITAction",
      "getProfileGroupsByCountersTECAction",
      "getProfileGroupsByCountersAction",
      "setgetProfileGroupsByCounters_ALL_Action",
      "setgetProfileGroupsByCounters_ALL_Action_2",
      "REMOVE_ClosedDamagesFromProfileGroupsByCounters_2__",
    ]),
    closedShow_archiveShowClose() {
      this.LoadingPage = true;
           if (this.getUserActive.fonction.name == "ADMIN") {
        this.setgetProfileGroupsByCounters_ALL_Action_2(0).then(() => {
         this.profilegroupsBydepartements = [
          ...this.getProfileGroupsByCounters,
        ];
        this.LoadingPage = false;
        this.closedShow_archive = true;
        }).catch((e) => {
          this.LoadingPage = false;
        });
      } else {
        if (this.getUserActive.fonction.department_id == 1) {
          this.setgetProfileGroupsByCounters_ALL_Action_2(1).then(() => {
           this.profilegroupsBydepartements = [
          ...this.getProfileGroupsByCounters,
        ];
        this.LoadingPage = false;
        this.closedShow_archive = true;
          }).catch((e) => {
            this.LoadingPage = false;
          });
        } else if (this.getUserActive.fonction.department_id == 2) {
          this.setgetProfileGroupsByCounters_ALL_Action_2(2).then(() => {
            this.profilegroupsBydepartements = [
          ...this.getProfileGroupsByCounters,
        ];
        this.LoadingPage = false;
        this.closedShow_archive = true;

          }).catch((e) => {
            this.LoadingPage = false;
          });
        } else {
          this.setgetProfileGroupsByCounters_ALL_Action_2(3).then(() => {
           this.profilegroupsBydepartements = [
          ...this.getProfileGroupsByCounters,
        ];
        this.LoadingPage = false;
        this.closedShow_archive = true;
          }).catch((e) => {
            this.LoadingPage = false;
          });
        }
      }
    },
    closedHide_archiveHideClose() {
      this.LoadingPage = true;
      this.REMOVE_ClosedDamagesFromProfileGroupsByCounters_2__();
      this.profilegroupsBydepartements = [
        ...this.getProfileGroupsByCounters,
      ];
      this.LoadingPage = false;
      this.closedShow_archive = false;
    },

    changeDepartment() {
      this.$router.push({
        name: "DamageForeman",
      });
    },
    setStep_3(idEquipment) {
      this.idEquipment = idEquipment;
      this.step = 3;
    },
    setStep_4(selectedDamage) {
      this.selectedDamage = selectedDamage;
      this.step = 4;
    },
    showLoading() {
      this.LoadingPage = true;
    },
    hideLoading() {
      this.LoadingPage = false;
    },
    getProfileGroupIcon(name) {
      try {
        // Remove spaces and handle case sensitivity if needed
        const fileName = `_${name.replace(/\s+/g, ' ').trim()}_icon.jpg`;
        return require(`@/assets/${fileName}`);
      } catch (e) {
        // fallback image if not found
        return require('@/assets/_STS_icon.jpg');
      }
    },
    getBackGrounColor(selectedDamage) {
      const status = (this.selectedDamage_comp?.status || '').toLowerCase();
      const colorMap = {
        'resolved': 'orange', // orange
        'on progress': 'red', // yellowish
        'closed': 'white' // blue
      };
      return colorMap[status] || 'white';
    },
    getStatusName(selectedDamage) {
      const status = (selectedDamage?.status || '').toLowerCase();
      const colorMap = {
        'resolved': 'RESOLVED', // orange
        'on progress': 'IN PROGRESS', // yellowish
        'closed': 'CLOSED' // blue
      };
      return colorMap[status] || 'CLOSED';
    },
    close_damageTech_cmt_resolve(){
      this.damageTech_cmt_resolve=false;

    },
    open_damageTech_cmt_resolve(){
      this.damageTech_cmt_resolve=true;

    },
    close_damageTech_cmt_closed(){
      this.damageTech_cmt_closed=false;

    },
    open_damageTech_cmt_closed(){
      this.damageTech_cmt_closed=true;

    },
    close_damageTech_cmt(){
      this.damageTech_cmt=false;

    },
    open_damageTech_cmt(){
      this.damageTech_cmt=true;

    },

  },
};
</script>
