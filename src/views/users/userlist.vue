<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片:el-card内默认有背景色 -->
    <el-card>
      <!-- 搜索框默认排满，用这个排版。默认24为整行长度。gutter：间隙，省略px单位-->
      <el-row :gutter="10">
        <el-col :span="8">
          <!-- 搜索框  clearable可清空,@clear：点击清空键按钮时触发-->
          <el-input
            placeholder="请输入内容"
            v-model="requestInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 stripe:隔行变色，border表格边框有无-->
      <el-table :data="userArr" border style="width: 100%" stripe>
        <!-- 索引：只用加type="index" -->
        <el-table-column type="index" label="索引"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- 因为状态是布尔值 -->
        <el-table-column label="状态">
          <!-- 通过 template 作用域插槽获取数据。scope.row 为当前行所有数据 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- switch开关 color分别为选中颜色与不选中颜色 change事件状态改变 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <!-- 也通过 template 作用域插槽获取数据。scope.row 为当前行所有数据 -->
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <!-- 给按钮加上文字提示 content提示内容 placement提示位置 effect提示颜色-->
            <!-- enterable:使鼠标悬停提示文字时，是否有影响 -->
            <el-tooltip content="修改" placement="top-start" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="editUser(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 用户角色按钮 -->
            <el-tooltip
              content="设置权限"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                @click="changeRole(scope.row)"
              ></el-button>
            </el-tooltip>
            <!--  删除按钮 -->
            <el-tooltip content="删除" placement="top-start" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="openChoose(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- size-change 每页展示条数改变事件 current-change 页码改变事件-->
      <!-- current-page 当前页数 page-sizes每页展示条数选择 page-size 当前页条数-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestInfo.pagenum"
        :page-sizes="[1, 2, 3, 4, 5, 10, 20]"
        :page-size="requestInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalpage"
      >
      </el-pagination>
    </el-card>

    <!-- 点击添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      @close="addDialogClose"
    >
      <!-- 内容中的表单 -->
      <el-form
        :model="ruleForm"
        ref="ruleFormEle"
        :rules="rules"
        label-width="60px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model.number="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.number="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.number="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model.number="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>

    <!-- 修改按钮弹出对话框 -->
    <el-dialog title="修改用户" :visible.sync="editdialogVisible" width="30%">
      <el-form
        :model="editruleForm"
        ref="editruleFormEle"
        :rules="editrules"
        label-width="60px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model.number="editruleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.number="editruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model.number="editruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserPut(editruleForm)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 用户角色按钮弹出对话框 -->
    <el-dialog
      title="角色权限"
      :visible.sync="roledialogVisible"
      width="30%"
      @close="closeUserRole"
    >
      <div>
        <p>当前的用户：{{ userRoleInfo.username }}</p>
        <p>当前的角色：{{ userRoleInfo.role_name }}</p>
        <p>
          要修改的角色：
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option
              v-for="item in RolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.roleName"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeRolePut">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱格式
    var validateEmail = (rule, value, callback) => {
      //验证邮箱的正则表达式
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error("请输入合法邮箱"))
    }
    //验证手机号格式
    var validatePhone = (rule, value, callback) => {
      //验证手机号的正则表达式
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error("请输入合法手机号"))
    }
    return {
      requestInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userArr: [],
      totalpage: 0,
      findmsg: "",
      dialogVisible: false,
      // 添加用户
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" },
        ],
      },
      editdialogVisible: false,
      roledialogVisible: false,
      // 修改用户
      editruleForm: {
        username: "",
        email: "",
        mobile: "",
        id: "",
      },
      editrules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" },
        ],
      },
      userRoleInfo: {},
      RolesList: [],
      // 已选中的值
      selectValue: "",
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      await this.$http
        .get("users", { params: this.requestInfo })
        .then((res) => {
          // console.log(res)
          if (res.data.meta.status == 200) {
            this.userArr = res.data.data.users
            this.totalpage = res.data.data.total
          } else {
            this.$message({ message: res.data.meta.msg, type: "error" })
          }
        })
    },
    //当前页个数改变
    handleSizeChange(newSize) {
      //将pagesize设置为，当前页选中个数
      this.requestInfo.pagesize = newSize
      //再次从后台获取数据
      this.getUserList()
    },
    //页数改变
    handleCurrentChange(newPage) {
      //将pagenum页数设置为，当前页
      this.requestInfo.pagenum = newPage
      //再次走后台获取数据
      this.getUserList()
    },
    //修改用户状态
    async changeStatus(scopeMsg) {
      // console.log(scopeMsg)
      await this.$http
        .put(`users/${scopeMsg.id}/state/${scopeMsg.mg_state}`)
        .then((res) => {
          // console.log(res)
          if (res.status == 200) {
            this.$message.success("更新用户状态成功")
          } else {
            this.$message.error("更新用户状态失败")
          }
        })
    },
    //dialog对话框关闭事件。用close，不加给按钮，因为对话框有三个按钮
    addDialogClose() {
      //表单重置
      this.$refs.ruleFormEle.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.ruleFormEle.validate(async (valid) => {
        if (valid) {
          await this.$http.post("users", this.ruleForm).then((res) => {
            // console.log(res)
            if (res.data.meta.status !== 201) {
              this.$message.error(res.data.meta.msg)
            } else {
              this.$message.success(res.data.meta.msg)
              //成功把对话框关掉
              this.dialogVisible = false
              //新添加的在页面展示出来
              this.getUserList()
            }
          })
        } else {
          return
        }
      })
    },
    // 修改按钮
    async editUser(scopeuserid) {
      // 通过id获取此用户，后台对应的值
      await this.$http.get(`users/${scopeuserid}`).then((res) => {
        // console.log(res)
        if (res.data.meta.status == 200) {
          this.editdialogVisible = true
          this.editruleForm = res.data.data
        } else {
          this.$message.error(res.data.meta.msg)
        }
      })
    },
    //修改弹出对话框确定
    editUserPut(abouteidtinfo) {
      this.$refs.editruleFormEle.validate(async (valid) => {
        if (valid) {
          await this.$http
            .put(`users/${abouteidtinfo.id}`, {
              email: abouteidtinfo.email,
              mobile: abouteidtinfo.mobile,
            })
            .then((res) => {
              // console.log(res)
              if (res.data.meta.status == 200) {
                this.$message.success(res.data.meta.msg)
                this.editdialogVisible = false
                this.getUserList()
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
        } else {
          // 移除校验信息，不然会留到下一次打开的地方。原始数据的问题，了解
          // this.$refs.editruleFormEle.clearValidate()
          this.$message.error("修改失败")
        }
      })
    },
    // 删除，弹出确认框
    openChoose(userid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.delete(`users/${userid}`).then((res) => {
            if (res.data.meta.status == 200) {
              this.$message.success("删除成功")
              this.getUserList()
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
        })
        .catch(() => {
          // console.log(err)
          this.$message.info("已取消删除")
        })
    },
    // 用户角色改变
    async changeRole(linerole) {
      this.roledialogVisible = true
      // 需要分配角色的用户信息
      this.userRoleInfo = linerole
      // 获取所有用户角色列表
      await this.$http.get("roles").then((res) => {
        // console.log(res)
        if (res.data.meta.status == 200) {
          this.RolesList = res.data.data
        } else {
          this.$message.error("获取用户角色列表失败")
        }
      })
    },
    // 提交用户角色修改
    async changeRolePut() {
      await this.$http
        .put(`users/${this.userRoleInfo.id}/role`, { rid: this.selectValue })
        .then((res) => {
          console.log(res)
          if (res.data.meta.status == 200) {
            this.$message.success(res.data.meta.msg)
            this.roledialogVisible = false
            this.getUserList()
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
    },
    // 关闭用户角色修改对话框
    closeUserRole() {
      this.selectValue = ""
    },
  },
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.el-table {
  margin-top: 20px;
  font-size: 13px;
}
.el-radio {
  display: block;
  margin-bottom: 5px;
}
</style>