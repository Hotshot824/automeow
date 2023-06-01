import { createStore, createLogger } from 'vuex'
import dht_sensor from './modules/dht_sensor'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    dht_sensor,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
