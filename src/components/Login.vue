<template>
  <div class="login">
    <el-form class="from" ref="form" status-icon :rules="rules" :model="form" label-width="80px">
      <img class="login-img" src="../assets/avatar.jpg" alt />
      <el-form-item label="用户名" prop="username">
        <el-input @keyup.enter.native="login" v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          @keyup.enter.native="login"
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="login">登陆</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['change', 'blur']
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['change', 'blur']
          },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        await this.$refs.form.validate()
        const { data, meta } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          localStorage.setItem('shop', data.token)
          this.$message.success(meta.msg)
          this.$router.push({ name: 'index' })
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }

      // this.$refs.form.validate(valid => {
      //   if (!valid) return
      //   this.$axios.post('login', this.form).then(res => {
      //     const { meta, data } = res
      //     if (meta.status === 200) {
      //       localStorage.setItem('shop', data.token)
      //       this.$message.success('登陆成功')
      //       this.$router.push({ name: 'index' })
      //     } else {
      //       this.$message.error('登陆失败')
      //     }
      //   })
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;

  .from {
    width: 400px;
    margin: 0 auto;
    margin-top: 200px;
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
    padding-top: 70px;
    position: relative;

    .login-btn {
      margin-right: 70px;
    }

    .login-img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -70px;
      border-radius: 50%;
      border: 5px solid #fff;
    }
  }
}
</style>
