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
            levels: [
                {
                    id: 3,
                    user_id: 1,
                    color: '0',
                    body: '11000,11001,01111,01001,01001',
                    title: 'simple one'
                },
                {
                    id: 6,
                    user_id: 1,
                    color: '0',
                    body: '0011000000,0111101000,1000010100,0011010110,0111111111,0111111101,0111111111,0111111011,0011110110,0001111100',
                    title: 'a little bit more complex'
                },
                {
                    id: 9,
                    user_id: 1,
                    color: '0',
                    body: '1100011,0100101,0111101,0100100,0100110',
                    title: 'a 7x5 puzzle'
                }
            ]
        }
    }
}
</script>

<style scoped>

</style>