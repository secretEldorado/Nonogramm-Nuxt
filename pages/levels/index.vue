<template>
  <div>
    <h1>
      Choose a level
    </h1>
    <LevelCard v-for="level in levels" :id="level.id" :key="level.id"
    :level="level"/>
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
            errormsg: ''
        }
    }, async asyncData({ $axios }) {
    const data = await $axios.get('http://localhost:3000/express/getLevel')
    return {
        levels:data.data
    }
  }
}
</script>

<style scoped>

</style>