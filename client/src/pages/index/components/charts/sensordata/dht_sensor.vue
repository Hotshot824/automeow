<script setup>
import { ref, computed } from 'vue';

defineProps({
    msg: {
        type: String,
        default: 'DHT22'
    },
})

const temperature = ref(null), humidity = ref(null);
const online = ref("OFF")
const currentTime = ref('');

async function fetchTemperature_Humidity() {
    await fetch('/api/dht')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            temperature.value = parseFloat(data.temperature).toFixed(2);
            humidity.value = parseFloat(data.humidity).toFixed(2);
            if (!isNaN(parseFloat(temperature.value)) && !isNaN(parseFloat(humidity.value))) {
                updateCurrentTime();
                online.value = "ON";
            }
        })
        .catch(error => {
            online.value = "OFF";
            console.error(error)
        });
}

fetchTemperature_Humidity();

setInterval(fetchTemperature_Humidity, 10000);

function updateCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentTime.value = `${year}/${month}/${day}/${hours}:${minutes}:${seconds}`;
}
</script>

<template>
    <tr>
        <!-- Name, Data, Position, Online, Last upload -->
        <td>{{ msg }}</td>
        <td>Temperature : {{ temperature }}, Humidity : {{ humidity }}</td>
        <td>Bedroom</td>
        <td>{{ online }}</td>
        <td>{{ currentTime }}</td>
    </tr>
</template>

<style></style>
  