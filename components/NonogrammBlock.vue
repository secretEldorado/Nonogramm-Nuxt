<template>
  <div :class="[isBlack ? 'black-color':'white-color', 'block'] " @click.enter="changeField()">
    <i :class="['fa-sharp','fa-solid', markIcon ? 'fa-xmark' : '']"></i>
  </div>
</template>

<script>
export default {
  props: ['tool', 'id'],
  data() {
    return {
      isBlack: false,
      markIcon: false
    }
  }, 
  methods: {
    changeField(){
      switch(this.tool) {
        case 0 :
          if(!this.isBlack && !this.markIcon)
            this.isBlack = true
          else if(this.isBlack){
            this.isBlack = false
            this.markIcon = true
          } else if(this.markIcon) {
            this.markIcon = false
          }
          this.$emit('change-field', this.id, this.isBlack)
          break
      }
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
  left: 0.15rem;
}
</style>