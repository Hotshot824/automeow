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

const device_status = computed(() => store.state.fountain.device_status);
const fountain_status = computed(() => store.state.fountain.fountain_status)
const mode = computed(() => store.state.fountain.mode);

const handleButtonClick = () => {
  let confirmation;
  if (device_status.value) {
    confirmation = window.confirm("Turn OFF the sensor?");
  } else {
    confirmation = window.confirm("Turn ON the sensor?");
  }

  if (confirmation) {
    store.dispatch('fountain/toggle');
  }
};

const handleButtonMode = () => {
  let confirmation;
  if (mode.value == 'manual') {
    confirmation = window.confirm("Change to automatic mode?");
  } else {
    confirmation = window.confirm("Change to manual mode?");
  }

  if (confirmation) {
    store.dispatch('fountain/changeMode');
  }
};

const handleButtonFountain = () => {
  let confirmation;
  if (fountain_status.value) {
    confirmation = window.confirm("Stop Feeding?");
  } else {
    confirmation = window.confirm("Start Feeding?");
  }

  if (confirmation) {
    store.dispatch('fountain/changeFountain');
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
            <button type="button" class="btn btn-outline-light" @click="handleButtonFountain" v-bind:disabled="mode !== 'manual' || device_status != true">
              {{ fountain_status ? 'Unfountain' : 'Fountain' }}
            </button>
            <button type="button" class="btn btn-outline-light" @click="handleButtonMode" v-bind:disabled="device_status != true">
              {{ mode == 'manual' ? 'M' : 'A' }}
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
