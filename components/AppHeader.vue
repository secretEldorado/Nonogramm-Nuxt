<template>
  <header class="header">
    <h1 class="title">Nonogramm</h1>
    <ul>
      <li>
          <nuxt-link to='/'>Home</nuxt-link>
      </li>
      <div v-if="$auth.loggedIn" class="flex">
        <!-- {{ $auth.user.user_name }} -->
        <li>
            <nuxt-link to='/create'>Make Level</nuxt-link>
        </li>
        <li>
          <a @click="logout">Logout</a>
        </li>
      </div>
      <div v-else class="flex">
        <li>
            <nuxt-link to='/login'>Login</nuxt-link>
        </li>
        <li>
            <nuxt-link to='/register'>Register</nuxt-link>
        </li>
      </div>
    </ul>
  </header>
</template>

<script>
export default {
    name: 'AppHeader',
    methods: {
      async logout() {
        await this.$auth.logout()
        this.$router.push("/")
      }
    }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  background-color: rgb(31, 187, 235);
  border-bottom: 1px dotted #ccc;
}
.flex {
  display: flex;
}
.header .title {
  font-size: 3rem;
  padding: 0 3px;
  color: #526488;
}
.header ul {
  display: flex;
}
.header a {
  display: inline-block;
  background: #526488;
  color: #fff;
  padding: 0.3rem 1rem;
  margin-right: 0.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
    .header .title {
        font-size: 1.5rem;
    }

    .header a {
        font-size: 0.8rem;
    }
}
</style>