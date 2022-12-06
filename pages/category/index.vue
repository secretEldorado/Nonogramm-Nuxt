<template>
  <div>
    <h1>
      Choose a category
    </h1>
    <nuxt-link to='category/all'>
      <div class="category-container">
          <h2>all Levels</h2>
      </div>
    </nuxt-link>
    <nuxt-link to='category/5-10'>
      <div class="category-container">
          <h2>puzzle with the size of: 5-10</h2>
      </div>
    </nuxt-link>
    <nuxt-link to='category/10-15'>
      <div class="category-container">
          <h2>puzzle with the size of: 10-15</h2>
      </div>
    </nuxt-link>
    <nuxt-link to='category/15-20'>
      <div class="category-container">
          <h2>puzzle with the size of: 15-20</h2>
      </div>
    </nuxt-link>
    <nuxt-link to='category/20-25'>
      <div class="category-container">
          <h2>puzzle with the size of: 20-25</h2>
      </div>
    </nuxt-link>
    <nuxt-link to='category/25-30'>
      <div class="category-container">
          <h2>puzzle with the size of: 25-30</h2>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'LevelsPage',
  head () {
        return {
            title: 'Category',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Choose a Category'
                }
            ]
        }
  }
}
</script>

<style>
.category-container {
    padding: 1rem;
    border: 3px solid green;
    background-color: #EEE;
    color: purple;
    margin: 2rem 0;
    border-radius: 5px;
    box-shadow: 5px 10px 18px #888888;
}

.category-container:active{
    box-shadow: none;
    background-color: #CCC;
}
</style>