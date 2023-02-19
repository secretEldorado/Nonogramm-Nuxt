<template>
  <div>
    <h1>
      Person: {{username}} ({{levels.length}})
    </h1>
    <p class="profile">Real Name: {{name}}</p>
    <p class="error">{{errormsg}}</p>
    <LevelCard v-for="level in levels" :id="level.id" :key="level.id"
    :level="level" @error-message="showError" @likedComment="changeLike"/>
    <div class="btn">
      <nuxt-link to='/category'>back to Category</nuxt-link>
    </div>
  </div>
</template>
<script>
export default {
    head () {
        return {
            title: this.username + ' levels',
            meta: [
                {
                    hid: 'description',
                    name: 'category',
                    content: 'the levels of a user'
                }
            ]
        }
    },
    data(){
        return{
            username:'',
            name:'',
            levels:[],
            errormsg:'',
            url:'',
        }
    } ,
    async created() {
        try{
            if(process.env.NODE_ENV === 'development'){
              this.url = 'http://localhost:3000'
            } else {
              this.url = 'https://www.secreteldorado.com'
            }
            let loggedInUser = ''
            if(this.$auth.loggedIn)
            loggedInUser = `&loggedInUser_id=${this.$auth.$state.user.id}`
            const url = this.url + `/express/getLevel?user_id=${this.$route.params.id}`+loggedInUser
            const data = await this.$axios.get(url)
            this.levels = data.data
            this.levels.shift()
            this.name = data.data[0].name
            this.username = data.data[0].userName
            if(!this.$auth.loggedIn){
                this.levels.forEach(level => {
                    const index = this.$store.getters.getCompletedStatus.indexOf(level.id.toString())
                    if (index >= 0) {
                        level.userCompletedLevel = true
                    } else level.userCompletedLevel = false
                })
            }
            this.levels.sort((a, b) => {
              const titleA = a.title.toUpperCase()
              const titleB = b.title.toUpperCase()
              // use this if non ascii characters are used
              return titleA.localeCompare(titleB)
            })
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
      }
    }
}
</script>

<style>
.profile {
  font-size: 1.5rem;
}
.btn {
    width: 25%;
}
@media (max-width: 768px) {
    .profile{
        font-size: 1rem;
    }
    .btn {
        font-size: 1.5rem;
        width: 200px;
    }
}
</style>