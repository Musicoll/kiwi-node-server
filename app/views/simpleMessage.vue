<template lang="html">
  <!-- Page Contents -->
  <div class="pusher">
    <div class="ui inverted vertical masthead center aligned segment">

      <main-menu></main-menu>

      <div class="ui text container">
        <h1 class="ui inverted header">
          {{title}}
        </h1>

        <div class="ui message" v-bind:class="{ 'success': !error, 'negative': error }">
          <div class="header">
            <p v-if="error">Activation failed !</p>
            <p v-else>Activation success !</p>
          </div>
          <p>{{message}}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import mainMenu from "./components/mainMenu.vue";
export default {
  data: function() {
    return {};
  },
  components: {
    mainMenu
  }
};
</script>

<style lang="css">
</style>
