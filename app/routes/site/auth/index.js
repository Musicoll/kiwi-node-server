const API_URL = 'http://localhost:8080/api/';
const LOGIN_URL= API_URL + 'auth/';
const SIGNUP_URL= API_URL + 'users/';

// authentication mixin
module.exports = {

  mounted: function () {
    this.checkAuth();
  },

  data: function() {
    return {
      user: {
        authenticated: false
      },
      config: {
        API_URL: API_URL,
        LOGIN_URL: LOGIN_URL,
        SIGNUP_URL: SIGNUP_URL
      }
    }
  },

  methods: {
    login: function(context, creds, redirect, cb) {
      context.$http.post(this.config.LOGIN_URL, creds).then(response => {

        let data = response.body;

        if(!data.error && data.token !== undefined)
        {
          localStorage.setItem('kiwi_api_token', data.token)
          this.user.authenticated = true;

          if(redirect) {
            window.location.replace(redirect);
          }
        }
        else {
          context.error = data.message;
        }

      }).catch((response, err) => {
        let data = response.body;
        if(data.error && data.message) {
          context.error = data.message;
        } else {
          context.error = err;
        }
      })
      .then(() => {
        if(cb) {
          cb();
        }
      })
    },

    signup: function(context, creds, redirect, cb) {
      context.$http.post(this.config.SIGNUP_URL, creds).then(response => {

        let data = response.body;
        if(!data.error && data.token !== undefined)
        {
          localStorage.setItem('kiwi_api_token', data.token)
          this.user.authenticated = true;

          if(redirect) {
            window.location.replace(redirect);
          }
        }
        else {
          context.error = data.message;
        }

      }).catch((err) => {
        context.error = err;
      })
      .then(() => {
        if(cb) {
          cb();
        }
      })
    },

    logout: function(redirect) {
      localStorage.removeItem('kiwi_api_token')
      this.user.authenticated = false
    },

    checkAuth: function() {
      this.user.authenticated = Boolean(localStorage.getItem('kiwi_api_token'));
    },

    getAuthHeader: function() {
      return {
        'Authorization': 'Bearer ' + localStorage.getItem('kiwi_api_token')
      }
    }
  }
}
