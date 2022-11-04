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
    <q-tabs v-model="tab" >
      <q-tab name="mails" class="full-width" icon="mail" label="Chat"/>
      <q-tab name="bot" class="full-width" icon="mail" label="BOT"/>
      <q-tab name="friend" class="full-width" icon="person" label="Friend"/>
      <q-tab name="grup" class="full-width" icon="people" label="Group"/>
      <q-tab name="profile" class="full-width" icon="account_circle" label="Profile"/>
    </q-tabs>
    <q-list v-if="tab == 'mails'" class="full-width" separator>
      <ChatPageDIV></ChatPageDIV>
    </q-list>
    <q-list v-if="tab == 'bot'" class="full-width" separator>
      <BotPageDIV></BotPageDIV>
    </q-list>
    <q-list v-if="tab == 'profile'" class="full-width" separator>
      <ProfilePageDIV :passingData="dataUser" ></ProfilePageDIV>
    </q-list>
    <q-list v-if="tab == 'friend'" class="full-width" separator>
      <FriendPageDIV :passingData="dataFriend"></FriendPageDIV>
    </q-list>
    <q-list v-if="tab == 'grup'" class="full-width" separator>
      <GroupPageDIV :passingData="dataGrup" ></GroupPageDIV>
    </q-list>
</q-page>
    <!-- </template>
  </Suspense> -->
</template>
  <script>
  import { ref }  from 'vue';
  import ChatPageDIV from 'src/components/ChatPage.vue'
  import ProfilePageDIV from 'src/components/ProfilePage.vue'
  import GroupPageDIV from 'src/components/GroupPage.vue'
  import FriendPageDIV from 'src/components/FriendPage.vue'
  import BotPageDIV from 'src/components/BotPage.vue'
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
    components: {
      ChatPageDIV,ProfilePageDIV,GroupPageDIV,FriendPageDIV,BotPageDIV
    },
    methods: {
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
      const $q = useQuasar();
      const que = query(collection(db, "users"));
      const unsubscribe = onSnapshot(que, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
              console.log("New User:", change.doc.data());
          }
          if (change.type === "modified") {
              console.log("Modified User: ", change.doc.data());

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
