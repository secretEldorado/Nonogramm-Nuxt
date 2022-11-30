<template>
  <div :class="{ solved: hasSolved}" @click="toggleSolved()">
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
    props: ['value'],
    methods: {
        toggleSolved() {
            this.hasSolved = !this.hasSolved
        }
    }
}
</script>

<style>

</style>