<template>
<q-page class="full-width">
  <q-page v-if="isChatted">
      <q-btn @click="goBack" label="<- BACK" />
      CHAT WITH {{namagroup}}
      <div class="q-pa-md row justify-center">
        <div style="width: 100%; max-width: 400px">
          <q-chat-message
            v-for="chat in dataChat" :key="chat.id"
              :name="chat.sender === user.uid  ? user.email : chat.senderemail"
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
            <q-item-label>Code : {{ group.groupcode }}</q-item-label>
          </q-item-section>
          <q-btn @click="goChat(group.groupcode)">chat</q-btn>
        </q-item>
      </q-list>
    </q-page>
</q-page>
</template>
  <script>
  import { doc, setDoc, updateDoc } from "firebase/firestore";
  import { useAuth } from '@vueuse/firebase/useAuth'
  import { useQuasar } from 'quasar';
  import { getAuth } from "firebase/auth";
  import { app, db , getGroup ,getChatGroup} from 'boot/firebase'
  import { collection, query, where, onSnapshot } from "firebase/firestore";
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
        dataGrup: this.passingData,codechatwith:undefined,dataChat:undefined,
        isChatted:false,namagroup:undefined,user,unsubscribe:undefined,unsubsgrup:undefined
      }
    },
    methods: {
      goBack(){
        this.isChatted = false;
      },
      sendMessage(){
        try {
            var substr1 = Math.floor(Math.random() * (21 - 1 + 1)) + 1;
            var substr2 = substr1 +  6;
            var autogenerate = user.value.uid.substring(substr1,substr2);
            var isipesan = this.formData.message;
            if(isipesan.trim()){
              setDoc(doc(db, "groupchats", autogenerate), {
                pesan:isipesan,
                date: new Date(),
                sender:user.value.uid,
                groupcode: this.codechatwith,
                senderemail: user.value.email
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
      async goChat(uidchat){
        this.isChatted = true;
        this.codechatwith = uidchat;
        await getGroup(db).then((response)=>{
            response.forEach(element => {
              if(element.groupcode == this.codechatwith){
                this.namagroup = element.groupname
              }
            });
          }).catch((error)=>{
            console.log(error);
          });
        this.getData();
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
        this.getData();
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
        this.getData();
      },
      async getData() {
        const q = query(collection(db, "groupchats"));
        this.unsubscribe = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              getChatGroup(db).then((response)=>{
                  var finaltemp=[];
                  response.forEach(element=>{
                    if(element.groupcode==this.codechatwith){
                      finaltemp.push(element);
                    }
                  })
                  const sortedActivities = finaltemp.slice().sort((a, b) => a.date - b.date);
                  this.dataChat=sortedActivities;
              })
            }
          });
        });
        const qu = query(collection(db, "group"));
        this.unsubsgrup = onSnapshot(qu, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "modified") {
              getGroup(db).then((response)=>{
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
            }
          });
        });
        await getChatGroup(db).then((response)=>{
            var finaltemp=[];
            response.forEach(element=>{
              if(element.groupcode==this.codechatwith){
                finaltemp.push(element);
              }
            })
            const sortedActivities = finaltemp.slice().sort((a, b) => a.date - b.date);
            this.dataChat=sortedActivities;
        })
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
