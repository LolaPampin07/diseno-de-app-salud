import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Create a custom axios instance with a base URL
const api = axios.create({ baseURL: 'http://localhost:3001' })

export default boot(({ app }) => {
  // Access this.$axios and this.$api inside Vue files (Options API)
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }
