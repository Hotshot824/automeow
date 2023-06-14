import { createStore, createLogger } from 'vuex'
import environment from './modules/environment'
import feeder from './modules/feeder'
import fountain from './modules/fountain'
import fan from './modules/fan'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    environment,
    feeder,
    fountain,
    fan,
  },
  strict: false,
  plugins: debug ? [createLogger()] : []
})
