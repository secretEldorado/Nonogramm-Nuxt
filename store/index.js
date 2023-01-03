export const state = () => ({
  temporarlyCompleted:[]
})

export const getters = {
    isAuthenticated(state) {
      return state.auth.loggedIn; // auth object as default will be added in vuex state, when you initialize nuxt auth
    },
    getUserInfo(state) {
      return state.auth.user;
    },

    getCompletedStatus(state) {
      return state.temporarlyCompleted
    }, 
  };

export const mutations = {
  addCompletedLevel(state, levelId ) {
    state.temporarlyCompleted.push(levelId)
  },
  eraseAllComplededLevel(state) {
    state.temporarlyCompleted = []
  }
}