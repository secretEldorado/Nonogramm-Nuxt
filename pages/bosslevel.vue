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
        let rootUrl
        if(process.env.NODE_ENV === 'development'){
          rootUrl = 'http://localhost:3000'
        } else {
          rootUrl = 'https://www.secreteldorado.com'
        }
        const url = rootUrl + `/express/getBossLevel`
        const data = await $axios.get(url)
        return {
            level:data.data
        }
    },
}
</script>

<style>

</style>