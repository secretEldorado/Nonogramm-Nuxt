<template>
    <form @submit.prevent="onSearch">
        <div class="search">
            <input type="text" v-model="text"
            placeholder="Search Level...">
            <select v-model="selection">
                <option>title</option>
                <option>name</option>
            </select>
            <input type="submit" value="Search Level">
        </div>
    </form>
</template>

<script>
export default {
    name: 'SearchLevel',
    data() {
        return {
            text: '',
            selection: 'title'
        }
    },
    methods: {
        onSearch(){
            this.$emit('search-level', this.text,this.selection)
            this.text = ""
            this.selection = "title"
        }
    }
}
</script>

<style>
.search {
    text-align: left;
    margin: 10px 0;
    margin-bottom: 20px;
}
.search input[type="text"] {
  border: none;
  margin-right: 20px;
  font-size: 1.5rem;
}
.search input[type="text"]:focus-visible {
  outline:solid lightgreen;
}
.search input[type="submit"] {
  border: none;
  width: 170px;
  font-size: 1.5rem;
}
.search select{
  border: none;
  font-size: 1.5rem;
  padding: 0 2px;
  font-family: 'Seaweed', cursive;
  margin-right: 20px;
}
.search select:focus-visible {
  outline:none;
}
@media (max-width: 768px) {
    .search input[type="submit"] {
        width: 110px;
        font-size: 1rem;
    }
    .search input[type="text"] {
        margin-right: 10px;
        font-size: 1rem;
    }
    .search select {
        margin-right: 10px;
        font-size: 1rem;
    }
}
</style>