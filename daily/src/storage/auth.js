import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUser = (userInfo) => {
    user.value = userInfo
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    // 可以在这里调用后端的登出接口
  }

  // 在应用启动时调用，用于恢复登录状态
  const initializeAuth = () => {
    // 状态已在 ref 初始化时从 localStorage 读取
  }

  // 返回对外暴露的属性和方法
  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    logout,
    initializeAuth
  }
})