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

const online = computed(() => store.state.feeder.online);

const handleButtonClick = () => {
  let confirmation;
  if (online.value) {
    confirmation = window.confirm("Turn OFF the sensor?");
  } else {
    confirmation = window.confirm("Turn ON the sensor?");
  }

  if (confirmation) {
    store.dispatch('feeder/toggle');
  }
};

const handleButtonFeed = () => {
  let confirmation;
  if (online.value) {
    confirmation = window.confirm("Turn OFF the sensor?");
  } else {
    confirmation = window.confirm("Turn ON the sensor?");
  }

  if (confirmation) {
    store.dispatch('feeder/toFeed');
  }
};
</script>

<template>
  <div class="card text-white mb-4" v-bind:class="bg">
    <div class="card-body">{{ cardtitle }}</div>
    <div class="card-footer d-flex align-items-center justify-content-between">
      <div class="small text-white">{{ online ? 'Active' : 'Inactive' }}</div>
      <div class="d-flex">
        <div class="small text-white"><button type="button" class="btn btn-outline-light me-2" @click="handleButtonFeed"> Feed </button>
        </div>
        <div class="small text-white"><button type="button" class="btn btn-light" @click="handleButtonClick">{{ online ?
          'OFF' : 'ON' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
