<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

defineProps({
    id: {
      type: String,
      default: 'Unknown'
    },
    position: {
      type: String,
      default: 'Unknown'
    },
})

const store = useStore();

const temperature = computed(() => store.state.dht_sensor.temperature);
const humidity = computed(() => store.state.dht_sensor.humidity);
const online = computed(() => store.state.dht_sensor.online);
const currentTime = computed(() => store.state.dht_sensor.currentTime);

function getTemperature_Humidity() {
    store.dispatch('dht_sensor/getTemperature_Humidity');
}

getTemperature_Humidity();
setInterval(getTemperature_Humidity, 10000);
</script>

<template>
    <tr>
        <!-- Name, Data, Position, Online, Last upload -->
        <td>{{ id }}</td>
        <td>Temperature : {{ temperature }}, Humidity : {{ humidity }}</td>
        <td>{{ position }}</td>
        <td>{{ online }}</td>
        <td>{{ currentTime }}</td>
    </tr>
</template>

<style></style>
  