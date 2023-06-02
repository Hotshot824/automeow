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

const temperature = computed(() => store.state.DHT22.temperature);
const humidity = computed(() => store.state.DHT22.humidity);
const online = computed(() => store.state.DHT22.online);
const current_time = computed(() => store.state.DHT22.current_time);

function getData() {
    store.dispatch('DHT22/getData');
}

getData();
setInterval(getData, 10000);
</script>

<template>
    <tr>
        <!-- Name, Data, Position, Online, Last upload -->
        <td>{{ id }}</td>
        <td>Temperature : {{ temperature }}, Humidity : {{ humidity }}</td>
        <td>{{ position }}</td>
        <td>{{ online ? 'Active' : 'Inactive' }}</td>
        <td>{{ current_time }}</td>
    </tr>
</template>

<style></style>
  