<script setup>
defineProps({
    bg: {
      type: String,
      default: 'bg-primary'
    },
    cardtitle: {
      type: String,
      default: 'Primary Card'
    },
    status: {
      type: String,
      default: 'OFF'
    },
})
</script>

<template>
    <div class="card text-white mb-4" v-bind:class="bg">
        <div class="card-body">{{ cardtitle }}</div>
        <div class="card-footer d-flex align-items-center justify-content-between">
            <div class="small text-white">{{ status }}</div>
            <div class="small text-white"><button type="button" class="btn btn-light">ON</button></div>
        </div>
    </div>
</template>

<style></style>
