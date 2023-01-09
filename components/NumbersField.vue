<template>
  <div :class="{ solved: hasSolved}" @click="toggleSolved()" :style="{'color': color }">
    <p>{{ value }}</p>
  </div>
</template>

<script>
export default {
    data(){
        return {
            hasSolved: false,
        }
    },
    props: ['value', 'color'],
    methods: {
        toggleSolved() {
            this.hasSolved = !this.hasSolved
        }
    }
}
</script>

<style>

</style>