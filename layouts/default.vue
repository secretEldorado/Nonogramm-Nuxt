<template>
  <div class="field">
    <AppHeader/>
    <div class="container" :style="{'background-color': color}">
        <Nuxt/>
    </div>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader";
export default {
  components: {
    AppHeader
  },
  created(){
    this.$nuxt.$on('changeBackground', ($event) => this.changeColor($event))
  },
  data(){
    return {
      color: '#e1f8ff'
    }
  },
  methods: {
    changeColor(count){
      switch(count){
        case 0:
          this.color = '#e1f8ff'
          break
        case 1:
          this.color = '#c9ebff'
          break
        case 2:
          this.color = '#abb5ff'
          break
        case 3:
          this.color = '#7475b6'
          break
        case 4:
          this.color = '#5148b2'
          break
        case 5:
          this.color = '#063852'
          break
        // case 56: #063852 #0011A27
      }
    }
  }
};
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Seaweed+Script&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: 'Seaweed', cursive;
  line-height: 1.6;
  background: #f4f4f4;
  display: block;
}
a {
  color: #666;
  text-decoration: none;
}
ul {
  list-style: none;
}
.field {
    margin:10px auto;
    overflow: auto;
}
.error {
  font-size: 1.5rem;
  color: red;
}
input {
  font-family: 'Seaweed', cursive;
}
textarea {
  font-family: 'Seaweed', cursive;
}
.flex {
  display: flex;
}
.container {
    margin:0 auto;
    padding: 0 60px;
    padding-bottom: 10px;
    text-align: center;
    max-width: 1200px;
}

h1 {
  font-size: 3rem;
  padding-top: 25px;
}

.box-playing-field {
    display: grid;
}

.black-color {
    background-color: black;
}

.white-color {
    background-color: white;
}

.btn {
  font-size: 2rem;
  background-color: yellow;
  border: solid green 3px;
  border-radius: 5px;
  margin: 30px auto;
  width: 20%;
  text-align: center;
  box-shadow: 5px 10px 18px #888888;

}
.btn:active {
  background: rgb(182, 182, 6);
  box-shadow: none;
}

.liked {
  color: green !important;
}
@media (max-width: 768px) {
    h1 {
        font-size: 2rem;
    }
    h2 {
      font-size: 1rem;
    }
    .btn {
      width: 200px;
    }
    
}

</style>