<template>
  <header class="header">
    <h1 class="title">Nonogramm</h1>
    <ul>
        <li>
            <nuxt-link to='/'>Home</nuxt-link>
        </li>
        <li>
            <nuxt-link to='/login'>Login</nuxt-link>
        </li>
        <li>
            <nuxt-link to='/register'>Register</nuxt-link>
        </li>
        <li>
            <nuxt-link to='/create'>Make Level</nuxt-link>
        </li>
    </ul>
  </header>
</template>

<script>
export default {
    name: 'AppHeader'
}
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  background-color: rgb(31, 187, 235);
  border-bottom: 1px dotted #ccc;
}
.header .title {
  font-size: 3rem;
  padding-left: 3px;
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