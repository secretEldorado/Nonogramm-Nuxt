<template>
  <div class="single-line-above">
    <NumbersField v-for="i in numbers.length" :key="i" :value="numbers[i-1]"/>
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
}

.single-line-above p {
    height: 25px;

}
</style>