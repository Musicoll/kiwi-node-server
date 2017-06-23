<template lang="html">
  <div class="ui container">
    <div class="ui large secondary inverted menu">

      <a class="active item" href="/"><i class="icon home"></i>Home</a>
      <a class="item" href="/api/documents">api</a>

      <div class="ui right menu basic buttons inverted">
        <a class="ui item button" href="/login" v-if="!user.authenticated"><i class="icon sign in"></i>Login</a>
        <a class="ui item button" href="/join" v-if="!user.authenticated">Sign Up</a>
        <a class="ui item button" href="/dashboard" v-if="user.authenticated"><i class="icon dashboard"></i>Dashboard</a>
        <a class="ui item button" href="/logout" v-if="user.authenticated"><i class="icon sign out"></i>Logout</a>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {}
  },
  props: ['user']
  /* buggy for now, see https://github.com/express-vue/express-vue/issues/94
  props: {
    // object/array defaults should be returned from a factory function
    user: {
      type: Object,
      default: function () {
        return {authenticated: true}
      }
    }
  }
  */
}
</script>

<style lang="css">
</style>
