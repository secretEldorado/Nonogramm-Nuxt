<template>
  <div class="single-line-left" >
    <NumbersField v-for="i in numbers.length" :key="i" :value="numbers[i-1]" :color="colors[i-1]"/>
  </div>
</template>

<script>
export default {
    props: ['numbers', 'colors'],
}
</script>

<style>
.single-line-left{
    background-color: wheat;
    display: flex;
    justify-content: end;
    text-align: center;
    border: solid 1px;
    height: 25px;
    text-shadow: #000 0px 0px 1px;
    -webkit-font-smoothing: antialiased;
}
.single-line-left p {
    width: 25px;
}

@media (max-width: 768px) {
  .single-line-left {
    height: 20px;
  }
  .single-line-left p {
    width: 20px;
    font-size: 0.8rem;
  }
}
</style>