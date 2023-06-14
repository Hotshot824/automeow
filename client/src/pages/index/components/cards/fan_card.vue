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

const device_status = computed(() => store.state.fan.device_status);
const fan_status = computed(() => store.state.fan.fan_status)

const handleButtonClick = () => {
  let confirmation;
  if (device_status.value) {
    confirmation = window.confirm("Turn OFF the sensor?");
  } else {
    confirmation = window.confirm("Turn ON the sensor?");
  }

  if (confirmation) {
    store.dispatch('fan/toggle');
  }
};

const handleButtonFan = () => {
  let confirmation;
  if (fan_status.value) {
    confirmation = window.confirm("Stop fan?");
  } else {
    confirmation = window.confirm("Start fan?");
  }

  if (confirmation) {
    store.dispatch('fan/toggleFan');
  }
};
</script>

<template>
  <div class="card text-white mb-4" v-bind:class="bg">
    <div class="card-body">{{ cardtitle }}</div>
    <div class="card-footer d-flex align-items-center justify-content-between">
      <div class="small text-white">{{ device_status ? 'Active' : 'Inactive' }}</div>
      <div class="d-flex">
        <div class="small text-white">
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-outline-light" @click="handleButtonFan" v-bind:disabled="device_status != true">
              {{ fan_status ? 'Fan OFF' : 'Fan ON' }}
            </button>
            <button type="button" class="btn btn-light" @click="handleButtonClick">
              {{ device_status ? 'OFF' : 'ON' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
