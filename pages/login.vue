<template>
  <div>
    <h1>Login</h1>

    <UserAuthForm buttonText="Login" :submitForm="loginUser" :hasName="false"/>
  </div>
</template>

<script>
export default {
    middleware: 'guestOnly',
    // computed: {
    //     ...mapGetters(['isAuthenticated','getUserInfo']),
    // },
    methods: {
        async loginUser(loginInfo){
            try{
                await this.$auth.loginWith("local", {
                    data: loginInfo
                })
                this.$router.push("/")
            } catch(error) {
                return error.response.data
            }
        }
    }
}
</script>

<style>

</style>