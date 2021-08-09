import axios from 'axios'
import Router from 'next/router'
import {
  REFRESH_TOKEN_CODE_ERRORS,
  REFRESH_TOKEN_URL
} from '../constants'
import useAuthStore from '../store/useAuthStore'

let isRefreshing = false
let failedQueue = []


const processQueue = error => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })

  failedQueue = []
}
const Client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 300000
})
// Do something before request is sent
Client.interceptors.request.use(
  config => {
    if (config.authorization !== false) {
      const { accessToken: token } = useAuthStore.getState()?.token
      if (token) {
        config.headers.Authorization = 'Bearer ' + token
      }
    }
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
Client.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  error => {
    const originalRequest = error.config
    const { token, clearToken, setToken } = useAuthStore?.getState()
    const {refreshToken} = token
    
    const handleError = error => {
      processQueue(error)
      clearToken();
      Router.replace('/login')
      return Promise.reject(error)
    }

    // REFRESH TOKEN CONDITIONS
    if (
      refreshToken &&
      error.response?.status === 401 &&
      REFRESH_TOKEN_CODE_ERRORS.includes(error.response?.data?.code) &&
      originalRequest?.url !== REFRESH_TOKEN_URL &&
      originalRequest?._retry !== true
    ) {
      
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return Client(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }
      isRefreshing = true

      originalRequest._retry = true
      return Client.post(REFRESH_TOKEN_URL, {
        refreshToken: refreshToken
      })
        .then(res => {
          setToken({
            accessToken: res.data.access_token,
            refreshToken: res.data.refresh_token
          })
          processQueue(null)
          return Client(originalRequest)
        }, handleError)
        .finally(() => {
          isRefreshing = false
        })
    }

    // // Invalid token scenario
    if (
      error.response?.status === 401
    ) {
      return handleError(error)
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)
export default Client
