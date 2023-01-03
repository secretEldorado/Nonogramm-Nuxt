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
                const completedLevels = this.$store.getters.getCompletedStatus
                if(completedLevels.length > 0){
                    completedLevels.forEach(async id => {
                        const response = await this.$axios.post('http://localhost:3000/express/completedLevel', {
                        user_id: this.$auth.state.user.id,
                        level_id: id
                        }).catch(({response}) => {
                            return response
                        })
                        if(response.status >= 400) {
                            throw new Error(response.data.body)
                        }
                    });
                }
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