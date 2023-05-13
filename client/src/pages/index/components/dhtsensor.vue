<script setup>
import { ref } from 'vue';

defineProps({
  msg: String,
})

const temperature = ref(null), humidity = ref(null);

async function fetchTemperature_Humidity() {
  await fetch('/api/dht')
  .then(response => response.json())
  .then(data => {
    temperature.value = parseFloat(data.temperature).toFixed(2);
    humidity.value = parseFloat(data.humidity).toFixed(2);
  })
  .catch(error => {
    console.error(error)
  });
}

fetchTemperature_Humidity();

setInterval(fetchTemperature_Humidity, 10000);
</script>

<template>
  <h1>{{ msg }}</h1>
  <div>
    <h5>Temperature: {{ temperature }} &#8451;</h5>
    <h5>Humidity: {{ humidity }} &#8451;</h5>
  </div>
</template>

<style scoped>
</style>
