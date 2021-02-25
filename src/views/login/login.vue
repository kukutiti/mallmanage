<template>
  <div class="all_box">
    <div class="login_out">
      <div class="logo_in">
        <img src="@/assets/pengyuyan.jpg" alt="登录logo" />
      </div>
      <!-- 表单区域 -->
      <!-- label-width 距离左边宽度 -->
      <el-form :model="loginForm" status-icon :rules="rules" ref="loginFormDoc" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <!-- prefix-icon 头部图标 suffix-icon	尾部图标 -->
          <el-input type="text" v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>

        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm('loginFormDoc')">提交</el-button>
          <el-button @click="resetForm('loginFormDoc')" type="info" class="btn2">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$http.post("login", this.loginForm).then((res) => {
            // console.log(res)
            if (res.data.meta.status === 200) {
              this.$message({
                type: "success",
                message: `登录成功`,
              })
              window.sessionStorage.setItem("token", res.data.data.token)
              this.$router.push("/home")
            } else {
              this.$message.error("检查用户名密码")
            }
          })
        } else {
          this.$message({
            type: "warning",
            message: `登录失败`,
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
.all_box {
  height: 100%;
  background: #2b4b6b;
}
.login_out {
  width: 400px;
  height: 300px;
  background: white;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-250px, -250px);
  .logo_in {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: grey;
    }
  }
  .demo-ruleForm {
    position: absolute;
    bottom: 0;
    width: 90%;
    padding: 0 5%;
    .btn {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>