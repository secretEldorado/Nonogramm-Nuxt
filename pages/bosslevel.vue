<template>
  <div>
    <GameField :mode="mode" :level="level"/>
  </div>
</template>

<script>
export default {
    middleware: 'accessBossStage',
    data(){
        return{
            mode:'boss'
        }
    },
    async asyncData({ $axios }) {
        const url = `http://localhost:3000/express/getBossLevel`
        const data = await $axios.get(url)
        return {
            level:data.data
        }
    },
}
</script>

<style>

</style>