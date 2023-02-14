<template>
  <div>
    <h1>
      Choose a level Amount:{{amount}}
    </h1>
    <p class="error">{{errormsg}}</p>
    <SearchLevel @search-level="selectChoice"/>
    <LevelPaging v-if="amount>=20" :size="pageSize" @page-levels="setPage"/>
    <LevelCard v-for="level in levels" :id="level.id" :key="level.id"
    :level="level" @error-message="showError" @likedComment="changeLike"/>
    <div class="btn">
      <nuxt-link to='/category'>back to Category</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LevelsPage',
  head () {
        return {
            title: 'Level Selector',
            meta: [
                {
                    hid: 'description',
                    name: 'category',
                    content: 'Choose a level'
                }
            ]
        }
    },
  data() {
      return {
          amount:0,
          pageSize:0,
          levels: [],
          errormsg: null,
          url:'',
      }
  }, 
  async mounted() {
    try{
      if(process.env.NODE_ENV === 'development'){
        this.url = 'http://localhost:3000'
      } else {
        this.url = 'http://www.mywebsite.com'
      }
      let user = ''
      if(this.$auth.loggedIn) user = `&loggedInUser_id=${this.$auth.$state.user.id}` 
      const url = this.url + `/express/getLevel?range=${this.$route.params.range}&page=1` + user
      const data = await this.$axios.get(url)
      this.amount = data.data[0].totalItem
      this.levels = data.data
      this.levels.shift()
        if(!this.$auth.loggedIn){
            this.levels.forEach(level => {
              const index = this.$store.getters.getCompletedStatus.indexOf(level.id.toString())
              if (index >= 0) {
                  level.userCompletedLevel = true
              } else level.userCompletedLevel = false
            })
        }
      this.setPageSize()
    } catch(error) {
      this.errormsg = error.response.data.body
    }
  },
  methods: {
      showError(msg){
        this.errormsg = msg
      },
      changeLike(id){
        const index = this.levels.findIndex(item => item.id === id)
        if(this.levels[index].userLikedLevel) {
          this.levels[index].likeCount--
        } else this.levels[index].likeCount++
        this.levels[index].userLikedLevel = !this.levels[index].userLikedLevel
      },
      async selectChoice(input, category){
        try {
          let loggedInUser = ''
          let search
          if(category === 'name') search = `&username=${input}`
          if(category === 'title') search = `&title=${input}`
          if(this.$auth.loggedIn)
            loggedInUser = `&loggedInUser_id=${this.$auth.$state.user.id}`
          const url = this.url + `/express/getLevel?range=${this.$route.params.range}&page=1` + loggedInUser + search
          const data = await this.$axios.$get(url)
          this.amount = data[0].totalItem
          this.levels = data
          // remove the first item in the level array
          this.levels.shift()
          if(!this.$auth.loggedIn){
            this.levels.forEach(level => {
              const index = this.$store.getters.getCompletedStatus.indexOf(level.id.toString())
              if (index >= 0) {
                level.userCompletedLevel = true
              } else level.userCompletedLevel = false
          })
          }
          this.setPageSize()
        } catch(error) {
          this.errormsg = error.response.data.body
        }
      },
      async setPage(page){
        try {
          let loggedInUser = ''
          if(this.$auth.loggedIn)
            loggedInUser = `&loggedInUser_id=${this.$auth.$state.user.id}`
          const url = this.url + `/express/getLevel?range=${this.$route.params.range}&page=${page}`+ loggedInUser
          const data = await this.$axios.$get(url)
          this.levels = data
          // remove the first item in the level array
          this.levels.shift()
          if(!this.$auth.loggedIn){
            this.levels.forEach(level => {
              const index = this.$store.getters.getCompletedStatus.indexOf(level.id.toString())
              if (index >= 0) {
                level.userCompletedLevel = true
              } else level.userCompletedLevel = false
          })
          }
          this.errormsg=''
        } catch(error) {
          this.errormsg = error.response.data.body
        }
      },
      setPageSize(){
        let roundUp
        if(this.amount%20 === 0) roundUp = 0
        else roundUp = 1
        this.pageSize = parseInt(this.amount /20) +roundUp
        this.errormsg=''
      }
    }
}
</script>

<style>
.btn {
    width: 25%;
}
@media (max-width: 768px) {
    .btn {
        font-size: 1.5rem;
        width: 200px;
    }
}
</style>