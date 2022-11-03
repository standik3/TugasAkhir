<template>
  <q-form @submit="submitForm">
    <!-- <pre>{{isAuthenticated}}</pre> -->
    <!-- <pre>{{user}}</pre> -->
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
      <q-space></q-space>
      <q-btn
      class="full-width"
      color="primary"
      type="submit"
      :label="tab" />
    </div>
    
  </q-form>
</template>
<script>
import { app, db, auth } from 'boot/firebase'
import { useAuth } from '@vueuse/firebase/useAuth'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { useQuasar } from 'quasar'
import { doc, setDoc, updateDoc } from "firebase/firestore";
const {isAuthenticated, user} = useAuth(auth);
export default {
props : ['tab'],
data() {
  return {
    formData:{
      name:'Tester',
      phone: '081234567890',
      email:'tester@gmail.com',
      password:'123456',
    },isAuthenticated, user
  }
},
methods: {
  submitForm(){
    var temail = this.formData.email;
    var tphone = this.formData.phone;
    var tpass = this.formData.password;
    var tname = this.formData.name;
    if(this.tab == 'login'){
      if(!temail.trim()||!tpass.trim()){
        console.log("Harus isi")
      }else{
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
              displayName: tname,
              email: temail,
              emailVerified: false,
              password: tpass,
              online: false,
              friendwith: [],
              group: [],
              reportedby: [],
              phoneNumber: tphone
            }).then(() => {
                console.log("Document successfully created!");
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
  }
  // signInGoogle(){
  //   const provider = new GoogleAuthProvider();
  //   signInWithPopup(auth, provider)
  //   .then((result) => {
  //     // This gives you a Google Access Token. You can use it to access the Google API.
  //     const credential = GoogleAuthProvider.credentialFromResult(result);
  //     const token = credential.accessToken;
  //     const userR = result.user;
  //     setDoc(doc(db, "users", userR.uid), {
  //         displayName: userR.displayName,
  //         email: userR.email,
  //         emailVerified: true,
  //         password: "xxxxxxxx",
  //         online: true,
  //         friendwith: [],
  //         group: [],
  //         reportedby: [],
  //         phoneNumber: ""
  //       }).then(() => {
  //           console.log("Data Google Sign masuk DB");
  //       })
  //       .catch((error) => {
  //           // The document probably doesn't exist.
  //           console.error("Error updating document: ", error);
  //       });
  //     // ...
  //   }).catch((error) => {
  //     // Handle Errors here.
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // The email of the user's account used.
  //     const email = error.customData.email;
  //     // The AuthCredential type that was used.
  //     const credential = GoogleAuthProvider.credentialFromError(error);
  //     // ...
  //   });
  //   console.log("google");
  // }
},setup(){
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
