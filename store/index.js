export const getters = {
    isAuthenticated(state) {
      console.log(state.auth.loggedIn)
      return state.auth.loggedIn; // auth object as default will be added in vuex state, when you initialize nuxt auth
    },
    getUserInfo(state) {
      return state.auth.user;
    }
  };