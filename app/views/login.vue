<template lang="html">
  <div class="user-modal-container" :class="{ 'active': active }" id="login-modal">
    <div class="user-modal">
      <ul class="form-switcher">
        <li><a href="/join" id="register-form" :class="{ 'active': active == 'register' }">Register</a></li>
        <li><a href="/login" id="login-form" :class="{ 'active': active == 'login' }">Login</a></li>
      </ul>

      <div class="form-register" :class="{ 'active': active == 'register' }" id="form-register">
        <div class="ui inverted dimmer" :class="{ 'active': submitted == 'register' }">
          <div class="ui text loader">Registering...</div>
        </div>
        <div class="ui negative message" v-if="error">
          <i class="close icon"></i>
          <div class="header">Registering error:</div>
          <p v-text="error"></p>
        </div>

        <form class="" action="/join" method="post">
          <input type="text" name="name" placeholder="Name" v-model="registerName">
          <input type="email" name="email" placeholder="Email" v-model="registerEmail">
          <input type="password" name="password" placeholder="Password" v-model="registerPassword">
          <input type="submit" :class="{ 'disabled': submitted == 'register' }" v-model="registerSubmit" id="registerSubmit">
          <div class="links">
            <a href="/login">Already have an account?</a>
          </div>
        </form>
      </div>

      <div class="form-login" :class="{ 'active': active == 'login' }" id="form-login">
        <div class="ui inverted dimmer" :class="{ 'active': submitted == 'login' }">
          <div class="ui text loader">Logging In...</div>
        </div>
        <div class="ui negative message" v-if="error">
          <i class="close icon"></i>
          <div class="header">Login error:</div>
          <p v-text="error"></p>
        </div>
        <form class="" action="/login" method="post">
          <input type="email" name="email" placeholder="Email or Username" v-model="loginUser">
          <input type="password" name="password" placeholder="Password" v-model="loginPassword">
          <input type="submit" :class="{ 'disabled': submitted == 'login' }" v-model="loginSubmit" id="loginSubmit">
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {

    data() {
      return {
        active: this.active ? this.active : 'login',
        submitted: null,

        // Submit button text
        registerSubmit: 'Register',
        loginSubmit: 'Login',

        // Modal text fields
        registerName: '',
        registerEmail: '',
        registerPassword: '',
        loginUser: '',
        loginPassword: '',

        error: ''
      }
    }
}
</script>

<style lang="css">
.ui.inverted.dimmer{
  background-color: rgba(0.9, 0.9, 0.9, 0.9);
}
.user-modal-container * {
  box-sizing: border-box;
}

.user-modal-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  /*cursor: pointer;*/
  overflow-y: auto;
  z-index: 3;
  font-family: 'Lato', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  font-size: 14px;
  background-color: rgba(17, 17, 17, .9);
  -webkit-transition: all 0.25s linear;
  -moz-transition: all 0.25s linear;
  -o-transition: all 0.25s linear;
  -ms-transition: all 0.25s linear;
  transition: all 0.25s linear;
}

.user-modal-container.active {
  opacity: 1;
  visibility: visible;
}

.user-modal-container .user-modal {
  position: relative;
  margin: 50px auto;
  width: 90%;
  max-width: 500px;
  background-color: #f6f6f6;
  cursor: initial;
}

.user-modal-container .form-login,
.user-modal-container .form-register,
.user-modal-container .form-password {
  padding: 75px 25px 25px;
  display: none;
}

.user-modal-container .form-login.active,
.user-modal-container .form-register.active,
.user-modal-container .form-password.active {
  display: block;
}

.user-modal-container ul.form-switcher {
  margin: 0;
  padding: 0;
}

.user-modal-container ul.form-switcher li {
  list-style: none;
  display: inline-block;
  width: 50%;
  float: left;
  margin: 0;
}

.user-modal-container ul.form-switcher li a {
  width: 100%;
  display: block;
  height: 50px;
  line-height: 50px;
  color: #666666;
  background-color: #dddddd;
  text-align: center;
}

.user-modal-container ul.form-switcher li a.active {
  color: #000000;
  background-color: #f6f6f6;
}

.user-modal-container input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #eeeeee;
}

.user-modal-container input[type="submit"] {
  color: #f6f6f6;
  border: 0;
  margin-bottom: 0;
  background-color: #3fb67b;
  cursor: pointer;
  border-radius: 0;
}

.user-modal-container input[type="submit"]:hover {
  background-color: #3aa771;
}

.user-modal-container input[type="submit"]:active {
  background-color: #379d6b;
}

.user-modal-container .links {
  text-align: center;
  padding-top: 25px;
}

.user-modal-container .links a {
  color: #3fb67b;
}

.user-modal-container input[type="submit"].disabled {
  background-color: #98d6b7;
}
</style>
