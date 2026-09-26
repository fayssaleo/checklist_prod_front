<template>
  <v-row style=" height: 753px;">
    <v-col cols="5">
      <v-card class="ma-4 pa-4 details_damage_left " style="
              border-radius: 16px;
              box-shadow: 0 2px 12px rgba(30,40,85,0.08);
              background: #fff;
              margin: 0 !important;
              padding: 0 !important;
                  border: 1px solid #00000070;
              ">
        <v-card-title class="d-flex align-center mb-2" style="gap: 12px;background-color: #1e2855;
    color: white;">
          <v-icon color="white" size="32">mdi-clipboard-text-search-outline</v-icon>
          <span class="text-h6 font-weight-bold">DETAILS</span>
          <v-chip
          style="    font-weight: 900;"
            :color="selectedDamage_comp.status === 'closed' ? 'success' : (selectedDamage_comp.status === 'resolved' ? 'orange' : 'error')"
            text-color="white" class="ml-auto">{{ selectedDamage_comp.status?.toUpperCase() || 'N/A' }}</v-chip>
        </v-card-title>
        <v-divider class="mb-4"></v-divider>
        <div style="flex:1; overflow-y:auto;  overflow-x:hidden; height: 643px;">
          <v-simple-table dense style="width:100%;">
            <tbody>
              <tr>
                <td class="font-weight-bold">Defect ID</td>
                <td><v-chip small>{{ String(selectedDamage_comp.id).padStart(4, '0') }}</v-chip></td>
              </tr>
              <tr v-if="getUserActive.fonction?.department_id==2">
                <td class="font-weight-bold">Work Order</td>
                <td><v-chip small>{{ selectedDamage_comp?.work_order || "null" }}</v-chip></td>
              </tr>
              <tr>
                <td class="font-weight-bold">Equipment</td>
                <td><v-chip small>{{ selectedDamage_comp.equipment?.profile_group?.name || 'N/A' }}</v-chip></td>
              </tr>
              <tr>
                <td class="font-weight-bold">Matricule</td>
                <td><v-chip small>{{ selectedDamage_comp.equipment?.name || 'N/A' }}</v-chip></td>
              </tr>
              <tr>
                <td class="font-weight-bold">Category</td>
                <td><v-chip small>{{ selectedDamage_comp.damage_type?.damage_type_master?.name || 'IT' }}</v-chip></td>
              </tr>
              <tr>
                <td class="font-weight-bold">Defect type</td>
                <td><v-chip small>{{ selectedDamage_comp.damage_type?.name || 'N/A' }}</v-chip></td>
              </tr>
              <tr
              v-if="getUserActive.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
              >
                <td class="font-weight-bold">Declared By</td>
                <td><v-chip small>{{ declaredByName }} ({{ String(declaredByMatricule).padStart(4, '0') }})</v-chip></td>
              </tr>
              <tr
              >
                <td class="font-weight-bold">Declared At</td>
                <td><v-chip small>{{ selectedDamage_comp.declaredAt }}</v-chip></td>
              </tr>
              <tr
              v-if="getUserActive.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'"
              >
                <td class="font-weight-bold">Shift</td>
                <td><v-chip small>{{ selectedDamage_comp.shift || 'N/A' }}</v-chip></td>
              </tr>
              
              <tr v-if="selectedDamage_comp.confirmed_by">
                <td  class="font-weight-bold">Confirmed By</td>
                <td><v-chip small>{{ confirmedByName }} ({{ String(confirmedByMatricule).padStart(4, '0') }})</v-chip></td>
              </tr>
              <tr v-if="selectedDamage_comp.confirmedAt">
                <td  class="font-weight-bold">Confirmed At</td>
                <td><v-chip small>{{ selectedDamage_comp.confirmedAt }}</v-chip></td>
              </tr>
              <tr v-if="selectedDamage_comp.closedAt">
                <td class="font-weight-bold">Closed By</td>
                <td><v-chip small>{{ closedByName }} ({{ String(closedByUsername).padStart(4, '0') }})</v-chip></td>
              </tr>
              <tr v-if="selectedDamage_comp.closedAt">
                <td class="font-weight-bold">Closed At</td>
                <td><v-chip small>{{ selectedDamage_comp.closedAt }}</v-chip></td>
              </tr>
              <tr v-if="selectedDamage_comp.rejectedBy_id">
                <td class="font-weight-bold">Rejected By</td>
                <td><v-chip small>{{ selectedDamage_comp.rejected_by?.firstName }} {{ selectedDamage_comp.rejected_by?.lastName }}
                    ({{ selectedDamage_comp.rejected_by?.fonction?.name }}) ({{ String(selectedDamage_comp.rejected_by.username).padStart(4, '0')  }})</v-chip></td>
              </tr>
              <tr v-if="selectedDamage_comp.rejectedAt">
                <td class="font-weight-bold">Rejected At</td>
                <td><v-chip small>{{ selectedDamage_comp.rejectedAt }}</v-chip></td>
              </tr>
              <tr v-if="selectedDamage_comp.rejectedTimes">
                <td class="font-weight-bold">Rejected Times</td>
                <td><v-chip small>{{ selectedDamage_comp.rejectedTimes }}</v-chip></td>
              </tr>

            </tbody>
          </v-simple-table>
        </div>
      </v-card>
    </v-col>
    <v-col cols="7" style="display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
        max-height: 754px;">
      <div class="the_chat_box"
        style="flex: 1 1 0; height: 100%; background: #f8fafc; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,40,85,0.07);">
        <v-col class="chat_header d-flex align-center justify-space-between py-2 px-4" cols="12"
          style="background: rgb(25, 118, 210); border-radius: 12px 12px 0 0; color: #fff;">
          <div class="font-weight-bold" style="font-size: 1.2rem; letter-spacing: 1px;">
            <v-icon left color="#fff" class="mr-2">mdi-chat</v-icon>
            Comments
          </div>

        </v-col>
        <v-col cols="12" class="d-flex flex-column flex-grow-1" ref="commentsContainer" style="    
        overflow: hidden auto;
    min-height: 414px !important;
    max-height: 438px !important;
    margin-bottom: 2px !important;
        border-bottom: 1px solid #00000069;
    "
    :style="{
      backgroundColor:(selectedDamage_comp?.comments.length>0)?getColor__(selectedDamage_comp?.comments[selectedDamage_comp?.comments.length-1], selectedDamage_comp?.comments):'rgba(17, 13, 65, 0.07)'
    }"
    
    >

          <template v-for="comment in selectedDamage_comp?.comments">
            <div v-if="comment.user.fonction?.department_id == 3" class="chat-message ops-msg"
              :class="{ normal: comment.status.toLocaleUpperCase() != 'REJECT' && comment.status.toLocaleUpperCase() != 'RESOLVED' && comment.status.toLocaleUpperCase() != 'CLOSING' && comment.status.toLocaleUpperCase() != 'DECLARATION' }"
              :style="{
                backgroundColor: getColor__(comment, selectedDamage_comp?.comments)
              }">
              <v-card color="#fff3e0" class="pa-2 mb-2 d-flex align-end" flat
                style="border-radius: 18px 18px 4px 18px; box-shadow: 0 2px 8px rgba(30,40,85,0.07);     margin-bottom: 0 !important;">
                <div style="flex:1;    margin-bottom: 0px !important;">
                  <div
                    v-if="(comment?.status.toLocaleUpperCase()=='DECLARATION')?(getUserActive.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'):true"
                    class="font-weight-bold mb-1 text-right" style="font-size: 0.95rem; 
                     text-align: left !important;
                        padding-right: 5px !important;">
                    <v-icon :color="getStatusColor(comment)" size="16" class="ml-1">{{ getStatusIcon(comment)
                    }}</v-icon>
                    {{ comment?.status.toLocaleUpperCase() }} by
                    {{
                      comment?.user?.firstName[0].toLocaleUpperCase() +
                      comment?.user?.firstName.slice(1).toLocaleLowerCase()
                    }}
                    {{ comment?.user?.lastName.toLocaleUpperCase() }}

                  </div>
                  <div
                    v-else
                    class="font-weight-bold mb-1 text-right" style="font-size: 0.95rem; 
                     text-align: left !important;
                        padding-right: 5px !important;">
                    <v-icon :color="getStatusColor(comment)" size="16" class="ml-1">mdi-lightbulb-alert</v-icon>
                    {{ 'DECLARATION' }} by
                    {{
                      'driver'
                    }}
                    

                  </div>
                  <div :class="{
                    commoent_with_pic: comment.files && comment.files.length
                  }" class="chat_message_container_right" style="text-align: right !important;">
                    {{ comment?.comment }}
                  </div>
                  <!-- Photos for ops-msg -->
                  <div class="comment-photos comment-photos_right" v-if="comment.files && comment.files.length"
                    style="justify-content: flex-end !important;margin: 8px 0; text-align: right;">
                    <template v-for="file in comment.files">
                      <v-img v-if="['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes((file.extension || '').toLowerCase())"
                        :key="file.id" :src="getPhotoUrl(file.filename)" class="comment-photo"
                        style="margin: 0 0 8px 8px; border-radius: 8px; display: inline-block; cursor:pointer;"
                        @click="imagefullScreen(file)"></v-img>
                      <v-btn v-else :key="file.id" icon small
                        style="margin: 0 0 8px 8px; border-radius: 8px; display: inline-block; cursor:pointer; background: #f5f5f5;"
                        @click="downloadFile(file)">
                        <v-icon v-if="file.extension && file.extension.toLowerCase() === 'pdf'"
                          color="#d43737">mdi-file-pdf-box</v-icon>
                        <v-icon v-else-if="['xls', 'xlsx'].includes((file.extension || '').toLowerCase())"
                          color="#1976d2">mdi-file-excel-box</v-icon>
                        <v-icon v-else-if="['doc', 'docx'].includes((file.extension || '').toLowerCase())"
                          color="#1976d2">mdi-file-word-box</v-icon>
                        <v-icon v-else-if="['csv'].includes((file.extension || '').toLowerCase())"
                          color="#43a047">mdi-file-delimited</v-icon>
                        <v-icon v-else-if="['txt'].includes((file.extension || '').toLowerCase())"
                          color="#757575">mdi-file-document-outline</v-icon>
                        <v-icon v-else-if="['ppt', 'pptx'].includes((file.extension || '').toLowerCase())"
                          color="#e65100">mdi-file-powerpoint-box</v-icon>
                        <v-icon v-else color="#757575">mdi-file-document-outline</v-icon>
                      </v-btn>
                    </template>
                  </div>
                  <div
                   v-if="(comment?.status.toLocaleUpperCase()=='DECLARATION')?(getUserActive.fonction?.department_id==3 || getUserActive?.fonction?.name=='ADMIN'):true"

                  class="text-caption grey--text mt-1 text-right matricule">{{
                    comment?.user?.username.toLocaleUpperCase() }}
                  </div>
                  <div
                   v-else

                  class="text-caption grey--text mt-1 text-right matricule">{{
                    'DRIVER' }}
                  </div>
                  <div class="text-caption grey--text mt-1 text-right" style="font-size: 0.8rem;">{{ comment.created_at
                  }}</div>
                </div>
                <v-avatar size="50px" class="ml-2" style="align-self: flex-end;">
                  <template v-if="opsPictureSrc">
                    <v-img :src="opsPictureSrc" alt="Ops"></v-img>
                  </template>
                  <template v-else>
                    <v-icon color="#1976d2" size="50px">mdi-account-circle</v-icon>
                  </template>
                </v-avatar>
              </v-card>
            </div>
            <div v-else class="chat-message tech-msg" :style="{
              backgroundColor: getColor__(comment, selectedDamage_comp?.comments)
            }"
              :class="{ normal: comment.status.toLocaleUpperCase() != 'REJECT' && comment.status.toLocaleUpperCase() != 'RESOLVED' && comment.status.toLocaleUpperCase() != 'CLOSING' && comment.status.toLocaleUpperCase() != 'DECLARATION' }">
              <v-card color="#e3f2fd" class="pa-2 mb-2 d-flex align-end" flat
                style="border-radius: 18px 18px 18px 4px; box-shadow: 0 2px 8px rgba(30,40,85,0.07);    margin-bottom: 0 !important;">
                <v-avatar size="50px" class="mr-2" style="align-self: flex-end;">
                  <template>
                    <v-icon color="#fb8500" size="50px">mdi-account-circle</v-icon>
                  </template>
                </v-avatar>
                <div style="flex:1;    margin-bottom: 0px !important;">
                  <div class="font-weight-bold mb-1" style="font-size: 0.95rem;    text-align: right !important;
    padding-right: 5px !important;">
                    {{ comment?.status.toLocaleUpperCase() }} by
                    {{
                      comment?.user?.firstName[0].toLocaleUpperCase() +
                      comment?.user?.firstName.slice(1).toLocaleLowerCase()
                    }}
                    {{ comment?.user?.lastName.toLocaleUpperCase() }}
                    <v-icon :color="getStatusColor(comment)" size="16" class="ml-1">{{ getStatusIcon(comment)
                    }}</v-icon>
                  </div>
                  <div :class="{
                    commoent_with_pic: comment.files && comment.files.length
                  }" class="chat_message_container_left" style="text-align: left !important;">
                    {{ comment?.comment }}.
                  </div>
                  <!-- Photos for tech-msg -->
                  <div class="comment-photos comment-photos_left" v-if="comment.files && comment.files.length"
                    style="margin: 8px 0; text-align: left;">
                    <template v-for="file in comment.files">
                      <v-img v-if="['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes((file.extension || '').toLowerCase())"
                        :key="file.id" :src="getPhotoUrl(file.filename)" class="comment-photo"
                        style="margin: 0 8px 8px 0; border-radius: 8px; display: inline-block; cursor:pointer;"
                        @click="imagefullScreen(file)"></v-img>
                      <v-btn v-else :key="file.id" icon small
                        style="margin: 0 8px 8px 0; border-radius: 8px; display: inline-block; cursor:pointer; background: #f5f5f5;"
                        @click="downloadFile(file)">
                        <v-icon v-if="file.extension && file.extension.toLowerCase() === 'pdf'"
                          color="#d43737">mdi-file-pdf-box</v-icon>
                        <v-icon v-else-if="['xls', 'xlsx'].includes((file.extension || '').toLowerCase())"
                          color="#1976d2">mdi-file-excel-box</v-icon>
                        <v-icon v-else-if="['doc', 'docx'].includes((file.extension || '').toLowerCase())"
                          color="#1976d2">mdi-file-word-box</v-icon>
                        <v-icon v-else-if="['csv'].includes((file.extension || '').toLowerCase())"
                          color="#43a047">mdi-file-delimited</v-icon>
                        <v-icon v-else-if="['txt'].includes((file.extension || '').toLowerCase())"
                          color="#757575">mdi-file-document-outline</v-icon>
                        <v-icon v-else-if="['ppt', 'pptx'].includes((file.extension || '').toLowerCase())"
                          color="#e65100">mdi-file-powerpoint-box</v-icon>
                        <v-icon v-else color="#757575">mdi-file-document-outline</v-icon>
                      </v-btn>
                    </template>
                  </div>
                  <div class="text-caption grey--text mt-1 matricule">{{ comment?.user?.username.toLocaleUpperCase() }}
                  </div>
                  <div class="text-caption grey--text mt-1" style="font-size: 0.8rem;">{{ comment.created_at }}</div>
                </div>
              </v-card>
            </div>
          </template>

        </v-col>
        <v-col class="chat_text" cols="12"
          style="border-top: 1px solid #e0e0e0; background: #f4f6fb; border-radius: 0 0 12px 12px;">
           <v-form
          v-if="damageTech_cmt_closed || damageTech_cmt || damageTech_cmt_resolve"
          
          @submit.prevent="">
            <v-textarea style="
   
                                  padding-left: 18px !important;
                                  padding-top: 18px !important;
                                  BACKGROUND-COLOR:#cacaca !important;
                                      padding-bottom: 13px !important;

                              " label="Defect comment.." v-model="damageTech_cmt_payload_22.comment" name="input-7-1" variant="outlined"
              class="sub_comment_text"></v-textarea>

            <div cols="12" md="12" class="cmt_pic_background" style="height: 63px !important;  ">
              <span class="images_pannel" style="       height: 100% !important;">
                <template v-for="pic in damageTech_cmt_payload_22.files">
                  <img
                    v-if="['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes((pic.name || pic.filename || '').split('.').pop().toLowerCase())"
                    @click="imagefullScreen(pic)"
                    :src="getImageUrl(pic)"
                    style="height: 56px !important; width: 90px !important; margin-left: 15px !important; cursor:pointer;"
                    alt=""
                  >
                  <v-btn
                    v-else
                    icon
                    small
                    style="height: 56px !important; width: 56px !important; margin-left: 15px !important; border-radius: 8px; background: #f5f5f5; display: inline-flex; align-items: center; justify-content: center; cursor:pointer;"
                    @click="downloadFile(pic)"
                  >
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-if="(pic.name || pic.filename || '').toLowerCase().endsWith('.pdf')" color="#d43737">mdi-file-pdf-box</v-icon>
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-else-if="['xls', 'xlsx'].includes((pic.name || pic.filename || '').split('.').pop().toLowerCase())" color="#1976d2">mdi-file-excel-box</v-icon>
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-else-if="['doc', 'docx'].includes((pic.name || pic.filename || '').split('.').pop().toLowerCase())" color="#1976d2">mdi-file-word-box</v-icon>
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-else-if="['csv'].includes((pic.name || pic.filename || '').split('.').pop().toLowerCase())" color="#43a047">mdi-file-delimited</v-icon>
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-else-if="['txt'].includes((pic.name || pic.filename || '').split('.').pop().toLowerCase())" color="#757575">mdi-file-document-outline</v-icon>
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-else-if="['ppt', 'pptx'].includes((pic.name || pic.filename || '').split('.').pop().toLowerCase())" color="#e65100">mdi-file-powerpoint-box</v-icon>
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-else color="#757575">mdi-file-document-outline</v-icon>
                  </v-btn>
                </template>
              </span>
              <v-menu class="chat_menus" location="top" v-model="menuOpen">
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on" class="add_button" style="height: 50px;">
                    <v-icon size="48px">mdi-plus</v-icon>
                  </span>
                </template>
                <v-list class="plus-list--chat-box">
                  <v-list-item v-for="(item, index) in add_options" :key="index"
                    @click="onAddOption(item.title); menuOpen = false;" class="menu-list-item menu-list-item-chat-box"
                    style="position: relative;transition: 0.5s;">
                    <v-list-item-icon>
                      <v-icon :class="'icons-plus-hover-icon-' + item.title"
                        v-if="item.title === 'PICTURE'">mdi-image</v-icon>
                      <v-icon :class="'icons-plus-hover-icon-' + item.title"
                        v-else-if="item.title === 'FILE'">mdi-file-document</v-icon>
                      <v-icon :class="'icons-plus-hover-icon-' + item.title"
                        v-else-if="item.title === 'DEFECT'">mdi-alert-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title style="padding-top: 3px; text-align: center;">{{ item.title
                    }}</v-list-item-title>
                    <span class="plus-hover-icon">
                      <v-icon small>mdi-plus</v-icon>
                    </span>
                  </v-list-item>
                </v-list>
              </v-menu>
              <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
            </div>
            <v-btn
            :disabled="damageTech_cmt_payload_22.comment==''"
            :class="{disabledSendChat:damageTech_cmt_payload_22.comment==''}"
            class="sendMsgBtn" type="submit"  block elevation="2" @click="add_comment">Send 
              <v-icon style="
                          font-size: 22px;
                      " >mdi-arrow-right-bottom</v-icon>  </v-btn>
          </v-form>
          <v-form
          v-else
          
          @submit.prevent="">
            <v-textarea style="
   
                                  padding-left: 18px !important;
                                  padding-top: 18px !important;
                                  BACKGROUND-COLOR:#cacaca !important;
                                      padding-bottom: 13px !important;

                              " label="Defect comment.." v-model="damageTech_cmt_payload.comment" name="input-7-1" variant="outlined"
              class="sub_comment_text"></v-textarea>

            <div cols="12" md="12" class="cmt_pic_background" style="height: 63px !important;  ">
              <span class="images_pannel" style="       height: 100% !important;">
                <template v-for="pic in damageTech_cmt_payload.files">
                  <img
                    v-if="['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes((pic.name || pic.filename || '').split('.').pop().toLowerCase())"
                    @click="imagefullScreen(pic)"
                    :src="getImageUrl(pic)"
                    style="height: 56px !important; width: 90px !important; margin-left: 15px !important; cursor:pointer;"
                    alt=""
                  >
                  <v-btn
                    v-else
                    icon
                    small
                    style="height: 56px !important; width: 56px !important; margin-left: 15px !important; border-radius: 8px; background: #f5f5f5; display: inline-flex; align-items: center; justify-content: center; cursor:pointer;"
                    @click="downloadFile(pic)"
                  >
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-if="(pic.name || pic.filename || '').toLowerCase().endsWith('.pdf')" color="#d43737">mdi-file-pdf-box</v-icon>
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-else-if="['xls', 'xlsx'].includes((pic.name || pic.filename || '').split('.').pop().toLowerCase())" color="#1976d2">mdi-file-excel-box</v-icon>
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-else-if="['doc', 'docx'].includes((pic.name || pic.filename || '').split('.').pop().toLowerCase())" color="#1976d2">mdi-file-word-box</v-icon>
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-else-if="['csv'].includes((pic.name || pic.filename || '').split('.').pop().toLowerCase())" color="#43a047">mdi-file-delimited</v-icon>
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-else-if="['txt'].includes((pic.name || pic.filename || '').split('.').pop().toLowerCase())" color="#757575">mdi-file-document-outline</v-icon>
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-else-if="['ppt', 'pptx'].includes((pic.name || pic.filename || '').split('.').pop().toLowerCase())" color="#e65100">mdi-file-powerpoint-box</v-icon>
                    <v-icon style="font-size: 59px; padding-top: 28px !important;" v-else color="#757575">mdi-file-document-outline</v-icon>
                  </v-btn>
                </template>
              </span>
              <v-menu class="chat_menus" location="top" v-model="menuOpen">
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on" class="add_button" style="height: 50px;">
                    <v-icon size="48px">mdi-plus</v-icon>
                  </span>
                </template>
                <v-list class="plus-list--chat-box">
                  <v-list-item v-for="(item, index) in add_options" :key="index"
                    @click="onAddOption(item.title); menuOpen = false;" class="menu-list-item menu-list-item-chat-box"
                    style="position: relative;transition: 0.5s;">
                    <v-list-item-icon>
                      <v-icon :class="'icons-plus-hover-icon-' + item.title"
                        v-if="item.title === 'PICTURE'">mdi-image</v-icon>
                      <v-icon :class="'icons-plus-hover-icon-' + item.title"
                        v-else-if="item.title === 'FILE'">mdi-file-document</v-icon>
                      <v-icon :class="'icons-plus-hover-icon-' + item.title"
                        v-else-if="item.title === 'DEFECT'">mdi-alert-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title style="padding-top: 3px; text-align: center;">{{ item.title
                    }}</v-list-item-title>
                    <span class="plus-hover-icon">
                      <v-icon small>mdi-plus</v-icon>
                    </span>
                  </v-list-item>
                </v-list>
              </v-menu>
              <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
            </div>
            <v-btn
            :disabled="damageTech_cmt_payload.comment==''"
            :class="{disabledSendChat:damageTech_cmt_payload.comment==''}"
            class="sendMsgBtn" type="submit"  block elevation="2" @click="add_comment">Send 
              <v-icon style="
                          font-size: 22px;
                      " >mdi-arrow-right-bottom</v-icon>  </v-btn>
          </v-form>
        </v-col>
      </div>

    </v-col>

    <v-dialog v-model="previewDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Image Preview</v-card-title>
        <v-card-text style="text-align:center;">
          <v-img :src="previewImgSrc" max-width="100%" max-height="400" contain></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="downloadPreviewImg">Download</v-btn>
          <v-btn text @click="previewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>





    
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
                (selectedDamage_comp?.damage_type.department_id == 1) ? selectedDamage_comp?.damage_type.icon : selectedDamage_comp?.damage_type.damage_type_master.icon
            }}</v-icon>
          REJECT RESOLUTION > {{ selectedDamage_comp?.damage_type?.name?.toLocaleUpperCase() }}
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
          <v-btn style="    font-weight: 900;" color="#fff " @click=" $emit('close_damageTech_cmt')">
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
                (selectedDamage_comp?.damage_type.department_id == 1) ? selectedDamage_comp?.damage_type.icon : selectedDamage_comp?.damage_type.damage_type_master.icon
            }}</v-icon>
          RESOLVE > {{ selectedDamage_comp?.damage_type?.name?.toLocaleUpperCase() }}
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
            <span class="add_button" @click="onAddOption('PICTURE')">
              <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
              <v-icon size="45px" class="">mdi-plus</v-icon>
            </span>

          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="    font-weight: 900;" color="#fff " @click="$emit('close_damageTech_cmt_resolve')">
            Cancel
          </v-btn>
          <v-btn :disabled="damageTech_cmt_payload.comment == '' || work_order==''" style="color:white;font-weight: 900" depressed
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
                (selectedDamage_comp?.damage_type.department_id == 1) ? selectedDamage_comp?.damage_type.icon : selectedDamage_comp?.damage_type.damage_type_master.icon
            }}</v-icon>
          CLOSE > {{ selectedDamage_comp?.damage_type?.name?.toLocaleUpperCase() }}
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
            <span class="add_button" @click="onAddOption('PICTURE')">
              <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
              <v-icon size="45px" class="">mdi-plus</v-icon>
            </span>

          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn style="    font-weight: 900;" color="#fff " @click=" $emit('close_damageTech_cmt_closed')">
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
          <span v-if="(selectedDamage_comp.status == 'on progress')"
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

export default {

  props: [
    "selectedDamage_comp",
    "damageTech_cmt_resolve",
    "damageTech_cmt",
    "damageTech_cmt_closed",
  ],
  data() {
    return {
      work_order:"",
      dialogDefectToResolve_closed:false,
      dialogDefectToResolve_resolve:false,
      cmt_actual_pic_delete:false,
      damageTech_cmt_fullscreen_img:false,
      dialogDefectToResolve:false,
      add_options: [
        { title: "PICTURE" },
        { title: "FILE" },
      ],
      add_option: null,
      btn: null,
      damageTech_cmt_payload: {
        comment: "",
        files: [],
      },
       damageTech_cmt_payload_22: {
        comment: "",
        files: []
      },
      newComment: "",
      newPicture: null,
      previewImage: null,
      selectedFiles: [],
      techPictureSrc: null, // Placeholder for tech avatar if needed
      opsPictureSrc: null,   // Placeholder for ops avatar if needed
      menuOpen: false,
      previewDialog: false,
      previewImgSrc: '',
      previewImgName: '',
    };
  },
  mounted() {
    // Initialize any required data or state
    this.newComment = "";
    this.newPicture = null;
    this.previewImage = null;
    this.selectedFiles = [];
    console.log("DamageView component mounted with selectedDamage_comp:", this.selectedDamage_comp);
    this.scrollToBottom();
  },
  watch: {
    'selectedDamage_comp.comments.length'(newVal, oldVal) {
      this.scrollToBottom();
    },
    damageTech_cmt_resolve(val) {
       this.reset__damageTech_cmt_payload();
    },
    damageTech_cmt(val) {
       this.reset__damageTech_cmt_payload();
    },
    damageTech_cmt_closed(val) {
       this.reset__damageTech_cmt_payload();
    },
  },
  computed: {
    ...mapGetters([
      "getUserActive"
    ]),
    
    declaredByMatricule() {
      const declared = this.selectedDamage_comp?.declared_by;
      return declared
        ? `${declared.username}`
        : "N/A";
    },
    declaredByName() {
      const declared = this.selectedDamage_comp?.declared_by;
      return declared
        ? `${declared.firstName} ${declared.lastName} (${declared.fonction?.name || 'N/A'})`
        : "N/A";
    },
    confirmedByMatricule() {
      const confirmed = this.selectedDamage_comp?.confirmed_by;
      return confirmed
        ? `${confirmed.username}`
        : "N/A";
    },
    confirmedByName() {
      const confirmed = this.selectedDamage_comp?.confirmed_by;
      return confirmed
        ? `${confirmed.firstName} ${confirmed.lastName} (${confirmed.fonction?.name || 'N/A'})`
        : "N/A";
    },
    closedByUsername() {
      const closed = this.selectedDamage_comp?.closed_by;
      return closed
        ? `${closed.username}`
        : "N/A";
    },
    closedByName() {
      const closed = this.selectedDamage_comp?.closed_by;
      return closed
        ? `${closed.firstName} ${closed.lastName} (${closed.fonction?.name || 'N/A'})`
        : "N/A";
    },
  },
  methods: {
    ...mapActions([
      "add_comment_in_profile_group_action",
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
    reject_action_with_cmt() {
      this.dialogDefectToResolve = true;
    },
    opendialogresolve_dragg_event_resolve() {
      this.damageTech_cmt_resolve = true;
    },
    doTheClose() {
      this.$emit("showLoading");
      let status = this.selectedDamage_comp.status;
      let formData = new FormData();
      formData.append(`damages[id]`, this.selectedDamage_comp.id);
      formData.append(`damages[closedBy_id]`, this.getUserActive.id);
      formData.append(`damages[damageTech_cmt_payload][comment]`, this.damageTech_cmt_payload.comment);
      this.damageTech_cmt_payload.files.forEach((picFile, picIndex) => {
        formData.append(`damages[damageTech_cmt_payload][files][${picIndex}]`, picFile);
      });


      this.closeDamageAction_2(formData)
        .then((resolve) => {
          this.reset__damageTech_cmt_payload();
          this.doCloseAction({
            damage: resolve,
            status: status
          });
          this.$emit("close_damageTech_cmt_closed") ;
          this.dialogDefectToResolve_closed = false;

          this.$emit("hideLoading");
          swal("Good job!", "success", "success");
        })
        .catch(() => {
          this.$emit("hideLoading");
          swal("Error", "", "error");
        });
    },
    closed_action_with_cmt_closed() {
      this.dialogDefectToResolve_closed = true;
    },
    doTheResolve() {
      this.$emit("showLoading");
      let formData = new FormData();
      formData.append(`damages[id]`, this.selectedDamage_comp.id);
      formData.append(`damages[work_order]`, this.work_order);
      formData.append(`damages[confirmedBy_id]`, this.getUserActive.id);
      formData.append(`damages[damageTech_cmt_payload][comment]`, this.damageTech_cmt_payload.comment);
      this.damageTech_cmt_payload.files.forEach((picFile, picIndex) => {
        formData.append(`damages[damageTech_cmt_payload][files][${picIndex}]`, picFile);
      });


      this.confirmDamage_2Action_2(formData)
        .then((resolve) => {
          this.selectedDamage_comp.work_order=this.work_order;
          this.reset__damageTech_cmt_payload();
          this.doResolveAction(resolve);
          this.$emit("close_damageTech_cmt_resolve");
          this.dialogDefectToResolve_resolve = false;
          this.work_order="";
          // Reset states


          this.$emit("hideLoading");
          swal("Good job!", "success", "success");
        })
        .catch(() => {
          this.$emit("hideLoading");
          swal("Error", "", "error");
        });
    },
    resolve_action_with_cmt_resolve() {
      this.dialogDefectToResolve_resolve = true;
    },
    doTheReject() {
      this.$emit("showLoading");
      let formData = new FormData();
      formData.append(`damages[id]`, this.selectedDamage_comp.id);
      formData.append(`damages[rejectedBy_id]`, this.getUserActive.id);
      formData.append(`damages[damageTech_cmt_payload][comment]`, this.damageTech_cmt_payload.comment);
      this.damageTech_cmt_payload.files.forEach((picFile, picIndex) => {
        formData.append(`damages[damageTech_cmt_payload][files][${picIndex}]`, picFile);
      });


      this.revertDamageAction_2(formData)
        .then((resolve) => {
          this.reset__damageTech_cmt_payload();
          this.doRejectAction(resolve);
          this.$emit("close_damageTech_cmt");
          this.dialogDefectToResolve = false;


          this.$emit("hideLoading");
          swal("Good job!", "success", "success");
        })
        .catch(() => {
          this.$emit("hideLoading");
          swal("Error", "", "error");
        });
    },
    cmt_actual_pic_edit_open(item) {
      this.selectedDamage_comp = item;

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
    getPhotoUrl(filename) {
      // Use the same baseURL as axios (from plugins/axios.js)
      // Remove trailing /api/ and use /storage/cdn/damagePhotos/
      let baseURL = '';
      if (this.$axios && this.$axios.defaults && this.$axios.defaults.baseURL) {
        baseURL = this.$axios.defaults.baseURL.replace(/\/api\/?$/, '');
      } else {
        baseURL = 'http://10.20.33.110:9008'; // fallback if $axios is not available
      }
      return `${baseURL}/storage/cdn/damageFiles/${filename}`;
    },
    triggerUpload(type) {
      // type: 'PICTURE' or 'FILE'
      const input = this.$refs.fileInput;
      if (!input) return;
      if (type === 'PICTURE') {
        input.accept = '.jpg,.jpeg,.png,.gif,.bmp,.webp';
      } else if (type === 'FILE') {
        input.accept = '.pdf,.xls,.xlsx,.doc,.docx,.csv,.txt,.ppt,.pptx';
      } else {
        input.accept = '';
      }
      input.value = '';
      input.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      const extension = file.name.split('.').pop().toLowerCase();
      if ([
        "jpg", "jpeg", "png", "gif", "bmp", "webp",
        "pdf", "xls", "xlsx", "doc", "docx", "csv", "txt", "ppt", "pptx"
      ].includes(extension)) {
        this.damageTech_cmt_payload.files.push(file);
      }
    },
    imagefullScreen(file) {
      // Only preview if image
      const extension = (file.extension || '').toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)) {
        this.previewImgSrc = this.getPhotoUrl(file.filename);
        this.previewImgName = file.filename;
        this.previewDialog = true;
      } else {
        // fallback: download if not image
        this.downloadFile(file);
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return "N/A";
      const [day, month, year, hour, minute] = dateStr.split(/[/\s:]/);
      return `${day}-${month}-${year} ${hour || ''}${minute ? ':' + minute : ''}`;
    },
    onPictureChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newPicture = file;
        this.previewImage = URL.createObjectURL(file);
      } else {
        this.newPicture = null;
        this.previewImage = null;
      }
    },
    onAddFiles() {
      // Trigger a hidden file input for multiple files (not just images)
      if (!this.$refs.filesInput) {
        // If the input doesn't exist, create it dynamically
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.style.display = 'none';
        input.addEventListener('change', (event) => {
          const files = Array.from(event.target.files);
          // You can handle the files array as needed, e.g., store in data or upload
          this.selectedFiles = files;
        });
        document.body.appendChild(input);
        this.$refs.filesInput = input;
      }
      this.$refs.filesInput.click();
    },
    onAddOption(option) {
      if (option === 'PICTURE' || option === 'FILE') {
        this.triggerUpload(option);
      } else if (option === 'DEFECT') {
        this.onAddDamageAttachment();
      }
    },
    onAddDamageAttachment() {
      // Implement damage attachment logic
    },
    add_comment() {
      this.$emit("showLoading");
      let formData = new FormData();
      formData.append(`comment[damage_id]`, this.selectedDamage_comp.id);
      formData.append(`comment[user_id]`, this.getUserActive.id);
      formData.append(`comment[status]`, "description");
      formData.append(`comment[damageTech_cmt_payload][comment]`, this.damageTech_cmt_payload.comment);
      this.damageTech_cmt_payload.files.forEach((picFile, picIndex) => {
        formData.append(`comment[damageTech_cmt_payload][files][${picIndex}]`, picFile);
      });
      this.damageTech_cmt_payload.files.forEach((file, fileIndex) => {
        formData.append(`comment[damageTech_cmt_payload][files][${fileIndex}]`, file);
      });
      this.add_comment_in_profile_group_action({
        comment: formData,
        damage: this.selectedDamage_comp
      })
        .then((resolve) => {
          console.log("this.selectedDamage_comp :", this.selectedDamage_comp);
          this.$emit("hideLoading");
          this.scrollToBottom();
          swal("Comment has been sent!", "success", "success");
          // Reset after send
          this.damageTech_cmt_payload.comment = "";
          this.damageTech_cmt_payload.files = [];
          this.damageTech_cmt_payload.files = [];
        })
        .catch(() => {
          this.$emit("hideLoading");
          this.scrollToBottom();
          swal("Error", "", "error");
        });
    },
    getColor__(comment, comments) {
      const status = comment.status?.toLocaleUpperCase();
      // Color map for statuses
      const colorMap = {
        'REJECT': 'rgb(255 233 233)', // red
        'RESOLVED': 'rgb(255 229 201)', // orange
        'CLOSING': 'rgb(234 237 255)', // blue
        'DECLARATION': 'rgb(255 233 233)', // grey (optional, you can adjust)
      };
      // If it's a direct action status, return its color
      if (status === 'REJECT') return colorMap['REJECT'];
      if (status === 'RESOLVED') return colorMap['RESOLVED'];
      if (status === 'CLOSING') return colorMap['CLOSING'];
      if (status === 'DECLARATION') return colorMap['DECLARATION'];
      // For 'description', find the last action status before this comment
      if (status === 'DESCRIPTION') {
        // Find the index of this comment
        const idx = comments.findIndex(c => c.id === comment.id);
        // Look backwards for the last action status
        for (let i = idx - 1; i >= 0; i--) {
          const prevStatus = comments[i].status?.toLocaleUpperCase();
          if (colorMap[prevStatus]) {
            return colorMap[prevStatus];
          }
        }
        // If not found, fallback color
        return 'rgb(234 237 255)';
      }
      // Default color
      return 'rgb(234 237 255)';
    },
    getStatusIcon(comment) {
      const status = comment.status?.toLocaleUpperCase();
      if (status === 'RESOLVED') return 'mdi-tools  '; // F1064
      if (status === 'REJECT' ) return 'mdi-eye-refresh-outline'; // F05E1
      if (status === 'DECLARATION') return 'mdi-lightbulb-alert'; // F05E1
      if (status === 'CLOSING') return 'mdi-check-circle-outline'; // F05E1
      if (status === 'DESCRIPTION') return 'mdi-comment'; // F05E1
      return 'mdi-account-circle'; // default
    },
    getStatusColor(comment) {
      const status = comment.status?.toLocaleUpperCase();
      if (status === 'RESOLVED') return '#fb8500'; // orange
      if (status === 'REJECT' || status === 'DECLARATION') return '#d43737'; // red
      if (status === 'CLOSING') return '#110d41'; // blue
      if (status === 'DESCRIPTION') return '#1976d2'; // fallback for description
      return '#1976d2'; // default (blue)
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
    downloadPreviewImg() {
      const a = document.createElement('a');
      a.href = this.previewImgSrc;
      a.download = this.previewImgName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    downloadFile(file) {
      if (!file) return;
      let url = '';
      let filename = '';
      if (file.filename) {
        url = this.getPhotoUrl(file.filename);
        filename = file.filename;
      } else if (file.name) {
        url = URL.createObjectURL(file);
        filename = file.name;
      } else {
        return;
      }
      // If image, open in new tab
      const extension = (file.extension || filename.split('.').pop()).toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)) {
        window.open(url, '_blank');
        return;
      }
      // If remote file, use direct link to bypass CORS fetch
      if (url.startsWith('http')) {
        const a = document.createElement('a');
        a.href = url;
        
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // For local files
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (file.name) URL.revokeObjectURL(url);
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.commentsContainer;
        if (container && container.$el) {
          container.$el.scrollTop = container.$el.scrollHeight;
        } else if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
  },
};
</script>

<style scoped>
.menu-list-item {
  display: flex;
  align-items: center;
  transition: background 0.2s;
}

.menu-list-item .plus-hover-icon {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
}

.menu-list-item:hover .plus-hover-icon {
  opacity: 1;
}

.menu-list-item .v-list-item-title {
  flex: 1;
}

.comment-photos {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.comment-photo {
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.comment-photo:hover {
  transform: scale(1.05);
}
</style>
