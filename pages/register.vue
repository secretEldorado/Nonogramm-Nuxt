<template>
  <div>
    <h1>Register</h1>

    <UserAuthForm buttonText="Register" :submitForm="registerUser" :hasName="true"/>
  </div>
</template>

<script>
export default {
    middleware: 'guestOnly',
    methods: {
        async registerUser(registrationInfo){
                const response = await this.$axios.post("/express/signIn", {
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