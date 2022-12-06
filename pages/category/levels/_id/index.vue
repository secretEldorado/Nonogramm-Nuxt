<template>
  <div>
    <h1>{{title}}</h1>
    <div id = "clock">{{time}}</div>

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
            <NonogrammBlock v-for="i in size" :key="i" :id="i" :tool="currentTool" @change-field="changeBlock">
                
            </NonogrammBlock>
        </div>
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
            switch(this.currentTool){
                case 0:
                    if(isColor) {
                        this.current[positiony][positionx] = 1
                    } else this.current[positiony][positionx] = 0
                    break
            }
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
                this.hasNotSolved = false
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