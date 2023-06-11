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

const device_name = computed(() => store.state.feeder.device_name);
const device_position = computed(() => store.state.feeder.device_position);
const device_status = computed(() => store.state.feeder.device_status);
const lastupdate = computed(() => store.state.feeder.lastupdate);
const init_distance = computed(() => store.state.feeder.init_distance);
const distance = computed(() => store.state.feeder.distance);
const mode = computed(() => store.state.feeder.mode);


function getData() {
    store.dispatch('feeder/getData');
}

getData();
setInterval(getData, 10000);
</script>

<template>
    <tr>
        <!-- Name, Data, Position, Online, Last upload -->
        <td>{{ device_name }}</td>
        <td>
            Distance: {{ distance }}, Mode: {{ mode }}
        </td>
        <td>{{ device_position }}</td>
        <td>{{ device_status ? 'Active' : 'Inactive' }}</td>
        <td>{{ lastupdate }}</td>
    </tr>
</template>

<style></style>
  