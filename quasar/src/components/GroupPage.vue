<template>
  <!-- <Suspense>
    <template #fallback>
      Loading
    </template> -->
    <!-- <template #default> -->
<q-page class="full-width">
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
          <!-- <q-btn @click="goChat(group.groupcode)">chat</q-btn> -->
        </q-item>
      </q-list>
</q-page>
    <!-- </template>
  </Suspense> -->
</template>
  <script>
  import { doc, setDoc, updateDoc } from "firebase/firestore";
  import { useAuth } from '@vueuse/firebase/useAuth'
  import { useQuasar } from 'quasar';
  import { getAuth } from "firebase/auth";
  import { app, db , getGroup } from 'boot/firebase'
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
        dataGrup: this.passingData
      }
    },
    methods: {
      goChat(groupcode){
        console.log("CHAT with Group :",groupcode);
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
