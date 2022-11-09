<template>
  <q-page class="full-width">
    <q-page v-if="isChatted">
      <q-btn @click="goBack" label="<- BACK" />
      CHAT WITH {{userchatwith}}
      <div class="q-pa-md row justify-center">
        <div style="width: 100%; max-width: 400px">
          <q-chat-message
            v-for="chat in dataChat" :key="chat.id"
              :name="chat.sender === user.uid  ? user.email : userchatwith"
              :text="[chat.pesan]"
              :sent="chat.sender === user.uid"
           />
        </div>
      </div>
      <q-footer>
          <q-form @submit="sendMessage">
            <q-toolbar class="bg-grey-3 text-black row">
            <q-btn round flat icon="insert_emoticon" class="q-mr-sm" />
            <q-input rounded outlined dense class="WAL__field col-grow q-mr-sm" bg-color="white" v-model="formData.message" placeholder="Type a message" />
            <q-btn round flat icon="send" type="submit"/>
          </q-toolbar>
          </q-form>
        </q-footer>
    </q-page>
      <q-page v-else>
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
            <q-btn @click="goReport(users.userUID)">report</q-btn>
          </q-item>
      </q-list>
      </q-page>
  </q-page>
</template>
  <script>
  import { useAuth } from '@vueuse/firebase/useAuth'
  import { ref } from 'vue';
  import { doc, setDoc, updateDoc } from "firebase/firestore";
  import { useQuasar } from 'quasar'
  import { getAuth } from "firebase/auth";
  import { app, db , getFriend,getCities,getChat } from 'boot/firebase'
  import { collection, query, where, onSnapshot } from "firebase/firestore";
  // import ChatActiveDIV from 'src/components/ChatActive.vue';
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
          grupcode:'',
          message:''
        },
        dataFriend: this.passingData,
        isChatted:false,dataChat:undefined,
        uidchatwith:undefined,user,
        userchatwith:undefined,unsubscribechat:undefined,unsubscribefriend:undefined
      }
    },
    components:{
      // ChatActiveDIV,
    },
    methods: {
      async goReport(uidreport){
        await getCities(db).then((response)=>{
          var tempreport = [];
          var sudahreport = false;
          response.forEach(element => {
            if(element.userUID == uidreport){
              tempreport = element.reportedby
            }
          });
          tempreport.forEach(element=>{
            if(element==user.value.uid){
              sudahreport=true;
            }
          })
          if(sudahreport){
            this.triggerNegative("ANDA SUDAH PERNAH REPORT")
          }else{
            tempreport.push(user.value.uid);
            let washingtonRef = doc(db, "users", uidreport);
            updateDoc(washingtonRef, {
              reportedby: tempreport
            }).then(() => {
                console.log("REPORTED user successfully updated!");
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
            this.triggerPositive("BERHASIL REPORT")
          }

        }).catch((error)=>{
          console.log(error);
        });

        this.getData();
      },
      goBack(){
        this.isChatted = false;
      },
      async goChat(uidchat){
        this.isChatted = true;
        this.uidchatwith = uidchat;
        await getCities(db).then((response)=>{
            response.forEach(element => {
              if(element.userUID == this.uidchatwith){
                this.userchatwith = element.email
              }
            });
          }).catch((error)=>{
            console.log(error);
          });
          await getChat(db).then((response)=>{
            response.forEach(element=>{
              if(element.receiver==user.value.uid && element.sender==uidchat){
                let washingtonRef = doc(db, "chats", element.idchat);
                updateDoc(washingtonRef, {
                  status: 'R'
                })
              }
            })
          })
        this.getData();
      },
      sendMessage(){
        try {
            var substr1 = Math.floor(Math.random() * (21 - 1 + 1)) + 1;
            var substr2 = substr1 +  6;
            var autogenerate = user.value.uid.substring(substr1,substr2) + this.uidchatwith.substring(substr1,substr2);
            var isipesan = this.formData.message;
            if(isipesan.trim()){
              setDoc(doc(db, "chats", autogenerate), {
                idchat:autogenerate,
                pesan:isipesan,
                date: new Date(),
                sender:user.value.uid,
                receiver: this.uidchatwith,
                status:'D'

              }).then(() => {
                console.log("BERHASIL CHAT");
              })
              .catch((error) => {
                console.log(error);
              });
            }
            this.formData.message = '';
            this.getData();
        } catch (error) {
          console.log(error);
        }
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
        const q = query(collection(db, "chats"));
        this.unsubscribechat = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              getChat(db).then((response)=>{
                  var finaltemp=[];
                  response.forEach(element=>{
                    if((element.sender==user.value.uid && element.receiver==this.uidchatwith)||(element.receiver==user.value.uid && element.sender==this.uidchatwith)){
                      finaltemp.push(element);
                    }
                  })
                  const sortedActivities = finaltemp.slice().sort((a, b) => a.date - b.date);
                  this.dataChat=sortedActivities;
              })
            }
          });
        });
        const qu = query(collection(db, "users"));
        this.unsubscribefriend = onSnapshot(qu, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if(change.type === "modified"){
              getFriend(db).then((response)=>{
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
                this.dataFriend = finaltemp;
              })
            }
          });
        });
        await getChat(db).then((response)=>{
            var finaltemp=[];
            response.forEach(element=>{
              if((element.sender==user.value.uid && element.receiver==this.uidchatwith)||(element.receiver==user.value.uid && element.sender==this.uidchatwith)){
                finaltemp.push(element);
              }
            })
            const sortedActivities = finaltemp.slice().sort((a, b) => a.date - b.date);
            this.dataChat=sortedActivities;
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
