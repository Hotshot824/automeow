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

const device_name = computed(() => store.state.fountain.device_name);
const device_position = computed(() => store.state.fountain.device_position);
const device_status = computed(() => store.state.fountain.device_status);
const lastupdate = computed(() => store.state.fountain.lastupdate);
const mode = computed(() => store.state.fountain.mode);
const fountain_status = computed(() => store.state.fountain.fountain_status)


function getData() {
    store.dispatch('fountain/getData');
}

getData();
setInterval(getData, 10000);
</script>

<template>
    <template v-if="device_status">
        <tr>
            <!-- Name, Data, Position, Online, Last upload -->
            <td>{{ device_name }}</td>
            <td>
                Mode: {{ mode }}, Fountain Status: {{ fountain_status ? 'ON' : 'OFF' }}
            </td>
            <td>{{ device_position }}</td>
            <td>{{ device_status ? 'Active' : 'Inactive' }}</td>
            <td>{{ lastupdate }}</td>
        </tr>
    </template>
</template>

<style></style>
  