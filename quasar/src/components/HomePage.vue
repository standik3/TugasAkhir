<template>
  <q-page>
      <q-page class="full-width" v-if="user.email !=null" style="max-height: 100%;" >
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto'>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <!-- <q-list v-if="tab == 'mails'" class="full-width" separator>
          <ChatPageDIV :passingData="dataUser"></ChatPageDIV>
        </q-list> -->
        <q-tabs v-model="tab">
          <!-- <q-tab name="mails" class="full-width" icon="mail" label="Chat"/> -->
          <q-tab name="friend" class="full-width" icon="person" label="Friend"/>
          <q-tab name="bot" class="full-width" icon="mail" label="BOT"/>
          <q-tab name="grup" class="full-width" icon="people" label="Group"/>
          <q-tab name="profile" class="full-width" icon="account_circle" label="Profile"/>
        </q-tabs>
          <q-page class="q-pa-md">
            <q-list v-if="tab == 'friend'" class="full-width" separator>
              <FriendPageDIV :passingData="dataFriend"></FriendPageDIV>
            </q-list>
            <q-list v-if="tab == 'bot'" class="full-width" separator>
              <BotPageDIV :passingData="dataChatbot"></BotPageDIV>
            </q-list>
            <q-list v-if="tab == 'profile'" class="full-width" separator>
              <ProfilePageDIV :passingData="dataUser" ></ProfilePageDIV>
            </q-list>
            <q-list v-if="tab == 'grup'" class="full-width" separator>
              <GroupPageDIV :passingData="dataGrup" ></GroupPageDIV>
            </q-list>
          </q-page>
    </q-page>
    <q-page v-else>
      <AdminPageDIV></AdminPageDIV>
    </q-page>
  </q-page>
</template>
  <script>
  import { provide, ref }  from 'vue';
  // import ChatPageDIV from 'src/components/ChatPage.vue'
  import ProfilePageDIV from 'src/components/ProfilePage.vue'
  import GroupPageDIV from 'src/components/GroupPage.vue'
  import FriendPageDIV from 'src/components/FriendPage.vue'
  import AdminPageDIV from 'src/components/AdminPage.vue'
  import BotPageDIV from 'src/components/BotPage.vue'
  import { useAuth } from '@vueuse/firebase/useAuth'
  import { useQuasar } from 'quasar'
  import { getAuth } from "firebase/auth";
  import { app, db, auth , getCities,getGroup , getFriend,getChatBot} from 'boot/firebase'
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
        dataFriend: undefined,
        dataChatbot:undefined
      }
    },
    components: {
      // ChatPageDIV,
      ProfilePageDIV,GroupPageDIV,FriendPageDIV,BotPageDIV,AdminPageDIV
    },
    methods: {
      async getData() {
        await getChatBot(db).then((response)=>{
            var finaltemp=[];
            response.forEach(element=>{
              if(element.sender==user.value.uid){
                finaltemp.push(element);
              }
            })
            const sortedActivities = finaltemp.slice().sort((a, b) => a.date - b.date);
            this.dataChatbot=sortedActivities;
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
      const userselected = ref('');
      provide('userselected',userselected);
      // console.log("USER LOGIN = ",user.value.email);
      const tab = ref('friend');
      const users = ref([]);
      const $q = useQuasar();
      return{
        tab,isAuthenticated,user,
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
