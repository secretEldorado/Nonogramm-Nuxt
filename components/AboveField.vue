<template>
  <div class="single-line-above">
    <NumbersField v-for="i in numbers.length" :key="i" :value="numbers[i-1]" :color="colors[i-1]" />
  </div>
</template>

<script>
export default {
    props: ['numbers', 'colors'],
}
</script>

<style>
.single-line-above{
    background-color: wheat;
    display: flex;
    flex-direction: column;
    justify-content: end;
    text-align: center;
    border: solid 1px;
    width: 25px;
    text-shadow: #000 0px 0px 1px;
    -webkit-font-smoothing: antialiased;
}

.single-line-above p {
    height: 25px;

}

@media (max-width: 768px) {
  .single-line-above {
    width: 20px;
  }
  .single-line-above p {
    height: 20px;
    font-size: 0.8rem;
  }
}
</style>