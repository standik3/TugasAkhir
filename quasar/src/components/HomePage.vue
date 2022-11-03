<template>
  <q-page class="full-width">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto'>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <q-tabs v-model="tab" class="full-width">
      <q-tab name="mails" class="full-width" icon="mail" label=""/>
      <q-tab name="friend" class="full-width" icon="person" label=""/>
      <q-tab name="grup" class="full-width" icon="people" label=""/>
      <q-tab name="profile" class="full-width" icon="account_circle" label=""/>
    </q-tabs>
    <q-list v-if="tab == 'mails'" class="full-width" separator>

    </q-list>
    <q-list v-if="tab == 'profile'" class="full-width" separator>
      <q-form @submit="editProfile">
        <div class="w3-white w3-text-grey w3-card-4">
          <img src="public/icons/avatar1.jpeg" style="width:100%" alt="Avatar">
          <div class="w3-container">
            <p><i class="fa fa-envelope fa-fw w3-margin-right w3-large w3-text-teal"></i>: {{user.email}}</p>
            <p> <i class="fa fa-user-circle fa-fw w3-margin-right w3-large w3-text-teal"></i>: {{user.name}}</p>
            <q-input
              outlined
              class="q-mb-md"
              v-model="formData.name"
              label="(Isi Jika ingin Update Nama)"
            />
            <p><i class="fa fa-phone fa-fw w3-margin-right w3-large w3-text-teal"></i>: {{user.phoneNumber}}</p>
            <q-input
              outlined
              class="q-mb-md"
              v-model="formData.phone"
              type="number"
              label="(Isi Jika ingin Update Phone Number)"
            />
            <q-input
              outlined
              class="q-mb-md"
              v-model="formData.password"
              type="text"
              label="(Isi Jika ingin Update Password)"
            />
          </div>
        </div>
        <div class="row">
          <q-space></q-space>
          <q-btn
          class="full-width"
          color="primary"
          type="submit"
          label="Edit Profile" />
        </div>
      </q-form>
    </q-list>
    <q-list v-if="tab == 'friend'" class="full-width" separator>
      <q-form @submit="addFriend">
        <q-input
          outlined
          class="q-mb-md"
          v-model="formData.emailadd"
          type="email"
          label="(Masukkan email)"
        />
        <q-input
          outlined
          class="q-mb-md"
          v-model="formData.phoneadd"
          type="number"
          label="(Masukkan nomor telepon)"
        />
        <div class="row">
          <q-btn
          class="full-width"
          color="primary"
          type="submit"
          label="ADD FRIEND" />
        </div>
      </q-form>
      <q-list>
       LIST SEMUA FRIEND : <br>
      </q-list>
    </q-list>
    <q-list v-if="tab == 'grup'" class="full-width" separator>
      <q-form @submit="addGroup">
        <q-input
          outlined
          class="q-mb-md"
          v-model="formData.grupcode"
          type="text"
          label="(Masukkan Code Grup/Nama grup)"
        />
        <div class="row">
          <q-btn
          class="full-width"
          color="primary"
          type="submit"
          label="Join" />
        </div>
      </q-form>
      <q-btn color="primary" class="full-width" @click="createGroup">CREATE</q-btn>
      <q-list>
       LIST SEMUA GRUP KU : <br>
      </q-list>
    </q-list>
  </q-page>
  </template>
  <script>
  import { ref }  from 'vue';
  import { useAuth } from '@vueuse/firebase/useAuth'
  import { useQuasar } from 'quasar'
  import { getAuth } from "firebase/auth";
  import { app, db, auth , getCities} from 'boot/firebase'
  import { doc, setDoc, updateDoc } from "firebase/firestore";
  import { collection, query, where,getDocs  } from "firebase/firestore";
  const { isAuthenticated, user } = useAuth(getAuth(app));
  export default ({
    data() {
      return {
        formData:{
          name:'',
          phone: '',
          email:'',
          password:'',
          emailadd:'',
          phoneadd:'',
          grupcode:''
        },
      }
    },
    methods: {

      editProfile(){
        var tphone = this.formData.phone;
        var tpass = this.formData.password;
        var tname = this.formData.name;
        const washingtonRef = doc(db, "users", user.value.uid);
        if(tphone.trim()){
          updateDoc(washingtonRef, {
            phoneNumber: tphone
          }).then(() => {
              this.triggerPositive("Update Berhasil");
          })
          .catch((error) => {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
          });
        }if(tpass.trim()){
          updateDoc(washingtonRef, {
            password: tpass
          }).then(() => {
              console.log("password successfully updated!");
              this.triggerPositive("Update Berhasil");
          })
          .catch((error) => {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
          });
        }if(tname.trim()){
          updateDoc(washingtonRef, {
            displayName: tname
          }).then(() => {
              console.log("name successfully updated!");
              this.triggerPositive("Update Berhasil");
          })
          .catch((error) => {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
          });
        }
        this.formData.phone = "";
        this.formData.password = "";
        this.formData.name = "";
      },
      addFriend(){
        var aemail = this.formData.emailadd;
        var aphone = this.formData.phoneadd;
        console.log(aemail,aphone);
        // const washingtonRef = doc(db, "users", user.value.uid);
        //   updateDoc(washingtonRef, {
        //     phoneNumber: tphone
        //   }).then(() => {
        //       console.log("phone successfully updated!");
        //   })
        //   .catch((error) => {
        //       // The document probably doesn't exist.
        //       console.error("Error updating document: ", error);
        //   });
        this.formData.emailadd = "";
        this.formData.phoneadd = "";
      },
      addGroup(){
        var agrup = this.formData.grupcode;
        console.log(agrup);
        // const washingtonRef = doc(db, "users", user.value.uid);
        //   updateDoc(washingtonRef, {
        //     phoneNumber: tphone
        //   }).then(() => {
        //       console.log("phone successfully updated!");
        //   })
        //   .catch((error) => {
        //       // The document probably doesn't exist.
        //       console.error("Error updating document: ", error);
        //   });
        this.formData.grupcode = "";
      },
      randomNumber : function(){
        return Math.floor(Math.random() * (19 - 1 + 1)) + 1;
      },
      createGroup(){
        var substr1 = this.randomNumber();
        var substr2 = substr1 + 8;
        var codegrup = user.value.uid.substring(substr1,substr2);
        var namagrup = this.formData.grupcode;
        if(!namagrup.trim()){
          this.triggerNegative("NAMA GRUP TIDAK BOLEH KOSONG");
        }else{
          // setDoc(doc(db, "group", namagrup), {
          //   groupcode:codegrup,
          //   groupname:namagrup,
          //   owner: user.value.email,
          //   memberid:[user.value.uid],
          //   chat:[],
          //   chatby:[]
          // }).then(() => {
          //   this.triggerPositive("GROUP BERHASIL DIBUAT");
          // })
          // .catch((error) => {
          //   this.triggerPositive("GROUP GAGAL DIBUAT");
          // });
        }
        this.formData.grupcode = "";
      }
    },
    setup() {
      const tab = ref('mails');
      const $q = useQuasar();
      const dataUsers = getCities(db);
      console.log("data user : ",dataUsers)
      return{
        tab,isAuthenticated, user,
        triggerPositive(errorMessage){
          $q.notify({
            type: 'positive',
            message: errorMessage,
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
    },
  })
  </script>

  <style>

  </style>
