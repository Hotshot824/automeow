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
const distance = computed(() => store.state.feeder.distance);
const online = computed(() => store.state.feeder.online);
const time = computed(() => store.state.feeder.time);

function getData() {
    store.dispatch('feeder/getData');
}

getData();
setInterval(getData, 10000);
</script>

<template>
    <template v-if="!isNaN(distance)">
        <tr>
            <!-- Name, Data, Position, Online, Last upload -->
            <td>{{ device_name }}</td>
            <td>
                Distance: {{ distance }} mm
            </td>
            <td>{{ device_position }}</td>
            <td>{{ online ? 'Active' : 'Inactive' }}</td>
            <td>{{ time }}</td>
        </tr>
    </template>
</template>

<style></style>
  