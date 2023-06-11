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

const device_name = computed(() => store.state.environment.device_name);
const device_position = computed(() => store.state.environment.device_position);
const device_status = computed(() => store.state.environment.device_status);
const lastupdate = computed(() => store.state.environment.lastupdate);
const temperature = computed(() => store.state.environment.temperature);
const humidity = computed(() => store.state.environment.humidity);
const light = computed(() => store.state.environment.light);

function getData() {
  store.dispatch('environment/getData');
}

getData();
setInterval(getData, 10000);
</script>

<template>
  <tr>
    <!-- Name, Data, Position, Online, Last upload -->
    <td>{{ device_name }}</td>
    <td>
      <template v-if="!isNaN(temperature)">
        Temperature: {{ temperature }}, Humidity: {{ humidity }}, Light: {{ light }}
      </template>
    </td>
    <td>{{ device_position }}</td>
    <td>{{ device_status ? 'Active' : 'Inactive' }}</td>
    <td>{{ lastupdate }}</td>
  </tr>
</template>

<style></style>
  