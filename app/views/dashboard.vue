<template lang="html">
  <!-- Page Contents -->
  <div class="pusher">
    <div class="ui inverted vertical masthead center aligned segment">

      <main-menu :user="user"></main-menu>

      <div class="ui text container">
        <h1 class="ui inverted header">KIWI</h1>
        <h2>Welcome in your Dashboard, {{user.username}} !!</h2>
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
