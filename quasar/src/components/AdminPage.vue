<template>
    <q-page class="flex q-pa-md" >
      <div class="full-width" >
        <q-btn class="full-width"  @click="openUser"> detail user</q-btn>
          <q-list
              class="full-width"
              v-if="tabeluser"
              separator>
              <table border="1px" class="full-width">
                  <tr>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>EMAIL VERIFIED</th>
                    <th>STATUS</th>
                    <th>REPORTED</th>
                    <th>ACTION</th>
                  </tr>
                  <tr v-for="users in this.dataUser" :key="users.id">
                      <th>{{ users.displayName }}</th>
                      <th>{{ users.email }}</th>
                      <th>{{ users.emailVerified }}</th>
                      <th><q-badge :color="users.disabled ? 'red-4' : 'light-green-5'">
                          {{ users.disabled ? 'BLOCKED' : '' }}</q-badge></th>
                      <th>{{users.reportedby.length != 0  ?  users.reportedby.length + " kali" : 'NO REPORT' }} </th>
                      <th><q-btn v-if="users.disabled" @click="unblock(users.userUID)"> UNBLOCK</q-btn><q-btn v-if="!users.disabled" @click="block(users.userUID)"> BLOCK</q-btn></th>
                  </tr>
                </table>
            </q-list>
        <q-btn class="full-width"  @click="openGrup"> detail grup</q-btn>
        <q-card class="full-width">
          <table border="1px" class="full-width" v-if="tabelgrup">
            <tr>
              <th>GROUP NAME</th>
              <th>GROUP CODE</th>
              <th>OWNER</th>
              <th>JUMLAH ANGGOTA</th>
            </tr>
            <tr v-for="group in this.dataGrup" :key="group.id">
              <th>{{group.groupname}}</th>
              <th>{{group.groupcode}}</th>
              <th>{{group.owner}}</th>
              <th>{{group.memberid.length}} orang</th>
            </tr>
          </table>
        </q-card>
        <q-btn class="full-width" @click="makeRule">make new rule </q-btn>
        <q-form @submit="trigerrespon" v-if="newrule">
          <q-input
            outlined
            class="q-mb-md"
            v-model="formData.trigger"
            type="text"
            label="(Trigger kata)"
          />
          <q-input
            outlined
            class="q-mb-md"
            v-model="formData.respon"
            type="text"
            label="(Respon kata)"
          />
        <div class="row">
          <q-btn
          class="full-width"
          color="primary"
          type="submit"
          label="Add Rule" />
        </div>
        </q-form>
      </div>
  </q-page>
</template>

<script>
import { useAuth } from '@vueuse/firebase/useAuth'
import { useQuasar } from 'quasar'
import { getAuth } from "firebase/auth";
import { app, db, auth , getCities,getGroup , getRuleBot} from 'boot/firebase'
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { collection, query, where, onSnapshot } from "firebase/firestore";
export default ({
    data() {
      return {
        formData:{
          trigger:'',
          respon: '',
        },
        dataUser: undefined,
        dataGrup: undefined,
        tabeluser: false,
        tabelgrup: false,
        newrule: false,
        dataRule:undefined,

      }
    },
    methods: {
      makeRule(){
        if(this.newrule){
          this.newrule = false;
        }else{
          this.newrule = true;
        }
        this.getData();
      },
      trigerrespon(){
        var newtri = this.formData.trigger;
        var newres = this.formData.respon;
        var bisaAddRule = true;
        if(newtri.trim()&&newres.trim()){
          var temprule = [];
          temprule=this.dataRule;
          temprule.forEach(element=>{
            element.trigger.forEach(trigerelement=>{
              if(newtri == trigerelement){
                bisaAddRule = false;
              }
            })
          })
          if(bisaAddRule){
            var totalrule ="rule"+ temprule.length;
            var temptrig =[];
            var tempresp =[];
            temptrig.push(newtri);
            tempresp.push(newres);
            setDoc(doc(db, "rules",totalrule), {
                trigger: temptrig,
                respon: tempresp
              }).then(() => {
                console.log("BERHASIL ADD RULE");
              })
              .catch((error) => {
                console.log(error);
              });
          }else{
            console.log("TIDAK BISA ADD");
          }
        }
        this.formData.trigger='';
        this.formData.respon='';
      },
      block(uid){
        const washingtonRef = doc(db, "users", uid);
        updateDoc(washingtonRef, {
          disabled: true
        }).then(() => {
            console.log("users successfully updated!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
        this.getData();
      },unblock(uid){
        const washingtonRef = doc(db, "users", uid);
        updateDoc(washingtonRef, {
          disabled: false
        }).then(() => {
            console.log("users successfully updated!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
        this.getData();
      },
      openUser(){
        if(this.tabeluser){
          this.tabeluser = false;
        }else{
          this.tabeluser = true;
        }
        this.getData();
      },
      openGrup(){
        if(this.tabelgrup){
          this.tabelgrup = false;
        }else{
          this.tabelgrup = true;
        }
        this.getData();
      },
      async getData() {
        await getRuleBot(db).then((response)=>{
          var temprule = []
          response.forEach(element=>{
            temprule.push(element)
          })
          this.dataRule = temprule
        })
        await getCities(db).then((response)=>{
          var temp= [];
          response.forEach(element => {
              temp.push(element);
          });
          this.dataUser = temp;
        }).catch((error)=>{
          console.log(error);
        });
        await getGroup(db).then((response)=>{
          var temp= [];
          response.forEach(element => {
              temp.push(element);
          });
          this.dataGrup=temp;
        }).catch((error)=>{
          console.log(error);
        });
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
