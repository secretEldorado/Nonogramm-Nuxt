<template>
  <div class="create-field">
    <h1>Create a level</h1>
    <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
    </p>
    <div class="flex">
        <p>height: </p>
        <input :value="levelInfo.height" type="number" min="5" max="30"  @input="updateHeight">
    </div>
    <div class="flex">
        <p>width: </p>
        <input :value="levelInfo.width" type="number" min="5" max="30" @input="updateWidth">
    </div>
    <div class="flex">
        <p>title: </p>
        <input v-model="levelInfo.title" type="text" placeholder="titlefield">
    </div>
    <div v-if="levelInfo.width > 0 && levelInfo.height >0" class="box-playing-field center" :style= "{'width': levelInfo.width * 25 + 'px' , 'grid-template-columns': 'repeat(' + levelInfo.width +', 1fr)' }">
        <NonogrammBlock v-for="i in levelInfo.height*levelInfo.width" :key="i" :id="i" :tool="currentTool" @change-field="changeBlock"/>
    </div>
    <div v-else>
        <p style="color:red">no Field unless height or weight is not zero</p>
    </div>
    <div v-if="levelInfo.width >= 5 && levelInfo.height >= 5">
        <div class="btn btn-submit" @click.enter="createLevel()">Submit</div>
    </div>
  </div>
</template>

<script>
export default {
    middleware:"isAuthenticated",
    data() {
      return {
        errors:[],
        field:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        currentTool:10,
        levelInfo: {
          title: '',
          width: 5,
          height: 5,
        }
      }
    },
    methods: {
        updateWidth(event){
            if(String(event.target.value) === '' ){
                this.levelInfo.width = 0
                this.field = []
            } else if(event.target.value < 4) {
                this.changeField(this.levelInfo.width - event.target.value, true)
                this.levelInfo.width = event.target.value
            }
            if(event.target.value < 5) {
                this.errors = this.errors.filter(err => {
                    if (err !== "width can't exceed 30" || err !== "width can't be smaller than 5") {
                        return false
                    } return true
                })
                this.errors.push("width can't be smaller than 5")
            }
            else if(event.target.value <= 30) {
                this.changeField(this.levelInfo.width - event.target.value, true)
                this.levelInfo.width = event.target.value
                this.errors = this.errors.filter(err => {
                    if (err !== "width can't exceed 30" || err !== "width can't be smaller than 5") {
                        return false
                    } return true
                })
            }
            else {
                this.errors = this.errors.filter(err => {
                    if (err !== "width can't exceed 30" || err !== "width can't be smaller than 5") {
                        return false
                    } return true
                })
                this.errors.push("width can't exceed 30")
            }
        },
        updateHeight(event){
            if(String(event.target.value) === ''){
                this.levelInfo.height = 0
                this.field = []
            } else if(event.target.value < 4) {
                this.changeField(this.levelInfo.height - event.target.value, false)
                this.levelInfo.height = event.target.value
            }
            if(event.target.value < 5) {
                this.errors = this.errors.filter(err => {
                    if (err !==  "height can't be smaller than 5" || err !== "height can't exceed 30"){
                        return false
                    } return true
                })
                this.errors.push("height can't be smaller than 5")
            }
            else if(event.target.value <= 30) {
                this.changeField(this.levelInfo.height - event.target.value, false)
                this.levelInfo.height = event.target.value
                this.errors = this.errors.filter(err => {
                    if (err !==  "height can't be smaller than 5" || err !== "height can't exceed 30"){
                        return false
                    } return true
                })
            }
            else {
                this.errors = this.errors.filter(err => {
                    if (err !==  "height can't be smaller than 5" || err !== "height can't exceed 30"){
                        return false
                    } return true
                })
                this.errors.push("height can't exceed 30")
            }
        },
        changeBlock(id){
            this.field[id-1] = this.field[id-1] === 0 ? 1:0
        },
        changeField(differenz, isWidth){
            const otherAxis = isWidth ? this.levelInfo.height : this.levelInfo.width
            if (differenz > 0) {
                for(let i = 0; i < differenz; i++){
                    for(let i = 0; i < otherAxis; i++){
                        this.field.pop()
                    }
                }
            }
            else if (differenz < 0) {
                for(let i = 0; i < Math.abs(differenz); i++){
                    for(let i = 0; i < otherAxis; i++){
                        this.field.push(0)
                    }
                }
            }
        },
        async createLevel(){
            let allowed = true
            this.errors = this.errors.filter(err => {
                if (err !==  "enter a title please" || err !== "color the field please"){
                    return false
                } return true
            })
            if(this.levelInfo.title === ''){
                this.errors.push("enter a title please")
                allowed = false
            }
            const notOnlyWhite = this.field.find(item => {
                return item !== 0
            })
            if(!notOnlyWhite){
                this.errors.push("color the field please")
                allowed = false
            }
            let body = ""
            let count = 0
            if(allowed){
                this.field.forEach(item => {
                    body += item
                    count++
                    if(count === parseInt(this.levelInfo.width)){
                        body += ','
                        count = 0
                    }
                })
                const puzzle = body.slice(0, -1)
                const response = await this.$axios.post("/express/createLevel", {
                    body: puzzle,
                    user_id: this.$auth.state.user.id,
                    title: this.levelInfo.title,
                    color: '1'
                }).catch(({response}) => {
                    return response
                })
                if(response.status > 400) {
                    this.errors = []
                    return this.errors.push(response.data.body)
                }
                this.$router.push("/")
            }
        }
    }
}
</script>

<style>
input {
  font-size: 1rem;
  border: none;
  border-bottom: solid #526488 2px;
} 
input:focus-visible {
    outline: none;
    border-bottom: solid 4px #526488 ;
    background: #EEE;
}
.flex {
    margin-bottom: 10px;
    display: flex;
}
.center {
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
}
.btn-submit {
    margin-top: 100px;
    margin-left: auto;
    margin-right: auto;
}
@media (min-width: 768px) {
    .create-field p {
        font-size: 1.5rem;
    }
    .create-field input {
        font-size: 1.5rem;
    }
}
</style>