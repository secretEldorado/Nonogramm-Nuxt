<template>
  <div>
    <h1>
      Welcome to the Nonogramm game. Wanna play?
    </h1>
    <p>{{errormsg}}</p>
    <div class="btn">
      <nuxt-link to='/category'>Level</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  head () {
      return {
          title: 'Welcome To Nonogramm',
          meta: [
              {
                  hid: 'description',
                  name: 'description',
                  content: 'Calm place to play Nonogramm'
              }
          ]
      }
  },
  data(){
    return {
      errormsg: ''
    }
  },
  async asyncData({ $axios }) {
    const message = await $axios.get('http://localhost:3000/express/init')
    if(message.msg === "error in initialising the Database") {
      return {
        errormsg: "Problem with the Database"
      }
    }
  }
}
</script>

<style scoped>
.btn {
  margin: 300px auto;
}
</style>