import { createStore, createLogger } from 'vuex'
import environment from './modules/environment'
import feeder from './modules/feeder'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    environment,
    feeder
  },
  strict: false,
  // plugins: debug ? [createLogger()] : []
})
