<script setup>
import navbar from './components/navbar.vue'
import sidenav from './components/sidenav.vue'
import content from './components/content.vue'
import dht_sensor from './components/dhtsensor.vue'
</script>

<template>
  <div class="sb-nav-fixed">
    <navbar />
    <div id="layoutSidenav">
    <sidenav />
    <content />
  </div>
  </div>
  <!-- <dht_sensor msg="DHT22" /> -->
</template>

<style></style>
