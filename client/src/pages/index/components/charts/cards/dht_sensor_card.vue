<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

defineProps({
  bg: {
    type: String,
    default: 'bg-primary'
  },
  cardtitle: {
    type: String,
    default: 'Primary Card'
  },
})

const store = useStore();

const online = computed(() => store.state.dht_sensor.online);

const handleButtonClick = () => {
  store.dispatch('dht_sensor/controlLED');
};
</script>

<template>
  <div class="card text-white mb-4" v-bind:class="bg">
    <div class="card-body">{{ cardtitle }}</div>
    <div class="card-footer d-flex align-items-center justify-content-between">
      <div class="small text-white">{{ online ? 'Active' : 'Inactive' }}</div>
      <div class="small text-white"><button type="button" class="btn btn-light"
          @click="handleButtonClick">{{ online ? 'OFF' : 'ON' }}</button>
      </div>
    </div>
  </div>
</template>

<style></style>
