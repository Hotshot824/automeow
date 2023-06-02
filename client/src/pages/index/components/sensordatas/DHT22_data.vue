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
const time = computed(() => store.state.DHT22.time);
</script>

<template>
    <tr>
        <!-- Name, Data, Position, Online, Last upload -->
        <td>{{ id }}</td>
        <td>Temperature : {{ temperature }}, Humidity : {{ humidity }}</td>
        <td>{{ position }}</td>
        <td>{{ online ? 'Active' : 'Inactive' }}</td>
        <td>{{ time }}</td>
    </tr>
</template>

<style></style>
  