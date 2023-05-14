<script setup>
import datatable from './charts/datatable.vue'
import areachart from './charts/areachart.vue'
import barchart from './charts/barchart.vue'
import piechart from './charts/piechart.vue'
import card from './charts/card.vue'

defineProps({
    title: {
      type: String,
      default: 'Dashboard'
    },
    subtitle: {
      type: String,
      default: 'IoT Cat Guardian System'
    },
})

const columns = [
    'ID',
    'Data',
    'Position',
    'Online',
    'Last upload',
]
</script>

<template>
    <div id="layoutSidenav_content">
        <main>
            <div class="container-fluid px-4">
                <h1 class="mt-4">{{ title }}</h1>
                <ol class="breadcrumb mb-4">
                    <li class="breadcrumb-item active">{{ subtitle }}</li>
                </ol>
                <div class="row">
                    <div class="col-xl-3 col-md-6">
                        <card bg="bg-primary" cardtitle="Primary Card" />
                    </div>
                    <div class="col-xl-3 col-md-6">
                        <card bg="bg-warning" cardtitle="Warning Card" />
                    </div>
                    <div class="col-xl-3 col-md-6">
                        <card bg="bg-success" cardtitle="Success Card" />
                    </div>
                    <div class="col-xl-3 col-md-6">
                        <card bg="bg-danger" cardtitle="Danger Card" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-xl-4">
                        <areachart />
                    </div>
                    <div class="col-xl-4">
                        <barchart />
                    </div>
                    <div class="col-xl-4">
                        <piechart />
                    </div>
                </div>
                <datatable v-bind:columns="columns" />
            </div>
        </main>
        <footer class="py-4 bg-light mt-auto">
            <div class="container-fluid px-4">
                <div class="d-flex align-items-center justify-content-between small">
                    <div class="text-muted">Copyright &copy; Your Website 2023</div>
                    <div>
                        <a href="#">Privacy Policy</a>
                        &middot;
                        <a href="#">Terms &amp; Conditions</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<style></style>
  