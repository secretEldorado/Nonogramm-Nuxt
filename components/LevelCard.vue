<template>
    <div class="level-container">
        <nuxt-link :to="'/category/levels/' + id">
            <h3>{{level.title}}</h3>
        </nuxt-link>
        <div class="levelcard-flex">
            <nuxt-link :to="'/category/profile/' + level.user_id">
                <p>created by: {{level.userName}}</p>
            </nuxt-link>
            <div class="levelcard-flex">
                <p>color: </p>
                <div v-for="color in colors" :key="color" :style="{'background-color': color}" class="miniblock"></div>
            </div>
            <p>size: {{level.length}}x{{level.height}}</p>
        </div>
        <div class="levelcard-flex">
            <p>likes: {{level.likeCount}}</p>
            <i v-if="$auth.loggedIn && ($auth.$state.user.user_name !== level.userName)" :class="['fa-sharp', 'fa-solid', 'fa-thumbs-up', level.userLikedLevel ? 'liked' : '']" @click="likeLevel(level.id)"></i>
            <div class="levelcard-flex">
                <p>completed: </p>
                <input type="checkbox" class="disable-click" :checked="level.userCompletedLevel"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LevelCard',
    props: ['level', 'id'],
    data(){
        return {
            colors:[]
        }
    },
    mounted(){
        const colorHolder = this.level.color.split(',')
        if(colorHolder[0] === '1'){
            colorHolder[0] = '#000000'
        }
        this.colors = colorHolder
        console.log(this.colors)
    },
    methods: {
        async likeLevel(id){
            const response = await this.$axios.post('http://localhost:3000/express/likeLevel', {
            user_id: this.$auth.state.user.id,
            level_id: id
            }).catch(({response}) => {
                return response
            })
            if(response.status >= 400) {
                this.$emit('error-message', response)
            } else {
                this.$emit('likedComment', id)
            }
        }
    }
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
    align-items: center;
}

.levelcard-flex i{
    color: black;
}

input[type="checkbox"]{
    margin-left: 10px;
}

.disable-click{
    pointer-events: none;
}

.miniblock{
    height: 15px;
    width: 15px;
    margin-right: 2px;
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