<template>
  <div class="container container-table">
      <div class="row vertical-10p">
        <div class="container">
          <img src="../assets/img/logo.png" class="center-block logo">
          <div class="text-center col-6 col-offset-3">
            <h1>You are lost.</h1>
            <h4>This page doesn't exist.</h4>
            <router-link exact to="/">Take me home.</router-link>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'NotFound'
  }
</script>

<style>
</style>
