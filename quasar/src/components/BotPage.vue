
<template>
  <q-page>
    <h1>BOT</h1>
  </q-page>
</template>

<script>
export default {
  mounted(){
    (function(d, m){
        var kommunicateSettings =
            {"appId":"3acdf5b325460e4e11b4b34c3d56b6fcf","popupWidget":true,"automaticChatOpenOnNavigation":true};
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        s.style.backgroundColor= "rgb(125, 210, 195)";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
      /* NOTE : Use web server to view HTML files as real-time update will not work if you directly open the HTML file in the browser. */
  }
}
</script>

<style>

</style>
