import { createStore, createLogger } from 'vuex'
import DHT22 from './modules/DHT22'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    DHT22,
  },
  strict: false,
  plugins: debug ? [createLogger()] : []
})
