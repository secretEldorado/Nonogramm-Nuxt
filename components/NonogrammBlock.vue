<template>
  <div :class="[isBlack ? 'black-color':'white-color', 'block'] " @click.enter="changeField()">
    <i :class="['fa-sharp','fa-solid', markIcon ? 'fa-xmark' : '', upIcon ? 'fa-arrow-up' : '', downIcon ? 'fa-arrow-down' : '', upDownIcon ? 'fa-arrows-up-down' : '', leftIcon ? 'fa-arrow-left' : '', rightIcon ? 'fa-arrow-right' : '', leftRightIcon ? 'fa-arrows-left-right' : '']"></i>
  </div>
</template>

<script>
export default {
  props: ['tool', 'id'],
  data() {
    return {
      isBlack: false,
      markIcon: false,
      upIcon: false,
      downIcon: false,
      upDownIcon: false,
      leftIcon: false,
      rightIcon: false,
      leftRightIcon: false
    }
  }, 
  methods: {
    changeField(){
      switch(this.tool) {
        case 0 :
          if(this.markIcon || this.upIcon || this.downIcon || this.upDownIcon || this.leftIcon || this.rightIcon || this.leftRightIcon) {
            this.clearField()
          }
          else if(!this.isBlack){
            this.clearField()
            this.isBlack = true
            this.$emit('change-field', this.id, this.isBlack)
          }
          else if(this.isBlack){
            this.clearField()
            this.markIcon = true
            this.$emit('change-field', this.id, this.isBlack)
          }
          break
        case 10 :
          if(!this.isBlack){
            this.clearField()
            this.isBlack = true
          }
          else if(this.isBlack)
            this.isBlack = false
          this.$emit('change-field', this.id, this.isBlack)
          break
        case 11 :
          if(!this.markIcon) {
            if(this.isBlack)
              this.$emit('change-field', this.id, this.isBlack)
            this.clearField()
            this.markIcon = true
          } else if(this.markIcon)
            this.markIcon = false
          break
        case 12 :
          if(this.downIcon) {
            this.downIcon = false
            this.upDownIcon = true
          } else if(this.upDownIcon) {
            this.upDownIcon = false
            this.downIcon = true
          } else if(!this.upIcon) {
            if(this.isBlack)
              this.$emit('change-field', this.id, this.isBlack)
            this.clearField()
            this.upIcon = true
          } else if(this.upIcon)
            this.upIcon = false
          break
        case 13 :
          if(this.upIcon) {
            this.upIcon = false
            this.upDownIcon = true
          } else if(this.upDownIcon) {
            this.upDownIcon = false
            this.upIcon = true
          } else if(!this.downIcon) {
            if(this.isBlack)
              this.$emit('change-field', this.id, this.isBlack)
            this.clearField()
            this.downIcon = true
          } else if(this.downIcon)
            this.downIcon = false
          break
        case 14 :
          if(this.rightIcon) {
            this.rightIcon = false
            this.leftRightIcon = true
          } else if(this.leftRightIcon) {
            this.leftRightIcon = false
            this.rightIcon = true
          } else if(!this.leftIcon) {
            if(this.isBlack)
              this.$emit('change-field', this.id, this.isBlack)
            this.clearField()
            this.leftIcon = true
          } else if(this.leftIcon)
            this.leftIcon = false
          break
        case 15 :
          if(this.leftIcon) {
            this.leftIcon = false
            this.leftRightIcon = true
          } else if(this.leftRightIcon) {
            this.leftRightIcon = false
            this.leftIcon = true
          } else if(!this.rightIcon) {
            if(this.isBlack)
              this.$emit('change-field', this.id, this.isBlack)
            this.clearField()
            this.rightIcon = true
          } else if(this.rightIcon)
            this.rightIcon = false
          break
      }
    },
    clearField(){
      this.isBlack = false
      this.markIcon = false
      this.upIcon = false
      this.downIcon = false
      this.upDownIcon = false
      this.leftIcon = false
      this.rightIcon = false
      this.leftRightIcon = false
    }
  }
}
</script>

<style>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css";
.block {
    border: solid 1px;
    height: 25px;
    font-size: 1.8rem;
    overflow: hidden;
    position: relative;
}
.block i {
  position: absolute;
}
.block .fa-xmark {
  left: 0.15rem
}
.block .fa-arrow-left {
  left: -0.1rem;
  top: -0.11rem
}
.block .fa-arrow-right {
  left: -0.1rem;
  top: -0.11rem
}
.block .fa-arrows-left-right {
  font-size: 1.5rem;
  left: -0.05rem;
  top: 0rem
}
.block .fa-arrow-up {
  left: 0.05rem;
  top: -0.15rem
}
.block .fa-arrow-down {
  left: 0.05rem;
  top: -0.15rem
}
.block .fa-arrows-up-down {
  font-size: 1.5rem;
  left: 0.25rem;
  top: -0.05rem
}
</style>