<template>
  <form method="POST" @submit.prevent="perpareSubmit">
    <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
    </p>
    <p v-if="hasName">Name</p>
    <input type="text" v-model="userInfo.name" placeholder="Name" v-if="hasName">
    <p>Username:</p>
    <input type="text" v-model="userInfo.username" placeholder="Username">
    <p>Password:</p>
    <input v-model="userInfo.password" placeholder="Password" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" counter=true>

    <input type="submit" :disabled="!(userInfo.password)" :class="[userInfo.password ? 'enable' : '']" :value="buttonText">
  </form>
</template>

<script>

export default {

    data() {
      return {
        errors:[],
        valid: false,
        showPassword: false,
        userInfo: {
          name: '',
          username: 'mustermann123',
          password: '123456'
        }
      }
    },
    props: ["submitForm", "buttonText", "hasName"],
    methods: {
      async perpareSubmit(){
        this.errors = []
        if(this.hasName && this.userInfo.name.length === 0){
          this.errors.push("Name is empty")
        }
        if(this.userInfo.password.length === 0){
          this.errors.push("Password is empty")
        }
        if(this.userInfo.username.length === 0){
          this.errors.push("Username is empty")
        }
        if((this.hasName === (this.userInfo.name.length !== 0)) && this.userInfo.password.length !== 0 && this.userInfo.username.length !== 0){
          const response = await this.submitForm(this.userInfo)
          if(response) {
            this.errors.push(response.body)
          }
        }
      }
    }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
} 
input {
  font-size: 1.5rem;
  border: none;
  border-bottom: solid #526488 2px;
} 
input:focus-visible {
    outline: none;
    border-bottom: solid 4px #526488 ;
    background: #EEE;
}
form p {
  font-size: 1.2rem;
  text-align: left;
}
input[type="submit"] {
  border: none;
  width: 100px;
  margin: auto;
  margin-top: 20px;
}
.enable {
  background-color: greenyellow;
}
</style>