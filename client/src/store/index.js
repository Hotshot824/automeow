import { createStore, createLogger } from 'vuex'
import DHT22 from './modules/DHT22'
import feeder from './modules/feeder'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    DHT22,
    feeder
  },
  strict: false,
  plugins: debug ? [createLogger()] : []
})
