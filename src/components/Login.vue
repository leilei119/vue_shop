<template>
  <div class="LoginContent">
    <div class="box">
      <div class="logo">
        <img src="../assets/img/logo.jpg" alt="" />
        <strong>RICH</strong>
      </div>
      <!-- 登录表单 -->
      <el-form
        class="form"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item label="username" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="password" prop="password">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button class="loginbtn" @click="login">Login To Happy</el-button>
          <el-button class="loginbtn" @click="resetLoginForm">reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 用户名的验证
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        // 密码的验证
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '长度在 6 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 登录功能
    login() {
      // 登陆之前预验证
      this.$refs.loginFormRef.validate(async (valid) => {
        // 预验证没通过false  直接返回
        if (!valid) return
        // 预验证痛过之后发起登录请求 返回promis用await async修饰
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 判断是否登陆成功
        if (res.meta.status !== 200) return this.$mes.error('登陆失败！')
        this.$mes.success('登陆成功!')

        //登陆成功之后的行为
        //1.将token保存到客户端的sessionStorage中
        //  1）项目中除了登录之外的其他API接口，必须在登陆之后才能访问，所以需要携带token来验证
        //  2）token只在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        //2.通过编程式导航跳转到后台主页，路由地址/home
        this.$router.push('/home')
      })
    },
    // 点击重置按钮重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
  },
}
</script>

<style scoped>
.LoginContent {
  height: 100%;
  background: url('../assets/img/背景l.gif') no-repeat;
  background-size: cover;
}
.box {
  width: 50%;
  height: 90%;
  background-color: #febd50;
  border-radius: 10px;
  position: absolute;
  left: 3%;
  top: 5%;
}
.logo {
  width: 50px;
  line-height: 25px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 2%;
  left: 50%;
  transform: translate(-50%, 0%);
  align-items: center;
}
.logo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
strong {
  font-family: cursive;
  text-shadow: 3px 4px 2px #00bcd4;
  color: #606266;
}
.form {
  position: absolute;
  top: 10%;
  width: 100%;
  padding: 0px 15px;
  margin: 20% 0;
  box-sizing: border-box;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
</style>