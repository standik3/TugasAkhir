<template>
  <q-page>
    <q-tabs v-model="userselected">
          <q-tab
          v-for="user in dataFriend"
          :key="user.userUID"
          :name="user.userUID" class="full-width" icon="account_circle" :label="user.email"
          :class="user.online ? 'text-green' : 'text-grey'"
          />
    </q-tabs>
    <ChatActiveDIV></ChatActiveDIV>
  </q-page>
</template>

<script>
  import { ref ,inject}  from 'vue';
  import { useAuth } from '@vueuse/firebase/useAuth'
  import { getAuth } from "firebase/auth";
  import { app, db ,getFriend,getChat } from 'boot/firebase'
  import ChatActiveDIV from 'src/components/ChatActive.vue'
  const { user } = useAuth(getAuth(app));
export default {
  props:[
      'passingData'
    ],
    data() {
      return {
        dataFriend: this.passingData
      }
    },
    components: {
      ChatActiveDIV
    },
  methods: {
      async getData() {
        // await getChat(db).then((response)=>{

        // })
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
  setup(){
    const userselected = inject('userselected');
    return{
      userselected
    }
  }
}
</script>

<style>

</style>
