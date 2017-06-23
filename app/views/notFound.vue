<template lang="html">
  <!-- Page Contents -->
  <div class="pusher">
    <div class="ui inverted vertical masthead center aligned segment">

      <main-menu :user="user"></main-menu>

      <div class="ui text container">
        <h1 class="ui inverted header">
          KIWI
        </h1>
        <h2>Page not found !</h2>
        <a class="ui large button" href="/">Go back to the home page...</a>
      </div>

    </div>
  </div>
</template>

<script>
export default {
    data: function() {
        return {}
    }
}
</script>

<style lang="css">
</style>
