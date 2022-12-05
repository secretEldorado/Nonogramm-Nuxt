<template>
  <nuxt-link :to="'levels/' + id">
    <div class="level-container">
        <h3>{{level.title}}</h3>
        <div class="levelcard-flex">
            <p>created by: {{level.userName}}</p>
            <p>color: {{level.color}}</p>
            <p>size: {{level.length}}x{{level.height}}</p>
        </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
    name: 'LevelCard',
    props: ['level', 'id'],
}
</script>

<style>
.level-container {
    padding: 1rem;
    border: 3px solid green;
    background-color: #EEE;
    color: purple;
    margin: 2rem 0;
    border-radius: 5px;
    box-shadow: 5px 10px 18px #888888;
}

.level-container:active{
    box-shadow: none;
    background-color: #CCC;
}

.levelcard-flex {
    display: flex;
    justify-content: space-between;
}

</style>