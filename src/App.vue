<template>
  <v-card @mousemove="resetTimer" v-if="logged" class="mx-auto overflow-hidden">
    <TimeoutLOgin
      :changeLoginValueToFalse="changeLoginValueToFalse"
      v-if="timeOutLogin"
    />
    <v-app-bar color="#fff" style="border-bottom: 2px solid #002f6c">
      <v-app-bar-nav-icon
        v-if="this.fonction != 'DRIVER'"
        @click="drawer = true"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>
        <v-img
          contain
          lazy-src="./assets/TangerAlliance.png"
          max-height="100"
          max-width="150"
          src="./assets/TangerAlliance.png"
        ></v-img>
      </v-toolbar-title>
      <h4 class="title">CHECKLIST</h4>
      <v-spacer></v-spacer>
      <template>
        <v-row justify="center">
          <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h5">New Password </span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="model.password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        hint="At least 8 characters"
                        counter
                        @click:append="show1 = !show1"
                        label="New password"
                        persistent-hint
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="Validpassword"
                        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show2 ? 'text' : 'password'"
                        name="input-10-1"
                        hint="At least 8 characters"
                        counter
                        @click:append="show2 = !show2"
                        label="Valider new password"
                        persistent-hint
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Close
                </v-btn>
                <v-btn color="blue darken-1" text @click="changepassword()">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </template>
      <div class="settingContainer">
        <h4 class="username">
          {{ getUserActive.lastName }} <br />{{ getUserActive.firstName }}
        </h4>

        <div class="text-center">
          <v-menu
            min-width="180px"
            rounded
            offset-y
            origin="center center"
            transition="scale-transition"
          >
            <template class="pa-2" v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on">
                <v-icon> mdi-account-cog </v-icon>
              </v-btn>
            </template>
            <v-list class="text-center">
              <div class="pa-4">
                <v-icon x-large>mdi-account-circle-outline</v-icon>
                <h4 class="text-uppercase title">
                  {{ getUserActive.username }}
                </h4>
              </div>
              <v-divider></v-divider>

              <div class="pa-8">
                <v-btn width="190px" @click="dialog = true">
                  <v-icon>mdi-lock</v-icon>
                  Change password
                </v-btn>
              </div>
              <div class="pa-8">
                <v-btn width="190px" @click="logout">
                  <v-icon>mdi-logout-variant</v-icon>
                  LOGOUT
                </v-btn>
              </div>
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      width="15em"
      style="background-color: #fff"
    >
      <v-list style="padding: 0px; align-items: center" nav dense>
        <v-list-item-group
          class="itemDrawer"
          active-class="deep-purple--text text--accent-4"
        >
          <br />
          <v-img
            contain
            lazy-src="./assets/TangerAlliance.png"
            max-height="220"
            max-width="250"
            src="./assets/TangerAlliance.png"
          ></v-img>

          <v-list
            v-if="
              department == 'TECHNIQUE' ||
              (department == 'OPERATIONS' && fonction != 'DRIVER')
            "
          >
            <v-list-item-group active-class="activeDrawer" class="itemDrawer">
              <router-link class="linktext" to="/technique">
                <div class="itemdrawer">
                  <v-list-item class="itemd"> Defects </v-list-item>
                </div>
              </router-link>
            </v-list-item-group>
          </v-list>

          <v-list class="" v-if="fonction == 'ADMIN'">
            <v-list-item-group active-class="activeDrawer" class="itemDrawer">
              <router-link class="linktext" to="/userGestion">
                <div class="itemdrawer">
                  <v-list-item class="itemd"> Gestion Users </v-list-item>
                </div>
              </router-link>
              <router-link class="linktext" to="/profile_groupe">
                <div class="itemdrawer">
                  <v-list-item class="itemd"> Equipment </v-list-item>
                </div>
              </router-link>
              <router-link class="linktext" to="/technique">
                <div class="itemdrawer">
                  <v-list-item class="itemd"> Technique </v-list-item>
                </div>
              </router-link>
            </v-list-item-group>
          </v-list>
          <v-list v-else-if="department == 'IT'" class="">
            <v-list-item-group active-class="activeDrawer" class="itemDrawer">
              <router-link class="linktext" to="/technique">
                <div class="itemdrawer">
                  <v-list-item class="itemd"> Technique </v-list-item>
                </div>
              </router-link>
            </v-list-item-group>
          </v-list>
          <v-list v-else-if="fonction == 'DRIVER'" class="foremanandTechnique">
            <v-list-item-group active-class="activeDrawer" class="itemDrawer">
              <router-link class="linktext" to="/Damage">
                <div class="itemdrawer">
                  <v-list-item class="itemd"> Damage </v-list-item>
                </div>
              </router-link>
            </v-list-item-group>
          </v-list>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app style="background-color: #fff">
      <router-view />
    </v-app>
  </v-card>
  <Login v-else />
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import swal from "sweetalert";
const Login = defineAsyncComponent(() => import("./View/Login.vue"));
const TimeoutLOgin = defineAsyncComponent(() =>
  import("../src/components/TimeoutLOgin.vue")
);
//import Login from "./View/Login.vue";
//import TimeoutLOgin from "../src/components/TimeoutLOgin.vue";

export default {
  components: {
    Login,
    TimeoutLOgin,
  },
  data() {
    return {
      shownForTheFirstTime: false,
      drawer: false,
      logged: false,
      dialogLogin: false,
      dialog: false,
      show1: false,
      show2: false,
      timeOutLogin: false,
      username: null,
      password: null,
      time: null,
      Validpassword: "",
      model: {
        id: 0,
        password: "",
      },
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        emailMatch: () => `The email and password you entered don't match`,
      },
      fonction: "",
      department: "",
      listDrawerChildRouter: [
        { id: 1, name: "User", ROUTE: "/userGestion" },
        { id: 2, name: "Damage", ROUTE: "/Damage" },
        { id: 3, name: "Equipment Profile ", ROUTE: "/profile_groupe" },
        { id: 4, name: "technique ", ROUTE: "/technique" },
        { id: 5, name: "Dashboard ", ROUTE: "/Dashboard" },
      ],
    };
  },
  mounted() {
    if (this.getUserActive == null) {
      this.logged = false;
    } else if (this.getUserActive != null) {
      this.fonction = this.getUserActive.fonction.name;
      this.department = this.getUserActive.fonction.department.name;
      this.logged = true;
    }
    /*  this.initialize();
    
    addEventListener('onmousemove', (event,time) => {
          clearTimeout(time);
          time = setTimeout(alert("You are now logged out."), 4000);
    }); */
  },
  computed: {
    ...mapGetters(["getUsers", "getUserActive"]),
  },
  watch: {},
  methods: {
    initialize() {
      this.inactivityTime();
    },
    logout() {
      localStorage.clear();
      this.$router.push({
        name: "Login",
      });
      window.location.reload();
    },
    changepassword() {
      this.model.id = this.getUserActive.id;
      if (this.model.password == this.Validpassword) {
        this.changePasswordAction(this.model).then(() => {
          swal("success", "Password has been changed successfully", "success");
          this.dialog = false;
        });
      } else {
        swal(
          "warning !!",
          "Please your password not matched with valide password!",
          "warning"
        );
      }
      //this.changePasswordAction().then(() => {});
    },
    changeLoginValueToFalse() {
      console.log("changeLoginValueToFalse ", this.timeOutLogin);
      this.timeOutLogin = false;
    },
    shownForTheFirstTimeValue() {
      return (this.shownForTheFirstTime = value);
    },
    setShownForTheFirstTimeValue(value) {
      console.log("value changeeeeeed");
      this.shownForTheFirstTime = value;
    },

    resetTimer() {
      clearTimeout(this.time);
      this.time = setTimeout(() => {
        this.timeOutLogin = true;
        localStorage.clear();
      }, 10 * 60 * 1000);
    },
    Login() {},

    ...mapActions(["changePasswordAction", "LoginAction"]),
  },
};
</script>
