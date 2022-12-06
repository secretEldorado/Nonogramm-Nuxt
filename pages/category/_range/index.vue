<template>
  <div>
    <h1>
      Choose a level
    </h1>
    <p class="error">{{errormsg}}</p>
    <LevelCard v-for="level in levels" :id="level.id" :key="level.id"
    :level="level"/>
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
                    name: 'description',
                    content: 'Choose a level'
                }
            ]
        }
    },
  data() {
      return {
          levels: [],
          errormsg: null
      }
  }, 
  async asyncData({ params, $axios }) {
    try{
      const url = `http://localhost:3000/express/getLevel?range=${params.range}`
      const data = await $axios.get(url)
      return {
        levels:data.data
      }
    } catch(error) {
      return {
        errormsg: error.response.data.body
      }
    }
  },
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