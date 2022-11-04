<template>
  <!-- <Suspense>
    <template #fallback>
      Loading
    </template> -->
    <!-- <template #default> -->
<q-page class="full-width">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto'>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <q-form @submit="editProfile">
        <div class="w3-white w3-text-grey w3-card-4">
          <q-item-section class="flex-center bg-grey-3" avatar>
            <q-avatar class="text-center" size="1000%" color="primary" text-color="white">
              {{ this.dataUser.displayName.charAt(0) }}
            </q-avatar>
          </q-item-section>
          <div class="w3-container bg-grey-3">
            <p> <i class="fa fa-user-circle fa-fw w3-margin-right w3-large w3-text-teal"></i>: {{this.dataUser.displayName}}</p>
            <p><i class="fa fa-envelope fa-fw w3-margin-right w3-large w3-text-teal"></i>: {{this.dataUser.email}}</p>
            <p><i class="fa fa-phone fa-fw w3-margin-right w3-large w3-text-teal"></i>: {{this.dataUser.phoneNumber}}</p>
            <q-input
              outlined
              class="q-mb-md"
              v-model="formData.name"
              label="(Isi Jika ingin Update Nama)"
            />
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
</q-page>
    <!-- </template>
  </Suspense> -->
</template>
  <script>
  import { useAuth } from '@vueuse/firebase/useAuth'
  import { useQuasar } from 'quasar'
  import { getAuth } from "firebase/auth";
  import { app, db , getCities } from 'boot/firebase'
  import { doc, updateDoc } from "firebase/firestore";
  const { user } = useAuth(getAuth(app));
  export default ({
    props:[
      'passingData'
    ],
    data(){
      return{
        formData:{
          name:'',
          phone: '',
          password:'',
        },
        dataUser: this.passingData,
      }
    },
    methods: {
      async editProfile(){
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
        this.getData();
      },
      async getData() {
       await getCities(db).then((response)=>{
          // console.log("aaa", response);
          response.forEach(element => {
            if(element.email==user.value.email){
              this.dataUser = element;
            }
          });
          // console.log("data user \n",this.dataUser);
        }).catch((error)=>{
          console.log(error);
        });
      },
    },
    created() {
      this.getData();
    },
    setup() {
      const $q = useQuasar();
      return{
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
