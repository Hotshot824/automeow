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

const device_name = computed(() => store.state.DHT22.device_name);
const device_position = computed(() => store.state.DHT22.device_position);
const temperature = computed(() => store.state.DHT22.temperature);
const humidity = computed(() => store.state.DHT22.humidity);
const online = computed(() => store.state.DHT22.online);
const time = computed(() => store.state.DHT22.time);
</script>

<template>
    <tr>
        <!-- Name, Data, Position, Online, Last upload -->
        <td>{{ device_name }}</td>
        <td>Temperature : {{ temperature }}, Humidity : {{ humidity }}</td>
        <td>{{ device_position }}</td>
        <td>{{ online ? 'Active' : 'Inactive' }}</td>
        <td>{{ time }}</td>
    </tr>
</template>

<style></style>
  