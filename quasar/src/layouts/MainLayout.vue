<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
         217116574
        </q-toolbar-title>
        <q-btn v-if="isAuthenticated" flat @click="logOut" round dense icon="logout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useAuth } from '@vueuse/firebase/useAuth'
import { getAuth, signOut ,deleteUser } from "firebase/auth";
import { app, db, auth } from 'boot/firebase'
import { doc, updateDoc } from "firebase/firestore";
import { openURL } from 'quasar'
import { ref } from 'vue'

const menuList = [
  {
    icon: 'inbox',
    label: 'Inbox',
    separator: true
  }
]

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
        if(user.value.email==null){
          deleteUser(auth.currentUser).then(() => {
            // User deleted.
            console.log("DELETED");
          }).catch((error) => {
            // An error ocurred
            // ...
          });
        }
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
      isAuthenticated, user,logOut,goProfile,
      drawer: ref(false),
      menuList

    }
  },
})
</script>
<style>

</style>
