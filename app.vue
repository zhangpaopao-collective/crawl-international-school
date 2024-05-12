<script setup lang="ts">
const { data } = await useFetch('/api/page')
</script>

<template>
  <h1></h1>
  <pre>{{ data }}</pre>
</template>