<script setup lang="ts">
const { data } = await useFetch('/api/page')
</script>

<template>
  <h1>这就是我鹏哥，无敌好吧</h1>
  <pre>{{ data }}</pre>
</template>