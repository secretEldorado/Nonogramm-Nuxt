<template>
    <div class="level-container">
        <nuxt-link :to="'/category/levels/' + id">
            <h3>{{level.title}}</h3>
        </nuxt-link>
        <div class="levelcard-flex">
            <nuxt-link :to="'/category/profile/' + level.user_id">
                <p>created by: {{level.userName}}</p>
            </nuxt-link>
            <p>color: {{level.color}}</p>
            <p>size: {{level.length}}x{{level.height}}</p>
        </div>
    </div>
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

.level-container a {
    color: purple;
}
.level-container:active{
    box-shadow: none;
    background-color: #CCC;
}

.levelcard-flex {
    display: flex;
    justify-content: space-between;
}

@media (max-width: 768px) {
    .level-container{
        border: 2px solid green;
    }

   .level-container h3{
        font-size: 1rem;
    }

    .level-container p {
        font-size: 0.8rem;
    }
}
</style>