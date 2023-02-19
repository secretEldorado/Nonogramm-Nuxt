<template>
  <div>
    <h1>{{title}}</h1>
    <div id = "clock">{{time}}</div>
    <p>{{ checkError }}</p>
    <!-- game -->
    <div class="box">
        <div class="box-empty">

        </div>
        <div class="box-above-field">
            <AboveField v-for="i in aboveField.numbers.length" :key="i" :numbers="aboveField.numbers[i-1]" :colors="aboveField.colorOfNumber[i-1]"></AboveField>
        </div>
        <div class="box-left-field">
            <LeftField v-for="i in leftField.numbers.length" :key="i" :numbers="leftField.numbers[i-1]" :colors="leftField.colorOfNumber[i-1]"></LeftField>
        </div>
         <!-- :style="{width: 125px, grid-template-columns: repeat(5, 1fr)} -->
        <div class="box-playing-field" :style= "{'width': current[0].length * blockSize + 'px' , 'grid-template-columns': 'repeat(' + current[0].length +', 1fr)' }">
            <NonogrammBlock v-for="i in size" :key="i" :id="i" :tool="currentTool" @change-field="changeBlock" :color="colors" :ref="'field'">
                
            </NonogrammBlock>
        </div>
    </div>

    <!-- helper icons -->
    <div class="flex helper-container">
        <i :class="['fa-sharp','fa-solid', 'fa-xmark', checkMark ? 'used':'']" @pointerdown="setMark"/>
        <div :class="['black-color', 'block', checkBlock ? 'used':'']" @pointerdown="setBlock"/>
        <i :class="['fa-solid','fa-arrow-up',checkUp ? 'used':'']" @pointerdown="setUpArrow"/>
        <i :class="['fa-solid','fa-arrow-down',checkDown ? 'used':'']" @pointerdown="setDownArrow"/>
        <i :class="['fa-solid','fa-arrow-left',checkLeft ? 'used':'']" @pointerdown="setLeftArrow"/>
        <i :class="['fa-solid','fa-arrow-right',checkRight ? 'used':'']" @pointerdown="setRightArrow"/>
    </div>
    <div class="flex helper-container">
        <p @pointerdown="undoAll" :class="{ 'disable-click':turnCount === 0 }">Begin</p>
        <i :class="['fa-solid', 'fa-arrow-rotate-left', turnCount === 0 ? 'disable-click' : '']" @pointerdown="undoOne"/>
        <i :class="['fa-solid', 'fa-arrow-rotate-right', turnCount >= turnHistory.length ? 'disable-click' : '']" @pointerdown="redoOne"/>
        <p :class="{ 'disable-click':turnCount >= turnHistory.length }" @pointerdown="redoAll">set to current Turn</p>
        <p @pointerdown="rightTrack" :class="{ 'disable-click' : !hasNotSolved}">Check Error</p>
    </div>
    <div class="flex color-container" v-if="checkOtherColors">
        <div v-for="(color, index) in colors" :key="color">
            <div :class="['block', checkColor[index] ? 'used':'']" :style="{'background-color': color}" @pointerdown="setColor(index)"/>
        </div>
    </div>
    <!-- comments -->
    <div v-if="mode!=='boss'">
        <h2 @pointerdown="lookAtComments">Comments:</h2>
        <div v-if="seeComment" class="comment-section">
            <div class="flex">
                <p>refresh Comment: </p>
                <i class="fa-solid fa-arrow-rotate-right" @pointerdown="refreshComments"/>
            </div>
            <div v-for="comment in comments" :key="comment.id" class="comment-container">
                <div class="comment-header">
                    <p><b>created by:</b> {{comment.username}}</p>
                    <p><b>on:</b> {{comment.createdAt}}</p>
                    <div class="like-section">
                    <div><b>Likes:</b> {{comment.countLike}}</div>
                    <div v-if="$auth.loggedIn && ($auth.$state.user.user_name !== comment.username)">
                        <i :class="['fa-sharp', 'fa-solid', 'fa-thumbs-up', comment.userLikedComment ? 'liked' : '']" @pointerdown="likeComment(comment.id)"></i>
                    </div>
                </div>
                </div>
                <div>{{comment.body}}</div>
            </div>
            <form v-if="$auth.loggedIn" @submit.prevent="sendComment" method="post">
                <textarea v-model="commentBody" rows="10" cols="30" placeholder="Your comment"/>
                <input type="submit" class="btn" :disabled="!commentBody" value="submit comment">
            </form>
        </div>
    </div>
    <!-- images -->
    <img src="/exampleDuck.png" id="duckOne" :ref="'duck1'" :class="{'show-duck':showDuck[0]}">
    <img src="/exampleDuck.png" id="duckTwo" :ref="'duck2'" :class="{'show-duck':showDuck[1]}">
    <img src="/exampleDuck.png" id="duckThree" :ref="'duck3'" :class="{'show-duck':showDuck[2]}">
    <div class=" btn" v-if="mode === 'normal' || title === 'Game Over' ||!hasNotSolved">
      <nuxt-link to='/category'>{{button}}</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
    props: ['mode', 'level'],
    head () {
        return {
            title: 'Level: ' + this.title,
            meta: [
                {
                    hid: 'description',
                    name: 'level',
                    content: 'Level'
                }
            ]
        }
    },
    data() {
        return {
            title: "",
            colors:[],
            time: "",
            button: "back to level",
            checkError: "",
            tempmm:0,
            tempss:0,
            mm:0,
            ss:0,
            start:false,
            hasNotSolved:true,
            puzzle:[],
            current:[],
            leftField:{
                numbers:[],
                colorOfNumber:[]
            },
            aboveField:{
                numbers:[],
                colorOfNumber:[]
            },
            size:0,
            currentTool:0,
            usedColor:1,
            checkMark:false,
            checkBlock:false,
            checkColor:[],
            checkUp:false,
            checkDown:false,
            checkLeft:false,
            checkRight:false,
            turnHistory:[],
            turnCount:0,
            seeComment: false,
            alreadyLoaded: false,
            comments:[],
            commentBody:"",
            checkOtherColors:false,
            showDuck:[false, false, false],
            blockSize: 25,
            url:''
        }
    },
    created(){
        if(process.env.NODE_ENV === 'development'){
            this.url = 'http://localhost:3000'
        } else {
            this.url = 'https://www.secreteldorado.com'
        }
        // initialisation and set time//
        const level = this.level
        this.title = level.title
        this.body = level.body
        this.colors = level.color.split(",")
        this.colors = this.colors.map(color => {
            if(color === '1') return '#000000'
            else if(color !== '1'){
                if(this.colors[0] === '#000000')
                    this.colors.shift()
                this.checkOtherColors = true
                this.checkColor.push(false)
                return color
            } return color
        })
        if(this.colors[0] === '#000000')
            this.colors.shift()
        if(this.mode === 'normal') this.showTime()
        if(this.mode === 'boss') this.countDown()

        // translate to multidimensional array and set the array//
        const leveldata = level.body.split(",")
        for(let i = 0; i<leveldata.length; i++) {
            this.puzzle[i] = [...leveldata[i]]
            const row = []
            for(let j = 0; j<this.puzzle[i].length; j++) {
                row.push(0)
            }
            this.current.push(row)
        }
        this.size = leveldata[0].length * leveldata.length

        // box left of the field //
        this.puzzle.forEach(row => {
            const rowArray = []
            const colorArray=[]
            let count = 0
            let set = 0
            let haveUsed = false
            let setColor
            row.forEach(item => {
                const number = parseInt(item)
                if(set !== number && count !== 0) {
                    rowArray.push(count)
                    if(set === 1 || count === 0) setColor = '#000000'
                    else setColor = this.colors[set-2]
                    colorArray.push(setColor)
                    if(number === 0){
                        count = 0
                    } else {
                        count = 1
                    }
                    haveUsed = true
                    
                } else if(number !== 0) {
                    count++
                }
                set = number
            })
            if(!(haveUsed) || count !==0) {
                rowArray.push(count)
                let setColor
                if(set === 1 || count === 0) setColor = '#000000'
                else setColor = this.colors[set-2]
                colorArray.push(setColor)
            } 
            this.leftField.numbers.push(rowArray)
            this.leftField.colorOfNumber.push(colorArray)
        })

        // box above the field//
        for(let i = 0; i<leveldata[0].length; i++) {
            const columnArray = []
            const colorArray=[]
            let count = 0
            let set = 0
            let haveUsed = false
            let setColor
            for(let j = 0; j<leveldata.length; j++) {
                const number = parseInt(leveldata[j][i])
                if(set !== number && count !== 0) {
                    columnArray.push(count)
                    if(set === 1 || count === 0) setColor = '#000000'
                    else setColor = this.colors[set-2]
                    colorArray.push(setColor)
                    if(number === 0){
                        count = 0
                    } else {
                        count = 1
                    }
                    haveUsed = true
                } else if(number !== 0) {
                    count++
                }
                set = number
            }
            if(!(haveUsed) || count !==0) {
                columnArray.push(count)
                if(set === 1 || count === 0) setColor = '#000000'
                else setColor = this.colors[set-2]
                colorArray.push(setColor)
            } 
            this.aboveField.numbers.push(columnArray)
            this.aboveField.colorOfNumber.push(colorArray)
        }
    },
    mounted(){
        // move ducks if a number of puzzles is solved (locally)
        const number = this.$store.getters.getCompletedStatus.length
        const ifBeaten = this.$store.getters.getBeatenBossStatus
        if(!ifBeaten) this.animateDuck(number)
        this.onResize()
        window.addEventListener('resize', this.onResize)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    methods: {
        async changeBlock(id, isColor){
            const positionx = ((id - 1) % this.current[0].length)
            const positiony = Math.trunc((id - 1) / this.current[0].length)
            const prevValue = this.current[positiony][positionx]
            if(isColor) {
                this.current[positiony][positionx] = this.usedColor
            } else this.current[positiony][positionx] = 0

            if(this.turnCount < this.turnHistory.length)
                this.turnHistory.splice(this.turnCount, this.turnHistory.length - this.turnCount)
            this.turnHistory.push({
                id,
                value: this.current[positiony][positionx],
                prevValue
            })
            this.turnCount++
            let winCount = 0
            for(let i = 0; i < this.current.length; i++) {
                for(let j = 0; j < this.current[0].length; j++) {
                    if(this.current[i][j] === parseInt(this.puzzle[i][j])) {
                        winCount++
                    }
                }
            }
            if(winCount === this.size) {
                if(this.mode === 'normal'){
                    const ifBeaten = this.$store.getters.getBeatenBossStatus
                    if(this.$auth.loggedIn){
                        try{
                            const response = await this.$axios.post(this.url + '/express/completedLevel', {
                                user_id: this.$auth.state.user.id,
                                level_id: this.$route.params.id
                            }).catch(({response}) => {
                                return response
                            })
                            if(response.status >= 400) {
                                throw new Error(response.data.body)
                            }
                        } catch(error) {
                            this.checkError = error
                            this.tempmm = this.mm
                            this.tempss = this.ss
                        }
                    }
                    this.$store.commit('addCompletedLevel', this.$route.params.id)
                    const number = this.$store.getters.getCompletedStatus.length
                    this.title = "Congratulations"
                    this.button = "Choose a new level"
                    this.hasNotSolved = false
                    if(!ifBeaten){
                        this.$nuxt.$emit('changeBackground', number)
                        if(number > 5){
                            this.$router.push("/boss")
                        }
                    }
                } else if(this.mode === 'boss'){
                    this.title = "Congratulations"
                    this.checkError = "you have escaped for now"
                    this.button = "back to normal"
                    this.hasNotSolved = false
                    this.$nuxt.$emit('changeBackground', 0)
                    this.$store.commit('toggleBeatenBossStatus')
                }
            }
        },
        setMark() {
            if(!this.checkMark) {
                this.uncheckEverything()
                this.checkMark = true
            }
            else
                this.checkMark = !this.checkMark
            if(this.checkMark)
                this.currentTool = 11
            else 
                this.currentTool = 0
        },
        setBlock(){
            if(!this.checkBlock) {
                this.uncheckEverything()
                this.checkBlock = true
            }
            else
                this.checkBlock = !this.checkBlock
            if(this.checkBlock)
                this.currentTool = 10
            else 
                this.currentTool = 0
        },
        setUpArrow(){
            if(!this.checkUp) {
                this.uncheckEverything()
                this.checkUp = true
            }
            else
                this.checkUp = !this.checkUp
            if(this.checkUp)
                this.currentTool = 12
            else 
                this.currentTool = 0
        },
        setDownArrow(){
            if(!this.checkDown) {
                this.uncheckEverything()
                this.checkDown = true
            }
            else
                this.checkDown = !this.checkDown
            if(this.checkDown)
                this.currentTool = 13
            else 
                this.currentTool = 0
        },
        setLeftArrow(){
            if(!this.checkLeft) {
                this.uncheckEverything()
                this.checkLeft = true
            }
            else
                this.checkLeft = !this.checkLeft
            if(this.checkLeft)
                this.currentTool = 14
            else 
                this.currentTool = 0
        },
        setRightArrow(){
            if(!this.checkRight) {
                this.uncheckEverything()
                this.checkRight = true
            }
            else
                this.checkRight = !this.checkRight
            if(this.checkRight)
                this.currentTool = 15
            else 
                this.currentTool = 0
        },
        setColor(index){
            if(!this.checkColor[index]) {
                this.uncheckEverything()
                this.checkColor[index] = true
            }
            else
                this.checkColor[index] = !this.checkColor[index]
            if(this.checkColor[index]){
                this.usedColor = index + 2
                this.currentTool = 9 - index
            }
            else 
                this.currentTool = 0
        },
        uncheckEverything(){
            this.checkMark = false
            this.checkBlock = false
            this.checkUp = false
            this.checkDown = false
            this.checkLeft = false
            this.checkRight = false
            for(let i = 0; i < this.checkColor.length; i++){
                this.checkColor[i] = false
            }
            this.usedColor = 1
        },
        undoAll(){
            if(this.turnCount > 0) {
                while(this.turnCount > 0){
                    this.undoOne()
                }
            }
        },
        undoOne(){
            if(this.turnCount > 0){
                const id = this.turnHistory[this.turnCount-1].id
                const prevValue = this.turnHistory[this.turnCount-1].prevValue
                this.current[parseInt((id-1)/this.current[0].length)][(id-1)%this.current[0].length] = prevValue
                if(prevValue === 0)
                    this.$refs.field[id-1].clearField()
                else if(prevValue === 1){
                    this.$refs.field[id-1].clearField()
                    this.$refs.field[id-1].isBlack = true
                }
                else{
                    this.$refs.field[id-1].clearField()
                    this.$refs.field[id-1].isColor = prevValue-1
                }
                this.turnCount--
            }
        },
        redoOne(){
            if(this.turnCount < this.turnHistory.length) {
                const id = this.turnHistory[this.turnCount].id
                const value = this.turnHistory[this.turnCount].value
                this.current[parseInt((id-1)/this.current[0].length)][(id-1)%this.current[0].length] = value
                if(value === 0)
                    this.$refs.field[id-1].clearField()
                else if(value === 1){
                    this.$refs.field[id-1].clearField()
                    this.$refs.field[id-1].isBlack = true
                }
                else{
                    this.$refs.field[id-1].clearField()
                    this.$refs.field[id-1].isColor = value-1
                }
                this.turnCount++
            }
        },
        redoAll(){
            if(this.turnCount < this.turnHistory.length) {
                while(this.turnCount < this.turnHistory.length){
                    this.redoOne()
                }
            }
        },
        rightTrack(){
            let errorCount = 0
            for(let i = 0; i < this.current.length; i++) {
                for(let j = 0; j < this.current[0].length; j++) {
                    if(this.current[i][j] > 0 && parseInt(this.puzzle[i][j]) !== this.current[i][j]) {
                        errorCount++
                    }
                }
            }
            if(errorCount > 1){
                this.checkError = "more than one field is mistakenly filled"
            } else if(errorCount > 0) {
                this.checkError = "one field is mistakenly filled"
            } else {
                this.checkError = "you are on the right track"
            }
            this.tempmm = this.mm
            this.tempss = this.ss
        },
        async lookAtComments(){
            this.seeComment = !this.seeComment
            if(this.seeComment && !this.alreadyLoaded){
                let user = ''
                if(this.$auth.loggedIn) user = `?user_id=${this.$auth.$state.user.id}` 
                const url = this.url + `/express/getComments/${this.$route.params.id}` + user
                const response = await this.$axios.get(url).catch(({response}) => {
                    return response
                })
                if(response.status >= 400) {
                    this.checkError = response.data.body
                    this.tempmm = this.mm
                    this.tempss = this.ss
                } else {
                    this.comments = response.data
                    this.alreadyLoaded = true
                }
            }
        },
        refreshComments(){
            this.alreadyLoaded = false
            this.lookAtComments()
            this.lookAtComments()
        },
        async sendComment(){
            if(this.commentBody){
                const response = await this.$axios.post(this.url + '/express/createComment', {
                    body: this.commentBody,
                    level_id: this.$route.params.id,
                    user_id: this.$auth.state.user.id
                }).catch(({response}) => {
                    return response
                })
                if(response.status >= 400) {
                    this.checkError = response.data.body
                    this.tempmm = this.mm
                    this.tempss = this.ss
                } else {
                    alert(response.data.msg)
                    this.refreshComments()
                }
            }
        },
        async likeComment(id){
            const index = this.comments.findIndex(item => item.id === id)
            if(index >= 0 && index < this.comments.length){
                const response = await this.$axios.post(this.url + '/express/likeComment', {
                user_id: this.$auth.state.user.id,
                comment_id: id
                }).catch(({response}) => {
                    return response
                })
                if(response.status >= 400) {
                    this.checkError = response.data.body
                    this.tempmm = this.mm
                    this.tempss = this.ss
                } else {
                    if(this.comments[index].userLikedComment) {
                        this.comments[index].countLike--
                    } else this.comments[index].countLike++
                    this.comments[index].userLikedComment = !this.comments[index].userLikedComment
                }
            }
        },
        onResize(){
            if (window.innerWidth < 768){
                this.blockSize = 20
            } else this.blockSize = 25
        },
        animateDuck(number){
            switch(number){
                case 0:
                    break
                case 1:
                    this.showDuck[0] = true
                    break
                case 2:
                    this.showDuck[1] = true
                    break
                case 3:
                    this.showDuck[2] = true
                    break
                case 4:
                    this.showDuck[0] = true
                    this.showDuck[1] = true
                    break
                default:
                    this.showDuck[0] = true
                    this.showDuck[1] = true
                    this.showDuck[2] = true
            }
        },
        showTime() {
            let mm = this.mm
            let ss = this.ss
            if(!this.start) {
                mm = 0
                ss = 0
            } else {
                ss++
                mm = parseInt(mm)
            }

            if(ss > 59) {
                mm++
                ss = 0
            }

            if(ss > parseInt(this.tempss) + 5 || (ss+60 > parseInt(this.tempss) + 5 && mm > parseInt(this.tempmm))) {
                this.checkError = ""
            }

            mm = (mm < 10) ? "0" + mm : mm
            ss = (ss < 10) ? "0" + ss : ss
            
            this.time = mm + ":" + ss
            this.mm = mm
            this.ss = ss
            this.start = true
            setTimeout(() => {
                if(this.hasNotSolved){
                    this.showTime()
                }
            }, 1000)
        },
        countDown() {
            let mm = this.mm
            let ss = this.ss
            if(parseInt(mm) === 0 && parseInt(ss) === 0 && this.start){
                this.title = "Game Over"
                this.checkError = "Ur time is up!! Get ready to be abduckted!!!"
                return
            }
            if(!this.start) {
                mm = 20
                ss = 0
            } else {
                ss--
                mm = parseInt(mm)
            }
            if(ss < 0) {
                mm--
                ss = 59
            }

            if(ss < parseInt(this.tempss) - 5 || (ss-60 < parseInt(this.tempss) - 5 && mm < parseInt(this.tempmm))) {
                this.checkError = ""
            }

            mm = (mm < 10) ? "0" + mm : mm
            ss = (ss < 10) ? "0" + ss : ss
            
            this.time = mm + ":" + ss
            this.mm = mm
            this.ss = ss
            this.start = true
            setTimeout(() => {
                if(this.hasNotSolved){
                    this.countDown()
                }
            }, 1000)
        }
    }
    
}
</script>

<style>
#clock{
    text-align: center;
    font-size: 3rem;
    margin-top: 60px;
}
.box {
    margin: 50px auto;
    display: grid;
    justify-content: center;
    width: fit-content;
    grid-template-columns: repeat(2, 1fr);
    line-height: 1.563;
}

.box-above-field {
    display: flex;
}

.helper-container {
    margin-bottom: 20px;
    border: solid 2px;
    background-color: beige;
    justify-content: space-around;
    height: 30px;
    align-items: center;
}
.helper-container .block {
    height: 20px;
    width: 20px;
    border: none
}
.color-container {
    margin-bottom: 20px;
    border: solid 2px;
    background-color: #FFF;
    justify-content: space-around;
    height: 30px;
    align-items: center;
}
.color-container .block {
    height: 20px;
    width: 20px;
    border: solid black 1px;
}
.used{
    border: red solid 2px !important;
}
.disable-click{
    pointer-events: none;
    opacity: 0.5;
}

.box-left-field {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: fit-content;
    margin-right: 0;
    margin-left: auto;
}

.box-playing-field {
    display: grid;
}

.solved {
    position: relative;
}

.black-color {
    background-color: black;
}

.white-color {
    background-color: white;
}

.solved::after{
    content: '';
    position:absolute;
    height: 3px;
    right: 0;
    left: 0;
    top: 10px;
    background: gray;
    transform: skewY(-45deg);
    -webkit-transform: skewY(-45deg);
    -moz-transform: skewY(-45deg);
    -ms-transform: skewY(-45deg);
}

.comment-section .flex{
    align-items: center;
}
.comment-section .comment-container {
    display: grid;
    border: solid 2px;
    grid-template-columns: 30% 70%;
    justify-content: space-around;
    align-items: center;
    background-color: pink;
    margin-top: 10px;
}
.comment-section .comment-header {
    display: block;
    font-size: 0.8rem;
    border-right: solid 2px;
    background-color: rgb(255, 215, 222);
}
.comment-section form {
    display: flex;
    flex-direction: column;
}
.comment-section .btn {
    margin: 10px 30px !important;
    font-size: 1rem !important;
}
.comment-section textarea {
    margin-top: 20px;
    font-size: 1.5rem;
}

.like-section {
    display: flex;
    justify-content: space-around;
}
#duckOne {
    padding: 5px;
    width: 150px;
    position: absolute;
    top: 100px;
    opacity: 0;
    animation-duration: 5s;
    animation-name: moveDuck;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}
#duckTwo {
    padding: 5px;
    width: 150px;
    position: fixed;
    left:-webkit-calc(80% - 75px);
    left:-moz-calc(80% - 75px);
    left:calc(80% - 75px);
    opacity: 0;
    animation-duration: 5s;
    animation-name: moveDuck2;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}
#duckThree {
    padding: 5px;
    width: 150px;
    position: fixed;
    left: 30px;
    top: 400px;
    opacity: 0;
    animation-duration: 10s;
    animation-name: moveDuck3;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}
.show-duck{
    opacity: 1 !important;
}
@keyframes moveDuck2 {
    from {
        top: 0%;
    }
    to {
        top: calc(100% - 150px);
        top: -webkit-calc(100% - 150px);
        top: -moz-calc(100% - 150px);
    }
}

@keyframes moveDuck {
    from {
        left: 0;
    }
    to {
        left: calc(100% - 150px);
        left: -webkit-calc(100% - 150px);
        left: -moz-calc(100% - 150px);
    }
}

@keyframes moveDuck3 {
    from {
        left: 0;
    }
    to {
        left: calc(100% - 150px);
        left: -webkit-calc(100% - 150px);
        left: -moz-calc(100% - 150px);
    }
}

@media (max-width: 768px) {
    #clock {
        font-size: 1.5rem;
    }
    .comment-section .comment-container {
        display: block;
        margin: 5px auto;
    }
    .comment-section .comment-header {
        display: flex;
        justify-content: space-around;
        border: none
    }
    .comment-section .btn {
        font-size: 0.8rem !important;
        margin: 10px auto;
    }
    .comment-section textarea {
        font-size: 1rem;
    }

    .like-section {
        display: block;
    }
}
@media (min-width: 768px) {
    .helper-container {
        font-size: 1.5rem;
        height: 40px;
    }
    .helper-container .block {
        height: 25px;
        width: 25px;
        border: none
    }
}
</style>

<style scoped>
.btn {
    margin: 100px auto;
}
@media (max-width: 768px) {
    .btn {
        font-size: 1.5rem;
        width: 200px;
    }
}
</style>