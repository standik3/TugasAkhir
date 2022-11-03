<template>
  <q-page class="flex q-pa-md" >
      <q-card class="full-width" v-if="!isAuthenticated">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator>
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Register" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="login">
            <LoginRegisterDIV :tab="tab"/>
          </q-tab-panel>
          <q-tab-panel name="register">
            <LoginRegisterDIV :tab="tab"/>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
      <q-card class="full-width" v-else>
        <HomePageDIV/>
      </q-card>
  </q-page>
</template>

<script>
	import { ref } from 'vue'
  import LoginRegisterDIV from 'src/components/LoginRegister.vue'
  import HomePageDIV from 'src/components/HomePage.vue'
  import { useAuth } from '@vueuse/firebase/useAuth'
import { getAuth} from "firebase/auth";
import { app, db, auth } from 'boot/firebase'
  export default {
    setup () {
      const {isAuthenticated, user} = useAuth(getAuth(app));
      return {
        tab: ref('login'),isAuthenticated,user
      }
    },
    components: {
      LoginRegisterDIV,HomePageDIV
    }
  }
</script>
<style>

</style>
