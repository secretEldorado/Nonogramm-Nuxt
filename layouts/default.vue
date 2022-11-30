<template>
  <div class="field">
    <AppHeader/>
    <div class="container">
        <Nuxt/>
    </div>
  </div>
</template>

<script>
import AppHeader from "../components/AppHeader";
export default {
  components: {
    AppHeader
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

.container {
    margin:0 auto;
    padding: 0 60px;
    background: lightblue;
    text-align: center;
    max-width: 1200px;
}

h1 {
  font-size: 3rem;
  padding-top: 25px;
}

.btn {
  font-size: 2rem;
  background-color: yellow;
  border: solid green 3px;
  border-radius: 5px;
  padding: 30px auto;
  width: 20%;
  text-align: center;
  box-shadow: 5px 10px 18px #888888;

}
.btn:active {
  background: rgb(182, 182, 6);
  box-shadow: none;
}
@media (max-width: 768px) {
    h1 {
        font-size: 2rem;
    }

    .btn {
      width: 150px;
    }
}

</style>