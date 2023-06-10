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

const device_status = computed(() => store.state.environment.device_status);

const handleButtonClick = () => {
  let confirmation;
  if (device_status.value) {
    confirmation = window.confirm("Turn OFF the sensor?");
  } else {
    confirmation = window.confirm("Turn ON the sensor?");
  }
  
  if (confirmation) {
    store.dispatch('environment/toggle');
  }
};
</script>

<template>
  <div class="card text-dark mb-4" v-bind:class="bg">
    <div class="card-body">{{ cardtitle }}</div>
    <div class="card-footer d-flex align-items-center justify-content-between">
      <div class="small text-dark">{{ device_status ? 'Active' : 'Inactive' }}</div>
      <div class="small text-dark"><button type="button" class="btn btn-dark"
          @click="handleButtonClick">{{ device_status ? 'OFF' : 'ON' }}</button>
      </div>
    </div>
  </div>
</template>

<style></style>
