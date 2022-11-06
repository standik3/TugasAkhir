<template>
<q-page >
  <q-form @submit="submitForm" v-if="!admincheck">
    <q-input
      v-if="tab == 'register'"
      outlined
      class="q-mb-md"
      v-model="formData.name"
      label="Nama"
    />
    <q-input
      v-if="tab == 'register'"
      outlined
      class="q-mb-md"
      v-model="formData.phone"
      type="number"
      label="Phone Number"
    />
    <q-input
      outlined
      class="q-mb-md"
      v-model="formData.email"
      type="email"
      label="Email"
    />
    <q-input
      outlined
      class="q-mb-md"
      v-model="formData.password"
      type="password"
      label="Password"
    />
    <div class="row">
      <q-btn
      class="full-width"
      color="primary"
      type="submit"
      :label="tab" />
    </div>
  </q-form>
  <q-form @submit="submitAdmin" v-else>
    <q-input
      outlined
      class="q-mb-md"
      v-model="formData.adminid"
      type="text"
      label="Id Admin"
    />
    <q-input
      outlined
      class="q-mb-md"
      v-model="formData.passwordadmin"
      type="password"
      label="Password Admin"
    />
    <div class="row">
      <q-space></q-space>
      <q-btn
      class="full-width"
      color="primary"
      type="submit"
      label="ADMIN LOGIN" />
    </div>
  </q-form>
  <img style="width:50px ;height: 50px;" src="public/icons/Google-PNG-Clipart.png" @click="signInGoogle"/>
  <img style="width:50px ;height: 50px;  float: right;" src="public/icons/download.jpeg" @click="admin"/>
</q-page>
</template>
<script>
import { app, db, auth } from 'boot/firebase'
import { useAuth } from '@vueuse/firebase/useAuth'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword , signOut ,GoogleAuthProvider ,signInWithPopup,signInAnonymously} from "firebase/auth";
import { useQuasar } from 'quasar'
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getCities} from 'boot/firebase'
import { isAdmin } from '@firebase/util';
const {isAuthenticated, user} = useAuth(auth);
export default {
props : ['tab'],
data() {
  return {
    formData:{
      name:'Tester',
      phone: '123456789012',
      email:'tester@gmail.com',
      password:'123456',
      passwordadmin:'admin',
      adminid:'admin'
    },isAuthenticated, user,admincheck: false,adminloggedin: undefined,dataUser:undefined
  }
},
methods: {
  submitAdmin(){
    var idAdmin = this.formData.adminid;
    var passAdmin = this.formData.passwordadmin;
    if(idAdmin.trim()&&passAdmin.trim()){
      if(idAdmin=="admin" && passAdmin=="admin"){
        this.adminloggedin = true;
        signInAnonymously(auth)
      .then(() => {
        // Signed in..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
      }else{
        this.adminloggedin = false;
        console.log(this.adminloggedin);
      }
    }
  },
  async submitForm(){
    var temail = this.formData.email;
    var tphone = this.formData.phone;
    var tpass = this.formData.password;
    var tname = this.formData.name;
    if(this.tab == 'login'){
      if(!temail.trim()||!tpass.trim()){
        console.log("Harus isi")
      }else{
        var akundisabled = false;
        await getCities(db).then((response)=>{
          response.forEach(element => {
            if(element.email==temail){
              akundisabled = element.disabled
            }
          });
        }).catch((error)=>{
          console.log(error);
        });
        if(!akundisabled){
          signInWithEmailAndPassword(auth, temail, tpass)
          .then((userCredential) => {
            // Signed in
            const userC = userCredential.user;
            const washingtonRef = doc(db, "users", userC.uid);
            updateDoc(washingtonRef, {
              online: true
            }).then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            this.triggerNegative(errorMessage)
          });
        }else{
          this.triggerNegative("AKUN TELAH DI BLOKIR ADMIN")
        }
      }
    }else{
      if(!temail.trim()||!tpass.trim()||!tname.trim()||!tphone.trim()){
        console.log("Harus isi")
      }else{
        createUserWithEmailAndPassword(auth, temail, tpass)
          .then((userCredential) => {
            // Signed in
            const userC = userCredential.user;
            setDoc(doc(db, "users", userC.uid), {
              emailVerified: true,
              photoURL: '',
              disabled: false,
              displayName: tname,
              email: temail,
              emailVerified: false,
              password: tpass,
              online: false,
              friendwith: [],
              group: [],
              reportedby: [],
              phoneNumber: tphone,
              userUID:userC.uid
            }).then(() => {
                console.log("Document successfully created!");
                signOut(auth).then(() => {
                  // Sign-out successful.
                }).catch((error) => {
                  // An error happened.
                });
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
            this.triggerPositive();
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            this.triggerNegative(errorMessage)
            // ..
          });
      }
    }
  },
  signInGoogle(){
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const userR = result.user;
      // console.log("DATA USER :",userR);
      setDoc(doc(db, "users", userR.uid), {
          displayName: userR.displayName,
          email: userR.email,
          emailVerified: userR.emailVerified,
          password: "",
          online: true,
          friendwith: [],
          group: [],
          reportedby: [],
          phoneNumber: userR.phoneNumber,
          photoURL: userR.photoURL,
          disabled: false,
          userUID:userR.uid
        }).then(() => {
            console.log("Data Google Sign masuk DB");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
    console.log("google");
  },
  admin(){
    if(this.admincheck){
      this.admincheck = false;
    }else{
      this.admincheck = true;
    }
    console.log("ADMIN CHECK :",this.admincheck);
  }
},
setup(){
  const $q = useQuasar();
  return{
    triggerPositive(){
      $q.notify({
        type: 'positive',
        message: 'Berhasil Register!!',
        timeout: 10
      })
    },
    triggerNegative(errorMessage){
      $q.notify({
        type: 'negative',
        message: errorMessage,
        timeout: 10
      })
    }
  }
}
}
</script>
<style>
</style>
