<template>
  <div>
    <GameField :mode="mode" :level="level"/>
  </div>
</template>

<script>
export default {
    data(){
        return{
            mode:'normal'
        }
    },
    async asyncData({ params, $axios }) {
        const url = process.env.NODE_ENV === 'development' ? `http://localhost:3000/express/getLevel/${params.id}` : `http://www.mywebsite.com/express/getLevel/${params.id}`
        const data = await $axios.get(url)
        return {
            level:data.data
        }
    },
}
</script>

<style>

</style>