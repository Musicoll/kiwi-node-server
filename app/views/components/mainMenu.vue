
<template lang="html">
  <div class="ui container">
    <div class="ui large secondary inverted menu">

      <a class="active item" href="/"><i class="icon home"></i>Home</a>
      <a class="item" href="/api/documents">api</a>

      <div class="ui right menu basic buttons inverted">
        <a class="ui item button" href="/login" v-if="!user.authenticated"><i class="icon sign in"></i>Login</a>
        <a class="ui item button" href="/join" v-if="!user.authenticated">Sign Up</a>
        <a class="ui item button" href="/dashboard" v-if="user.authenticated"><i class="icon dashboard"></i>Dashboard</a>
        <a class="ui item button" href="/" v-if="user.authenticated" @click.prevent="logout()"><i class="icon sign out"></i>Logout</a>
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
