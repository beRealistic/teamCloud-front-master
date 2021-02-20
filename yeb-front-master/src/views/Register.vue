<template>
  <div>
    <el-form
        v-loading="loading"
        element-loading-text="注册中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        ref="RegisterForm" :model="RegisterForm" :rules="rules" class="loginContainer">
      <h3 class="loginTitle">系统注册</h3>
      <!-- 自动补全 auto-complete="false" -->
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="RegisterForm.username" placeholder="请输入登录用户名"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input type="text" auto-complete="false" v-model="RegisterForm.name" placeholder="请输入用于显示的用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="RegisterForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="checkPassword">
        <el-input type="password" auto-complete="false" v-model="RegisterForm.checkPassword" placeholder="再次输入密码"></el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-input type="text" auto-complete="false" v-model="RegisterForm.code" placeholder="点击图片更换验证码"
                  style="width: 250px;margin-right: 5px;"></el-input>
        <img :src="kaptchaUrl" @click="updateKaptcha">
      </el-form-item>
      <el-button type="primary" style="width: 100%" @click="submitRegister">注册</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Login',
  components: {},
  props: [],
  data() {
      var validatePass = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请再次输入密码'));
          } else if (value !== this.RegisterForm.password) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };
      var validateUsername = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请输入登录用户名'));
          } else {
              this.getRequest('/register/checkUsername/'+value).then(resp => {
                  //alert(JSON.stringify(resp));
                  this.loading = false;
                  if (resp) {
                      callback(new Error('该名称已经被使用!'));
                  } else {
                      callback();
                  }
              })
          }
      };
    return {
      // 验证码
      kaptchaUrl: '/kaptcha?time=' + new Date(),
      RegisterForm: {
        username: '',
        name: '',
        password: '',
        checkPassword: '',
        code: '',
      },
      loading: false, // 加载中
      checked: true,
      rules: {
        username: [{required: true, validator: validateUsername, trigger: 'blur'}],
        name: [{required: true, message: '请输入用于显示的用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        checkPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      }
    }
  },
  methods: {
    // 点击刷新验证码
    updateKaptcha() {
      this.kaptchaUrl = '/kaptcha?time=' + new Date();
    },
      submitRegister() {
      let userinfo = {
          username: this.RegisterForm.username,
          name: this.RegisterForm.name,
          password: this.RegisterForm.password,
          code: this.RegisterForm.code
      };
      this.$refs.RegisterForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest('/register', userinfo).then(resp => {
             //alert(JSON.stringify(resp));
            this.loading = false;
            // if (resp) {
            //     this.activeName = 'login'
            //   //this.$router.replace('/login') // 路径替换，无法回退到上一页
            // }

          })
          .catch(err => {
              this.$message.error(`${err.message}`)
          })
        } else {
          this.$message.error('请正确输入所有字段！')
          return false;
        }
      })
    }
  }
}
</script>
<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  /*属性规定背景的绘制区域 背景被裁剪到内边距框。 margin: 180 px auto;*/
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0 auto 40px auto;
  text-align: center;
}

.loginRemember {
  text-align: left;
  margin: 0 0 15px 0;
}

/*验证码*/
.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
