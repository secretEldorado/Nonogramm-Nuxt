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
    <div v-if="levelInfo.width > 0 && levelInfo.height >0" class="box-playing-field center" :style= "{'width': levelInfo.width * blockSize + 'px' , 'grid-template-columns': 'repeat(' + levelInfo.width +', 1fr)' }">
        <NonogrammBlock v-for="i in levelInfo.height*levelInfo.width" :key="i" :id="i" :color="levelInfo.colors" :tool="currentTool" :ref="'field'" @change-field="changeBlock" />
    </div>
    <div v-else>
        <p style="color:red">no Field unless height or weight is not zero</p>
    </div>
    <div v-if="levelInfo.width >= 5 && levelInfo.height >= 5">
        <div class="flex color-buttons">
            <div class="btn color-btn" @click="addColor">set new Color</div>
            <input type="color" id="head" name="head"  v-model="color">
            <div class="btn color-btn" @click="deleteColor">delete newest Color</div>
        </div>
        <div class="flex color-container" v-if="levelInfo.colors.length > 0">
            <div v-for="(color, index) in levelInfo.colors" :class="['color-block', usedColor===index+2?'color-used':'']" :key="color" :style="'background-color:'+color" @click="setColor(index+2)"></div>
        </div>
        <div class="btn btn-submit" @click.enter="createLevel()">Submit</div>
    </div>
  </div>
</template>

<script>
export default {
    middleware:"isAuthenticated",
    head () {
      return {
          title: 'Creation of a level',
          meta: [
              {
                  hid: 'description',
                  name: 'create',
                  content: 'make ur own Level'
              }
          ]
      }
  },
    data() {
      return {
        errors:[],
        field:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        currentTool:10,
        color:'#e66465',
        levelInfo: {
          title: '',
          width: 5,
          height: 5,
          colors:[],
        },
        usedColor:1,
        blockSize:25,
      }
    },
    mounted(){
        window.addEventListener('resize', this.onResize)
        this.onResize()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
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
                    if (err !== "width can't exceed 30" && err !== "width can't be smaller than 5") {
                        return true
                    } return false
                })
                this.errors.push("width can't be smaller than 5")
            }
            else if(event.target.value <= 30) {
                this.changeField(this.levelInfo.width - event.target.value, true)
                this.levelInfo.width = event.target.value
                this.errors = this.errors.filter(err => {
                    if (err !== "width can't exceed 30" && err !== "width can't be smaller than 5") {
                        return true
                    } return false
                })
            }
            else {
                this.errors = this.errors.filter(err => {
                    if (err !== "width can't exceed 30" && err !== "width can't be smaller than 5") {
                        return true
                    } return false
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
                    if (err !==  "height can't be smaller than 5" && err !== "height can't exceed 30"){
                        return true
                    } return false
                })
                this.errors.push("height can't be smaller than 5")
            }
            else if(event.target.value <= 30) {
                this.changeField(this.levelInfo.height - event.target.value, false)
                this.levelInfo.height = event.target.value
                this.errors = this.errors.filter(err => {
                    if (err !==  "height can't be smaller than 5" && err !== "height can't exceed 30"){
                        return true
                    } return false
                })
            }
            else {
                this.errors = this.errors.filter(err => {
                    if (err !==  "height can't be smaller than 5" && err !== "height can't exceed 30"){
                        return true
                    } return false
                })
                this.errors.push("height can't exceed 30")
            }
        },
        changeBlock(id){
            this.field[id-1] = this.field[id-1] === this.usedColor ? 0:this.usedColor
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
        addColor(){
            this.errors = this.errors.filter(err => {
                if (err !==  "cannot have two of the same color as selection"){
                    return true
                } return false
            }) 
            const duplicate = this.levelInfo.colors.find(color => {
                return color === this.color
            })
            if(duplicate){
                this.errors.push("cannot have two of the same color as selection")
                return
            }
            if (this.levelInfo.colors.length < 8) this.levelInfo.colors.push(this.color)
        },
        deleteColor(){
            this.errors = this.errors.filter(err => {
                if (err !==  "cannot have two of the same color as selection"){
                    return true
                } return false
            }) 
            for(let i=0; i<this.field.length; i++){
                if(this.field[i] === this.levelInfo.colors.length+1) this.field[i] = 0
                this.$refs.field[i].clearField()
            }
            this.levelInfo.colors.pop()
            this.usedColor = 1
            this.currentTool = 10
        },
        setColor(position){
            if(this.usedColor !== position){
                this.usedColor = position
                this.currentTool = 11-position
            }
            else{
                this.usedColor = 1
                this.currentTool = 10
            }
            
        },
        onResize(){
            if (window.innerWidth < 768){
                this.blockSize = 20
            } else this.blockSize = 25
        },
        async createLevel(){
            let allowed = true
            this.errors = this.errors.filter(err => {
                if (err !==  "enter a title please" && err !== "color the field please"){
                    return true
                } return false
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
                let colortext = '1'
                const blackUsed = this.field.find(item => {
                    return item === 1
                })
                if(!blackUsed){
                    colortext = ''
                }
                let noticeNotUsedColor=0
                for(let i = 2; i < 10; i++){
                    const colorUsed = this.field.find(item =>{
                        return item === i
                    })
                    if(colorUsed){
                        if(noticeNotUsedColor > 0){
                            for(let j=0; j<this.field.length; j++){
                                if(this.field[j] === i) this.field[j] = i-noticeNotUsedColor
                            }
                            noticeNotUsedColor = 0
                        } 
                        if(i === 2-noticeNotUsedColor && !blackUsed)
                            colortext += this.levelInfo.colors[i-2]
                        else
                            colortext += ',' + this.levelInfo.colors[i-2]
                    } else noticeNotUsedColor++
                }
                this.field.forEach(block => {
                    body += block
                    count++
                    if(count === parseInt(this.levelInfo.width)){
                        body += ','
                        count = 0
                    }
                })
                const puzzle = body.slice(0, -1)
                const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/express/createLevel' : 'http://www.secreteldorado.com/express/createLevel'
                const response = await this.$axios.post(url, {
                    body: puzzle,
                    user_id: this.$auth.state.user.id,
                    title: this.levelInfo.title,
                    color: colortext
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
.color-container{
    margin-top: 30px;
    justify-content: space-around;
    border: solid 2px black;
    background-color: azure;
}
.color-block{
    height: 20px;
    width:20px;
    margin: 10px 0;
}
.center {
    margin-top: 30px;
    margin-left: auto;
    margin-right: auto;
}
.btn-submit {
    margin-top: 100px;
}
.color-btn{
    font-size: 1.5rem;
    width: 250px;
}
input[type="color"]{
    border: none;
    height: 40px;
    width: 100px;
}
.color-buttons {
    justify-content: space-evenly;
    margin-top: 10px;
    align-items: center;
}
.color-used {
    border-radius: 50%;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}
@media (min-width: 768px) {
    .create-field p {
        font-size: 1.5rem;
    }
    .create-field input {
        font-size: 1.5rem;
    }
}
@media (max-width: 768px) {
    .color-btn {
        font-size: 1rem;
    }
}
</style>
