<template lang="html">
  <!-- Page Contents -->

  <div class="pusher">
    <div class="ui vertical masthead center aligned segment block">

      <div class="ui text container">

        <h1 class="ui header">KIWI</h1>
        <h2>Realtime Collaborative audio patching software</h2>

        <release-links></release-links>

        <a class="ui github button large" href="https://github.com/Musicoll/Kiwi"><i class="github icon"></i> Github</a>
        <a class="ui large button" href="http://musicoll.github.io/Kiwi"><i class="book icon"></i> Documentation</a>
        <a class="ui large button" href="http://musicoll.mshparisnord.org/"><i class="graduation icon"></i> ANR Project Website (fr)</a>

      </div>
    </div>

  </div>

</template>

<script>
import releaseLinks from "./components/releaseLinks.vue";
export default {
  data: function() {
    return {};
  },
  components: {
    releaseLinks
  }
};
</script>

<style lang="css">
</style>
