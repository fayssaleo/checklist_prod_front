<template>

      <v-data-table
        :headers="computedHeaders"
        :items="equipments"
        :search="search"
        :loading="loading"
        sort-by="item.id"
        class="elevation-1 technique_table_new"
        v-if="viewTable"
        :items-per-page="5"
      >
       <template v-slot:item="{ item }">
      <tr @click="pageView(item)" class="" style="background-color:rgb(107 112 124) ;">
        

        <td>
          <img :src="require(`@/assets/_${selectEquipmentType?.name}_icon.jpg`)" alt="">
        </td>
        <td>
          {{ item?.nameEquipment }}
        </td>
        <td 
        v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
        :class="(item.isShecked)?'isShecked_yes':'isShecked_no'">
          <v-icon >mdi-check-circle-outline</v-icon>
        </td>
        <td v-if="closedShow_archive">
          {{ item?.closedCount }}
        </td>
        <td>
          {{ item?.damagedCount+item?.confirmedCount }}
        </td>
        <td>
          {{ item?.damagedCount }}
        </td>
        <td>
          {{ item?.confirmedCount }}
        </td>
        <td>
          <v-btn style="    border-radius: 146px;" color="transparent" class="mr-2 btn white--text btn" @click="pageView(item)">
            <v-icon medium class="mr-2"> mdi-eye-outline </v-icon>
          </v-btn>
        </td>
      </tr>
    </template>



        <template v-slot:no-data>
          <v-btn color="#293777" style="color:white" @click="initialize()"> Reset </v-btn>
        </template>
      </v-data-table>
      <v-row v-else>
          <v-col cols="6" v-for="item in equipments">
            <span class="profile_group_tickets" style="background-color: rgb(21 43 98) ;" @click="pageView(item)"
            :class="(item.isShecked)?'isShecked_yes':'isShecked_no'"
            >
              <img style="border-color:rgb(21 43 98)  ;" :src="require(`@/assets/_${selectEquipmentType?.name}_icon.jpg`)" alt="">

              {{ item?.nameEquipment }}
              <v-icon v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'">mdi-check-circle-outline</v-icon>

              <span v-if="closedShow_archive" class="c__" :class="(item?.isShecked)?'isCheckedEquipment':''">
                CLOSED
                <span 
                class="profile_group_tickets_number"
                style="color:rgb(178 189 255);font-weight: 900;font-size: 15px;">
                {{ item?.closedCount }}
                </span>
              </span>

              <span class="t_">TOTAL DEFECTS<span class="profile_group_tickets_number"
                  style="font-weight: 900;font-size: 15px;">{{ (item?.confirmedCount+item?.damagedCount) }}</span></span>
              
              <span class="tf_">IN PROGRESS<span class="profile_group_tickets_number"
                  style="color:#d43737;font-weight: 900;font-size: 15px;">{{ (item?.damagedCount) }}</span></span>
              <span class="r_">RESOLVED<span class="profile_group_tickets_number"
                  style="color:#fb8500;font-weight: 900;font-size: 15px;">{{(item?.confirmedCount)}}</span></span>

            </span>

          </v-col>
        </v-row>

</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props:["idDomainGroupesid","viewTable","selectEquipmentType","closedShow_archive"],
  data: () => ({
    loading: false,
    search: "",
    headers: [
      {
        text: "",
        value: "",
      },
      { text: "NAME",value: "name", sortable: true },

      {
        text: "CHECKED",
        value: "equipmentCheckedCount",
        sortable: true,
      },
      {
        text: "TOTAL CLOSED",
        value: "closedCount",
        sortable: true,
      },
      {
        text: "TOTAL DEFECTS",
        value: "damagedCount",
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
    equipments: [],
    equipmentsFiltre: [],
    idgrp: null,
    ProfileGroupsByCounter: {
      id: null,
      name: "",
      equipmentsCount: null,
      functionalEquipmnet: null,
      damagedCount: null,
      confirmedCount: null,
      closedCount: null,
      nonFunctionalEquipmnet:null,
    },
    EquipmentsByCounters: {
      id: null,
      nameEquipment: null,
      damagedCount: null,
      confirmedCount: null,
      closedCount: null,
    },
    editedIndex: -1,
    editedItem: {
      id: null,
      name: "",
      description: "",
      profileGroup: {
        id: null,
      },
    },
    defaultItem: {
      id: null,
      name: "",
      description: "",
      profileGroup: {
        id: null,
      },
    },
    fonction:'',
    userDepartment:"",
  }),
  mounted() {
    document.title = "CHECKLIST" +(" - "+ ((this.selectEquipmentType)?this.selectEquipmentType?.name:""));
    this.fonction = this.getUserActive.fonction.name;
    this.userDepartment = this.getUserActive.fonction.department.name;
    this.loading = true;
    this.initialize();
      
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    computedHeaders () {
      let header=[];
      this.headers.map((r)=>{
        if(this.getUserActive?.fonction?.department_id!=3 && this.getUserActive?.fonction?.name!='ADMIN'){
          if(r.value == "equipmentCheckedCount"){
            return;
          }
        }
        if(!this.closedShow_archive){
          if(r.value == "closedCount"){
            return;
          }
        }
        header.push(r);
      });

      return header;

    },
    ...mapGetters([
      "getequipments",
      "getEquipmentsByCounters",
      "getUserActive",
    ]),
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    // this.initialize();
  },
  methods: {
    getColor(item) {
      var color = "";
      if (item.damagedCount > 0 || item.confirmedCount > 0) color = "#d43737";
      else if (item.damagedCount == 0 || item.confirmedCount == 0) color = "#1e2855";
      return color;
    },
    initialize() {
      this.idgrp = this.idDomainGroupesid;

      if (this.getUserActive.fonction.name == "ADMIN") {

          this.equipments = [...this.selectEquipmentType.equipment];
          //  console.log("this.equipments",this.equipments);
    
      
          this.selectEquipmentType.id = this.selectEquipmentType.id;
          this.selectEquipmentType.name =
            this.selectEquipmentType.name;
          this.selectEquipmentType.equipmentsCount =
            this.selectEquipmentType.equipmentsCount;
          this.selectEquipmentType.functionalEquipmnet =
            this.selectEquipmentType.functionalEquipmnet;
          this.selectEquipmentType.damagedCount =
            this.selectEquipmentType.damagedCount;
          this.selectEquipmentType.confirmedCount =
            this.selectEquipmentType.confirmedCount;
          this.selectEquipmentType.closedCount =
            this.selectEquipmentType.closedCount;
            this.selectEquipmentType.nonFunctionalEquipmnet =
            this.selectEquipmentType.nonFunctionalEquipmnet;
   
      } else {
         if (this.getUserActive.fonction.department_id == 1) {
       
          this.equipments = [...this.selectEquipmentType.equipment];
          //  console.log("this.equipments",this.equipments);
    
       
          this.selectEquipmentType.id = this.selectEquipmentType.id;
          this.selectEquipmentType.name =
            this.selectEquipmentType.name;
          this.selectEquipmentType.equipmentsCount =
            this.selectEquipmentType.equipmentsCount;
          this.selectEquipmentType.functionalEquipmnet =
            this.selectEquipmentType.functionalEquipmnet;
          this.selectEquipmentType.damagedCount =
            this.selectEquipmentType.damagedCount;
          this.selectEquipmentType.confirmedCount =
            this.selectEquipmentType.confirmedCount;
          this.selectEquipmentType.closedCount =
            this.selectEquipmentType.closedCount;
            this.selectEquipmentType.nonFunctionalEquipmnet =
            this.selectEquipmentType.nonFunctionalEquipmnet;
       
      } else if (this.getUserActive.fonction.department_id == 2) {
        
          this.equipments = [...this.selectEquipmentType.equipment];
          console.log("this.equipments", this.equipments);
       
       
          this.selectEquipmentType.id = this.selectEquipmentType.id;
          this.selectEquipmentType.name =
            this.selectEquipmentType.name;
          this.selectEquipmentType.equipmentsCount =
            this.selectEquipmentType.equipmentsCount;
          this.selectEquipmentType.functionalEquipmnet =
            this.selectEquipmentType.functionalEquipmnet;
          this.selectEquipmentType.damagedCount =
            this.selectEquipmentType.damagedCount;
          this.selectEquipmentType.confirmedCount =
            this.selectEquipmentType.confirmedCount;
          this.selectEquipmentType.closedCount =
            this.selectEquipmentType.closedCount;
            this.selectEquipmentType.nonFunctionalEquipmnet =
            this.selectEquipmentType.nonFunctionalEquipmnet;
       
      } else {
        
          
       
          this.equipments = [...this.selectEquipmentType.equipment];
          //  console.log("this.equipments",this.equipments);
        
        
          this.selectEquipmentType.id = this.selectEquipmentType.id;
          this.selectEquipmentType.name =
            this.selectEquipmentType.name;
          this.selectEquipmentType.equipmentsCount =
            this.selectEquipmentType.equipmentsCount;
          this.selectEquipmentType.functionalEquipmnet =
            this.selectEquipmentType.functionalEquipmnet;
          this.selectEquipmentType.damagedCount =
            this.selectEquipmentType.damagedCount;
          this.selectEquipmentType.confirmedCount =
            this.selectEquipmentType.confirmedCount;
          this.selectEquipmentType.closedCount =
            this.selectEquipmentType.closedCount;
            this.selectEquipmentType.nonFunctionalEquipmnet =
            this.selectEquipmentType.nonFunctionalEquipmnet;
        
      }
      }

     
      this.loading = false;
      console.log("this.ProfileGroupsByCounter", this.ProfileGroupsByCounter);
    },
    ...mapActions([
      "setequipmentsAction",
      "getProfileGroupsByCounterAction",
      "getProfileGroupsByCounterITAction",
      "getProfileGroupsByCounterTECAction",
      "getEquipmentsByCountersAction",
      "getEquipmentsByCountersITAction",
      "getEquipmentsByCountersTECAction",
    ]),
    pageView(item) {
      this.$emit("setStep_3",item.id)
     // this.$router.push({
     //   name: "techniqueEquipment",
     //   params: { name: item.name },
     // });
     // console.log("item.id", item.id);
     // localStorage.removeItem("idEquipment");
     // localStorage.setItem("idEquipment", item.id);
    },
    getProfileGroupIcon(name) {
      try {
        // Remove spaces and handle case sensitivity if needed
        const fileName = `_${name}_icon.jpg`;
        console.log("fileName ",name);
        return require(`@/assets/${fileName}`);
      } catch (e) {
        // fallback image if not found
        return require('@/assets/_STS_icon.jpg');
      }
    },
  },
};
</script>
