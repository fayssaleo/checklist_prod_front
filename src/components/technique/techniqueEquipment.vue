<template>


  <v-data-table :items-per-page="5" :headers="computedHeaders" :items="damageByEquipments" :search="search" :loading="loading"
    sort-by="item.id" class="elevation-1 technique_table_new technique_table_new_damage" v-if="viewTable">
    <template v-slot:item="{ item }">
      <tr @click="pageView(item)" :style="{backgroundColor:getColor(item.status)+' !important'}">
        <td> <v-icon style="
            height: 50px;
    width: 45px;
    border-radius: 57px;
    border: 1px solid white;
    color: white;
        " >{{ item?.damage_type?.damage_type_master?.icon || item?.damage_type?.icon }}</v-icon> </td>
        <td>{{ item?.damage_type.name }}</td>
        <td
        v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
        >
          {{ item?.declared_by.username }}
        </td>

        <td>
          {{ item?.created_at }}
        </td>
        <td>{{ item?.confirmedAt }}</td>
        <td>
          {{ item?.rejectedTimes }}
        </td>

        <td>

          <v-btn v-if="
            item?.status == 'on progress' &&
            (getUserActive?.fonction?.department_id==1 || getUserActive?.fonction?.department_id==2)

            "
       
            style=" 
                font-weight: 900;   
                font-weight: 900 !important;
                background-color: transparent !important;
                color: #fb8500 !important;
                border: 1px solid #fb8500;
                " 
            class="mr-2  " 
            @click.stop="opendialogresolve_dragg_event_resolve(item)">
            RESOLVE
          </v-btn>
          <v-btn v-if="
            item?.status == 'resolved' &&
            (getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN')
            "
            style=" 
                font-weight: 900;   
                font-weight: 900 !important;
                background-color: transparent !important;
                color:#d43737 !important;
                border: 1px solid #d43737;
                " 
           class="mr-2 "
            @click.stop="opendialogresolve_dragg_event(item)">
            REJECT
          </v-btn>
          <v-btn v-if="
            (item?.status == 'resolved' ||  item?.status == 'on progress') &&
           ( getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN')
            
            "
            style=" 
                font-weight: 900;   
                font-weight: 900 !important;
                background-color: transparent !important;
                color:rgb(36 48 101) !important;
                border: 1px solid rgb(36 48 101);
                " 
           class="mr-2 " 
            @click.stop="opendialogclosed_dragg_event_closed(item)">
            CLOSE
          </v-btn>

          <v-btn v-if="fonction == 'ADMIN'" color="red" class="mr-2 btn white--text"
            @click.stop="opendialogDelete(item)">
            <v-icon medium class="mr-2"> mdi-delete </v-icon>
          </v-btn>
        </td>
      </tr>
    </template>

    <template v-slot:top>
      <v-dialog v-model="dialogDefectToResolve" transition="dialog-bottom-transition" max-width="700px">
      <v-card style="border-top-right-radius: 76px; border-bottom-left-radius: 79px; ">
        <v-toolbar dark color="rgb(241 0 0)">
          <v-btn icon dark @click="dialogDefectToResolve = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title style="font-weight: 900">REJECT RESOLUTION :</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items> </v-toolbar-items>
        </v-toolbar>

        <v-card-title class="text-h5" style="font-weight: 900">
          Are you sure you want to reject this <span style="margin-left:10px;margin-right:10px;color: #fb8500; ;">
            RESOLUTION </span> ?</v-card-title>
        <v-col cols="12" md="12"> </v-col>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="color:black;font-weight: 900" depressed color="" @click="dialogDefectToResolve = false">
            CANCEL
          </v-btn>
          <v-btn style="color:white;font-weight: 900" depressed color="rgb(241 0 0)" @click="doTheReject">
            YES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog style="border-top-right-radius: 76px !important;
   border-bottom-left-radius: 79px !important; " transition="dialog-bottom-transition" v-model="damageTech_cmt"
      persistent max-width="800px">
      <v-card style="border-top-right-radius: 76px; border-bottom-left-radius: 79px; ">
        <v-card-title class="text-h5 lighten-1 white--text"
          style="background-color: rgb(241 0 0) !important; font-weight: 900;">
          <v-icon style=" font-size: 40px;
              margin-left: -12px;
              margin-right: 9px;
              margin-bottom: 5px;
              color: white; ">{{
                (damageSelect?.damage_type.department_id == 1) ? damageSelect?.damage_type.icon : damageSelect?.damage_type.damage_type_master.icon
            }}</v-icon>
          REJECT RESOLUTION > {{ damageSelect?.damage_type?.name?.toLocaleUpperCase() }}
        </v-card-title>
        <v-spacer></v-spacer>

        <v-card-text class="pa-4 black--text" style="font-size: 19px; font-weight: 900; ">
          <span style="font-size: 19px; font-weight: 900; margin-bottom: 17px; display: inline-block;">Add details
            (comment/pictures) :</span>
          <v-textarea label="Defect comment.." v-model="damageTech_cmt_payload.comment" name="input-7-1"
            variant="outlined" style="BACKGROUND-COLOR:#cacaca !important;" class="sub_comment_text"></v-textarea>
          <div cols="12" md="12" class="cmt_pic_background">
            <span class="images_pannel">
              <img v-for="pic in damageTech_cmt_payload.files" @click="imagefullScreen(pic)" :src="getImageUrl(pic)"
                alt="">

            </span>
            <span class="add_button" @click="triggerUpload">
              <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
              <v-icon size="45px" class="">mdi-plus</v-icon>
            </span>

          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="    font-weight: 900;" color="#fff " @click="resetDraggin(); damageTech_cmt = false">
            Cancel
          </v-btn>
          <v-btn :disabled="damageTech_cmt_payload.comment == ''" style="color:white;font-weight: 900" depressed
            color="rgb(241 0 0)" @click="reject_action_with_cmt()">
            REJECT
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
            <v-btn style="    background-color: rgb(229 229 229);
                                  border-color: rgb(201 25 25);
                                  margin-left: 8px;
                                  /* font-weight: 900; */
                                  margin-right: 14px;
                                  font-size: 31px;
                                  border-radius: 46px;
                                  /* width: 16px !important; */
                                  color: #913333;" @click="damageTech_cmt_fullscreen_img = false">
              <v-icon style="    color: #b04242;
                                    font-size: 37px;
                                    margin-top: 2px;
                                ">mdi-close-circle</v-icon>
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
    <v-dialog v-model="cmt_actual_pic_delete" persistent max-width="600px">
      <v-card>
        <v-toolbar dark style="font-weight: 900;background-color: rgb(241 0 0);">
          <v-toolbar-title>Warning !</v-toolbar-title>
        </v-toolbar>
        <v-card-title class="text-h5" style="font-weight: 900;">
          Are you sure to delete this picture ?
        </v-card-title>
        <v-card-text class="font-weight-bold"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="font-weight: 900" color="white" @click="cmt_actual_pic_delete = false"> No </v-btn>
          <v-btn style="color:white;font-weight: 900" color="rgb(241 0 0)" @click="deleteImage()"> Yes </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


















    <!------------------------------------------------------------------------------------------------------------------------->
    <v-dialog style="border-top-right-radius: 76px !important;
         border-bottom-left-radius: 79px !important; " transition="dialog-bottom-transition"
      v-model="damageTech_cmt_resolve" persistent max-width="800px">
      <v-card style="border-top-right-radius: 76px; border-bottom-left-radius: 79px; ">
        <v-card-title class="text-h5 lighten-1 white--text"
          style="background-color: #fb8500 !important; font-weight: 900;">
          <v-icon style=" font-size: 40px;
              margin-left: -12px;
              margin-right: 9px;
              margin-bottom: 5px;
              color: white; ">{{
                (damageSelect?.damage_type.department_id == 1) ? damageSelect?.damage_type.icon : damageSelect?.damage_type.damage_type_master.icon
            }}</v-icon>
          RESOLVE > {{ damageSelect?.damage_type?.name?.toLocaleUpperCase() }}
        </v-card-title>
        <v-spacer></v-spacer>

        <v-card-text class="pa-4 black--text" style="font-size: 19px; font-weight: 900; ">
          <v-row style="padding: 0 !important;margin: 0 !important;">
            <v-col cols="6" style="padding: 0 !important;margin: 0 !important;">
              <span style="font-size: 19px; font-weight: 900; margin-bottom: 17px; display: inline-block;">Add details
              (comment/pictures) :</span>
            </v-col>
            <v-col cols="6" style="padding: 0 !important;margin: 0 !important;">
              <v-text-field hide-details  style="padding: 0 !important;margin: 0 !important;" v-model="work_order" label="WORK ORDER:"></v-text-field>
            </v-col>
          </v-row>
          <v-textarea label="Defect comment.." v-model="damageTech_cmt_payload.comment" name="input-7-1"
            variant="outlined" style="BACKGROUND-COLOR:#cacaca !important;" class="sub_comment_text"></v-textarea>
          <div cols="12" md="12" class="cmt_pic_background">
            <span class="images_pannel">
              <img v-for="pic in damageTech_cmt_payload.files" @click="imagefullScreen(pic)" :src="getImageUrl(pic)"
                alt="">

            </span>
            <span class="add_button" @click="triggerUpload">
              <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
              <v-icon size="45px" class="">mdi-plus</v-icon>
            </span>

          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="    font-weight: 900;" color="#fff " @click="resetDraggin(); damageTech_cmt_resolve = false">
            Cancel
          </v-btn>
          <v-btn :disabled="damageTech_cmt_payload.comment == '' || work_order == ''" style="color:white;font-weight: 900" depressed
            color="#fb8500" @click="resolve_action_with_cmt_resolve()">
            RESOLVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDefectToResolve_resolve" transition="dialog-bottom-transition" max-width="700px">
      <v-card style="border-top-right-radius: 76px; border-bottom-left-radius: 79px; ">
        <v-toolbar dark color="#fb8500">
          <v-btn icon dark @click="dialogDefectToResolve_resolve = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title style="font-weight: 900">RESOLVE DEFECT :</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items> </v-toolbar-items>
        </v-toolbar>

        <v-card-title class="text-h5" style="font-weight: 900">
          Are you sure you want to resolve this <span style="margin-left:10px;margin-right:10px;color: rgb(241 0 0) ;">
            DEFECT </span> ?</v-card-title>
        <v-col cols="12" md="12"> </v-col>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="color:black;font-weight: 900" depressed color="" @click="dialogDefectToResolve_resolve = false">
            CANCEL
          </v-btn>
          <v-btn style="color:white;font-weight: 900" depressed color="#fb8500" @click="doTheResolve">
            YES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <!------------------------------------------------------------------------------------------------------------------------->





    <!------------------------------------------------------------------------------------------------------------------------->
    <v-dialog style="border-top-right-radius: 76px !important;
         border-bottom-left-radius: 79px !important; " transition="dialog-bottom-transition"
      v-model="damageTech_cmt_closed" persistent max-width="800px">
      <v-card style="border-top-right-radius: 76px; border-bottom-left-radius: 79px; ">
        <v-card-title class="text-h5 lighten-1 white--text"
          style="background-color: #110d41 !important; font-weight: 900;">
          <v-icon style=" font-size: 40px;
              margin-left: -12px;
              margin-right: 9px;
              margin-bottom: 5px;
              color: white; ">{{
                (damageSelect?.damage_type.department_id == 1) ? damageSelect?.damage_type.icon : damageSelect?.damage_type.damage_type_master.icon
            }}</v-icon>
          CLOSE > {{ damageSelect?.damage_type?.name?.toLocaleUpperCase() }}
        </v-card-title>
        <v-spacer></v-spacer>

        <v-card-text class="pa-4 black--text" style="font-size: 19px; font-weight: 900; ">
          <span style="font-size: 19px; font-weight: 900; margin-bottom: 17px; display: inline-block;">Add details
            (comment/pictures) :</span>
          <v-textarea label="Defect comment.." v-model="damageTech_cmt_payload.comment" name="input-7-1"
            variant="outlined" style="BACKGROUND-COLOR:#cacaca !important;" class="sub_comment_text"></v-textarea>
          <div cols="12" md="12" class="cmt_pic_background">
            <span class="images_pannel">
              <img v-for="pic in damageTech_cmt_payload.files" @click="imagefullScreen(pic)" :src="getImageUrl(pic)"
                alt="">

            </span>
            <span class="add_button" @click="triggerUpload">
              <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
              <v-icon size="45px" class="">mdi-plus</v-icon>
            </span>

          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="    font-weight: 900;" color="#fff " @click="resetDraggin(); damageTech_cmt_closed = false">
            Cancel
          </v-btn>
          <v-btn :disabled="damageTech_cmt_payload.comment == ''" style="color:white;font-weight: 900" depressed
            color="#110d41" @click="closed_action_with_cmt_closed()">
            CLOSE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDefectToResolve_closed" transition="dialog-bottom-transition" max-width="700px">
      <v-card style="border-top-right-radius: 76px; border-bottom-left-radius: 79px; ">
        <v-toolbar dark color="#110d41">
          <v-btn icon dark @click="dialogDefectToResolve_closed = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title style="font-weight: 900">RESOLVE DEFECT :</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items> </v-toolbar-items>
        </v-toolbar>

        <v-card-title class="text-h5" style="font-weight: 900">
          Are you sure you want to close this
          <span v-if="(damageSelect.status == 'on progress')"
            style="margin-left:10px;margin-right:10px;color: rgb(241 0 0) ;"> DEFECT </span>
          <span v-else style="margin-left:10px;margin-right:10px;color: #fb8500; ;"> RESOLUTION </span>

          ?</v-card-title>
        <v-col cols="12" md="12"> </v-col>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="color:black;font-weight: 900" depressed color="" @click="dialogDefectToResolve_closed = false">
            CANCEL
          </v-btn>
          <v-btn style="color:white;font-weight: 900" depressed color="#110d41" @click="doTheClose">
            YES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <!------------------------------------------------------------------------------------------------------------------------->

      <v-dialog v-model="dialogimage" width="1000">
        <v-card>
          <v-toolbar dark color=" #1e2855">
            <v-btn icon dark @click="dialogimage = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title style="font-weight: 900;">Comments</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items> </v-toolbar-items>
          </v-toolbar>
          <div v-if="showComments" ref="scrollComment" class="scrollComments">
            <v-sheet color="white" class="mx-4" elevation="4" rounded>
              <Comment class="my-2" v-for="item in comments" :key="item?.id" :status="item?.status"
                :comment_id="item?.id" :editeCommentParent="editeComment" :username="item?.user.username"
                :damage_id="item?.damage_id" :user_id="item?.user_id" :refreshComments="refreshComments"
                :comment="item?.comment" :files="item?.files" :created_at="item?.created_at" />
            </v-sheet>
          </div>

          <v-divider></v-divider>

          <v-row class="addDescription">
            <v-col cols="12">
              <h3>Comment :</h3>
              <v-textarea solo name="input-7-4" label="Description" v-model="photo.comment"></v-textarea>
            </v-col>
            <v-col cols="12" class="ma-0 py-0">
              <v-file-input label="Pictures" v-model="photo.photos" filled multiple
                prepend-icon="mdi-camera"></v-file-input>
            </v-col>
            <v-col cols="12" md="12" v-if="userDepartment != 'TECHNIQUE' && userDepartment != 'IT'">
              <v-card class="d-flex pa-4 mb-4 commentSwitch">
                <v-row>
                  <v-col cols="7"></v-col>
                </v-row>
                <h5 class="black--text text--lighten-2 mr-4">
                  Description
                </h5>
                <v-switch color="deep-orange lighten-1 mt-0" v-model="switch1"
                  @change="DescriptionOrReject()"></v-switch>
                <h5 class="deep-orange--text text--lighten-1 ml-4">
                  Rejected
                </h5>
              </v-card>
            </v-col>
            <v-col cols="12" md="12">
              <v-card-actions class="action">
                <v-btn depressed color="" @click="dialogimage = false">
                  Close
                </v-btn>
                <v-btn :disabled="disabledImage" depressed color="primary" @click="sendImage()">
                  Save
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogresolve" max-width="700px">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialogresolve = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Resolved</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items> </v-toolbar-items>
          </v-toolbar>

          <v-card-title class="text-h5">
            Are you sure you want to resolve this Defecte ?</v-card-title>
          <v-col cols="12" md="12"> </v-col>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed color="" @click="dialogresolve = false">
              Close
            </v-btn>
            <v-btn depressed color="primary" @click="confirmed()">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogrejected" max-width="700px">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialogrejected = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Rejected</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items> </v-toolbar-items>
          </v-toolbar>
          <v-card-title class="text-h5">
            Are you sure you want to reject this Defecte ?</v-card-title>

          <v-col cols="12" md="12"> </v-col>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed color="" @click="dialogrejected = false">
              Close
            </v-btn>
            <v-btn depressed color="primary" @click="revert()"> Ok </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogclose" max-width="700px">
        <v-card>
          <v-toolbar dark color="error">
            <v-toolbar-title>Warning !</v-toolbar-title>
          </v-toolbar>
          <v-card-title class="text-h5">Are you sure you want to close this Defecte ?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="" @click="dialogclose = false">Cancel</v-btn>
            <v-btn color="primary" @click="closed">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="600px">
        <v-card>
          <v-toolbar dark color="error">
            <v-toolbar-title>Warning !</v-toolbar-title>
          </v-toolbar>
          <v-card-title class="text-h5">Are you sure you want to delete this Defecte ?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn depressed color="" @click="dialogDelete = false">Cancel</v-btn>
            <v-btn depressed color="error" @click="deleteDamage()">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" fullscreen hide-overlay>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="closedtailedialoge">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>
              {{ damageSelect.damage_type.name }} {{ " - " }}
              {{ damageSelect.declaredAt }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-title class="text-h5 blue--text text--darken-3">
            Defect Details:
          </v-card-title>
          <v-container>
            <v-row>
              <v-col>
                <table class="DamageDetails">
                  <tbody>
                    <tr v-if="userDepartment == 'TECHNIQUE' || userDepartment == 'IT'">
                      <td>
                        <h3>Master</h3>
                      </td>
                      <td class="valueColumn">
                        <h4>{{ damageSelect.damage_type?.damage_type_master?.name || 'IT' }}</h4>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3>Defect</h3>
                      </td>
                      <td class="valueColumn">
                        <h4>{{ damageSelect.damage_type.name }}</h4>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <h3>Status</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.status == null">Empty</h5>

                        <h4 v-else>{{ damageSelect.status }}</h4>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <h3>Profile Group</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="
                          damageSelect.equipment.profile_group.name ==
                          null
                        ">
                          Empty
                        </h5>

                        <h4 v-else>
                          {{ damageSelect.equipment.profile_group.name }}
                        </h4>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3>Equipment</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.equipment.name == null">
                          Empty
                        </h5>

                        <h4 v-else>{{ damageSelect.equipment.name }}</h4>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3>Declared At</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.declaredAt == null">
                          Empty
                        </h5>

                        <h4 v-else>{{ damageSelect.declaredAt }}</h4>
                      </td>
                    </tr>
                    <tr v-if="userDepartment != 'TECHNIQUE' && userDepartment != 'IT'">
                      <td>
                        <h3>Declared By</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.declared_by.username == null">
                          Empty
                        </h5>

                        <h4 v-else>
                          {{ damageSelect.declared_by.username }}
                        </h4>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3>Resolved At</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.confirmedAt == null">
                          Empty
                        </h5>

                        <h4 v-else>{{ damageSelect.confirmedAt }}</h4>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <h3>Resolved By</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.confirmed_by == null">
                          Empty
                        </h5>

                        <h4 v-else>
                          {{ damageSelect.confirmed_by.username }}
                        </h4>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3>Closed At</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.closedAt == null">Empty</h5>

                        <h4 v-else>{{ damageSelect.closedAt }}</h4>
                      </td>
                    </tr>
                    <tr v-if="userDepartment != 'TECHNIQUE' && userDepartment != 'IT'">
                      <td>
                        <h3>Rejected By</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.rejected_by == null">
                          Empty
                        </h5>

                        <h4 v-else>
                          {{ damageSelect.rejected_by.username }}
                        </h4>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3>Rejected At</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.rejectedAt == null">
                          Empty
                        </h5>

                        <h4 v-else>{{ damageSelect.rejectedAt }}</h4>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3>Rejected Times</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.rejectedTimes == null">
                          Empty
                        </h5>

                        <h4 v-else>{{ damageSelect.rejectedTimes }}</h4>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <h3>Created at</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.created_at == null">
                          Empty
                        </h5>

                        <h4 v-else>{{ damageSelect.created_at }}</h4>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3>Shift</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.shift == null">Empty</h5>

                        <h4 v-else>
                          {{ damageSelect.shift }}
                        </h4>
                      </td>
                    </tr>
                    <tr v-if="userDepartment != 'TECHNIQUE' && userDepartment != 'IT'">
                      <td>
                        <h3>Last driver</h3>
                      </td>
                      <td class="valueColumn">
                        <h5 v-if="damageSelect.driverOut == null">Empty</h5>

                        <h4 v-else>
                          {{ damageSelect.driver_out.username }}
                        </h4>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-col>
            </v-row>
          </v-container>

          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogimageShow" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogimageShow = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Picture</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="mr-2 white--text" color="red">
            <v-icon medium class="mr-2">mdi-folder-image</v-icon>
            <a class="downloadpicture" :href="`http://10.20.33.110:9008/storage/cdn/damageFiles/${PhotoShow.filename}`"
              download target="_blank">
              download picture</a>
          </v-btn>
        </v-toolbar>
        <v-card>
          <div class="p-100">
            <v-img :lazy-src="`http://10.20.33.110:9008/storage/cdn/damageFiles/${PhotoShow.filename}`" max-height="90%"
              max-width="100%" :src="`http://10.20.33.110:9008/storage/cdn/damageFiles/${PhotoShow.filename}`"></v-img>
          </div>
        </v-card>
      </v-dialog>
      <v-toolbar flat>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn color="teal" class="mr-2 btn white--text" @click.stop="clickImage(item)">
        <v-icon medium class="mr-2"> mdi-camera </v-icon>
        /
        <v-icon medium class="mr-2"> mdi-comment </v-icon>
      </v-btn>
      <v-btn class="mr-2 btn" color="primary" @click.stop="opendialogresolve(item)">
        Resolved
      </v-btn>
      <v-btn class="mr-2 btn" color="error" @click.stop="opendialogrejected(item)">
        Rejected
      </v-btn>
      <v-btn class="mr-2 btn" color="primary" @click.stop="dialogclose = true">
        Close
      </v-btn>

      <v-btn v-if="userDepartment == 'IT'" color="red" class="mr-2 btn white--text"
        @click.stop="opendialogDelete(item)">
        <v-icon medium class="mr-2"> mdi-delete </v-icon>
      </v-btn>
    </template>
    <template v-slot:no-data>
      <v-btn color="#293777" style="color:white" @click="initialize()"> Reset </v-btn>
    </template>
  </v-data-table>
  <v-row v-else style="display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
    margin: -12px;
    justify-content: center;
    height: 100%;
     ">
    <v-col class="header_poto_holder " :class="{
      'potoBeenDragget': (dragging && dragItem.status === 'resolved' && getUserActive.fonction?.department_id==3),
      'poto_prohibited_1': dragging && dragItem.status === 'closed',
    }" cols="4"><span class="poto_header_1">IN PROGRESS</span></v-col>
    <v-col class="header_poto_holder" :class="{
      'potoBeenDragget': dragging && dragItem.status === 'on progress' &&  getUserActive.fonction?.department_id!=3,
      'poto_prohibited_2': dragging && dragItem.status === 'closed',
    }" cols="4"><span class="poto_header_2">RESOLVED</span></v-col>
    <v-col class="header_poto_holder" :class="{ 'potoBeenDragget': dragging && dragItem.status === 'closed'  && getUserActive.fonction?.department_id==3 }"
      cols="4"><span class="poto_header_3">CLOSED</span></v-col>
    <v-col cols="4" class="poto poto_1" :class="{
      poto_shaine_1: (dragging && dragItem.status == 'resolved' &&  getUserActive.fonction?.department_id==3),
      poto_body_prohibited_1: (dragging && dragItem.status == 'closed'),
    }" @mouseleave="onMouseLeave_progress_wall($event)" @mouseover="onMouseOver_wall_progress($event)"
      @mouseup="onMouseUp_progress_wall($event)">

      <v-row style="transition: all 0.3s ease;">
        <v-col v-if="hover_item_progress" @click.prevent cols="12" :key="hover_item_progress?.id">
          <span style="background-color:#110d41;
           margin-bottom: 30px;
           margin-top: 30px;
              box-shadow: -2px 13px 20px 6px #dd3030;
          " @mousedown="onMouseDown($event, hover_item_progress)" class="profile_group_tickets_damage">
            <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ dragItem?.damage_type?.damage_type_master?.icon || dragItem?.damage_type?.icon }}</v-icon>

            <span class="damageTicketTitle" style="background-color: rgb(239 97 97) !important; ">{{
              dragItem?.damage_type?.name }}</span>
            <span class="t_"> <span class="profile_group_tickets_number"
                style="font-weight: 900;float: left;display: inline-block;float: left;">{{ dragItem.created_at ||
                  'empty' }}</span></span>
            <span
             v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            class="d_"><span class="profile_group_tickets_number"
                style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                  dragItem?.declared_by?.username || 'empty' }}</span></span>
            <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
              dragItem?.rejectedAt || 'empty' }}</span></span>
            <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
              dragItem?.rejectedTimes }}</span></span>

          </span>

        </v-col>
        <v-col @click.prevent cols="12" :key="item.id"
          v-for="item in damageByEquipments.filter((e) => e.status == 'on progress')">
          <span style="background-color:#110d41;
          margin-bottom: 30px;
              box-shadow: -2px 13px 20px 6px #dd3030;
          " @mousedown="onMouseDown($event, item)" @mouseover="onMouseOver($event, item)"
            @mouseup="onMouseUp_progress($event, item)" v-if="hoverItem?.id == item.id"
            class="profile_group_tickets_damage" @click="pageView(item)">
            <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ dragItem?.damage_type?.damage_type_master?.icon || dragItem?.damage_type?.icon }}</v-icon>

            <span class="damageTicketTitle" style="background-color: rgb(239 97 97) !important; ">{{
              dragItem?.damage_type?.name }}</span>
            <span class="t_"> <span class="profile_group_tickets_number"
                style="font-weight: 900;float: left;display: inline-block;float: left;">{{ dragItem.created_at ||
                  'empty' }}</span></span>
            <span
             v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            class="d_"><span class="profile_group_tickets_number"
                style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                  dragItem?.declared_by?.username || 'empty' }}</span></span>
            <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
              dragItem?.rejectedAt || 'empty' }}</span></span>
            <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
              dragItem?.rejectedTimes }}</span></span>

          </span>
          <span @mousedown="onMouseDown($event, item)" @mouseover="onMouseOver($event, item)"
            @mouseup="onMouseUp_progress($event, item)" v-if="dragItem?.id != item.id"
            class="profile_group_tickets_damage" @click="pageView(item)">
            <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ item?.damage_type?.damage_type_master?.icon || item?.damage_type?.icon }}</v-icon>

            <span class="damageTicketTitle" style="background-color: rgb(239 97 97) !important; ">{{
              item?.damage_type?.name }}</span>
            <span class="t_" style="float: left;display: inline-block;"> <span class="profile_group_tickets_number"
                style="font-weight: 900;float: left;display: inline-block;float: left;">{{ item.created_at ||
                  'empty' }}</span></span>
            <span
             v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            class="d_"><span class="profile_group_tickets_number"
                style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                  item?.declared_by?.username || 'empty' }}</span></span>
            <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
              item?.rejectedAt || 'empty' }}</span></span>
            <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
              item?.rejectedTimes }}</span></span>

          </span>
          <span v-else style="opacity: 0.3;" class="profile_group_tickets_damage" @click="pageView(item)">
            <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ item?.damage_type?.damage_type_master?.icon || item?.damage_type?.icon }}</v-icon>

            <span class="damageTicketTitle" style="background-color: rgb(239 97 97) !important;">{{
              item?.damage_type?.name }}</span>
            <span class="t_"> <span class="profile_group_tickets_number"
                style="font-weight: 900;float: left;display: inline-block;float: left;">{{ item.created_at ||
                  'empty' }}</span></span>
            <span
             v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            class="d_"><span class="profile_group_tickets_number"
                style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                  item?.declared_by?.username || 'empty' }}</span></span>
            <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
              item?.rejectedAt || 'empty' }}</span></span>
            <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
              item?.rejectedTimes }}</span></span>

          </span>
          <div v-if="dragging && dragItem?.status == 'on progress'" class="custom-drag"
            :style="{ top: dragY + 'px', left: dragX + 'px' }">
            <span class="profile_group_tickets_damage " style="min-width: 457px;">
              <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ dragItem?.damage_type?.damage_type_master?.icon || dragItem?.damage_type?.icon }}</v-icon>
              <span class="damageTicketTitle" style="background-color: rgb(239 97 97) !important;">{{
                dragItem?.damage_type?.name }}</span>
              <span class="t_"> <span class="profile_group_tickets_number"
                  style="font-weight: 900;float: left;display: inline-block;float: left;">{{ dragItem.created_at ||
                    'empty' }}</span></span>
              <span
               v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
              class="d_"><span class="profile_group_tickets_number"
                  style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                    dragItem?.declared_by?.username || 'empty' }}</span></span>
              <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
                dragItem?.rejectedAt || 'empty' }}</span></span>
              <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
                dragItem?.rejectedTimes }}</span></span>
            </span>
          </div>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4" class="poto poto_2" :class="(dragging && dragItem.status == 'on progress'  && getUserActive.fonction?.department_id!=3) ? 'poto_shaine_2' : ''"
      @mouseleave="onMouseLeave_resolved_wall($event)" @mouseover="onMouseOver_wall_resolve($event)"
      @mouseup="onMouseUp_resolve_wall($event)">
      <v-row>
        <v-col v-if="hover_item_resolve" @click.prevent cols="12" :key="hover_item_resolve?.id">
          <span style="background-color:#110d41;
          
          " @mousedown="onMouseDown($event, hover_item_resolve)" class="profile_group_tickets_damage">
            <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ dragItem?.damage_type?.damage_type_master?.icon || dragItem?.damage_type?.icon }}</v-icon>

            <span class="damageTicketTitle" style="background-color: #fb8500 !important;">{{ dragItem?.damage_type?.name
            }}</span>
            <span class="t_"> <span class="profile_group_tickets_number"
                style="font-weight: 900;float: left;display: inline-block;float: left;">{{ dragItem.created_at ||
                  'empty' }}</span></span>
            <span
             v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            class="d_"><span class="profile_group_tickets_number"
                style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                  dragItem?.declared_by?.username || 'empty' }}</span></span>
            <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
              dragItem?.rejectedAt || 'empty' }}</span></span>
            <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
              dragItem?.rejectedTimes }}</span></span>

          </span>

        </v-col>
        <v-col :key="item.id" cols="12" v-for="item in damageByEquipments.filter((e) => e.status == 'resolved')">


          <span style="background-color:#110d41;
          margin-bottom: 30px;
          " @mousedown="onMouseDown($event, item)" @mouseover="onMouseOver($event, item)"
            @mouseup="onMouseUp_resolve($event, item)" v-if="hoverItem?.id == item.id" @click.prevent
            class="profile_group_tickets_damage" @click="pageView(item)">
            <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ dragItem?.damage_type?.damage_type_master?.icon || dragItem?.damage_type?.icon }}</v-icon>

            <span class="damageTicketTitle" style="background-color: #fb8500 !important;">{{ dragItem?.damage_type?.name
            }}</span>
            <span class="t_"> <span class="profile_group_tickets_number"
                style="font-weight: 900;float: left;display: inline-block;float: left;">{{ dragItem.created_at ||
                  'empty' }}</span></span>
            <span
             v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            class="d_"><span class="profile_group_tickets_number"
                style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                  dragItem?.declared_by?.username || 'empty' }}</span></span>
            <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
              dragItem?.rejectedAt || 'empty' }}</span></span>
            <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
              dragItem?.rejectedTimes }}</span></span>

          </span>
          <span @mousedown="onMouseDown($event, item)" @mouseover="onMouseOver($event, item)"
            @mouseup="onMouseUp_resolve($event, item)" v-if="dragItem?.id != item.id" @click.prevent
            class="profile_group_tickets_damage" @click="pageView(item)">
            <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ item?.damage_type?.damage_type_master?.icon || item?.damage_type?.icon }}</v-icon>

            <span class="damageTicketTitle" style="background-color: #fb8500 !important;">{{ item?.damage_type?.name
            }}</span>
            <span class="t_"> <span class="profile_group_tickets_number"
                style="font-weight: 900;float: left;display: inline-block;float: left;">{{ item.created_at ||
                  'empty' }}</span></span>
            <span
             v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            class="d_"><span class="profile_group_tickets_number"
                style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                  item?.declared_by?.username || 'empty' }}</span></span>
            <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
              item?.rejectedAt || 'empty' }}</span></span>
            <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
              item?.rejectedTimes }}</span></span>

          </span>
          <span v-else style="opacity: 0.3;" @click.prevent class="profile_group_tickets_damage"
            @click="pageView(item)">
            <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ item?.damage_type?.damage_type_master?.icon || item?.damage_type?.icon }}</v-icon>

            <span class="damageTicketTitle" style="background-color: #fb8500 !important;">{{ item?.damage_type?.name
            }}</span>
            <span class="t_"> <span class="profile_group_tickets_number"
                style="font-weight: 900;float: left;display: inline-block;float: left;">{{ item.created_at ||
                  'empty' }}</span></span>
            <span
             v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            class="d_"><span class="profile_group_tickets_number"
                style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                  item?.declared_by?.username || 'empty' }}</span></span>
            <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
              item?.rejectedAt || 'empty' }}</span></span>
            <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
              item?.rejectedTimes }}</span></span>

          </span>
          <div v-if="dragging && dragItem?.status == 'resolved'" class="custom-drag"
            :style="{ top: dragY + 'px', left: dragX + 'px' }">
            <span class="profile_group_tickets_damage" style="min-width: 457px;">
              <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ dragItem?.damage_type?.damage_type_master?.icon || dragItem?.damage_type?.icon }}</v-icon>
              <span class="damageTicketTitle" style="background-color: #fb8500 !important;">{{
                dragItem?.damage_type?.name
              }}</span>
              <span class="t_"> <span class="profile_group_tickets_number"
                  style="font-weight: 900;float: left;display: inline-block;float: left;">{{ dragItem.created_at ||
                    'empty' }}</span></span>
              <span
               v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
              class="d_"><span class="profile_group_tickets_number"
                  style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                    dragItem?.declared_by?.username || 'empty' }}</span></span>
              <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
                dragItem?.rejectedAt || 'empty' }}</span></span>
              <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
                dragItem?.rejectedTimes }}</span></span>
            </span>
          </div>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4" class="poto poto_3"
      :class="(dragging && (dragItem.status == 'resolved' || dragItem.status == 'on progress') && getUserActive.fonction?.department_id==3) ? 'poto_shaine_3' : ''"
      @mouseleave="onMouseLeave_colsed_wall($event)" @mouseover="onMouseOver_wall_closed($event)"
      @mouseup="onMouseUp_closed_wall($event)">
      <v-row>
        <v-col v-if="hover_item_closed" @click.prevent cols="12" :key="hover_item_closed?.id">
          <span style="background-color:#110d41;
          
          " @mousedown="onMouseDown($event, hover_item_closed)" class="profile_group_tickets_damage">
            <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ dragItem?.damage_type?.damage_type_master?.icon || dragItem?.damage_type?.icon }}</v-icon>

            <span class="damageTicketTitle" style="background-color: #332f6b;">{{ dragItem?.damage_type?.name }}</span>
            <span class="t_"> <span class="profile_group_tickets_number"
                style="font-weight: 900;float: left;display: inline-block;float: left;">{{ dragItem.created_at ||
                  'empty' }}</span></span>
            <span
             v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            class="d_"><span class="profile_group_tickets_number"
                style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                  dragItem?.declared_by?.username || 'empty' }}</span></span>
            <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
              dragItem?.rejectedAt || 'empty' }}</span></span>
            <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
              dragItem?.rejectedTimes }}</span></span>

          </span>

        </v-col>
        <v-col @click.prevent :key="item.id" cols="12"
          v-for="item in damageByEquipments.filter((e) => e.status == 'closed')">


          <span style="background-color:#110d41;
          margin-bottom: 30px;
          " @mousedown="onMouseDown($event, item)" @mouseover="onMouseOver($event, item)"
            @mouseup="onMouseUp_closed($event, item)" v-if="hoverItem?.id == item.id"
            class="profile_group_tickets_damage" @click="pageView(item)">
            <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ dragItem?.damage_type?.damage_type_master?.icon || dragItem?.damage_type?.icon }}</v-icon>

            <span class="damageTicketTitle" style="background-color: #332f6b;">{{ dragItem?.damage_type?.name }}</span>
            <span class="t_"> <span class="profile_group_tickets_number"
                style="font-weight: 900;float: left;display: inline-block;float: left;">{{ dragItem.created_at ||
                  'empty' }}</span></span>
            <span
             v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            class="d_"><span class="profile_group_tickets_number"
                style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                  dragItem?.declared_by?.username || 'empty' }}</span></span>
            <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
              dragItem?.rejectedAt || 'empty' }}</span></span>
            <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
              dragItem?.rejectedTimes }}</span></span>

          </span>
          <span @mouseover="onMouseOver($event, item)" @mouseup="onMouseUp_closed($event, item)"
            v-if="dragItem?.id != item.id" class="profile_group_tickets_damage" @click="pageView(item)">
            <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ item?.damage_type?.damage_type_master?.icon || item?.damage_type?.icon }}</v-icon>

            <span class="damageTicketTitle" style="background-color: #332f6b;">{{ item?.damage_type?.name }}</span>
            <span class="t_"> <span class="profile_group_tickets_number"
                style="font-weight: 900;float: left;display: inline-block;float: left;">{{ item.created_at ||
                  'empty' }}</span></span>
            <span
             v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            class="d_"><span class="profile_group_tickets_number"
                style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                  item?.declared_by?.username || 'empty' }}</span></span>
            <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
              item?.rejectedAt || 'empty' }}</span></span>
            <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
              item?.rejectedTimes }}</span></span>

          </span>
          <span v-else style="opacity: 0.3;" class="profile_group_tickets_damage" @click="pageView(item)">
            <v-icon style="
            position: absolute;
    left: -14px;
    top: -18px;
    height: 62px;
    width: 62px;
    border-radius: 57px;
    border: 1px solid rgb(239 237 255 / 45%);
    background-color: rgb(17, 13, 65);
    color: white;
    font-size: 43px;
        " >{{ item?.damage_type?.damage_type_master?.icon || item?.damage_type?.icon }}</v-icon>

            <span class="damageTicketTitle" style="background-color: #332f6b;">{{ item?.damage_type?.name }}</span>
            <span class="t_"> <span class="profile_group_tickets_number"
                style="font-weight: 900;float: left;display: inline-block;float: left;">{{ item.created_at ||
                  'empty' }}</span></span>
            <span
             v-if="getUserActive?.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
            class="d_"><span class="profile_group_tickets_number"
                style="color:#0ab20a;font-weight: 900;float: left;display: inline-block;float: left;">{{
                  item?.declared_by?.username || 'empty' }}</span></span>
            <span class="tf_"><span class="profile_group_tickets_number" style="color:#d43737;font-weight: 900;">{{
              item?.rejectedAt || 'empty' }}</span></span>
            <span class="r_"><span class="profile_group_tickets_number" style="color:#fb8500;font-weight: 900;">{{
              item?.rejectedTimes }}</span></span>

          </span>


        </v-col>
      </v-row>
    </v-col>








    <v-dialog v-model="dialogDefectToResolve" transition="dialog-bottom-transition" max-width="700px">
      <v-card style="border-top-right-radius: 76px; border-bottom-left-radius: 79px; ">
        <v-toolbar dark color="rgb(241 0 0)">
          <v-btn icon dark @click="dialogDefectToResolve = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title style="font-weight: 900">REJECT RESOLUTION :</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items> </v-toolbar-items>
        </v-toolbar>

        <v-card-title class="text-h5" style="font-weight: 900">
          Are you sure you want to reject this <span style="margin-left:10px;margin-right:10px;color: #fb8500; ;">
            RESOLUTION </span> ?</v-card-title>
        <v-col cols="12" md="12"> </v-col>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="color:black;font-weight: 900" depressed color="" @click="dialogDefectToResolve = false">
            CANCEL
          </v-btn>
          <v-btn style="color:white;font-weight: 900" depressed color="rgb(241 0 0)" @click="doTheReject">
            YES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog style="border-top-right-radius: 76px !important;
   border-bottom-left-radius: 79px !important; " transition="dialog-bottom-transition" v-model="damageTech_cmt"
      persistent max-width="800px">
      <v-card style="border-top-right-radius: 76px; border-bottom-left-radius: 79px; ">
        <v-card-title class="text-h5 lighten-1 white--text"
          style="background-color: rgb(241 0 0) !important; font-weight: 900;">
          <v-icon style=" font-size: 40px;
              margin-left: -12px;
              margin-right: 9px;
              margin-bottom: 5px;
              color: white; ">{{
                (damageSelect?.damage_type.department_id == 1) ? damageSelect?.damage_type.icon : damageSelect?.damage_type.damage_type_master.icon
            }}</v-icon>
          REJECT RESOLUTION > {{ damageSelect?.damage_type?.name?.toLocaleUpperCase() }}
        </v-card-title>
        <v-spacer></v-spacer>

        <v-card-text class="pa-4 black--text" style="font-size: 19px; font-weight: 900; ">
          <span style="font-size: 19px; font-weight: 900; margin-bottom: 17px; display: inline-block;">Add details
            (comment/pictures) :</span>
          <v-textarea label="Defect comment.." v-model="damageTech_cmt_payload.comment" name="input-7-1"
            variant="outlined" style="BACKGROUND-COLOR:#cacaca !important;" class="sub_comment_text"></v-textarea>
          <div cols="12" md="12" class="cmt_pic_background">
            <span class="images_pannel">
              <img v-for="pic in damageTech_cmt_payload.files" @click="imagefullScreen(pic)" :src="getImageUrl(pic)"
                alt="">

            </span>
            <span class="add_button" @click="triggerUpload">
              <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
              <v-icon size="45px" class="">mdi-plus</v-icon>
            </span>

          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="    font-weight: 900;" color="#fff " @click="resetDraggin(); damageTech_cmt = false">
            Cancel
          </v-btn>
          <v-btn :disabled="damageTech_cmt_payload.comment == ''" style="color:white;font-weight: 900" depressed
            color="rgb(241 0 0)" @click="reject_action_with_cmt()">
            REJECT
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
            <v-btn style="    background-color: rgb(229 229 229);
                                  border-color: rgb(201 25 25);
                                  margin-left: 8px;
                                  /* font-weight: 900; */
                                  margin-right: 14px;
                                  font-size: 31px;
                                  border-radius: 46px;
                                  /* width: 16px !important; */
                                  color: #913333;" @click="damageTech_cmt_fullscreen_img = false">
              <v-icon style="    color: #b04242;
                                    font-size: 37px;
                                    margin-top: 2px;
                                ">mdi-close-circle</v-icon>
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
    <v-dialog v-model="cmt_actual_pic_delete" persistent max-width="600px">
      <v-card>
        <v-toolbar dark style="font-weight: 900;background-color: rgb(241 0 0);">
          <v-toolbar-title>Warning !</v-toolbar-title>
        </v-toolbar>
        <v-card-title class="text-h5" style="font-weight: 900;">
          Are you sure to delete this picture ?
        </v-card-title>
        <v-card-text class="font-weight-bold"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="font-weight: 900" color="white" @click="cmt_actual_pic_delete = false"> No </v-btn>
          <v-btn style="color:white;font-weight: 900" color="rgb(241 0 0)" @click="deleteImage()"> Yes </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


















    <!------------------------------------------------------------------------------------------------------------------------->
    <v-dialog style="border-top-right-radius: 76px !important;
         border-bottom-left-radius: 79px !important; " transition="dialog-bottom-transition"
      v-model="damageTech_cmt_resolve" persistent max-width="800px">
      <v-card style="border-top-right-radius: 76px; border-bottom-left-radius: 79px; ">
        <v-card-title class="text-h5 lighten-1 white--text"
          style="background-color: #fb8500 !important; font-weight: 900;">
          <v-icon style=" font-size: 40px;
              margin-left: -12px;
              margin-right: 9px;
              margin-bottom: 5px;
              color: white; ">{{
                (damageSelect?.damage_type.department_id == 1) ? damageSelect?.damage_type.icon : damageSelect?.damage_type.damage_type_master.icon
            }}</v-icon>
          RESOLVE > {{ damageSelect?.damage_type?.name?.toLocaleUpperCase() }}
        </v-card-title>
        <v-spacer></v-spacer>

        <v-card-text class="pa-4 black--text" style="font-size: 19px; font-weight: 900; ">
          
          <v-row style="padding: 0 !important;margin: 0 !important;">
            <v-col cols="6" style="padding: 0 !important;margin: 0 !important;">
              <span style="font-size: 19px; font-weight: 900; margin-bottom: 17px; display: inline-block;">Add details
              (comment/pictures) :</span>
            </v-col>
            <v-col cols="6" style="padding: 0 !important;margin: 0 !important;">
              <v-text-field hide-details  style="padding: 0 !important;margin: 0 !important;" v-model="work_order" label="WORK ORDER:"></v-text-field>
            </v-col>
          </v-row>
          <v-textarea label="Defect comment.." v-model="damageTech_cmt_payload.comment" name="input-7-1"
            variant="outlined" style="BACKGROUND-COLOR:#cacaca !important;" class="sub_comment_text"></v-textarea>
          <div cols="12" md="12" class="cmt_pic_background">
            <span class="images_pannel">
              <img v-for="pic in damageTech_cmt_payload.files" @click="imagefullScreen(pic)" :src="getImageUrl(pic)"
                alt="">

            </span>
            <span class="add_button" @click="triggerUpload">
              <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
              <v-icon size="45px" class="">mdi-plus</v-icon>
            </span>

          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="    font-weight: 900;" color="#fff " @click="resetDraggin(); damageTech_cmt_resolve = false">
            Cancel
          </v-btn>
          <v-btn :disabled="damageTech_cmt_payload.comment == ''  || work_order == ''" style="color:white;font-weight: 900" depressed
            color="#fb8500" @click="resolve_action_with_cmt_resolve()">
            RESOLVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDefectToResolve_resolve" transition="dialog-bottom-transition" max-width="700px">
      <v-card style="border-top-right-radius: 76px; border-bottom-left-radius: 79px; ">
        <v-toolbar dark color="#fb8500">
          <v-btn icon dark @click="dialogDefectToResolve_resolve = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title style="font-weight: 900">RESOLVE DEFECT :
            
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items> </v-toolbar-items>
        </v-toolbar>

        <v-card-title class="text-h5" style="font-weight: 900">
          Are you sure you want to resolve this <span style="margin-left:10px;margin-right:10px;color: rgb(241 0 0) ;">
            DEFECT </span> ?</v-card-title>
        <v-col cols="12" md="12"> </v-col>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="color:black;font-weight: 900" depressed color="" @click="dialogDefectToResolve_resolve = false">
            CANCEL
          </v-btn>
          <v-btn style="color:white;font-weight: 900" depressed color="#fb8500" @click="doTheResolve">
            YES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <!------------------------------------------------------------------------------------------------------------------------->





    <!------------------------------------------------------------------------------------------------------------------------->
    <v-dialog style="border-top-right-radius: 76px !important;
         border-bottom-left-radius: 79px !important; " transition="dialog-bottom-transition"
      v-model="damageTech_cmt_closed" persistent max-width="800px">
      <v-card style="border-top-right-radius: 76px; border-bottom-left-radius: 79px; ">
        <v-card-title class="text-h5 lighten-1 white--text"
          style="background-color: #110d41 !important; font-weight: 900;">
          <v-icon style=" font-size: 40px;
              margin-left: -12px;
              margin-right: 9px;
              margin-bottom: 5px;
              color: white; ">{{
                (damageSelect?.damage_type.department_id == 1) ? damageSelect?.damage_type.icon : damageSelect?.damage_type.damage_type_master.icon
            }}</v-icon>
          CLOSE > {{ damageSelect?.damage_type?.name?.toLocaleUpperCase() }}
        </v-card-title>
        <v-spacer></v-spacer>

        <v-card-text class="pa-4 black--text" style="font-size: 19px; font-weight: 900; ">
          <span style="font-size: 19px; font-weight: 900; margin-bottom: 17px; display: inline-block;">Add details
            (comment/pictures) :</span>
          <v-textarea label="Defect comment.." v-model="damageTech_cmt_payload.comment" name="input-7-1"
            variant="outlined" style="BACKGROUND-COLOR:#cacaca !important;" class="sub_comment_text"></v-textarea>
          <div cols="12" md="12" class="cmt_pic_background">
            <span class="images_pannel">
              <img v-for="pic in damageTech_cmt_payload.files" @click="imagefullScreen(pic)" :src="getImageUrl(pic)"
                alt="">

            </span>
            <span class="add_button" @click="triggerUpload">
              <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
              <v-icon size="45px" class="">mdi-plus</v-icon>
            </span>

          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="    font-weight: 900;" color="#fff " @click="resetDraggin(); damageTech_cmt_closed = false">
            Cancel
          </v-btn>
          <v-btn :disabled="damageTech_cmt_payload.comment == ''" style="color:white;font-weight: 900" depressed
            color="#110d41" @click="closed_action_with_cmt_closed()">
            CLOSE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDefectToResolve_closed" transition="dialog-bottom-transition" max-width="700px">
      <v-card style="border-top-right-radius: 76px; border-bottom-left-radius: 79px; ">
        <v-toolbar dark color="#110d41">
          <v-btn icon dark @click="dialogDefectToResolve_closed = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title style="font-weight: 900">RESOLVE DEFECT :</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items> </v-toolbar-items>
        </v-toolbar>

        <v-card-title class="text-h5" style="font-weight: 900">
          Are you sure you want to close this
          <span v-if="(damageSelect.status == 'on progress')"
            style="margin-left:10px;margin-right:10px;color: rgb(241 0 0) ;"> DEFECT </span>
          <span v-else style="margin-left:10px;margin-right:10px;color: #fb8500; ;"> RESOLUTION </span>

          ?</v-card-title>
        <v-col cols="12" md="12"> </v-col>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="color:black;font-weight: 900" depressed color="" @click="dialogDefectToResolve_closed = false">
            CANCEL
          </v-btn>
          <v-btn style="color:white;font-weight: 900" depressed color="#110d41" @click="doTheClose">
            YES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <!------------------------------------------------------------------------------------------------------------------------->




  </v-row>



</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import swal from "sweetalert";
//import LoadingPage from "../LoadingPage.vue";
const LoadingPage = defineAsyncComponent(() => import("../LoadingPage.vue"));
//import Comment from "../../components/comments/Comment.vue";
const Comment = defineAsyncComponent(() =>
  import("../../components/comments/Comment.vue")
);

export default {
  props: ["idEquipment", "viewTable", "selectedEquipment","selectEquipmentType"],
  components: {
    LoadingPage,
    Comment,
  },
  data: () => ({
    cmt_actual_pic_delete: false,
    damageTech_cmt_fullscreen_img: false,
    cmt_actual_pic: null,
    cmt_actual_pic_edit: false,
    damageTech_cmt_payload: {
      comment: "",
      files: []
    },
    damageTech_cmt_closed: false,
    damageTech_cmt_resolve: false,
    damageTech_cmt: false,
    dialogDefectToResolve_closed: false,
    dialogDefectToResolve_resolve: false,
    dialogDefectToResolve: false,
    hoverItem: null,
    pendingDragItem: null,
    hover_item_progress: null,
    hover_item_resolve: null,
    hover_item_closed: null,
    dragging: false,
    dragItem: null,
    dragX: 0,
    dragY: 0,
    isMouseDown: false,
    startX: 0,
    startY: 0,
    isHistorique: false,
    LoadingPage: false,
    dialog: false,
    dialogDelete: false,
    loading: false,
    dialogimage: false,
    dialogresolve: false,
    dialogclose: false,
    dialogrejected: false,
    dialogDelete: false,
    dialogimageShow: false,

    search: "",
    fonction: "",
    userDepartment: "",
    headers: [
      { text: "", value: "damage_type.damage_type_master.icon", sortable: true },
      { text: "Name", value: "damage_type.name", sortable: true },
      { text: "Created By", value: "declared_by.username", sortable: true },
      { text: "Created At", value: "created_at", sortable: true },
      { text: "Resolved At", value: "confirmedAt", sortable: true },
      { text: "rejected Times", value: "rejectedTimes", sortable: true },
      { text: "", value: "actions", sortable: false },
    ],
    equipmentsFiltreByid: [],
    showdetails: false,
    PhotoShow: {
      id: null,
      description: null,
      filename: "",
      damage_id: null,
      created_at: "",
      updated_at: "",
    },
    photo: {
      id: "",
      comment: "",
      damage_id: "",
      user_id: "",
      files: [],
    },
    ImagesPath: "http://10.20.33.110:9008/storage/cdn/damageFiles/",
    work_order: "",
    damageSelect: {
      id: null,
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
      driver_out: {
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
        damage_type_master: {
          name: "",
        }
      },
    },
    equipment: null,
    iscolor: "#1e2855 ",
    EquipmentsByCounter: {
      id: null,
      nameEquipment: "",
      damagedCount: null,
      confirmedCount: null,
      closedCount: null,
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
    Damagedelete: {
      id: null,
    },
    editedIndex: -1,
    editedItem: {
      id: null,
      name: "",
      description: "",
    },
    defaultItem: {
      id: null,
      name: "",
      description: "",
    },
    EmailModel: {
      payload: {
        Equipment: "",
        department: "",
        Defect: "",
        Status: "on progress",
        DriverOut: "",
        DeclaredBy: "",
        DeclaredAt: "",
      },
      status: "",
      email: "",
      department: "IT",
    },
    damageByEquipmentsClose: [],
    damageByEquipmentsWithOutClose: [],
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
    useractiveUSERNAME: "",
    commenttest: "commenttest commenttest commenttest",
    showComments: false,
    commentsDefect: [
      {
        id: 1,
        comment: "test comment1",
        status: "",
        damage_id: 1,
        user: {
          id: 1,
          username: "hamza abdous",
        },
        files: [
          {
            id: 1,
            filename: "1",
            comment_id: 1,
            user_id: 1,
          },
          {
            id: 2,
            filename: "2",
            comment_id: 1,
            user_id: 2,
          },
          {
            id: 3,
            filename: "3",
            comment_id: 1,
            user_id: 2,
          },
          {
            id: 4,
            filename: "4",
            comment_id: 1,
            user_id: 2,
          },
        ],
      },
      {
        id: 2,
        comment: "test comment 2 ",
        status: "",
        damage_id: 1,
        user: {
          id: 1,
          username: "hamza abdous 2",
        },
        files: [
          {
            id: 1,
            filename: "1",
            comment_id: 1,
            user_id: 1,
          },
          {
            id: 2,
            filename: "2",
            comment_id: 1,
            user_id: 2,
          },
          {
            id: 3,
            filename: "3",
            comment_id: 1,
            user_id: 2,
          },
          {
            id: 4,
            filename: "4",
            comment_id: 1,
            user_id: 2,
          },
        ],
      },
    ],
    comments: [],
    switch1: false,
    disabledImage: true,
    switchValue: "description",
  }),
  mounted() {
    console.log("this.selectedEquipment : ",this.selectedEquipment)
    document.title = "CHECKLIST" +(" - "+ ((this.selectedEquipment)?this.selectedEquipment?.nameEquipment:"")+" - DEFECTS ");
    this.loading = true;
    this.fonction = this.getUserActive.fonction.name;
    this.userDepartment = this.getUserActive.fonction.department.name;
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
          if(r.value == "declared_by.username"){
            return;
          }
        }

        header.push(r);
      });

      return header;

    },
    damageByEquipments(){
      let damages=[];
       this.getProfileGroupsByCounters.map((e)=>{
        if(e.id==this.selectEquipmentType.id){
          e.equipment.map((r)=>{
          if(r.id==this.selectedEquipment.id){
            r.damages.map((d)=>{
              damages.push(d);
            });
          }
        });
        }
        
      });
      return damages;
    },
    ...mapGetters([

      "getProfileGroupsByCounters",
      "sendDamagePhotosStoragePath",
      "getUserActive",
      "getdepartements",
      "getcomments",
    ]),
  },
  watch: {
    photo: {
      deep: true,
      handler(newValue, oldvalue) {
        if (
          newValue.comment.trim().length != 0 ||
          newValue.files.length != 0
        ) {
          this.disabledImage = false;
        } else {
          this.disabledImage = true;
        }
      },
    },
    damageTech_cmt(val) {
       this.reset__damageTech_cmt_payload();
    },
    damageTech_cmt_resolve(val) {
       this.reset__damageTech_cmt_payload();
    },
    damageTech_cmt_closed(val) {
       this.reset__damageTech_cmt_payload();
    },
  },
  created() {
    // this.initialize();
    this.useractiveUSERNAME = this.getUserActive.username;
  },
  methods: {
    ...mapActions([
      "FindDamageTypeByEquipmentIDAction",
      "getEquipmentsByCounterAction",
      "getEquipmentsByCounterITAction",
      "getEquipmentsByCounterTECAction",
      "confirmDamageAction",
      "closeDamageAction",
      "revertDamageAction",
      "sendDamagePhotosStoragePathAction",
      "deleteDAMAGEAction",
      "FindDamageTypeByEquipmentID_ITAction",
      "FindDamageTypeByEquipmentID_TECAction",
      "SendEmailAction",
      "setDepartementsAction",
      "setCOMMENTSAction",
      "addCOMMENTAction",
      "revertDamageAction_2",
      "confirmDamage_2Action_2",
      "closeDamageAction_2",
      "doRejectAction",
      "doCloseAction",
      "doResolveAction",
    ]),
    reset__damageTech_cmt_payload(){
      this.damageTech_cmt_payload= {
        comment: "",
        files: [],
      };
    },
    resetDraggin() {
      this.isMouseDown = false;
      this.dragging = false;
      this.dragItem = null;
      this.hoverItem = null;
      this.pendingDragItem = null;
      this.hover_item_progress = null;
      this.hover_item_resolve = null;
      this.hover_item_closed = null;
    },
    cmt_actual_pic_edit_open(item) {
      this.damageSelect = item;

      this.cmt_actual_pic_edit = true;
    },
    deleteImage() {
      this.damageTech_cmt_payload.files = this.damageTech_cmt_payload.files.filter((e) => {
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
        this.damageTech_cmt_payload.files.push(file);
      }
    },
    imagefullScreen(pic) {
      this.damageTech_cmt_fullscreen_img = true;
      this.cmt_actual_pic = pic;
    },
    onMouseDown(e, item) {
      this.isMouseDown = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.pendingDragItem = item;  

      window.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("mouseup", this.onMouseUp);
    },
    onMouseOver(e, item) {
      if(item.status=="resolved"){
        if((this.getUserActive?.fonction?.department_id!=3) && (this.getUserActive?.fonction?.name!='ADMIN')){
          return ;
        }
      }
      else if(item.status=="on progress" && this.hover_item_closed){
        if((this.getUserActive?.fonction?.department_id!=3) && (this.getUserActive?.fonction?.name!='ADMIN')){
          return ;
        }
      }
      else if(item.status=="on progress" && this.hover_item_resolve){
        if((this.getUserActive?.fonction?.department_id!=1) && (this.getUserActive?.fonction?.department_id!=2)){
          return ;
        }
      }
      if (!this.dragItem)
        return;

      if (item?.status != this.dragItem.status) {
        this.hover_item_progress = null;
        this.hover_item_resolve = null;
        this.hover_item_closed = null;
        this.hoverItem = item;  // store the item temporarily
      }


    },
    onMouseOver_wall_progress(e, item) {
      if((this.getUserActive?.fonction?.department_id!=3) && (this.getUserActive?.fonction?.name!='ADMIN')){
          return ;
        }
      if (this.hoverItem || this.hover_item_resolve)
        return;

      if (this.dragItem?.status != "on progress")
        this.hover_item_progress = this.dragItem;
      this.hover_item_resolve = null;
      this.hover_item_closed = null;


    },
    onMouseOver_wall_resolve(e, item) {
      if((this.getUserActive?.fonction?.department_id!=1) && (this.getUserActive?.fonction?.department_id!=2)){
          return ;
        }
      if (this.hoverItem || this.hover_item_resolve)
        return;

      if (this.dragItem?.status != "resolved")
        this.hover_item_resolve = this.dragItem;
      this.hover_item_progress = null;
      this.hover_item_closed = null;


    },
    onMouseOver_wall_closed(e, item) {


        if((this.getUserActive?.fonction?.department_id!=3) && (this.getUserActive?.fonction?.name!='ADMIN')){
          return ;
        }

      if (this.hoverItem || this.hover_item_closed)
        return;

      if (this.dragItem?.status != "closed")
        this.hover_item_closed = this.dragItem;
      this.hover_item_progress = null;
      this.hover_item_resolve = null;



    },

    onMouseMove(e) {
      if(this.pendingDragItem.status=="resolved"){
        if((this.getUserActive?.fonction?.department_id!=3) && (this.getUserActive?.fonction?.name!='ADMIN')){
          return ;
        }
      }
      if (!this.isMouseDown) return;

      const dx = Math.abs(e.clientX - this.startX);
      const dy = Math.abs(e.clientY - this.startY);

      if (!this.dragging && (dx > 10 || dy > 10)) {
        this.dragging = true;
        this.dragItem = this.pendingDragItem;  

      }

      if (this.dragging) {
        this.dragX = e.clientX + 10;
        this.dragY = e.clientY + 10;
      }
    },

    onMouseUp_progress(e) {
      if((this.getUserActive?.fonction?.department_id!=3) && (this.getUserActive?.fonction?.name!='ADMIN')){
          return ;
        }
      this.onMouseUp_progress_wall();
    },
    onMouseUp_resolve(e) {
      if((this.getUserActive?.fonction?.department_id!=1) && (this.getUserActive?.fonction?.department_id!=2)){
          return ;
        }
      this.onMouseUp_resolve_wall();
    },
    onMouseUp_closed(e) {
      if((this.getUserActive?.fonction?.department_id!=3) && (this.getUserActive?.fonction?.name!='ADMIN')){
          return ;
        }
      this.onMouseUp_closed_wall();
    },


    onMouseLeave_progress_wall(e) {
      if (this.dragging && this.dragItem.status != "on progress") {
        this.hoverItem = null;
        this.hover_item_progress = null;
      } else {
      }

    },
    onMouseLeave_resolved_wall(e) {
      console.log("show wall leave  wall resolve ", this.dragging);
      if (this.dragging && this.dragItem.status != "resolved") {
        this.hoverItem = null;

        this.hover_item_resolve = null;

      } else {
      }

    },
    onMouseLeave_colsed_wall(e) {
      if (this.dragging && this.dragItem.status != "closed") {
        this.hoverItem = null;
        this.hover_item_closed = null;
      } else {
      }

    },
    reject_action_with_cmt() {
      this.dialogDefectToResolve = true;
    },
    resolve_action_with_cmt_resolve() {
      this.dialogDefectToResolve_resolve = true;
    },
    closed_action_with_cmt_closed() {
      this.dialogDefectToResolve_closed = true;
    },
    opendialogresolve_dragg_event(item) {
     if((this.getUserActive?.fonction?.department_id!=3) && (this.getUserActive?.fonction?.name!='ADMIN')){
          return ;
        }
      console.log("item ddddd:", item)
      this.damageSelect = item;

      this.dragging = null;

      window.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("mouseup", this.onMouseUp);
      this.damageTech_cmt = true;
    },
    opendialogresolve_dragg_event_resolve(item) {
      if((this.getUserActive?.fonction?.department_id!=1) && (this.getUserActive?.fonction?.department_id!=2)){
          return ;
        }
      console.log("item ddddd:", item)
      this.damageSelect = item;

      this.dragging = null;

      window.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("mouseup", this.onMouseUp);
      this.damageTech_cmt_resolve = true;
    },
    opendialogclosed_dragg_event_closed(item) {
      if((this.getUserActive?.fonction?.department_id!=3) && (this.getUserActive?.fonction?.name!='ADMIN')){
          return ;
        }
      console.log("item ddddd:", item)
      this.damageSelect = item;

      this.dragging = null;

      window.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("mouseup", this.onMouseUp);
      this.damageTech_cmt_closed = true;
    },
    doTheReject() {
      this.$emit("showLoading");
      let formData = new FormData();
      formData.append(`damages[id]`, this.damageSelect.id);
      formData.append(`damages[rejectedBy_id]`, this.getUserActive.id);
      formData.append(`damages[damageTech_cmt_payload][comment]`, this.damageTech_cmt_payload.comment);
      this.damageTech_cmt_payload.files.forEach((picFile, picIndex) => {
        formData.append(`damages[damageTech_cmt_payload][files][${picIndex}]`, picFile);
      });


      this.revertDamageAction_2(formData)
        .then((resolve) => {

          this.doRejectAction(resolve);
          this.damageTech_cmt = false;
          this.dialogDefectToResolve = false;

          // Reset states
          this.isMouseDown = false;
          this.dragging = false;
          this.dragItem = null;
          this.hoverItem = null;
          this.pendingDragItem = null;
          this.hover_item_progress = null;
          this.hover_item_resolve = null;
          this.hover_item_closed = null;
          window.removeEventListener("mousemove", this.onMouseMove);
          window.removeEventListener("mouseup", this.onMouseUp);
          this.$emit("hideLoading");
          swal("Good job!", "success", "success");
        })
        .catch(() => {
          this.$emit("hideLoading");
          swal("Error", "", "error");
        });
    },
    doTheResolve() {
      this.$emit("showLoading");
      let formData = new FormData();
      formData.append(`damages[id]`, this.damageSelect.id);
      formData.append(`damages[confirmedBy_id]`, this.getUserActive.id);
      formData.append(`damages[work_order]`, this.work_order);
      formData.append(`damages[damageTech_cmt_payload][comment]`, this.damageTech_cmt_payload.comment);
      this.damageTech_cmt_payload.files.forEach((picFile, picIndex) => {
        formData.append(`damages[damageTech_cmt_payload][files][${picIndex}]`, picFile);
      });


      this.confirmDamage_2Action_2(formData)
        .then((resolve) => {
          this.work_order="";
          this.doResolveAction(resolve);
          this.damageTech_cmt_resolve = false;
          this.dialogDefectToResolve_resolve = false;
          // Reset states
          this.isMouseDown = false;
          this.dragging = false;
          this.dragItem = null;
          this.hoverItem = null;
          this.pendingDragItem = null;
          this.hover_item_progress = null;
          this.hover_item_resolve = null;
          this.hover_item_closed = null;
          window.removeEventListener("mousemove", this.onMouseMove);
          window.removeEventListener("mouseup", this.onMouseUp);
          this.$emit("hideLoading");
          swal("Good job!", "success", "success");
        })
        .catch(() => {
          this.$emit("hideLoading");
          swal("Error", "", "error");
        });
    },
    doTheClose() {
      this.$emit("showLoading");
      let status = this.damageSelect.status;
      let formData = new FormData();
      formData.append(`damages[id]`, this.damageSelect.id);
      formData.append(`damages[closedBy_id]`, this.getUserActive.id);
      formData.append(`damages[damageTech_cmt_payload][comment]`, this.damageTech_cmt_payload.comment);
      this.damageTech_cmt_payload.files.forEach((picFile, picIndex) => {
        formData.append(`damages[damageTech_cmt_payload][files][${picIndex}]`, picFile);
      });


      this.closeDamageAction_2(formData)
        .then((resolve) => {

          this.doCloseAction({
            damage: resolve,
            status: status
          });
          this.damageTech_cmt_closed = false;
          this.dialogDefectToResolve_closed = false;
          if (this.dragging) {
            this.dragItem.status = "on progress";
            this.handleDrop(e, this.dragItem);
          } else {
          }
          // Reset states
          this.isMouseDown = false;
          this.dragging = false;
          this.dragItem = null;
          this.hoverItem = null;
          this.pendingDragItem = null;
          this.hover_item_progress = null;
          this.hover_item_resolve = null;
          this.hover_item_closed = null;
          window.removeEventListener("mousemove", this.onMouseMove);
          window.removeEventListener("mouseup", this.onMouseUp);
          this.$emit("hideLoading");
          swal("Good job!", "success", "success");
        })
        .catch(() => {
          this.$emit("hideLoading");
          swal("Error", "", "error");
        });
    },
    onMouseUp_progress_wall(e) {
      setTimeout(() => {
        if (this.dragging && this.dragItem?.status == "resolved") {
          this.opendialogresolve_dragg_event(this.dragItem);
        }
        else {
          console.log("dragged in progress in wall");
          if (this.dragging) {
            this.dragItem.status = "on progress";
            this.handleDrop(e, this.dragItem);
          } else {
          }
          // Reset states
          this.isMouseDown = false;
          this.dragging = false;
          this.dragItem = null;
          this.hoverItem = null;
          this.pendingDragItem = null;
          this.hover_item_progress = null;
          this.hover_item_resolve = null;
          this.hover_item_closed = null;
          window.removeEventListener("mousemove", this.onMouseMove);
          window.removeEventListener("mouseup", this.onMouseUp);
        }
      }, 0);
      //setTimeout(() => {
      //  console.log("dragged in progress in wall");
      //  if (this.dragging) {
      //    this.dragItem.status = "on progress";
      //    this.handleDrop(e, this.dragItem);
      //  } else {
      //  }
      //
      //  // Reset states
      //  this.isMouseDown = false;
      //  this.dragging = false;
      //  this.dragItem = null;
      //  this.hoverItem = null;
      //  this.pendingDragItem = null;
      //  this.hover_item_progress = null;
      //  this.hover_item_resolve = null;
      //  this.hover_item_closed = null;
      //  window.removeEventListener("mousemove", this.onMouseMove);
      //  window.removeEventListener("mouseup", this.onMouseUp);
      //}, 0);
    },
    onMouseUp_resolve_wall(e) {
      setTimeout(() => {
        if (this.dragging && this.dragItem?.status == "on progress") {

          this.opendialogresolve_dragg_event_resolve(this.dragItem);
        } else {
        }

        // Reset states
        this.isMouseDown = false;
        this.dragging = false;
        this.dragItem = null;
        this.hoverItem = null;
        this.pendingDragItem = null;
        this.hover_item_progress = null;
        this.hover_item_resolve = null;
        this.hover_item_closed = null;
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
      }, 0)
    },
    onMouseUp_closed_wall(e) {
      setTimeout(() => {
        if (this.dragging && (this.dragItem?.status == "on progress" || this.dragItem?.status == "resolved")) {

          this.opendialogclosed_dragg_event_closed(this.dragItem);
        } else {
        }

        // Reset states
        this.isMouseDown = false;
        this.dragging = false;
        this.dragItem = null;
        this.hoverItem = null;
        this.pendingDragItem = null;
        this.hover_item_progress = null;
        this.hover_item_resolve = null;
        this.hover_item_closed = null;
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
      }, 0)
    },



    handleDrop(e, item) {
      this.dragItem = null;
      this.hoverItem = null;
      this.hover_item_progress = null;
      this.hover_item_resolve = null;
      this.hover_item_closed = null;
      console.log("Dropped item:", item);
    },
    getColor(status) {
      var color = "";
      if (status == "on progress") color = "#d43737 ";
      else if (status == "closed") color = "rgb(36 48 101)";
      else if (status == "resolved") color = "#fb8500";

      return color;
    },
    getAbbr(status) {
      var color = "";
      if (status == "on progress") color = "D";
      else if (status == "closed") color = "C";
      else if (status == "resolved") color = "R";

      return color;
    },
    DescriptionOrReject() {
      if (this.switch1 == false) {
        this.switchValue = "description";
      } else {
        this.switchValue = "reject";
      }
    },
    getColorceritical(important) {
      var color = "";
      if (important == 1) color = "#f54 ";

      return color;
    },
    getColorRejectTimes(rejectedTimes) {
      var color = "";
      if (rejectedTimes >= 1) color = "#f54 ";

      return color;
    },
    initialize() {

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
      this.equipmentsFiltreByid = [];



      if (this.fonction == "ADMIN") {


        this.damageByEquipments.map((item) => {
          if (item.equipment_id == this.idEquipment) {
            this.equipmentsFiltreByid.push(item);
          }
        });



        this.EquipmentsByCounter.id = this.selectedEquipment.id;
        this.EquipmentsByCounter.nameEquipment =
          this.selectedEquipment.nameEquipment;
        this.EquipmentsByCounter.damagedCount =
          this.selectedEquipment.damagedCount;
        this.EquipmentsByCounter.confirmedCount =
          this.selectedEquipment.confirmedCount;
        this.EquipmentsByCounter.closedCount = 0;


      } else {
        if (this.getUserActive.fonction.department_id == 1) {

          this.damageByEquipments.map((item) => {
            if (item.equipment_id == this.idEquipment) {
              this.equipmentsFiltreByid.push(item);
            }
          });

          this.damageByEquipmentsClose = this.equipmentsFiltreByid.filter(
            (c) => c.status == "closed"
          );
          this.EquipmentsByCounter.nameEquipment = this.selectedEquipment.nameEquipment;
          this.EquipmentsByCounter.damagedCount = this.selectedEquipment.damagedCount;
          this.EquipmentsByCounter.confirmedCount = this.selectedEquipment.confirmedCount;
          this.EquipmentsByCounter.closedCount = 0;


        } else if (this.getUserActive.fonction.department_id == 2) {

          this.damageByEquipments.map((item) => {
            if (item.equipment_id == this.idEquipment) {
              this.equipmentsFiltreByid.push(item);
            }
          });

          this.EquipmentsByCounter.nameEquipment = this.selectedEquipment.nameEquipment;
          this.EquipmentsByCounter.damagedCount = this.selectedEquipment.damagedCount;
          this.EquipmentsByCounter.confirmedCount = this.selectedEquipment.confirmedCount;
          this.EquipmentsByCounter.closedCount = 0;

        } else {


          this.damageByEquipments.map((item) => {
            if (item.equipment_id == this.idEquipment) {
              this.equipmentsFiltreByid.push(item);
            }
          });



          this.EquipmentsByCounter.id = this.selectedEquipment.id;
          this.EquipmentsByCounter.nameEquipment =
            this.selectedEquipment.nameEquipment;
          this.EquipmentsByCounter.damagedCount =
            this.selectedEquipment.damagedCount;
          this.EquipmentsByCounter.confirmedCount =
            this.selectedEquipment.confirmedCount;
          this.EquipmentsByCounter.closedCount = 0;



        }
      }
      this.loading = false;
      this.iscolor = "#1e2855 ";
      this.isHistorique = false;

    },

    pageView(item) {
      console.log("this.draggin", this.dragging)
      console.log("this.dragItem", this.dragItem)
      console.log("this.hoverItem", this.hoverItem)

      if (this.dragItem != null || this.hoverItem != null) {
        return;
      }
      this.$emit("setStep_4", item)

      //this.damageSelect = item;
      //this.photo.id = item.id;
      //
      //console.log("this.damageSelect", this.damageSelect);
      //this.dialog = true;
      //this.showdetails = true;
    },
    showHistorique() {
      this.equipmentsFiltreByid = [];
      this.loading = true;
      this.LoadingPage = true;

      setTimeout(() => {
        this.LoadingPage = false;
      }, 2000);
      if (this.fonction == "ADMIN") {
        this.FindDamageTypeByEquipmentIDAction(this.idEquipment).then(
          (resolve) => {
            this.damageByEquipments.map((item) => {
              if (item.equipment_id == this.idEquipment) {
                this.equipmentsFiltreByid.push(item);
              }
            });
            this.damageByEquipmentsWithOutClose =
              this.equipmentsFiltreByid.filter((c) => c.status != "closed");
            this.damageByEquipmentsClose = this.equipmentsFiltreByid.filter(
              (c) => c.status == "closed"
            );

            this.getEquipmentsByCounterAction(this.idEquipment).then(() => {
              this.EquipmentsByCounter.id = this.selectedEquipment.id;
              this.EquipmentsByCounter.nameEquipment =
                this.selectedEquipment.nameEquipment;
              this.EquipmentsByCounter.damagedCount =
                this.selectedEquipment.damagedCount;
              this.EquipmentsByCounter.confirmedCount =
                this.selectedEquipment.confirmedCount;
              this.EquipmentsByCounter.closedCount =
                this.selectedEquipment.closedCount;
            });
          }
        );
        this.loading = false;
      } else {
        if (this.getUserActive.fonction.department_id == 1) {
          this.FindDamageTypeByEquipmentID_ITAction(this.idEquipment).then(
            (resolve) => {
              this.damageByEquipments.map((item) => {
                if (item.equipment_id == this.idEquipment) {
                  this.equipmentsFiltreByid.push(item);
                }
              });
              this.damageByEquipmentsWithOutClose =
                this.equipmentsFiltreByid.filter((c) => c.status != "closed");
              this.damageByEquipmentsClose = this.equipmentsFiltreByid.filter(
                (c) => c.status == "closed"
              );


              this.EquipmentsByCounter.nameEquipment = resolve.nameEquipment;
              this.EquipmentsByCounter.damagedCount = resolve.damagedCount;
              this.EquipmentsByCounter.confirmedCount = resolve.confirmedCount;
              this.EquipmentsByCounter.closedCount = resolve.closedCount;
              this.loading = false;
            }
          );
        } else if (this.getUserActive.fonction.department_id == 2) {
          this.FindDamageTypeByEquipmentID_TECAction(this.idEquipment).then(
            (resolve) => {

              this.damageByEquipmentsWithOutClose =
                this.equipmentsFiltreByid.filter((c) => c.status != "closed");
              this.damageByEquipmentsClose = this.equipmentsFiltreByid.filter(
                (c) => c.status == "closed"
              );
              this.damageByEquipmentsWithOutClose.map((item) => {
              });

              this.EquipmentsByCounter.nameEquipment = resolve.nameEquipment;
              this.EquipmentsByCounter.damagedCount = resolve.damagedCount;
              this.EquipmentsByCounter.confirmedCount = resolve.confirmedCount;
              this.EquipmentsByCounter.closedCount = resolve.closedCount;
            }
          );
          this.loading = false;
        } else {
          this.FindDamageTypeByEquipmentIDAction(this.idEquipment).then(
            (resolve) => {
              this.damageByEquipments = [...this.selectedEquipment?.damages];
              this.damageByEquipments.map((item) => {
                if (item.equipment_id == this.idEquipment) {
                  this.equipmentsFiltreByid.push(item);
                }
              });
              this.damageByEquipmentsWithOutClose =
                this.equipmentsFiltreByid.filter((c) => c.status != "closed");
              this.damageByEquipmentsClose = this.equipmentsFiltreByid.filter(
                (c) => c.status == "closed"
              );
              this.damageByEquipments = [];
              this.damageByEquipments = [...this.damageByEquipmentsClose];
              this.damageByEquipmentsWithOutClose.map((item) => {
                this.damageByEquipments.push(item);
              });
              this.getEquipmentsByCounterAction(this.idEquipment).then(() => {
                this.EquipmentsByCounter.id = this.selectedEquipment.id;
                this.EquipmentsByCounter.nameEquipment =
                  this.selectedEquipment.nameEquipment;
                this.EquipmentsByCounter.damagedCount =
                  this.selectedEquipment.damagedCount;
                this.EquipmentsByCounter.confirmedCount =
                  this.selectedEquipment.confirmedCount;
                this.EquipmentsByCounter.closedCount =
                  this.selectedEquipment.closedCount;
              });
            }
          );
          this.loading = false;
        }
      }

      this.iscolor = "teal";
      this.isHistorique = true;
    },
    clickImage(item) {
      this.damageSelect = item;

      this.photo.damage_id = item.id;
      this.photo.user_id = this.getUserActive.id;

      this.setCOMMENTSAction(item.id).then(() => {
        this.comments = [...this.getcomments];
        setTimeout(() => {
          this.$refs.scrollComment.scrollTo(
            0,
            this.$refs.scrollComment.scrollHeight +
            this.$refs.scrollComment.lastElementChild.scrollHeight
          );
        }, 500);
      });
      this.LoadingPage = true;

      setTimeout(() => {
        this.LoadingPage = false;
      }, 2000);
      this.dialogimage = true;
      this.showComments = true;
    },
    closedtailedialoge() {
      this.showdetails = false;
      this.dialog = false;
    },
    opendialogclosed(item) {
      this.damageSelect = item;

      this.dialogclose = true;
    },
    opendialogresolve(item) {
      this.damageSelect = item;

      this.dialogresolve = true;
    },
    opendialogrejected(item) {
      this.damageSelect = item;

      this.dialogrejected = true;
    },
    opendialogDelete(item) {
      this.dialogDelete = true;
      this.Damagedelete.id = item.id;
    },
    confirmed() {
      this.confirmDamage.id = this.damageSelect.id;
      this.confirmDamage.confirmedBy_id = this.getUserActive.id;

      this.confirmDamageAction(this.confirmDamage)
        .then((resolve) => {

          this.damageSelect.resolveDescription =
            this.confirmDamage.resolveDescription;
          this.damageSelect.status = resolve.status;
          this.confirmDamage.id = null;

          this.confirmDamage.confirmedBy_id = null;
          this.confirmDamage.resolveDescription = "";
          this.EmailModel.payload.Equipment =
            this.EquipmentsByCounter.nameEquipment;
          this.EmailModel.payload.department =
            resolve.damage_type.department.name;
          this.EmailModel.payload.Defect = resolve.damage_type.name;
          this.EmailModel.status = "Resolved ";
          this.EmailModel.payload.Status = "resolved";
          this.EmailModel.email =
            this.departmentOP?.email.toString() +
            resolve.department?.email.toString();

          this.EmailModel.payload.confirmed_by = this.getUserActive.username;
          this.EmailModel.payload.confirmedAt = resolve.declaredAt;
          if (resolve.driver_out != null) {
            this.damageSelect.driver_out = resolve.driver_out.username;
            this.EmailModel.payload.DriverOut = resolve.driver_out.username;
          } else {
            console.error("test DriverOut");
          }
          this.EmailModel.payload.DeclaredBy = resolve.declared_by.username;
          this.EmailModel.payload.DeclaredAt = resolve.declaredAt;

          this.SendEmailAction(this.EmailModel).then(() => {

          });

          this.LoadingPage = true;

          setTimeout(() => {
            this.LoadingPage = false;
            swal("Good job!", "success", "success");
          }, 2000);
        })
        .catch((err) => {
          swal("Error", "", "error");
          console.error("on err", err);
        });
      setTimeout(() => {
        this.counters();
      }, 1000);

      this.showdetails = false;
      this.dialogresolve = false;
    },
    closed() {
      this.closeDamage.id = this.damageSelect.id;
      this.closeDamage.closedBy_id = this.getUserActive.id;
      this.damageSelect.status = this.closeDamage.status;
      this.closeDamageAction(this.closeDamage)
        .then((resolve) => {


          this.damageSelect.status = resolve.status;
          this.EmailModel.payload.Equipment =
            this.EquipmentsByCounter.nameEquipment;
          this.EmailModel.payload.department =
            resolve.damage_type.department.name;
          this.EmailModel.payload.Defect = resolve.damage_type.name;
          this.EmailModel.status = "Closed ";
          this.EmailModel.payload.Status = "closed";
          this.EmailModel.email =
            this.departmentOP.email.toString() +
            resolve.damage_type.department.email.toString();
          this.EmailModel.payload.ClosedBy = this.getUserActive.username;
          this.EmailModel.payload.ClosedAt = resolve.declaredAt;
          if (resolve.driver_out != null) {
            this.damageSelect.driver_out = resolve.driver_out.username;
            this.EmailModel.payload.DriverOut = resolve.driver_out.username;
          } else {
          }
          this.EmailModel.payload.DeclaredBy = resolve.declared_by.username;
          this.EmailModel.payload.DeclaredAt = resolve.declaredAt;

          /* this.SendEmailAction(this.EmailModel).then(() => {
     
          }); */
          this.closeDamage.id = null;
          this.closeDamage.closedBy_id = null;

          this.LoadingPage = true;

          setTimeout(() => {
            this.LoadingPage = false;
            swal("Good job!", "success", "success");
          }, 2000);
        })
        .catch((error) => {
          swal("Error", "", "error");
          console.log("error", error);
        });
      setTimeout(() => {
        this.counters();
      }, 1000);

      this.dialogclose = false;
      this.showdetails = false;
    },
    revert() {
      this.revertDamage.id = this.damageSelect.id;
      this.revertDamage.rejectedBy_id = this.getUserActive.id;
      this.damageSelect.status = this.revertDamage.status;

      this.revertDamageAction(this.revertDamage)
        .then((resolve) => {

          this.damageSelect.status = resolve.status;
          this.damageSelect.rejectedTimes = resolve.rejectedTimes;
          this.damageSelect.rejectedDescription =
            this.revertDamage.rejectedDescription;
          this.revertDamage.id = null;
          this.revertDamage.rejectedBy_id = null;
          this.revertDamage.rejectedDescription = "";

          this.EmailModel.payload.Equipment =
            this.EquipmentsByCounter.nameEquipment;
          this.EmailModel.payload.department =
            resolve.damage_type.department.name;
          this.EmailModel.payload.Defect = resolve.damage_type.name;
          this.EmailModel.status = "Rejcted ";
          this.EmailModel.payload.Status = "on progress";
          this.EmailModel.email =
            this.departmentOP.email.toString() +
            resolve.damage_type.department.email.toString();
          this.EmailModel.payload.rejected_by = this.getUserActive.username;
          this.EmailModel.payload.rejectedAt = resolve.declaredAt;
          if (resolve.driver_out != null) {
            this.damageSelect.driver_out = resolve.driver_out.username;

            this.EmailModel.payload.DriverOut = resolve.driver_out.username;
          } else {
            console.error("test DriverOut");
          }
          this.EmailModel.payload.DeclaredBy = resolve.declared_by.username;
          this.EmailModel.payload.DeclaredAt = resolve.declaredAt;

          this.SendEmailAction(this.EmailModel).then(() => {

          });

          this.LoadingPage = true;

          setTimeout(() => {
            this.LoadingPage = false;
            swal("Good job!", "success", "success");
          }, 2000);
        })
        .catch(() => {
          swal("Error", "", "error");
        });
      setTimeout(() => {
        this.counters();
      }, 1000);

      this.showdetails = false;
      this.dialogrejected = false;
    },
    deleteDamage() {
      this.deleteDAMAGEAction(this.Damagedelete)
        .then(() => {


          this.LoadingPage = true;

          setTimeout(() => {
            this.LoadingPage = false;
            swal("Good job!", "success", "success");
          }, 2000);
        })
        .catch(() => {
          swal("Error", "", "error");
        });
      setTimeout(() => {
        this.counters();
      }, 2000);

      this.dialogDelete = false;
    },
    showImage(item) {

      this.PhotoShow = item;
      this.dialogimageShow = true;
    },
    counters() {
      if (this.getUserActive.fonction.department_id == 1) {
        this.getEquipmentsByCounterITAction(this.idEquipment).then(() => {
          this.EquipmentsByCounter.id = this.selectedEquipment.id;
          this.EquipmentsByCounter.nameEquipment =
            this.selectedEquipment.nameEquipment;

          this.EquipmentsByCounter.damagedCount =
            this.selectedEquipment.damagedCount;
          this.EquipmentsByCounter.confirmedCount =
            this.selectedEquipment.confirmedCount;
          this.EquipmentsByCounter.closedCount =
            this.selectedEquipment.closedCount;
        });
      } else if (this.getUserActive.fonction.department_id == 2) {
        this.getEquipmentsByCounterTECAction(this.idEquipment).then(() => {
          this.EquipmentsByCounter.id = this.selectedEquipment.id;
          this.EquipmentsByCounter.nameEquipment =
            this.selectedEquipment.nameEquipment;

          this.EquipmentsByCounter.damagedCount =
            this.selectedEquipment.damagedCount;
          this.EquipmentsByCounter.confirmedCount =
            this.selectedEquipment.confirmedCount;
          this.EquipmentsByCounter.closedCount =
            this.selectedEquipment.closedCount;
        });
      } else {
        this.getEquipmentsByCounterAction(this.idEquipment).then(() => {
          this.EquipmentsByCounter.id = this.selectedEquipment.id;
          this.EquipmentsByCounter.nameEquipment =
            this.selectedEquipment.nameEquipment;

          this.EquipmentsByCounter.damagedCount =
            this.selectedEquipment.damagedCount;
          this.EquipmentsByCounter.confirmedCount =
            this.selectedEquipment.confirmedCount;
          this.EquipmentsByCounter.closedCount =
            this.selectedEquipment.closedCount;
        });
      }
    },
    sendImage() {
      var formData = new FormData();
      formData.append("damage_id", parseFloat(this.photo.damage_id));

      formData.append("comment", this.photo.comment);

      if (this.userDepartment == "TECHNIQUE" || this.userDepartment == "IT") {
        formData.append("status", "resolve");
      } else {
        formData.append("status", this.switchValue);
      }

      this.photo.photos.map((item) => {
        formData.append("photos[]", item);
      });
      formData.append("user_id", parseFloat(parseFloat(this.photo.user_id)));

      if (this.photo.comment != "") {
        this.addCOMMENTAction(formData)
          .then((resolve) => {
            this.comments.push(resolve);

            this.photo.comment = "";
            this.switch1 = false;
            this.photo.photos = [];

            setTimeout(() => {
              this.$refs.scrollComment.scrollTo(
                0,
                this.$refs.scrollComment.scrollHeight +
                this.$refs.scrollComment.lastElementChild.scrollHeight
              );
            }, 500);
            this.LoadingPage = true;

            setTimeout(() => {
              this.LoadingPage = false;
              swal("Good job!", "success", "success");
            }, 2000);
          })
          .catch(() => {
            swal("Error", "", "error");
          });
      }

      //this.dialogimage = false;
    },
    refreshComments(id) {
      this.comments = this.comments.filter((c) => c.id != id);
      this.LoadingPage = true;

      setTimeout(() => {
        this.LoadingPage = false;
        swal("Good job!", "success", "success");
      }, 2000);
    },
    editeComment(comment) {
      this.comments = this.comments.map((c) => {
        if (c.id == comment.id) return comment;
        return c;
      });
    },
  },
};
</script>
