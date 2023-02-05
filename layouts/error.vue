<template>
  <div class="page-error">
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-if="error.statusCode === 401">Token expired</h1>
    <h1 v-else>An error occurred</h1>
    <NuxtLink to="/">Home page</NuxtLink>
  </div>
</template>

<script>
  export default {
    props: ['error'],
    layout: 'error' // you can set a custom layout for the error page
  }
</script>

<style>
.page-error a {
    background-color: green;
    color: white;
    font-size: 2rem;
    padding: 0 20px;
}
</style>