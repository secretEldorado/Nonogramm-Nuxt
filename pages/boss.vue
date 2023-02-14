<template>
    <div @click="nextDialog">
        <div class="boss-title">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h1>Alert!</h1>
            <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div class="size-maker"/>
        <div class="boss-wrapper">
            <img src="/exampleDuckOnUFO.png" class="boss-image">
            <div class="dialog-option" :style="{'cursor': showOptions ? 'default':'pointer'}">
                <p @click="changeSituation">Help</p>
                <p @click="changeSituation">F**k u</p>
                <p @click="changeSituation">Get over with</p>
            </div>
        </div>
        <div class="boss-text">
            <p>{{bossText}}</p>
        </div>
    </div>
</template>

<script>
import anime from 'animejs';
export default {
    head () {
      return {
          title: 'ready????',
          meta: [
              {
                  hid: 'description',
                  name: 'boss',
                  content: 'important moment'
              }
          ]
      }
  },
    middleware: 'accessBossStage',
    data(){
        return{
            scaling:0,
            top:0,
            comming: true,
            showOptions:true,
            bossText: 'Hello player',
            dialogCount:0,
        }
    },
    mounted(){
        this.onResize()
        this.comming = false
        anime({
            targets: [".boss-title", ".boss-text"],
            loop:true,
            color: "#ff0000",
            duration: 500,
            easing: 'linear',
            direction: 'alternate'
        })
        const animation = anime({
            targets: ".boss-image",
            scale: this.scaling/2,
            duration: 5000,
            top: this.top,
            easing: 'easeInOutCubic',
        })
        animation.finished.then(this.finishedInitialAnimation)
        // this.comming = true
        window.addEventListener('resize', this.onResize)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    methods:{
        onResize(){
            if(this.comming){
                if (window.innerWidth < 768){
                    this.scaling = 200
                    this.top = 200
                } else {
                    this.scaling = 350
                    this.top = 350
                }
                anime({
                    targets: ".boss-image",
                    scale: this.scaling/2,
                    top: this.top,
                    duration: 1,
                    easing: 'linear',
                })
            }
        },
        finishedInitialAnimation(){
            anime({
                targets: ".boss-text",
                opacity: 1,
                duration: 300,
                easing: 'linear',
            })
            this.comming = true
        },
        nextDialog(){
            if(this.comming){
                switch (this.dialogCount){
                    case 0:
                        this.bossText = "you thought you can play the game peacefully"
                        break
                    case 1:
                        this.bossText = "then u don't understand the situation"
                        break
                    case 2:
                        this.bossText = "my underlings already did the preparations"
                        break
                    case 3:
                        this.bossText = "any last words?"
                        anime({
                            targets: ".dialog-option",
                            opacity: 1,
                            duration: 300,
                            easing: 'linear',
                        })
                        this.showOptions = false
                        break
                    case 4:
                        this.dialogCount--
                        break
                    case 5:
                        anime({
                            targets: ".dialog-option",
                            opacity: 0,
                            duration: 300,
                            easing: 'linear',
                        })
                        this.showOptions = true
                        this.bossText = "well then"
                        break
                    case 6:
                        this.bossText = "if u can beat this nonogramm, then i will let you live"
                        break
                    case 7:
                        this.$router.push("/bosslevel")
                }
                this.dialogCount++
            }
        },
        changeSituation(){
            if(!this.showOptions) this.dialogCount++
        }
    }
}
</script>
<style>
.boss-title{
    display: flex;
    justify-content: center;
    color: blue;
    align-items: center;
    padding-top: 25px ;
}
.boss-title i {
    font-size: 3rem;
}
.boss-title h1 {
    padding: 0 ;
}
.boss-text {
    font-size: 2rem;
    background-color: rgba(255, 0, 0, 0.2);
    color: blue;
    border-bottom: solid blue 4px;
    opacity: 0;
}
.dialog-option{
    border: solid blue 4px;
    height: 150px;
    width: 100px;
    float: left;
    background-color: rgba(255, 0, 0, 0.2);
    left: 200px;
    top: 300px;
    position: relative;
    align-content: space-evenly;
    display: grid;
    border-radius: 5px;
    color: brown;
    opacity: 0;
}
.boss-image{
    height: 2px;
    width: 3px;
    float: left;
    position: relative;
}
.boss-wrapper{
    position: absolute;
    left: 50%;
    top: 100px;
}
.size-maker{
    height: 500px;
}
@media (max-width: 768px) {
    .size-maker{
        height: 300px;
    }
    .boss-title i{
        font-size: 2rem;
    }
    .boss-text p{
        font-size: 1.8rem;
    }
    .dialog-option{
        left: 150px;
        top: 125px;
    }
}
</style>
