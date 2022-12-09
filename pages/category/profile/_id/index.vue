<template>
  <div>
    <h1>
      Person: {{username}}
    </h1>
    <p class="profile">Real Name: {{name}}</p>
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
    data(){
        return{
            username:'',
            name:'',
            levels:[],
            errormsg:''
        }
    } ,
    async asyncData({ params, $axios }) {
        try{
        const url = `http://localhost:3000/express/getLevel?user_id=${params.id}`
        const data = await $axios.get(url)
            return {
                levels:data.data,
                name:data.data[0].name,
                username: data.data[0].userName
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