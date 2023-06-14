<script setup>
import { components } from './sensordatas'

defineProps({
    tabletitle: {
        type: String,
        default: 'Sensor Data Table'
    },
    columns: {
        type: Array,
        default: () => [
        ]
    }
})

window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple);
    }
});

</script>

<template>
    <div class="card mb-4">
        <div class="card-header">
            <i class="fas fa-table me-1"></i>
            {{ tabletitle }}
        </div>
        <div class="card-body">
            <table id="datatablesSimple">
                <thead>
                    <tr>
                        <th v-for="column in columns" v-bind:key="column">{{ column }}</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th v-for="column in columns" v-bind:key="column">{{ column }}</th>
                    </tr>
                </tfoot>
                <tbody>
                    <component :is="components.environment_data"/>
                    <component :is="components.feeder_data"/>
                    <component :is="components.fountain_data"/>
                    <component :is="components.fan_data"/>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style>
table#datatablesSimple th:nth-child(2) {
    width: 40%;
}
</style>
  