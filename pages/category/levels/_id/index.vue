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
        <div class="box-playing-field" :style= "{'width': current[0].length * 25 + 'px' , 'grid-template-columns': 'repeat(' + current[0].length +', 1fr)' }">
            <NonogrammBlock v-for="i in size" :key="i" :id="i" :tool="currentTool" @change-field="changeBlock" :ref="'field'">
                
            </NonogrammBlock>
        </div>
    </div>

    <!-- helper icons -->
    <div class="flex helper-container">
        <i :class="['fa-sharp','fa-solid', 'fa-xmark', checkMark ? 'used':'']" @click="setMark"/>
        <div :class="['black-color', 'block', checkBlock ? 'used':'']" @click="setBlock"/>
        <i :class="['fa-solid','fa-arrow-up',checkUp ? 'used':'']" @click="setUpArrow"/>
        <i :class="['fa-solid','fa-arrow-down',checkDown ? 'used':'']" @click="setDownArrow"/>
        <i :class="['fa-solid','fa-arrow-left',checkLeft ? 'used':'']" @click="setLeftArrow"/>
        <i :class="['fa-solid','fa-arrow-right',checkRight ? 'used':'']" @click="setRightArrow"/>
    </div>
    <div class="flex helper-container">
        <p @click="undoAll" :class="{ 'disable-click':turnCount === 0 }">Begin</p>
        <i :class="['fa-solid', 'fa-arrow-rotate-left', turnCount === 0 ? 'disable-click' : '']" @click="undoOne"/>
        <i :class="['fa-solid', 'fa-arrow-rotate-right', turnCount >= turnHistory.length ? 'disable-click' : '']" @click="redoOne"/>
        <p :class="{ 'disable-click':turnCount >= turnHistory.length }" @click="redoAll">set to current Turn</p>
        <p @click="rightTrack">Check Error</p>
    </div>
    <div class=" btn">
      <nuxt-link to='/category'>{{button}}</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
    head () {
        return {
            title: this.title,
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Level'
                }
            ]
        }
    },
    data() {
        return {
            level:{
                title:"",
                body:"",
                color:""
            },
            title: "",
            color:"",
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
            checkMark:false,
            checkBlock:false,
            checkUp:false,
            checkDown:false,
            checkLeft:false,
            checkRight:false,
            turnHistory:[],
            turnCount:0,
        }
    },
    async asyncData({ params, $axios }) {
        const url = `http://localhost:3000/express/getLevel/${params.id}`
        const data = await $axios.get(url)
        return {
            level:data.data
        }
    },
    created(){
        // initialisation and set time//
        const level = this.level
        this.title = level.title
        this.body = level.body
        this.color = level.color
        this.showTime()

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
            row.forEach(item => {
                const number = parseInt(item)
                if(set !== number && count !== 0) {
                    rowArray.push(count)
                    colorArray.push(set)
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
                colorArray.push(set)
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
            for(let j = 0; j<leveldata.length; j++) {
                const number = parseInt(leveldata[j][i])
                if(set !== number && count !== 0) {
                    columnArray.push(count)
                    colorArray.push(set)
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
                colorArray.push(set)
            } 
            this.aboveField.numbers.push(columnArray)
            this.aboveField.colorOfNumber.push(colorArray)
        }
    },
    methods: {
        changeBlock(id, isColor){
            const positionx = ((id - 1) % this.current[0].length)
            const positiony = Math.trunc((id - 1) / this.current[0].length)
            if(isColor) {
                this.current[positiony][positionx] = 1
            } else this.current[positiony][positionx] = 0

            if(this.turnCount < this.turnHistory.length)
                this.turnHistory.splice(this.turnCount, this.turnHistory.length - this.turnCount)
            this.turnHistory.push({
                id,
                value: this.current[positiony][positionx]
            })
            this.turnCount++
            console.log(this.turnHistory)
            let winCount = 0
            for(let i = 0; i < this.current.length; i++) {
                for(let j = 0; j < this.current[0].length; j++) {
                    if(this.current[i][j] === parseInt(this.puzzle[i][j])) {
                        winCount++
                    }
                }
            }
            if(winCount === this.size) {
                this.title = "Congratulations"
                this.button = "Choose a new level"
                this.hasNotSolved = false
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
        uncheckEverything(){
            this.checkMark = false
            this.checkBlock = false
            this.checkUp = false
            this.checkDown = false
            this.checkLeft = false
            this.checkRight = false
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
                if(this.turnHistory[this.turnCount-1].value === 0)
                    this.$refs.field[id-1].isBlack = true
                else this.$refs.field[id-1].clearField()
                this.turnCount--
            }
        },
        redoOne(){
            if(this.turnCount < this.turnHistory.length) {
                const id = this.turnHistory[this.turnCount].id
                if(this.turnHistory[this.turnCount].value === 1)
                    this.$refs.field[id-1].isBlack = true
                else this.$refs.field[id-1].clearField()
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
                    if(this.current[i][j] === 1 && parseInt(this.puzzle[i][j]) === 0) {
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
.used{
    border: red solid 2px !important;
}
.disable-click{
    pointer-events: none;
    opacity: 50%;
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
@media (max-width: 768px) {
    #clock {
        font-size: 1.5rem;
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