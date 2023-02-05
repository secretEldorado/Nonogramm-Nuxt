export const state = () => ({
  temporarlyCompleted:[],
  beatBoss:false
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
    getBeatenBossStatus(state) {
      return state.beatBoss
    },
  };

export const mutations = {
  addCompletedLevel(state, levelId ) {
    const found = state.temporarlyCompleted.find(id => {
      return id === levelId
    });
    if(!found){
      state.temporarlyCompleted.push(levelId)
    }
  },
  eraseAllComplededLevel(state) {
    state.temporarlyCompleted = []
  },
  toggleBeatenBossStatus(state) {
    state.beatBoss = !state.beatBoss
  }
}