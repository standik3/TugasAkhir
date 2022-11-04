<template>
  <q-page class="full-width">
      <q-form @submit="addFriend">
        <q-input
          outlined
          class="q-mb-md"
          v-model="formData.emailadd"
          type="email"
          label="(Isi jika add by email)"
        />
        <q-input
          outlined
          class="q-mb-md"
          v-model="formData.phoneadd"
          type="number"
          label="(Isi jika add by phone number)"
        />
        <div class="row">
          <q-btn
          class="full-width"
          color="primary"
          type="submit"
          label="ADD FRIEND" />
        </div>
      </q-form>
      <q-list
          class="full-width"
          separator>
          <q-item
            v-for="users in this.dataFriend"
            :key="users.id"
            v-ripple>
            <q-avatar color="primary" text-color="white">
                {{ users.displayName.charAt(0) }}
              </q-avatar>
            <q-item-section>
              <!-- <q-item-label>{{ users.displayName }}</q-item-label> -->
              <q-item-label>{{ users.displayName }}<br><q-badge :color="users.online ? 'light-green-5' : 'grey-4'">
                {{ users.online ? 'Online' : 'Offline' }}</q-badge></q-item-label>
            </q-item-section>
            <q-btn @click="goChat(users.userUID)">chat</q-btn>
          </q-item>
        </q-list>
  </q-page>
</template>
  <script>
  import { useAuth } from '@vueuse/firebase/useAuth'
  import { doc, setDoc, updateDoc } from "firebase/firestore";
  import { useQuasar } from 'quasar'
  import { getAuth } from "firebase/auth";
  import { app, db , getFriend,getCities } from 'boot/firebase'
  const { user } = useAuth(getAuth(app));
  export default ({
    props:[
      'passingData'
    ],
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
        dataFriend: this.passingData
      }
    },
    methods: {
      goChat(uid){
        console.log("CHAT with :",uid);
      },
      async addFriend(){
        var aemail = this.formData.emailadd;
        var aphone = this.formData.phoneadd;
        if(aemail.trim()&&aphone.trim()){
          this.triggerNegative("Harap MENGISI SALAH SATU SAJA")
        }else if(aemail.trim()){
          var datausertemp=[];
          var datafriendtemp=[];
          var uidFriendup="";
          var uidUserup="";
          var cekuser = false;
          await getCities(db).then((response)=>{
            response.forEach(element => {
              if(element.email == user.value.email){
                datausertemp = element.friendwith;
                uidUserup = element.userUID;
              }
              if(element.email==aemail && element.email != user.value.email){
                datafriendtemp = element.friendwith;
                uidFriendup = element.userUID;
                cekuser=true;
              }
            });
          }).catch((error)=>{
            console.log(error);
          });
          if(!cekuser){
            console.log("TIDAK ADA")
          }else{
            var addedfriend = false;
            datausertemp.forEach(elem=>{
              if(elem == uidFriendup){
                addedfriend =true;
              }
            })
            if(!addedfriend){
              datausertemp.push(uidFriendup);
              datafriendtemp.push(uidUserup);
              let washingtonRef = doc(db, "users", uidUserup);
              updateDoc(washingtonRef, {
                friendwith: datausertemp
              }).then(() => {
                  console.log("Friendwith user successfully updated!");
              })
              .catch((error) => {
                  // The document probably doesn't exist.
                  console.error("Error updating document: ", error);
              });
              washingtonRef = doc(db, "users", uidFriendup);
              updateDoc(washingtonRef, {
                friendwith: datafriendtemp
              }).then(() => {
                  console.log("Friendwith friend successfully updated!");
              })
              .catch((error) => {
                  // The document probably doesn't exist.
                  console.error("Error updating document: ", error);
              });
            }else{
              console.log("Sudah berteman");
            }
          }
        }else if(aphone.trim()){

          this.triggerNegative("PHONE TERISI")
        }

        this.formData.emailadd = "";
        this.formData.phoneadd = "";
        this.getData();
      },
      async getData() {
        await getFriend(db).then((response)=>{
          var datafriendtemp = [];
          var finaltemp=[];
          response.forEach(element=>{
            if(element.email == user.value.email){
              datafriendtemp = element.friendwith;
            }
          })
          datafriendtemp.forEach(elemen=>{
            response.forEach(element => {
              if(element.userUID == elemen){
                finaltemp.push(element);
              }
            });
          })
          // console.log("DATA FRIEND:\n",finaltemp);
          this.dataFriend = finaltemp;
        })
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
            timeout: 30
          })
        }
      }
    },
  })
  </script>

  <style>

  </style>
