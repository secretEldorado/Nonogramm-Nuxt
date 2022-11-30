<template>
  <div>
    <h1>
      Welcome to the Nonogramm game. Wanna play?
    </h1>
    <div class="btn">
      <nuxt-link to='/levels'>Level</nuxt-link>
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
    }
}
</script>

<style scoped>
.btn {
  margin: 300px auto;
}
</style>