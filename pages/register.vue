<template>
  <div>
    <h1>Register</h1>

    <UserAuthForm buttonText="Register" :submitForm="registerUser" :hasName="true"/>
  </div>
</template>

<script>
export default {
    head () {
      return {
          title: 'Nonogramm Registration',
          meta: [
              {
                  hid: 'description',
                  name: 'register',
                  content: 'Registrate to create level'
              }
          ]
      }
  },
    middleware: 'guestOnly',
    methods: {
        async registerUser(registrationInfo){
                const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/express/signIn' : 'http://www.secreteldorado.com/express/signIn'
                const response = await this.$axios.post(url, {
                    name: registrationInfo.name,
                    username: registrationInfo.username,
                    password: registrationInfo.password
                }).catch(({response}) => {
                    return response
                })
                if(response.status > 400) {
                    return response.data
                }
                alert(response.data.user.username +' signed in')
                this.$router.push("/")
        }
    }
}
</script>

<style>

</style>