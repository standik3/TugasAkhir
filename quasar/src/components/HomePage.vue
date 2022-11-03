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
    <q-list v-if="tab == 'mails'" class="full-width" separator>

    </q-list>
    <q-list v-if="tab == 'profile'" class="full-width" separator>

      <q-form @submit="editProfile">
        <div class="w3-white w3-text-grey w3-card-4">
          <q-item-section class="flex-center bg-grey-3" avatar>
            <q-avatar class="text-center" size="1000%" color="primary" text-color="white">
              {{ this.dataUser.displayName.charAt(0) }}
            </q-avatar>
          </q-item-section>
          <div class="w3-container bg-grey-3">
            <!-- {{ this.dataUser }} -->
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
      <q-list
          class="full-width"
          separator>
          <q-item
            v-for="users in this.dataFriend"
            :key="users.id"
            clickable
            v-ripple>
            <q-avatar color="primary" text-color="white">
                {{ users.displayName.charAt(0) }}
              </q-avatar>
            <q-item-section>
              <!-- <q-item-label>{{ users.displayName }}</q-item-label> -->
              <q-item-label>{{ users.email }}</q-item-label>
              <!-- <q-item-label>{{ users.phoneNumber }}</q-item-label> -->
            </q-item-section>
          </q-item>
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
          <q-list
            class="full-width"
            separator>
            <q-item
              v-for="group in this.dataGrup"
              :key="group.id"
              clickable
              v-ripple>
              <q-avatar icon="people" color="primary"/><br>
              <q-item-section>
                <q-item-label>{{ group.groupname }}</q-item-label>
                <q-item-label>Member : {{ group.memberid.length }} orang</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
    </q-list>
    <q-tabs v-model="tab" class="absolute-bottom">
      <q-tab name="mails" class="full-width" icon="mail" label="Chat"/>
      <q-tab name="friend" class="full-width" icon="person" label="Friend"/>
      <q-tab name="grup" class="full-width" icon="people" label="Group"/>
      <q-tab name="profile" class="full-width" icon="account_circle" label="Profile"/>
    </q-tabs>
</q-page>
    <!-- </template>
  </Suspense> -->
</template>
  <script>
  import { ref }  from 'vue';
  import { useAuth } from '@vueuse/firebase/useAuth'
  import { useQuasar } from 'quasar'
  import { getAuth } from "firebase/auth";
  import { app, db, auth , getCities,getGroup , getFriend,getRuleBot} from 'boot/firebase'
  import { doc, setDoc, updateDoc } from "firebase/firestore";
  import { collection, query, where, onSnapshot } from "firebase/firestore";
  const { isAuthenticated, user } = useAuth(getAuth(app));
  const unsubscribe = null;
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
        dataUser: undefined,
        dataGrup: undefined,
        dataFriend: undefined
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
      },
      addFriend(){
        var aemail = this.formData.emailadd;
        var aphone = this.formData.phoneadd;
        // console.log(aemail,aphone);
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
      async addGroup(){
        var agrup = this.formData.grupcode;
        var cekCodeAda = false;
        var membertemp=[];
        var finaltemp=[];
        await getGroup(db).then((response)=>{
          response.forEach(element=>{
            if(element.groupcode == agrup){
              cekCodeAda = true;
              membertemp = element.memberid;
            }
          })
          if(cekCodeAda){
            var sudahdaftar = false
            membertemp.forEach(element=>{
              if(element == user.value.uid){
                sudahdaftar = true;
              }
            })
            if(sudahdaftar){
              this.triggerNegative("Sudah Join Grup!")
            }else{
              membertemp.forEach(element => {
                finaltemp.push(element);
              });
              finaltemp.push(user.value.uid);
              const washingtonRef = doc(db, "group", agrup);
              updateDoc(washingtonRef, {
                memberid: finaltemp
              }).then(() => {
                  console.log("group successfully updated!");
              })
              .catch((error) => {
                  // The document probably doesn't exist.
                  console.error("Error updating document: ", error);
              });
              this.triggerPositive("GROUP JOINED")
            }
          }else{
            this.triggerNegative("Group tidak terdaftar");
          }
        })
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
          setDoc(doc(db, "group", codegrup), {
            groupcode:codegrup,
            groupname:namagrup,
            owner: user.value.email,
            memberid:[user.value.uid],
            chat:[],
            chatby:[]
          }).then(() => {
            this.triggerPositive("GROUP BERHASIL DIBUAT");
          })
          .catch((error) => {
            this.triggerPositive("GROUP GAGAL DIBUAT");
          });
        }
        this.formData.grupcode = "";
      },
      async getData() {
        await getRuleBot(db).then((response)=>{
          console.log(response);
          // response.forEach(element=>{

          // })
        })
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
        await getGroup(db).then((response)=>{
          var datamember = [];
          var datagrupsaya=[];
          response.forEach(element => {
              datamember = element.memberid;
              datamember.forEach(elementmember => {
                if(elementmember == user.value.uid){
                  datagrupsaya.push(element);
                }
              });
          });
          this.dataGrup = datagrupsaya
          // console.log("data grup:\n",this.dataGrup);
        }).catch((error)=>{
          console.log(error);
        })
      },
    },
    created() {
      this.getData();
    },
    setup() {
      const tab = ref('mails');
      const userschange = ref([]);
      const $q = useQuasar();
      const que = query(collection(db, "users"));
      const unsubscribe = onSnapshot(que, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
              console.log("New User:", change.doc.data());
              // userschange.value = [...userschange.value,change.doc.data()]
          }
          if (change.type === "modified") {
              console.log("Modified User: ", change.doc.data());
              // userschange.value = userschange.value.map(usertemp =>{
              //   usertemp.uid === change.doc.data().uid
              //   ? {...usertemp,state: change.doc.data.state}
              //   :usertemp
              // })
          }
          if (change.type === "removed") {
              console.log("Removed user ", change.doc.data());
          }
        });
      });
      return{
        tab,isAuthenticated,unsubscribe,
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
