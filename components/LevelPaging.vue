<template>
  <div class="paging-container">
    <p v-for="n in size" :key="n" @click="$emit('page-levels', n)">{{n}}</p>
  </div>
</template>

<script>
export default {
    props: ['size']
}
</script>

<style>
.paging-container{
    display: flex;
    justify-content: start;
    overflow: auto;
}
.paging-container p{
    font-size: 1.3rem;
    height: 40px;
    min-width: 40px;
    margin: 10px;
    align-self: center;
    padding: auto;
}
.paging-container p:nth-child(odd){
    background-color: orange;
}
.paging-container p:nth-child(even){
    background-color: lightsalmon;
}
@media (max-width: 768px) {
    .paging-container p{
        font-size: 1rem;
        height: 30px;
        min-width: 30px;
        margin: 0 10px;
    }
}
</style>