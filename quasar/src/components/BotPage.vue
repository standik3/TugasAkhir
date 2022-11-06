<template>
  <q-page class="full-width">
    <div class="q-pa-md row justify-center">
      <div style="width: 100%; max-width: 400px;">
        <q-list v-for="chat in dataChat" :key="chat.id">
            <q-chat-message
              :name="user.email"
              :text="[chat.pesan]"
              sent
            /><q-chat-message
              name="BOT"
              :text="[chat.respon]"
            />
        </q-list>
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
</template>
  <script>
  import {getChat, getRuleBot} from 'boot/firebase'
  import {ref} from 'vue'
  import { doc, setDoc, updateDoc,addDoc } from "firebase/firestore";
  import { auth , timer} from 'boot/firebase'
  import { useAuth } from '@vueuse/firebase/useAuth'
  import { useQuasar } from 'quasar'
  import { app, db , getChatBot} from 'boot/firebase'
  const { isAuthenticated, user } = useAuth(auth);
  export default ({
    props:[
      'passingData'
    ],
    data() {
      return {
        formData:{
          message:''
        },
        dataChat: this.passingData,user,
        dataRule:undefined
      }
    },
    methods: {
      sendMessage(){
        try {
            var substr1 = Math.floor(Math.random() * (19 - 1 + 1)) + 1;
            var substr2 = substr1 +  8;
            var autogenerate = user.value.uid.substring(substr1,substr2);
            var isipesan = this.formData.message;
            var temprule = [];
            temprule=this.dataRule;
            var temprespon = "Maaf,Bisa ulangi lagi ?"
            temprule.forEach(element=>{
              element.trigger.forEach(trigerelement=>{
                if(isipesan == trigerelement){
                  if(element.respon.length<=1){
                    temprespon = element.respon[0]
                  }else{
                    temprespon = element.respon[Math.floor(Math.random() * (element.respon.length - 1 + 1))]
                  }
                }
              })
            })
            if(isipesan.trim()){
              setDoc(doc(db, "chatbots", autogenerate), {
                pesan:isipesan,
                date: new Date(),
                sender:user.value.uid,
                respon:temprespon
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
      async getData() {
        await getRuleBot(db).then((response)=>{
          var temprule = []
          response.forEach(element=>{
            temprule.push(element)
          })
          this.dataRule = temprule
        })
        await getChatBot(db).then((response)=>{
            var finaltemp=[];
            response.forEach(element=>{
              if(element.sender==user.value.uid){
                finaltemp.push(element);
              }
            })
            const sortedActivities = finaltemp.slice().sort((a, b) => a.date - b.date);
            this.dataChat=sortedActivities;
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
    // mounted(){
    //   (function(d, m){
    //       var kommunicateSettings =
    //           {"appId":"3acdf5b325460e4e11b4b34c3d56b6fcf","popupWidget":true,"automaticChatOpenOnNavigation":true};
    //       var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
    //       s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
    //       s.style.backgroundColor= "rgb(125, 210, 195)";
    //       var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
    //       window.kommunicate = m; m._globals = kommunicateSettings;
    //   })(document, window.kommunicate || {});
    //     /* NOTE : Use web server to view HTML files as real-time update will not work if you directly open the HTML file in the browser. */
    // }
  })
  </script>

  <style>

  </style>
