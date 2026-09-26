<template>
  <div style="padding: 0; padding-top: 13px">
    <div style="margin: 0 auto; width: 100%">
      <v-container class="damageContainer">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-select :items="profile_groupe" item-text="name" item-value="id" v-model="profile_groupe_id"
              label="Equipment groups :" :disabled="disabled" @change="changeProfile_groupeSELECT"></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-select :items="equipmentsFiltre" item-text="name" item-value="id" v-model="equipments_id"
              label="Equipment :" @change="changeEquipmentsFiltreSELECT"
              :disabled="disabledEquipmentsFiltre"></v-select>
          </v-col>
        </v-row>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-toolbar dark color="error">
              <v-toolbar-title>Warning !</v-toolbar-title>
            </v-toolbar>
            <v-card-title class="text-h5">
              Are you sure to validate this Checklist ?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn style="    font-weight: 900;" color="white" @click="cancel"> No </v-btn>
              <v-btn style="    font-weight: 900;" color="primary" @click="dialog = false"> Yes </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="cmt_actual_pic_edit" persistent max-width="600px">
          <v-card>
            <v-toolbar dark color="error">
              <v-toolbar-title>ALREADY SELECTED DEFECT SUB TYPE !</v-toolbar-title>
            </v-toolbar>
            <v-card-title class="text-h5">
              The sub defect type is already selected.<br> <span
                style="margin-top: 45px; font-weight: 700; color: #ff0000; ">PLEASE SELECT THE NEXT ACTION :</span>
            </v-card-title>
            <v-card-text class="font-weight-bold"></v-card-text>
            <v-card-actions>
              <v-btn color="white" @click="cmt_actual_pic_edit = false"> Cancel </v-btn>
              <v-spacer></v-spacer>
              <v-btn style=" font-weight: 700; color: white; " color="orange"
                @click="cmt_actual_pic_edit = false; valider_3(selected_sub_Defect)"> UNSELECT </v-btn>
              <v-btn style=" font-weight: 700; color: white; " color="primary"
                @click="cmt_actual_pic_edit = false; techDefects_withCmt(selected_sub_Defect)"> EDIT </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="cmt_actual_pic_delete" persistent max-width="600px">
          <v-card>
            <v-toolbar dark color="error">
              <v-toolbar-title>Warning !</v-toolbar-title>
            </v-toolbar>
            <v-card-title class="text-h5">
              Are you sure to delete this picture ?
            </v-card-title>
            <v-card-text class="font-weight-bold"></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="white" @click="cmt_actual_pic_delete = false"> No </v-btn>
              <v-btn color="primary" @click="deleteImage()"> Yes </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogValide" persistent max-width="600px">
          <v-card>
            <v-toolbar dark color="error">
              <v-toolbar-title>Warning !</v-toolbar-title>
            </v-toolbar>
            <v-card-title class="text-h5">
              Are you sure to validate this Checklist ?
            </v-card-title>
            <v-card-text class="font-weight-bold"></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="white" @click="cancelvalide()"> No </v-btn>
              <v-btn color="primary" @click="valider()"> Yes </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogValideDamage" persistent max-width="600px">
          <v-card>
            <v-toolbar dark color="error">
              <v-toolbar-title>Warning !</v-toolbar-title>
            </v-toolbar>
            <v-card-title class="text-h5">
              Are you sure to validate this Checklist ?
            </v-card-title>
            <v-card-text class="font-weight-bold"></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="white" @click="dialogValideDamage = false">
                No
              </v-btn>
              <v-btn color="primary" @click="validerDamages()"> Yes </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="driver_comment_dialog" persistent max-width="700">
          <v-card>
            <v-card-title class="text-h5 red lighten-1 white--text">
              {{ selectedDefect?.name }} - Sub Types :
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-text class="pa-4 black--text" style="    font-weight: 900;">
              Please select a defect specification :
              <v-row class="subType  m-0 p-0">
                <v-col style="padding: 0;" class=" m-0 p-0" cols="6" v-for="item in defectList">
                  <span v-if="item.damage == null"
                    @click="isChecked(item) ? cmt_actual_pic_edit_open(item) : techDefects_withCmt(item)"
                    :class="isChecked(item) ? 'checked' : ''" class="sub_box m-0 p-0
                  ">{{ item.name }}</span>
                  <span v-else-if="item.damage.status == 'on progress'" @click="defectedFunction(item)"
                    class="sub_box progress m-0 p-0">{{ item.name }}</span>
                  <span v-else-if="item.damage.status == 'resolved'" @click="resolvedFunction(item)"
                    class="sub_box resolved m-0 p-0">{{ item.name }}</span>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn style="    font-weight: 900;" color="#fff " @click="valider_cmt_first_cancel()">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn style="color:white   ; font-weight: 900;" class="mr-2" color="#76ba99"
                @click="valider_cmt_first_confirm()">
                Confirm
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="damageTech_cmt_fullscreen_img" max-width="800px">
          <template v-slot:default="{ isActive }">
            <v-card rounded="lg">
              <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">
                  {{ selected_sub_Defect?.name }} Picture :
                </div>
                <v-spacer></v-spacer>
                <v-btn style="    font-weight: 900;color:white" color="red " @click="cmt_actual_pic_delete = true">
                  DELETE
                </v-btn>
                <v-btn style=" margin-left:8px  ;   font-weight: 900;color:white" color="green "
                  @click="downloadImage(cmt_actual_pic)">
                  DOWNLOAD
                </v-btn>
                <v-btn style="margin-left:8px  ;font-weight: 900;" color="#fff "
                  @click="damageTech_cmt_fullscreen_img = false">
                  CLOSE
                </v-btn>
              </v-card-title>
              <v-divider class="mb-4"></v-divider>
              <v-card-text class="pic_full_screen">
                <div>
                  <img :src="getImageUrl(cmt_actual_pic)" alt="">
                </div>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
        <v-dialog v-model="damageTech_cmt" persistent max-width="490">
          <v-card>
            <v-card-title class="text-h5 red lighten-1 white--text">
              {{ selected_sub_Defect?.name }} - DETAILS :
            </v-card-title>
            <v-spacer></v-spacer>

            <v-card-text class="pa-4 black--text" style="    font-weight: 900;">
              Add details (comment/pictures) :
              <v-textarea label="Defect comment.." v-model="damageTech_cmt_payload.comment" name="input-7-1"
                variant="outlined" style="BACKGROUND-COLOR: #e4d551 !important;" class="sub_comment_text"></v-textarea>
              <div cols="12" md="12" class="cmt_pic_background">
                <span class="images_pannel">
                  <img v-for="pic in damageTech_cmt_payload.pics" @click="imagefullScreen(pic)" :src="getImageUrl(pic)"
                    alt="">

                </span>
                <span class="add_button" @click="triggerUpload">
                  <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
                  <v-icon size="45px" class="">mdi-plus</v-icon>
                </span>

              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn style="    font-weight: 900;" color="#fff " @click="techDefects_withCmt_close">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>

              <v-btn style=" color:white   ;   font-weight: 900;" class="mr-2" color="#f54"
                @click="techDefects_withCmt_confirm()">
                CONFIRM
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="resolvedDialoge" persistent max-width="490">
          <v-card>
            <v-card-title class="text-h5 red lighten-1 white--text">
              Warning !!
            </v-card-title>
            <v-spacer></v-spacer>

            <v-card-text class="pa-4 black--text" style="    font-weight: 900;">
              Warning this is a resolved item, are you sure you want to turn it
              not-defected or defected ?
              <v-textarea label="Defect comment.." v-model="damageTech_cmt_payload.comment" name="input-7-1"
                variant="outlined" style="BACKGROUND-COLOR: #e4d551 !important;" class="sub_comment_text"></v-textarea>
                <div cols="12" md="12" class="cmt_pic_background">
                <span class="images_pannel">
                  <img v-for="pic in damageTech_cmt_payload.pics" @click="imagefullScreen(pic)" :src="getImageUrl(pic)"
                    alt="">

                </span>
                <span class="add_button" @click="triggerUpload">
                  <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
                  <v-icon size="45px" class="">mdi-plus</v-icon>
                </span>

              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn style="    font-weight: 900;" color="#fff " @click="resolvedDialoge = false">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn style="color:white   ;    font-weight: 900;" class="mr-2" color="#76ba99" @click="confirmed">
                Not-Defected
              </v-btn>
              <v-btn style=" color:white   ;   font-weight: 900;" class="mr-2" color="#f54" @click="revert">
                Defected
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="defectedDialoge" persistent max-width="490">
          <v-card>
            <v-card-title class="text-h5 red lighten-1 white--text">
              Warning !!
            </v-card-title>
            <v-spacer></v-spacer>

            <v-card-text class="pa-4 black--text" style="    font-weight: 900;">
              Warning this is a defected item, are you sure you want to turn it
              not-defected ?
              <v-textarea label="Defect comment.." v-model="damageTech_cmt_payload.comment" name="input-7-1"
                variant="outlined" style="BACKGROUND-COLOR: #e4d551 !important;" class="sub_comment_text"></v-textarea>
                <div cols="12" md="12" class="cmt_pic_background">
                <span class="images_pannel">
                  <img v-for="pic in damageTech_cmt_payload.pics" @click="imagefullScreen(pic)" :src="getImageUrl(pic)"
                    alt="">

                </span>
                <span class="add_button" @click="triggerUpload">
                  <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
                  <v-icon size="45px" class="">mdi-plus</v-icon>
                </span>

              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="#fff" @click="defectedDialoge = false">
                Cancel
              </v-btn>
              <v-spacer></v-spacer>

              <v-btn style=" color:white   ;   font-weight: 900;" class="mr-2" color="#76ba99" @click="confirmed">
                Not-Defected
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-container>
          <v-row>
            <v-col cols="12" class="TECpanell">
              <v-row>
                <v-col cols="12" class="d-flex justify-center">
                  <span>Technique </span>
                  <span class="red--text">
                    ({{ this.countDefectsTEC + this.countResolvedTEC }})</span></v-col>
              </v-row>

              <v-col cols="12" sm="12" class="scroll">
                <v-list flat>
                  <v-list-item-group name="TEC" class="TEC" v-model="modelTEC" multiple color="#fff">
                    <div class="hamzatec technique-Fayssal">
                      <v-list-item v-for="(item, i) in damageTypesTEC" :key="i" class="item" two-line
                        :class="MasterIsChecked(item) ? 'defect_active' : 'defect_intact'"
                        @click="valider_cmt_first(item, i)">
                        <v-list-item-content class="item-content">
                          <span v-if="item.important == false">
                            <v-list-item-title name="damageTypesTEC" class="itemName"
                              style="background-color: #76ba99"></v-list-item-title>
                            <v-list-item-subtitle class="itemSubtitle"
                              style="color: #76ba99; width: 170px !important">{{
                              item.name }}</v-list-item-subtitle>
                          </span>
                          <span v-else-if="item.important == true">
                            <v-list-item-title name="damageTypesTEC" class="itemName"
                              style="background-color: #76ba99"></v-list-item-title>
                            <v-list-item-subtitle class="itemSubtitle" style="
                                color: rgb(0, 171, 88);
                                font-weight: bolder !important;
                                width: 170px !important;
                              ">{{ item.name }}</v-list-item-subtitle>
                          </span>
                        </v-list-item-content>

                      </v-list-item>
                    </div>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-col>
            <v-col cols="12" class="ITpanell">
              <v-row>
                <v-col cols="12" class="d-flex justify-center">
                  <span>IT </span>
                  <span class="red--text">({{ this.countDefects + this.countResolved }})</span></v-col>
              </v-row>

              <v-col cols="12" sm="12" class="scrollIT">
                <v-list flat>
                  <v-list-item-group name="it" v-model="modelIT" multiple color="#fff" class="ITcol TEC">
                    <div class="hamzatec">
                      <v-list-item v-for="(item, i) in damageTypesIT" :key="i" class="item" two-line
                        :active-class="'bg-active'">
                        <v-list-item-content v-if="item.damage == null" class="item-content" @click="valider(item, i)">
                          <span v-if="item.important == false">
                            <v-list-item-title name="damageTypesTEC" class="itemName"
                              style="background-color: #76ba99"></v-list-item-title>
                            <v-list-item-subtitle class="itemSubtitle" style="color: #76ba99">{{ item.name
                              }}</v-list-item-subtitle>
                          </span>
                          <span v-else-if="item.important == true">
                            <v-list-item-title name="damageTypesTEC" class="itemName"
                              style="background-color: #76ba99"></v-list-item-title>
                            <v-list-item-subtitle class="itemSubtitle" style="
                                color: rgb(0, 171, 88);
                                font-weight: bolder !important;
                              ">{{ item.name }}</v-list-item-subtitle>
                          </span>
                        </v-list-item-content>
                        <v-list-item-content @click="resolvedFunction(item, i)"
                          v-else-if="item.damage.status == 'resolved'" class="item-content resolved">
                          <span v-if="item.important == false">
                            <v-list-item-title name="damageTypesTEC" class="itemName"
                              style="background-color: #ff8f56"></v-list-item-title>
                            <v-list-item-subtitle style="color: #ff8f56" class="itemSubtitle">{{ item.name
                              }}</v-list-item-subtitle>
                          </span>
                          <span v-else-if="item.important == true">
                            <v-list-item-title name="damageTypesTEC" class="itemName"
                              style="background-color: #ff8f56"></v-list-item-title>
                            <v-list-item-subtitle style="
                                color: #ff8f56;
                                font-weight: bolder !important;
                              " class="itemSubtitle">{{ item.name }}</v-list-item-subtitle>
                          </span>
                        </v-list-item-content>
                        <v-list-item-content v-else-if="item.damage.status == 'on progress'"
                          class="item-content defects" @click="defectedFunction(item, i)">
                          <span v-if="item.important == false">
                            <v-list-item-title name="damageTypesTEC" class="itemName"
                              style="background-color: #f54"></v-list-item-title>
                            <v-list-item-subtitle style="color: #f54" class="itemSubtitle">{{ item.name
                              }}</v-list-item-subtitle>
                          </span>
                          <span v-if="item.important == true">
                            <v-list-item-title name="damageTypesTEC" class="itemName"
                              style="background-color: #f54"></v-list-item-title>
                            <v-list-item-subtitle style="
                                color: #f54;
                                font-weight: bolder !important;
                              " class="itemSubtitle">{{ item.name }}</v-list-item-subtitle>
                          </span>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center">
            <v-col cols="4">
              <v-sheet color="#f54" elevation="1" height="20" width="20" rounded></v-sheet>
              Defected
            </v-col>
            <v-col cols="4">
              <v-sheet color="#FF8F56" elevation="1" height="20" width="20" rounded></v-sheet>
              Resolved
            </v-col>
            <v-col cols="3">
              <v-sheet color="#76ba99" elevation="1" height="20" width="20" rounded></v-sheet>
              Not-Defected
            </v-col>
          </v-row>
        </v-container>
        <v-container>
          <v-row>
            <v-col class="d-flex justify-center" cols="12">
              <v-btn depressed color="primary" :disabled="disabled" @click="test()">
                Valider
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </div>

    <LoadingPage v-if="LoadingPage == true" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import swal from "sweetalert";
//import LoadingPage from "../LoadingPage.vue";
const LoadingPage = defineAsyncComponent(() => import("../LoadingPage.vue"));
import moment from "moment/src/moment";

export default {
  components: {
    LoadingPage,
  },
  data: () => ({
    cmt_actual_pic_edit: false,
    cmt_actual_pic_delete: false,
    cmt_actual_pic: null,
    defectList: [],
    damageTech_cmt_payload: {
      comment: "",
      pics: []
    },
    damageTech_cmt_fullscreen_img: false,
    damageTech_cmt: false,
    selected_sub_Defect: null,
    selectedDefect: null,
    driver_comment_dialog: false,
    userFiltre: [],
    disabled: false,
    LoadingPage: false,
    resolvedDialoge: false,
    defectedDialoge: false,
    dialogLogin: false,
    damageTypesIT: [],
    damageTypesTEC: [],
    modelDamageIT: [],
    modelDamageTEC: [],
    confirmedDamageTEC: [],
    confirmedDamageIT: [],
    equipmentsFiltre: [],
    Data: [],
    Data_2: [],
    damageCourent: {
      declaredBy_id: null,
      equipment_id: null,
      damage_type_id: null,
      shift: "",
    },
    damage_type_id: null,
    modelIT_id_Courent: null,
    modelTEC_id_Courent: null,
    profile_groupe: [],
    equipments: [],
    damagesend: [],
    modelIT: [],
    modelTEC: [],
    department: [],
    departmentIT: {
      id: null,
      name: "",
      email: "",
      created_at: "",
      updated_at: "",
    },
    departmentTEC: {
      id: null,
      name: "",
      email: "",
      created_at: "",
      updated_at: "",
    },
    departmentOP: {
      id: null,
      name: "",
      email: "",
      created_at: "",
      updated_at: "",
    },
    DamageSelect: {
      id: null,
      driver_comment: "",
      status: "",
      description: "",
      declaredBy_id: null,
      declaredAt: "",
      confirmedBy_id: null,
      confirmedAt: null,
      closedBy_id: null,
      closedAt: null,
      rejectedBy_id: null,
      rejectedAt: null,
      rejectedTimes: null,
      equipment_id: null,
      damage_type_id: null,
      created_at: "",
      updated_at: "",
      declared_by: {
        id: null,
        username: "",
        lastName: "",
        firstName: "",
        email: "",
        phoneNumber: "",
        fonction_id: null,
        created_at: "",
        updated_at: "",
        fonction: {
          id: null,
          name: "",
          department_id: null,
          created_at: "",
          updated_at: "",
          department: {
            id: null,
            name: "",
            created_at: "",
            updated_at: "",
          },
        },
      },
      confirmed_by: null,
      closed_by: null,
      rejected_by: null,
      equipment: {
        id: null,
        name: "",
        profile_group_id: null,
        created_at: "",
        updated_at: "",
        profile_group: {
          id: null,
          name: "",
          department_id: null,
          created_at: "",
          updated_at: "",
          department: {
            id: null,
            name: "",
            created_at: "",
            updated_at: "",
          },
        },
      },
      damage_type: {
        id: null,
        name: "",
        profile_group_id: null,
        department_id: null,
        created_at: "",
        updated_at: "",
        profile_group: {
          id: null,
          name: "",
          department_id: null,
          created_at: "",
          updated_at: "",
          department: {
            id: null,
            name: "",
            created_at: "",
            updated_at: "",
          },
        },
        department: {
          id: null,
          name: "",
          created_at: "",
          updated_at: "",
        },
      },
      photos: [
        {
          id: null,
          description: null,
          filename: "",
          damage_id: null,
          created_at: "",
          updated_at: "",
        },
      ],
    },
    presenceCheck: {
      user_id: 0,
      equipment_id: 0,
      validation_presence_At: "",
    },
    confirmDamage: {
      id: null,
      confirmedBy_id: null,
      resolveDescription: "",
    },
    closeDamage: {
      id: null,
      closedBy_id: null,
    },
    revertDamage: {
      id: null,
      rejectedBy_id: null,
      rejectedDescription: "",
    },
    resolveditem: [],
    defecteditem: [],
    defectsChange: {
      item: [],
      damagetypeOld: [],
      statusOld: null,
      statusNew: "",
    },
    EmailModel: {
      payload: {
        Equipment: "",
        EquipmentGroupe: "",
        Department: "",
        Defects: [],
        Status: "on progress",
        DriverOut: "",
        DeclaredBy: "",
        DeclaredAt: "",
      },
      status: "",
      email: "",
      department: [],
    },
    EmailModelTEC: {
      payload: {
        Equipment: "",
        EquipmentGroupe: "",
        Department: "",
        Defects: [],
        Status: "on progress",
        DriverOut: "",
        DeclaredBy: "",
        DeclaredAt: "",
      },
      status: "",
      email: "",
      department: [],
    },
    a: [],
    b: [],
    listdepartmentIT: [],
    listDefectsNamesIT: [],
    listdepartmentTEC: [],
    listDefectsNamesTEC: [],
    listDefectsNamesTECFinal: [],
    listDefectsNamesITFinal: [],
    listDefectsChange: [],
    DamageTypeByEquipmentID: [],
    DamagesMergedWithDamageTypes: [],
    damageSelect: [],
    isvalide: false,
    equipments_id: "",
    dialog: false,
    dialogValide: false,
    profile_groupe_id: null,
    disabledEquipmentsFiltre: true,
    dialogValideDamage: false,
    countDefects: 0,
    countResolved: 0,
    countDefectsTEC: 0,
    countResolvedTEC: 0,
    countImportantTEC: 0,
    countImportantIT: 0,
    EquipmentName: "",
  }),
  mounted() {
    document.title = "Checklist";
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    ...mapGetters([
      "getUsers",
      "getdamageTypes",
      "getprofilegroups",
      "getequipments",
      "getDamageTypeByEquipmentID",
      "getdamage",
      "getEquipmentDamagesMergedWithDamageTypes",
      "getdepartements",
      "getUserActive",
    ]),
  },
  watch: {
    dialog(val) {
      val || this.cancel();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    cmt_actual_pic_edit_open(item) {
      console.log("cmt_actual_pic_edit_open : item", item);
      this.selected_sub_Defect = item;

      this.cmt_actual_pic_edit = true;
    },
    deleteImage() {
      console.log("this.damageTech_cmt_payload :", this.damageTech_cmt_payload);
      console.log("selected_sub_Defect :", this.selected_sub_Defect);
      this.damageTech_cmt_payload.pics = this.damageTech_cmt_payload.pics.filter((e) => {
        return e.name != this.cmt_actual_pic.name;
      });
      this.cmt_actual_pic_delete = false;
      this.damageTech_cmt_fullscreen_img = false;
    },
    downloadImage(file) {
      if (!file) return;

      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name || 'download.jpg';
      a.click();
      URL.revokeObjectURL(url); // Clean up
    },
    getImageUrl(file) {
      if (file)
        return URL.createObjectURL(file);
      else
        return null;
    },
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        // handle your file upload logic here
        this.damageTech_cmt_payload.pics.push(file);
      }
    },
    test() {
      if (this.Data.length == 0) {
        if (this.equipments_id == "") {
          swal(
            "warning !!",
            "Please can you chose equipment you use it!",
            "warning"
          );
          this.dialogValide = false;
          this.dialogValideDamage = false;
        } else {
          swal({
            title: "Are you sure?",
            text: "you want make checklist !",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willDelete) => {
            if (willDelete) {
              this.presenceCheck.user_id = this.getUserActive.id;
              this.presenceCheck.equipment_id = this.equipments_id;
              this.presenceChecksAction(this.presenceCheck).then((resolve) => {
                swal("success !!", "Checklist success", "success");
              });
              this.dialogValide = false;
              this.dialogValideDamage = false;
            } else {
              swal("Checklist cancel");
            }
          });
        }
      } else {
        this.dialogValideDamage = true;
      }
    },
    imagefullScreen(pic) {
      this.damageTech_cmt_fullscreen_img = true;
      this.cmt_actual_pic = pic;
    },
    techDefects_withCmt(item) {
      console.log("techDefects_withCmt first one :", item)
      this.selected_sub_Defect = item;
      if (item.damageTech_cmt_payload) {
        this.damageTech_cmt_payload = item.damageTech_cmt_payload;
      }
      else {
        item.damageTech_cmt_payload = this.damageTech_cmt_payload;
        this.damageTech_cmt_payload = {
          comment: "",
          pics: []
        };
      }
      this.damageTech_cmt = true;

      //this.valider_2(item)
    },
    techDefects_withCmt_confirm() {
      console.log("this.selected_sub_Defect second ", this.selected_sub_Defect);
      this.selected_sub_Defect.damageTech_cmt_payload = this.damageTech_cmt_payload;
      this.valider_2(this.selected_sub_Defect);
      this.damageTech_cmt = false;
      this.damageTech_cmt_payload = {
        comment: "",
        pics: []
      };

    },
    techDefects_withCmt_close() {
      this.damageTech_cmt = false;
      this.damageTech_cmt_payload = {
        comment: "",
        pics: []
      };
    },
    changeProfile_groupeSELECT() {
      this.modelDamageIT = [];
      this.modelDamageTEC = [];
      this.equipmentsFiltre = [];
      this.confirmedDamageTEC = [];
      this.confirmedDamageIT = [];
      this.damageTypesIT.length = 0;
      this.damageTypesTEC.length = 0;
      this.equipments_id = 0;
      this.disabledEquipmentsFiltre = false;
      var count = 0;
      this.equipments.map((item) => {
        if (item.profile_group_id == this.profile_groupe_id) {
          this.equipmentsFiltre.push(item);
          count++;
        }
      });
      if (count == 0) {
        this.equipmentsFiltre = [];
      }
    },
    changeEquipmentsFiltreSELECT() {
      var IT = this.departmentIT.id;
      var TEC = this.departmentTEC.id;
      this.modelDamageTEC = [];
      this.modelDamageIT = [];
      this.damageTypesTEC = [];
      this.damageTypesIT = [];
      this.modelTEC = [];
      this.modelIT = [];
      this.Data = [];
      this.confirmedDamageTEC = [];
      this.confirmedDamageIT = [];
      this.FindDamageTypeByEquipmentID = [];
      this.setequipmentsByIDAction(this.equipments_id).then(() => {
        this.EquipmentName = [this.getequipments];
      });
      this.getEquipmentDamagesMergedWithDamageTypesAction(
        this.equipments_id
      ).then(() => {
        this.DamagesMergedWithDamageTypes = [
          ...this.getEquipmentDamagesMergedWithDamageTypes,
        ];


        this.damageTypesTEC = this.DamagesMergedWithDamageTypes.filter(
          (c) => c.department_id == TEC
        );
        this.damageTypesTEC = this.damageTypesTEC.map((e) => {
          e.isSelected = false;
          e.damageTech_cmt_payload = {
            comment: "",
            pics: []
          }
          return e;
        })
        this.damageTypesIT = this.DamagesMergedWithDamageTypes.filter(
          (c) => c.department_id == IT
        );
        this.damageTypesIT = this.damageTypesIT.map((e) => {
          e.isSelected = false;
          return e;
        })
        this.countDefects = 0;
        this.countResolved = 0;
        this.countDefectsTEC = 0;
        this.countResolvedTEC = 0;
        this.countImportantTEC = 0;
        this.countImportantIT = 0;
        this.damageTypesIT.map((e) => {
          if (e.damage == null) {
          } else if (e.damage.status == "on progress") {
            this.countDefects = this.countDefects + 1;
            if (e.important == true) {
              this.countImportantIT = this.countImportantIT + 1;
              swal(
                "warning !",
                "There are some elements that are important for the operation of this Equipment" +
                ` ${this.EquipmentName[0].name}`,
                "warning"
              );
            }
          } else if (e.damage.status == "resolved") {
            this.countResolved = this.countResolved + 1;
          }
        });
        this.damageTypesTEC.map((e) => {
          e.damageTypes.map((c)=>{
            if (c.damage == null) {
            } else if (c.damage.status == "on progress") {
              this.countDefectsTEC = this.countDefectsTEC + 1;
              if (c.important == true) {
                this.countImportantTEC = this.countImportantTEC + 1;
                swal(
                  "warning !",
                  "There are some elements that are important for the operation of this Equipment" +
                  ` ${this.EquipmentName[0].name}`,
                  "warning"
                );
              }
            } else if (c.damage.status == "resolved") {
              this.countResolvedTEC = this.countResolvedTEC + 1;
            }
            })
        });
      });

    },
    initialize() {
      this.setPROFILEDROUPSAction().then(() => {
        this.setUsersbyIDAction(this.getUserActive.id).then(() => {
          this.userFiltre = this.getUsers;
          if (this.userFiltre.profileGroups.length == 0) {
            swal("warning !!", "You don't have any group !", "warning");
            this.disabled = true;
            // this.profile_groupe = [...this.getprofilegroups];
          } else if (this.userFiltre.profileGroups.length != 0) {
            this.profile_groupe = [...this.userFiltre.profileGroups];
          }
        });
      });
      this.setequipmentsAction().then(() => {
        this.equipments = [...this.getequipments];
      });
      this.setDepartementsAction().then(() => {
        this.department = [...this.getdepartements];
        this.department.map((item) => {
          if (item.name.toLowerCase() == "technique") {
            this.departmentTEC = item;
          }
          if (item.name.toLowerCase() == "it") {
            this.departmentIT = item;
          }
          if (item.name.toLowerCase() == "operations") {
            this.departmentOP = item;
          }
        });
      });
    },
    ...mapActions([
      "setDAMAGEAction",
      "editDAMAGEAction",
      "deleteDAMAGEAction",
      "declareDamageAction",
      "confirmDamageAction",
      "closeDamageAction",
      "revertDamageAction",
      "revertDamageAction_2",
      "setDAMAGETYPESAction",
      "setPROFILEDROUPSAction",
      "setequipmentsAction",
      "addDAMAGESAction",
      "FindDamageTypeByEquipmentIDAction",
      "getEquipmentDamagesMergedWithDamageTypesAction",
      "setDepartementsAction",
      "setUsersbyIDAction",
      "presenceChecksAction",
      "setequipmentsByIDAction",
      "SendEmailAction",
      "closeDamageAction_2",
    ]),
    isChecked(item) {
      let isCheck = false;
      this.Data.map((e) => {
        if (item.id == e.damage_type_id)
          isCheck = true;
      });
      this.Data_2.map((e) => {
        if (item.id == e.damage_type_id)
          isCheck = true;
      });
      return isCheck;
    },
    MasterIsChecked(item) {
      if (item.damage == true)
        return true;
      let isCheck = false;
      item.damageTypes.map((t) => {
        this.Data.map((e) => {
          if (t.id == e.damage_type_id)
            isCheck = true;
        });
      });


      return isCheck;
    },
    valider_cmt_first(item, i) {
      this.driver_comment_dialog = true;

      item.isSelected = true;
      this.damageTech_cmt_payload = item.damageTech_cmt_payload;
      this.selectedDefect = item;
      this.defectList = item.damageTypes;
    },
    valider_cmt_first_confirm() {
      this.driver_comment_dialog = false;
      this.damageTypesTEC = this.damageTypesTEC.map((e) => {
        if (e.id == this.selectedDefect.id) {
          e.isSelected = false
        }
        return e;
      });
      this.selectedDefect = null;
      this.Data_2.map((e) => {
        this.Data.push(e);
      });
      this.Data_2=[];
    },
    valider_cmt_first_cancel() {
      this.driver_comment_dialog = false;



      this.damageTypesIT = this.damageTypesIT.map((e) => {
        if (e.id == this.selectedDefect.id) {
          e.isSelected = false
        }
        return e;
      })


      this.damageTypesTEC = this.damageTypesTEC.map((e) => {
        if (e.id == this.selectedDefect.id) {
          e.isSelected = false
        }
        return e;
      })
      this.Data_2 = [];
      this.selectedDefect = null;
    },
    valider(item, i) {

      this.damageCourent.declaredBy_id = this.getUserActive.id;
      this.damageCourent.damage_type_id = item.id;
      this.damageCourent.equipment_id = this.equipments_id;
      this.damage_type_id = item.id;
      this.modelIT_id_Courent = i;

      if (item.department.name == "IT") {
        this.listdepartmentIT.push(item.department.name);
        this.listDefectsNamesIT.push(item);
      } else if (item.department.name == "TECHNIQUE") {
        this.listdepartmentTEC.push(item.department.name);
        this.listDefectsNamesTEC.push(item);
      }

      if (this.Data.length == 0) {
        if (item.important == true) {
          swal(
            "warning !",
            "this item " +
            `*** ${item.name} *** ` +
            " must be immediately reported to the hierarchy ",
            "warning"
          );
          var Damage = {
            declaredBy_id: null,
            equipment_id: null,
            damage_type_id: null,
            department_id: null,
            shift: "",
          };
          Damage.declaredBy_id = this.getUserActive.id;
          Damage.damage_type_id = this.damage_type_id;
          Damage.equipment_id = this.equipments_id;
          Damage.shift = this.getActualShift();
          Damage.department_id = item.department_id;
          this.damageSelect.push(Damage);

          this.Data.push(Damage);
        } else {
          var Damage = {
            declaredBy_id: null,
            equipment_id: null,
            damage_type_id: null,
            department_id: null,
            shift: "",
          };
          Damage.declaredBy_id = this.getUserActive.id;
          Damage.damage_type_id = this.damage_type_id;
          Damage.equipment_id = this.equipments_id;
          Damage.department_id = item.department_id;
          Damage.shift = this.getActualShift();

          this.damageSelect.push(Damage);

          this.Data.push(Damage);
        }
      } else if (this.Data.length > 0) {
        this.isvalide = false;
        this.Data.map((e) => {
          if (e.damage_type_id == this.damage_type_id) {
            this.isvalide = true;
          }
        });
        if (this.isvalide == true) {
          this.Data = this.Data.filter((c) => c.damage_type_id != item.id);
        } else {
          if (item.important == true) {
            swal(
              "warning !",
              `*** ${item.name} *** ` +
              " must be immediately reported to the hierarchy ",
              "warning"
            );
            var Damage = {
              declaredBy_id: null,
              equipment_id: null,
              damage_type_id: null,
              department_id: null,
              shift: "",
            };
            Damage.declaredBy_id = this.getUserActive.id;
            Damage.damage_type_id = this.damage_type_id;
            Damage.equipment_id = this.equipments_id;
            Damage.department_id = item.department_id;
            Damage.shift = this.getActualShift();

            this.damageSelect.push(Damage);

            this.Data.push(Damage);
          } else {
            var Damage = {
              declaredBy_id: null,
              equipment_id: null,
              damage_type_id: null,
              department_id: null,
              shift: "",
            };
            Damage.declaredBy_id = this.getUserActive.id;
            Damage.damage_type_id = this.damage_type_id;
            Damage.equipment_id = this.equipments_id;
            Damage.department_id = item.department_id;
            Damage.shift = this.getActualShift();
            this.damageSelect.push(Damage);

            this.Data.push(Damage);
          }
        }
      }
    },
    valider_2(item) {

      this.damageCourent.declaredBy_id = this.getUserActive.id;
      this.damageCourent.damage_type_id = item.id;
      this.damageCourent.equipment_id = this.equipments_id;
      this.damage_type_id = item.id;

      if (item.department.name == "IT") {
        this.listdepartmentIT.push(item.department.name);
        this.listDefectsNamesIT.push(item);
      } else if (item.department.name == "TECHNIQUE") {
        this.listdepartmentTEC.push(item.department.name);
        this.listDefectsNamesTEC.push(item);
      }



      if (this.Data.length > 0) {
        this.isvalide = false;
        this.Data.map((e) => {
          if (e.damage_type_id == this.damage_type_id) {
            this.isvalide = true;
          }
        });
        if (this.isvalide == true) {
          this.Data = this.Data.filter((c) => c.damage_type_id != item.id);

        }
      }







      if (this.Data_2.length == 0) {
        if (item.important == true) {
          swal(
            "warning !",
            "this item " +
            `*** ${item.name} *** ` +
            " must be immediately reported to the hierarchy ",
            "warning"
          );
          var Damage = {
            declaredBy_id: null,
            equipment_id: null,
            damage_type_id: null,
            department_id: null,
            shift: "",
            damageTech_cmt_payload: {
              comment: "",
              pics: []
            }
          };
          Damage.declaredBy_id = this.getUserActive.id;
          Damage.damage_type_id = this.damage_type_id;
          Damage.equipment_id = this.equipments_id;
          Damage.department_id = item.department_id;
          Damage.shift = this.getActualShift();
          Damage.damageTech_cmt_payload = item.damageTech_cmt_payload;

          this.damageSelect.push(Damage);

          this.Data_2.push(Damage);
        } else {
          var Damage = {
            declaredBy_id: null,
            equipment_id: null,
            damage_type_id: null,
            department_id: null,
            shift: "",
            damageTech_cmt_payload: {
              comment: "",
              pics: []
            }
          };
          Damage.declaredBy_id = this.getUserActive.id;
          Damage.damage_type_id = this.damage_type_id;
          Damage.equipment_id = this.equipments_id;
          Damage.department_id = item.department_id;
          Damage.shift = this.getActualShift();
          Damage.damageTech_cmt_payload = item.damageTech_cmt_payload;
          this.damageSelect.push(Damage);

          this.Data_2.push(Damage);
        }
      } else if (this.Data_2.length > 0) {
        this.isvalide = false;
        this.Data_2.map((e) => {
          if (e.damage_type_id == this.damage_type_id) {
            this.isvalide = true;
          }
        });
        if (this.isvalide == true) {
          this.Data_2 = this.Data_2.filter((c) => c.damage_type_id != item.id);
          if (item.important == true) {
            swal(
              "warning !",
              `*** ${item.name} *** ` +
              " must be immediately reported to the hierarchy ",
              "warning"
            );
            var Damage = {
              declaredBy_id: null,
              equipment_id: null,
              damage_type_id: null,
              department_id: null,
              shift: "",
              damageTech_cmt_payload: {
                comment: "",
                pics: []
              }
            };
            Damage.declaredBy_id = this.getUserActive.id;
            Damage.damage_type_id = this.damage_type_id;
            Damage.equipment_id = this.equipments_id;
            Damage.department_id = item.department_id;
            Damage.shift = this.getActualShift();
            Damage.damageTech_cmt_payload = item.damageTech_cmt_payload;
            this.damageSelect.push(Damage);

            this.Data_2.push(Damage);
          } else {
            var Damage = {
              declaredBy_id: null,
              equipment_id: null,
              damage_type_id: null,
              department_id: null,
              shift: "",
              damageTech_cmt_payload: {
                comment: "",
                pics: []
              }
            };
            Damage.declaredBy_id = this.getUserActive.id;
            Damage.damage_type_id = this.damage_type_id;
            Damage.equipment_id = this.equipments_id;
            Damage.department_id = item.department_id;
            Damage.shift = this.getActualShift();
            this.damageSelect.push(Damage);
            Damage.damageTech_cmt_payload = item.damageTech_cmt_payload;
            this.Data_2.push(Damage);
          }
        } else {
          if (item.important == true) {
            swal(
              "warning !",
              `*** ${item.name} *** ` +
              " must be immediately reported to the hierarchy ",
              "warning"
            );
            var Damage = {
              declaredBy_id: null,
              equipment_id: null,
              damage_type_id: null,
              department_id: null,
              shift: "",
              damageTech_cmt_payload: {
                comment: "",
                pics: []
              }
            };
            Damage.declaredBy_id = this.getUserActive.id;
            Damage.damage_type_id = this.damage_type_id;
            Damage.equipment_id = this.equipments_id;
            Damage.department_id = item.department_id;
            Damage.shift = this.getActualShift();
            Damage.damageTech_cmt_payload = item.damageTech_cmt_payload;
            this.damageSelect.push(Damage);

            this.Data_2.push(Damage);
          } else {
            var Damage = {
              declaredBy_id: null,
              equipment_id: null,
              damage_type_id: null,
              department_id: null,
              shift: "",
              damageTech_cmt_payload: {
                comment: "",
                pics: []
              }
            };
            Damage.declaredBy_id = this.getUserActive.id;
            Damage.damage_type_id = this.damage_type_id;
            Damage.equipment_id = this.equipments_id;
            Damage.department_id = item.department_id;
            Damage.shift = this.getActualShift();
            this.damageSelect.push(Damage);
            Damage.damageTech_cmt_payload = item.damageTech_cmt_payload;
            this.Data_2.push(Damage);
          }
        }
      }
    },
    valider_3(item) {

      this.damageCourent.declaredBy_id = this.getUserActive.id;
      this.damageCourent.damage_type_id = item.id;
      this.damageCourent.equipment_id = this.equipments_id;
      this.damage_type_id = item.id;

      if (item.department.name == "IT") {
        this.listdepartmentIT.push(item.department.name);
        this.listDefectsNamesIT.push(item);
      } else if (item.department.name == "TECHNIQUE") {
        this.listdepartmentTEC.push(item.department.name);
        this.listDefectsNamesTEC.push(item);
      }



      if (this.Data.length > 0) {
        this.isvalide = false;
        this.Data.map((e) => {
          if (e.damage_type_id == this.damage_type_id) {
            this.isvalide = true;
          }
        });
        if (this.isvalide == true) {
          this.Data = this.Data.filter((c) => c.damage_type_id != item.id);

        }
      }







      if (this.Data_2.length == 0) {
        if (item.important == true) {
          swal(
            "warning !",
            "this item " +
            `*** ${item.name} *** ` +
            " must be immediately reported to the hierarchy ",
            "warning"
          );
          var Damage = {
            declaredBy_id: null,
            equipment_id: null,
            damage_type_id: null,
            department_id: null,
            shift: "",
            damageTech_cmt_payload: {
              comment: "",
              pics: []
            }
          };
          Damage.declaredBy_id = this.getUserActive.id;
          Damage.damage_type_id = this.damage_type_id;
          Damage.equipment_id = this.equipments_id;
          Damage.department_id = item.department_id;
          Damage.shift = this.getActualShift();
          Damage.damageTech_cmt_payload = item.damageTech_cmt_payload;
          this.damageSelect.push(Damage);

          this.Data_2.push(Damage);
        } else {
          var Damage = {
            declaredBy_id: null,
            equipment_id: null,
            damage_type_id: null,
            department_id: null,
            shift: "",
            damageTech_cmt_payload: {
              comment: "",
              pics: []
            }
          };
          Damage.declaredBy_id = this.getUserActive.id;
          Damage.damage_type_id = this.damage_type_id;
          Damage.equipment_id = this.equipments_id;
          Damage.department_id = item.department_id;
          Damage.shift = this.getActualShift();
          Damage.damageTech_cmt_payload = item.damageTech_cmt_payload;
          this.damageSelect.push(Damage);

          this.Data_2.push(Damage);
        }
      } else if (this.Data_2.length > 0) {
        this.isvalide = false;
        this.Data_2.map((e) => {
          if (e.damage_type_id == this.damage_type_id) {
            this.isvalide = true;
          }
        });
        if (this.isvalide == true) {
          this.Data_2 = this.Data_2.filter((c) => c.damage_type_id != item.id);
        } else {
          if (item.important == true) {
            swal(
              "warning !",
              `*** ${item.name} *** ` +
              " must be immediately reported to the hierarchy ",
              "warning"
            );
            var Damage = {
              declaredBy_id: null,
              equipment_id: null,
              damage_type_id: null,
              department_id: null,
              shift: "",
              damageTech_cmt_payload: {
                comment: "",
                pics: []
              }
            };
            Damage.declaredBy_id = this.getUserActive.id;
            Damage.damage_type_id = this.damage_type_id;
            Damage.equipment_id = this.equipments_id;
            Damage.department_id = item.department_id;
            Damage.shift = this.getActualShift();
            Damage.damageTech_cmt_payload = item.damageTech_cmt_payload;
            this.damageSelect.push(Damage);

            this.Data_2.push(Damage);
          } else {
            var Damage = {
              declaredBy_id: null,
              equipment_id: null,
              damage_type_id: null,
              department_id: null,
              shift: "",
              damageTech_cmt_payload: {
                comment: "",
                pics: []
              }
            };
            Damage.declaredBy_id = this.getUserActive.id;
            Damage.damage_type_id = this.damage_type_id;
            Damage.equipment_id = this.equipments_id;
            Damage.department_id = item.department_id;
            Damage.shift = this.getActualShift();
            this.damageSelect.push(Damage);
            Damage.damageTech_cmt_payload = item.damageTech_cmt_payload;
            this.Data_2.push(Damage);
          }
        }
      }
    },
    resolvedFunction(item) {
      this.resolveditem = [];
      this.resolvedDialoge = true;
      this.resolveditem.push(item);
    },
    defectedFunction(item) {
      this.resolveditem = [];
      this.defectedDialoge = true;
      this.resolveditem.push(item);
    },
    changeDefectsFunction() {
      this.defectsChange.item = this.resolveditem[0];
      this.defectsChange.damagetypeOld = this.resolveditem[0].damage;
      this.defectsChange.statusOld = this.resolveditem[0].damage.status;
      this.defectsChange.statusNew = "closed";

      this.listDefectsChange.push(this.defectsChange);
      if (this.resolveditem[0].department.name == "IT") {
        this.damageTypesIT.push(this.resolveditem[0]);
        this.modelDamageIT = this.modelDamageIT.filter(
          (c) => c.id != this.resolveditem[0].id
        );
      } else if (this.resolveditem[0].department.name == "TECHNIQUE") {
        this.damageTypesTEC.push(this.resolveditem[0]);
        this.modelDamageTEC = this.modelDamageTEC.filter(
          (c) => c.id != this.resolveditem[0].id
        );
      }
      this.defectedDialoge = false;
    },
    confirmed() {
      this.LoadingPage = true;
      this.closeDamage.id = this.resolveditem[0].damage.id;
      this.closeDamage.closedBy_id = this.getUserActive.id;
      let formData = new FormData();
      formData.append(`damages[id]`, this.closeDamage.id);
      formData.append(`damages[closedBy_id]`, this.closeDamage.closedBy_id);
      formData.append(`damages[damageTech_cmt_payload][comment]`, this.damageTech_cmt_payload.comment);
      this.damageTech_cmt_payload.pics.forEach((picFile, picIndex) => {
        formData.append(`damages[damageTech_cmt_payload][pics][${picIndex}]`, picFile);
      });
      
      console.log("this.damageTech_cmt_payload :",this.damageTech_cmt_payload);
      console.log("this.getUserActive :",this.getUserActive);
      console.log("this.resolveditem :",this.resolveditem);
      this.closeDamageAction_2(formData)
        .then((resolve) => {
        // this.EmailModel.payload.Equipment = this.EquipmentName[0].name;
        // this.EmailModel.status = "Closed ";
        // this.EmailModel.payload.EquipmentGroupe =
        //   this.resolveditem[0].department.name;
        // this.EmailModel.payload.Defects = resolve.damage_type.name;
        // this.EmailModel.payload.Status = "closed";
        // this.EmailModel.email =
        //   this.departmentOP.email.toString() +
        //   this.resolveditem[0].department.email.toString();
        // this.EmailModel.payload.ClosedBy = this.getUserActive.username;
        // this.EmailModel.payload.ClosedAt = resolve.declaredAt;
        // if (resolve.driver_out != null) {
        //   this.EmailModel.payload.DriverOut = resolve.driver_out.username;
        // } else {
        // }
        // this.EmailModel.payload.DeclaredBy = resolve.declared_by.username;
        // this.EmailModel.payload.DeclaredAt = resolve.declaredAt;

        // this.SendEmailAction(this.EmailModel).then(() => {
        // });
          // this.LoadingPage = true;
          this.damageTech_cmt_payload={
            comment: "",
            pics: []
          };
          console.log("kdkdkdkd",this.resolveditem[0])
          console.log("this.damageTypesTEC :",this.damageTypesTEC);
          this.defectedDialoge = false;
          this.modelTEC = [];
          this.modelIT = [];
          this.defectedDialoge=false;
          this.resolvedDialoge=false;
          this.damageTypesTEC=this.damageTypesTEC.map((e)=>{
            let isChecked=false;
            e.damageTypes=e.damageTypes.map((c)=>{
              if(c.id==this.resolveditem[0].id){
                c.damage=null;
              }

              if(c.damage!=null)
                isChecked=true;
              
              return c;
            });
            e.damage=isChecked;
            return e;
          });
          this.damageTypesIT=this.damageTypesIT.map((c)=>{
            let isChecked=false;
            if(c.id==this.resolveditem[0].id){
                c.damage=null;
              }
            return c;
          });
          
          
          this.resolveditem = [];
          this.LoadingPage = false;
          swal("Good job!", "success", "success");
          
          //this.$router.go();
        })
        .catch(() => {
          swal("Error hna", "", "error");
        });
         console.log("hna :",this.damageTypesTEC);
      
    },
    closed() {
      this.closeDamage.id = this.resolveditem[0].damage.id;
      this.closeDamage.closedBy_id = this.getUserActive.id;
      this.closeDamageAction_2(this.closeDamage)
        .then((resolve) => {
          //this.EmailModel.payload.Equipment = this.EquipmentName[0].name;
          //this.EmailModel.status = "Closed ";
//
          //this.EmailModel.payload.EquipmentGroupe =
          //  this.resolveditem[0].department.name;
          //this.EmailModel.payload.Defects = resolve.damage_type.name;
          //this.EmailModel.payload.Status = "closed";
          //this.EmailModel.email =
          //  this.departmentOP.email.toString() +
          //  this.resolveditem[0].department.email.toString();
//
          //this.EmailModel.payload.ClosedBy = this.getUserActive.username;
          //this.EmailModel.payload.ClosedAt = resolve.declaredAt;
          //if (resolve.driver_out != null) {
          //  this.EmailModel.payload.DriverOut = resolve.driver_out.username;
          //} else {
          //}
          //this.EmailModel.payload.DeclaredBy = resolve.declared_by.username;
          //this.EmailModel.payload.DeclaredAt = resolve.declaredAt;
//
          //this.SendEmailAction(this.EmailModel).then(() => {
          //});
          this.resolvedDialoge = false;
          // this.LoadingPage = true;

          this.$router.go();
        })
        .catch(() => {
          swal("Error", "", "error");
        });

      this.changeEquipmentsFiltreSELECT();
      this.modelTEC = [];
      this.modelIT = [];
    },
    revert() {
      this.LoadingPage = true;
      this.revertDamage.id = this.resolveditem[0].damage.id;
      this.revertDamage.rejectedBy_id = this.getUserActive.id;
      let formData = new FormData();
      formData.append(`damages[id]`, this.revertDamage.id);
      formData.append(`damages[rejectedBy_id]`, this.revertDamage.rejectedBy_id);
      formData.append(`damages[damageTech_cmt_payload][comment]`, this.damageTech_cmt_payload.comment);
      this.damageTech_cmt_payload.pics.forEach((picFile, picIndex) => {
        formData.append(`damages[damageTech_cmt_payload][pics][${picIndex}]`, picFile);
      });
      
      console.log("this.damageTech_cmt_payload :",this.damageTech_cmt_payload);
      console.log("this.getUserActive :",this.getUserActive);
      console.log("this.resolveditem :",this.revertDamage);
      this.revertDamageAction_2(formData)
        .then((resolve) => {
          //this.EmailModel.payload.Equipment = this.EquipmentName[0].name;
          //this.EmailModel.payload.EquipmentGroupe =
          //  this.resolveditem[0].department.name;
          //this.EmailModel.payload.Defects = resolve.damage_type.name;
          //this.EmailModel.status = "Rejcted ";
          //this.EmailModel.email =
          //  this.departmentOP.email.toString() +
          //  this.resolveditem[0].department.email.toString();
//
          //this.EmailModel.payload.Status = "on progress";
          //this.EmailModel.payload.Rejected_by = this.getUserActive.username;
          //this.EmailModel.payload.RejectedAt = resolve.declaredAt;
          //this.EmailModel.payload.RejectedTimes = resolve.rejectedTimes;
          //this.EmailModel.payload.Confirmed_by = resolve.confirmed_by.username;
          //this.EmailModel.payload.ConfirmedAt = resolve.declaredAt;
//
          //if (resolve.driver_out != null) {
          //  this.EmailModel.payload.DriverOut = resolve.driver_out.username;
          //} else {
          //}
          //this.EmailModel.payload.DeclaredBy = resolve.declared_by.username;
          //this.EmailModel.payload.declaredAt = resolve.declaredAt;
//
          //this.SendEmailAction(this.EmailModel).then(() => {
          //});
          console.log("resolve",resolve)
          this.damageTech_cmt_payload={
            comment: "",
            pics: []
          };
          console.log("kdkdkdkd",this.resolveditem[0])
          console.log("this.damageTypesTEC :",this.damageTypesTEC);
          this.defectedDialoge = false;
          this.modelTEC = [];
          this.modelIT = [];
          this.resolvedDialoge=false;
          this.damageTypesTEC=this.damageTypesTEC.map((e)=>{
            let isChecked=false;
            e.damageTypes=e.damageTypes.map((c)=>{
              if(c.id==this.resolveditem[0].id){
                c.damage=resolve;
              }

              if(c.damage!=null)
                isChecked=true;
              
              return c;
            });
            e.damage=isChecked;
            return e;
          });
          this.damageTypesIT=this.damageTypesIT.map((c)=>{
            let isChecked=false;
            if(c.id==this.resolveditem[0].id){
                c.damage=resolve;
              }
            return c;
          });
          this.resolvedDialoge = false;

           this.LoadingPage = false;

          //this.$router.go();
        })
        .catch(() => {
          swal("Error", "", "error");
        });


    },
    cancel() {
      this.dialog = false;
    },
    cancelvalide() {
      if (this.Data.length == 0) {
        this.dialogValide = false;
      } else {
        this.Data = this.Data.map((e) => {
          if (e.damage_type_id != this.damage_type_id) {
            return e;
          }
        });
        this.dialogValide = false;
        this.modelIT = this.modelIT.map((e) => {
          if (e != this.modelIT_id_Courent) {
            return e;
          }
        });
        this.Data = this.Data.filter(function (element) {
          return element !== undefined;
        });
      }
    },
    dialogValideFunction(item, i) {
      this.damageCourent.declaredBy_id = this.getUserActive.id;
      this.damageCourent.damage_type_id = item.id;
      this.damageCourent.equipment_id = this.equipments_id;
      this.damage_type_id = item.id;
      this.modelIT_id_Courent = i;
      //this.dialogValide = true;
    },
    clearModelEmail() {
      this.EmailModel.payload = {
        Equipment: "",
        EquipmentGroupe: "",
        Department: "",
        Defects: [],
        Status: "on progress",
        DriverOut: "",
        DeclaredBy: "",
        DeclaredAt: "",
      };
      this.EmailModel.status = "";
      this.EmailModel.email = "";
      this.EmailModel.department = [];

      // TEC

      this.EmailModelTEC.payload = {
        Equipment: "",
        EquipmentGroupe: "",
        Department: "",
        Defects: [],
        Status: "on progress",
        DriverOut: "",
        DeclaredBy: "",
        DeclaredAt: "",
      };
      this.EmailModelTEC.status = "";
      this.EmailModelTEC.email = "";
      this.EmailModelTEC.department = [];

      this.listdepartmentIT = [];
      this.listdepartmentIT = [];
      this.listDefectsNamesIT = [];
      this.listDefectsNamesITFinal = [];

      this.listdepartmentTEC = [];
      this.listdepartmentTEC = [];
      this.listDefectsNamesTEC = [];
      this.listDefectsNamesTECFinal = [];
    },
    validerDamages() {
      this.LoadingPage = true;
      let formData = new FormData();
      this.Data.forEach((item, index) => {
        formData.append(`damages[${index}][declaredBy_id]`, item.declaredBy_id);
        formData.append(`damages[${index}][equipment_id]`, item.equipment_id);
        formData.append(`damages[${index}][damage_type_id]`, item.damage_type_id);
        formData.append(`damages[${index}][shift]`, item.shift);
        console.log("item",item)
        if(item.department_id==2){
           console.log("item entered",item)
          formData.append(`damages[${index}][damageTech_cmt_payload][comment]`, item.damageTech_cmt_payload.comment);

          item.damageTech_cmt_payload.pics.forEach((picFile, picIndex) => {
          formData.append(`damages[${index}][damageTech_cmt_payload][pics][${picIndex}]`, picFile);
        });
        } else {
          
        formData.append(`damages[${index}][damageTech_cmt_payload][comment]`, this.damageTech_cmt_payload.comment);

        this.damageTech_cmt_payload.pics.forEach((picFile, picIndex) => {
          formData.append(`damages[${index}][damageTech_cmt_payload][pics][${picIndex}]`, picFile);
        });
        }
        
      });
      if (this.Data.length == 0) {
        if (this.equipments_id == "") {
          swal(
            "warning !!",
            "Please can you chose equipment you use it!",
            "warning"
          );
          this.dialogValide = false;
          this.dialogValideDamage = false;
        } else {
          this.presenceCheck.user_id = this.getUserActive.id;
          this.presenceCheck.equipment_id = this.equipments_id;
          this.presenceChecksAction(this.presenceCheck)
            .then((resolve) => {
              swal("success !!", "", "success");
            })
            .catch(() => {
              swal("Error", "", "error");
            });

          this.dialogValide = false;
          this.dialogValideDamage = false;
        }
      } else if (this.Data.length > 0) {
        console.log("formData :",formData);
        this.declareDamageAction(formData)
          .then((resolve) => {
            this.modelTEC = [];
            this.modelIT = [];
            this.EmailModel.payload.Defects = [];
            this.EmailModelTEC.payload.Defects = [];
            var ITemail = this.departmentIT.email;
            var TECemail = this.departmentTEC.email;

            this.Data.map((item) => {
              this.a = [...new Set(this.listDefectsNamesTEC)];

              this.a.map((c) => {
                if (c.id == item.damage_type_id) {
                  this.EmailModelTEC.payload.Defects.push(c.name);
                }
              });
            });
            this.Data.map((item) => {
              this.b = [...new Set(this.listDefectsNamesIT)];

              this.b.map((c) => {
                if (c.id == item.damage_type_id) {
                  this.EmailModel.payload.Defects.push(c.name);
                }
              });
            });

            if (this.listdepartmentIT.length != 0) {
              this.EmailModel.department = "IT";
              this.EmailModel.payload.Equipment = this.EquipmentName[0].name;
              this.EmailModel.payload.EquipmentGroupe =
                this.EquipmentName[0].profile_group.name;

              this.EmailModel.payload.Department = "IT";
              this.EmailModel.payload.Status = "on progress";
              this.EmailModel.status = "Defected ";
              this.EmailModel.email =
                this.departmentIT.email.toString() +
                this.departmentOP.email.toString();

              if (resolve[0].driver_out != null) {
                this.EmailModel.payload.DriverOut =
                  resolve[0].driver_out.username;
              } else {
              }
              this.EmailModel.payload.DeclaredBy =
                resolve[0].declaredBy.username;
              this.EmailModel.payload.DeclaredAt = resolve[0].declaredAt;
              this.SendEmailAction(this.EmailModel).then(() => {
                this.listdepartmentIT = [];
                this.listdepartmentIT = [];
                this.listDefectsNamesIT = [];
                this.listDefectsNamesITFinal = [];
              });
            }
            if (this.listdepartmentTEC.length != 0) {
              setTimeout(() => {
                this.EmailModelTEC.department = "TECHNIQUE";
                this.EmailModelTEC.payload.Equipment =
                  this.EquipmentName[0].name;
                this.EmailModelTEC.payload.EquipmentGroupe =
                  this.EquipmentName[0].profile_group.name;

                this.EmailModelTEC.payload.Department = "TECHNIQUE";
                this.EmailModelTEC.payload.Status = "on progress";
                this.EmailModelTEC.status = "Defected ";
                this.EmailModelTEC.email =
                  this.departmentTEC.email.toString() +
                  "," +
                  this.departmentOP.email.toString();
                if (resolve[0].driver_out != null) {
                  this.EmailModelTEC.payload.DriverOut =
                    resolve[0].driver_out.username;
                } else {
                }
                this.EmailModelTEC.payload.DeclaredBy =
                  resolve[0].declaredBy.username;
                this.EmailModelTEC.payload.DeclaredAt = resolve[0].declaredAt;


                this.SendEmailAction(this.EmailModelTEC).then(() => {

                  this.listdepartmentTEC = [];
                  this.listDefectsNamesTEC = [];
                  this.listDefectsNamesTECFinal = [];
                });
              }, 1000);
            }
            this.Data = [];
            this.Data_2 = [];
            this.presenceCheck.user_id = this.getUserActive.id;
            this.presenceCheck.equipment_id = this.equipments_id;
            this.presenceChecksAction(this.presenceCheck).then((resolve) => {
            });
            this.damageSelect = [];
            this.changeEquipmentsFiltreSELECT();
            this.dialogValide = false;
            this.dialogValideDamage = false;
            this.LoadingPage = true;
            this.LoadingPage = false;
            setTimeout(() => {
              this.LoadingPage = false;
              swal("Good job!", "success", "success");
            }, 1500);
          })
          .catch(() => {
            swal("Error", "", "error");
          });
      }
    },
    getActualShift() {
      let thisDate = new Date("2022-02-16T06:30:00");
      let nowDate = new Date();
      let shift = ["D", "A", "B", "C"];
      let momentDate = moment(thisDate);

      while (momentDate.add(72, "hours").toDate() < nowDate) {
        shift = this.shiftArrays(shift);
      }

      if (
        ((nowDate.getHours() == 6 && nowDate.getMinutes() >= 30) ||
          nowDate.getHours() >= 7) &&
        ((nowDate.getHours() == 14 && nowDate.getMinutes() < 30) ||
          nowDate.getHours() < 15)
      )
        return shift[0];
      else if (
        ((nowDate.getHours() == 14 && nowDate.getMinutes() >= 30) ||
          nowDate.getHours() >= 15) &&
        ((nowDate.getHours() == 22 && nowDate.getMinutes() < 30) ||
          nowDate.getHours() < 23)
      )
        return shift[1];
      else if (
        (nowDate.getHours() == 22 && nowDate.getMinutes() >= 30) ||
        (nowDate.getHours() >= 0 &&
          nowDate.getHours() < 6 &&
          nowDate.getMinutes() < 30)
      )
        return shift[2];
    },
    shiftArrays(array) {
      let c = "";
      c = array[3];
      array[3] = array[2];
      array[2] = array[1];
      array[1] = array[0];
      array[0] = c;

      return array;
    },
  },
};
</script>
