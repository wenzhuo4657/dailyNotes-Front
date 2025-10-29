<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const form = ref({
  username: '',
  password: '',
  remember: true,
})

const loading = ref(false)

const onLogin = async () => {
  if (!form.value.username || !form.value.password) {
    ElMessage.error('请输入用户名和密码')
    return
  }
  try {
    loading.value = true
    // TODO: 调用后端登录接口，当前直接写入 token
    const token = 'demo-token'
    if (form.value.remember) {
      localStorage.setItem('token', token)
    } else {
      sessionStorage.setItem('token', token)
    }

    const redirect = (route.query && route.query.redirect) || '/'
    ElMessage.success('登录成功')
    router.replace(String(redirect))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="title">登录</h2>
      <el-form @submit.prevent="onLogin" label-width="0">
        <el-form-item>
          <el-input
            v-model="form.username"
            placeholder="用户名"
            autocomplete="username"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            autocomplete="current-password"
            show-password
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.remember">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" size="large" style="width: 100%" @click="onLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}
.login-card {
  width: 360px;
  padding: 28px 24px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}
.title {
  margin: 0 0 18px;
  text-align: center;
  font-size: 22px;
}
</style>

