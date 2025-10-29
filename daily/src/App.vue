<script setup>
</script>

<template>
  <h1>Hello App!</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/home">Go to Home</RouterLink>
    <br></br>
    <RouterLink to="/login">Go to login</RouterLink>
    <br></br>
    <RouterLink to="/auth/callback">Go to auth/callback</RouterLink>

  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
</style>

