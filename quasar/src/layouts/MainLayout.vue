<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-avatar v-if="isAuthenticated" @click="goProfile" icon="account_circle" color="primary"/>
        <q-toolbar-title>
         217116574
        </q-toolbar-title>
        <div>
          <q-btn color="negative" v-if="isAuthenticated" @click="logOut">Logout<br>{{user.email}}</q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useAuth } from '@vueuse/firebase/useAuth'
import { getAuth, signOut } from "firebase/auth";
import { app, db, auth } from 'boot/firebase'
import { doc, updateDoc } from "firebase/firestore";
import { openURL } from 'quasar'
export default ({
  name: 'MainLayout',

  methods: {

  },

  setup () {
    const {isAuthenticated, user} = useAuth(auth);
    const goProfile = async() => {
      console.log("PROFILE");
    }
    const logOut = async() => {
      try {
        const washingtonRef = doc(db, "users", user.value.uid);
         updateDoc(washingtonRef, {
            online: false
          }).then(() => {
              console.log("Document successfully updated!");
          })
          .catch((error) => {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
          });
        signOut(auth).then(() => {
          // Sign-out successful
          console.log('Logged out');
        }).catch((error) => {
          // An error happened.
        });
      } catch (error) {

      }
    }
    return {
      isAuthenticated, user,logOut,goProfile
    }
  },
  mounted(){
    (function(d, m){
        var kommunicateSettings =
            {"appId":"3acdf5b325460e4e11b4b34c3d56b6fcf","popupWidget":true,"automaticChatOpenOnNavigation":true};
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
      /* NOTE : Use web server to view HTML files as real-time update will not work if you directly open the HTML file in the browser. */
  }
})
</script>
<style>

</style>
