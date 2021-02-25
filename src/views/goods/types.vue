<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 提示区 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false"> </el-alert>
      <!-- 选择商品分类区 -->
      <el-row class="goodtypeplace">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 练级选择框 -->
          <!-- v-model默认选中值  @change选中事件-->
          <el-cascader v-model="selectKeys" :options="cataList" :props="cataProps" clearable @change="changeSelect"></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs列 -->
      <!--  @tab-click tab切换事件 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" class="addBtnItem" @click="dialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border style="width: 100%">
            <!-- 展开行，点击展开 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag type="success" v-for="(item, index) in scope.row.attr_vals" :key="index" style="margin-left: 5px" closable @close="removeTag(index, scope.row)">{{ item }}</el-tag>
                <!-- tag标签动态编辑 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" round @click="editBtn(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" round @click="deleteBtn(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" class="addBtnItem" :disabled="isBtnDisabled" @click="dialogVisible = true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="staticTableData" border style="width: 100%">
            <!-- 展开行，点击展开 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag type="success" v-for="(item, index) in scope.row.attr_vals" :key="index" style="margin-left: 5px" closable @close="removeTag(index, scope.row)">{{ item }}</el-tag>
                <!-- tag标签动态编辑 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" round @click="editBtn(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" round @click="deleteBtn(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加对话框 动态获取标题-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" @close="dialogClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="ruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitDialog">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框-->
    <el-dialog title="编辑" :visible.sync="editdialogVisible" width="30%" @close="editdialogClose">
      <el-form :model="editruleForm" :rules="editrules" ref="editruleFormRef" label-width="100px">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品列表
      cataList: [],
      // 定义联级选择器
      cataProps: {
        children: "children",
        label: "cat_name",
        value: "cat_id",
      },
      // 联级选择器选中的项
      selectKeys: [],
      // 默认选中项
      activeName: "many",
      // 动态参数
      manyTableData: [],
      // 静态属性
      staticTableData: [],
      dialogVisible: false,
      ruleForm: {
        attr_name: "",
      },
      rules: {
        attr_name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
      },
      editdialogVisible: false,
      deletedialogVisible: false,
      editruleForm: {
        attr_name: "",
      },
      editrules: {
        attr_name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
      },
      // 控制tag表情的按钮与文本框的展示情况
      inputVisible: false,
      inputValue: "",
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    isBtnDisabled() {
      return this.selectKeys.length !== 3 ? true : false
    },
    cateId() {
      return this.selectKeys.length === 3 ? this.selectKeys[2] : null
    },
    dialogTitle() {
      return this.activeName === "many" ? "动态参数" : "静态属性"
    },
  },
  methods: {
    async getCateList() {
      await this.$http.get("categories").then((res) => {
        // console.log(res)
        if (res.data.meta.status == 200) {
          this.cataList = res.data.data
        } else {
          this.$message.error("获取商品分类失败")
        }
      })
    },
    // 联级选择器改变事件
    async changeSelect() {
      // console.log(this.selectKeys)
      // 如果不是三级分类那么重置选中keys
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.manyTableData = []
        this.staticTableData = []
        return
      }
      await this.$http
        .get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName },
        })
        .then((res) => {
          // console.log(res.data.data)
          res.data.data.forEach((item) => {
            // 因为空的以split分割会形成空白字符数组，所以需要判断一下
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []
            // tag标签动态编辑联动问题解决：给每个设置单独的状态
            item.inputVisible = false
            item.inputValue = ""
          })
          if (res.data.meta.status == 200) {
            this.activeName === "many" ? (this.manyTableData = res.data.data) : (this.staticTableData = res.data.data)
          }
        })
    },
    // tabs改变事件
    handleClick() {
      this.changeSelect()
    },
    // dialog关闭,重置表单
    dialogClose() {
      this.$refs.ruleFormRef.resetFields()
    },
    // 确认添加
    commitDialog() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (valid) {
          await this.$http
            .post(`categories/${this.cateId}/attributes`, {
              attr_name: this.ruleForm.attr_name,
              attr_sel: this.activeName,
            })
            .then((res) => {
              // console.log(res)
              if (res.data.meta.status == 200 || res.data.meta.status == 201) {
                this.changeSelect()
                this.$message.success("添加成功")
                this.dialogVisible = false
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
        }
      })
    },
    //修改按钮
    async editBtn(nowid) {
      // 根据id查询当前列信息
      await this.$http
        .get(`categories/${this.cateId}/attributes/${nowid}`, {
          params: {
            attr_sel: this.activeName,
          },
        })
        .then((res) => {
          if (res.data.meta.status == 200) {
            this.editruleForm = res.data.data
          }
        })
      this.editdialogVisible = true
    },

    // 确认修改
    editDialog() {
      this.$refs.editruleFormRef.validate(async (valid) => {
        if (valid) {
          await this.$http
            .put(`categories/${this.cateId}/attributes/${this.editruleForm.attr_id}`, {
              attr_name: this.editruleForm.attr_name,
              attr_sel: this.activeName,
            })
            .then((res) => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                // 重新加载数据
                this.changeSelect()
                this.editdialogVisible = false
                this.$message.success("更新成功")
              } else {
                this.$message.error("修改失败")
              }
            })
        }
      })
    },
    // 关闭修改对话框
    editdialogClose() {
      this.$refs.editruleFormRef.resetFields()
    },
    // 删除按钮
    async deleteBtn(nowid) {
      await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.delete(`categories/${this.cateId}/attributes/${nowid}`).then((res) => {
            if (res.data.meta.status === 200) {
              this.changeSelect()
              this.$message.success("删除成功")
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
        })
        .catch(() => {
          this.$message.error("已取消删除")
        })
    },
    // tag文本框失去焦点或者键盘按下enter事件
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = ""
        // 如果有输入内容，则把放入总数组
      } else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ""
        // 再发起请求保存到后台
        await this.$http
          .put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(" "),
          })
          .then((res) => {
            console.log(res)
            if (res.data.meta.status == 200) {
              this.$message.success("添加成功")
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
      }
      row.inputVisible = false
    },
    // 点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      //  this.$nextTick() 作用：当页面元素渲染好了，再执行里面的代码
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除叉掉的tag
    async removeTag(index, row) {
      // splice 删除下标开始的多少位，如果还有更多参数就是相应再加上
      row.attr_vals.splice(index, 1)
      await this.$http
        .put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        })
        .then((res) => {
          console.log(res)
          if (res.data.meta.status == 200) {
            this.$message.success("删除成功")
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
.goodtypeplace {
  margin-top: 10px;
}
.addBtnItem {
  margin-bottom: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>