
<template>
  <q-page>
      <div class="q-pa-md row justify-center">
        <div style="width: 100%; max-width: 400px">
          <q-chat-message
            v-for="chat in dataChat" :key="chat.id"

              :text="chat.pesan"
              :sent="chat.sender === user.uid"
            />
        </div>
      </div>
      <q-footer>
          <q-form @submit.prevent="sendMessage">
            <q-toolbar class="bg-grey-3 text-black row">
            <q-btn round flat icon="insert_emoticon" class="q-mr-sm" />
            <q-input rounded outlined dense class="WAL__field col-grow q-mr-sm" bg-color="white" v-model="message" placeholder="Type a message" />
            <q-btn round flat icon="send" type="submit"/>
          </q-toolbar>
          </q-form>
        </q-footer>
  </q-page>
</template>

<script>
import  {ref,inject, watch}  from 'vue';
import { useAuth } from '@vueuse/firebase/useAuth';
import { doc, setDoc, updateDoc,addDoc } from "firebase/firestore";
import { app, db  ,auth,getChat , timer} from 'boot/firebase'
import { collection, query, where, onSnapshot } from "firebase/firestore";
const {user} = useAuth(auth);
export default {
  props:[
      'dataChatpass'
    ],
    data() {
      return {
        dataChat: this.dataChatpass
      }
    },
  methods: {
    async getData() {
      console.log("data pass:",this.dataChat);
      var tempdatachat = [];
      var uidtemp=''
      tempdatachat = this.dataChat;
      tempdatachat.forEach(element=>{
        uidtemp = element.receiver;
      })
      await getChat(db).then((response)=>{
          var finaltemp=[];
          response.forEach(element=>{
            if((element.sender==user.value.uid && element.receiver==uidtemp)||(element.receiver==user.value.uid && element.sender==uidtemp)){
              finaltemp.push(element);
            }
          })
          const sortedActivities = finaltemp.slice().sort((a, b) => a.date - b.date);
          this.dataChat=sortedActivities;
          // console.log("data temp",this.dataChat);
      })
      },
    },
    created() {
      this.getData();
    },
  setup(){
    const message = ref('');
    var date=new Date();
    const sendMessage = async()=>{
      // try {
      //     var substr1 = Math.floor(Math.random() * (21 - 1 + 1)) + 1;
      //     var substr2 = substr1 +  6;
      //     var autogenerate = user.value.uid.substring(substr1,substr2) + userselected.value.substring(substr1,substr2);
      //     if(message.value.trim()){
      //       setDoc(doc(db, "chats", autogenerate), {
      //         pesan:message.value,
      //         date: date,
      //         sender:user.value.uid,
      //         receiver: userselected.value
      //       }).then(() => {
      //         console.log("BERHASIL CHAT");
      //       })
      //       .catch((error) => {
      //         console.log(error);
      //       });
      //     }
      //     message.value = '';
      // } catch (error) {
      //   console.log(error);
      // }
    }
    return{
      message,sendMessage,user
    }
  }
}
</script>

<style>

</style>
