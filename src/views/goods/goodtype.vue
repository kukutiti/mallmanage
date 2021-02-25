<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row class="addtypebtn">
        <el-col>
          <el-button type="primary" @click="addType">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 树形表格：三方模块，全局注册的 -->
      <tree-table :data="cateList" :columns="columns" :show-index="true" index-text="#" :selection-type="false" :expand-type="false" border>
        <!-- 状态：自定义列，加作用域插槽 -->
        <template slot="isok" slot-scope="scope">
          <!-- 以作用于插槽中的数据布尔值判断是否显示 -->
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序：自定义列，加作用域插槽 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作：自定义列，加作用于插槽 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" round>编辑</el-button>
          <el-button round type="danger" icon="el-icon-delete" size="mini" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        :page-sizes="[1, 3, 5, 10, 50]"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalnum"
        @size-change="sizeChange"
        @current-change="pageChange"
      >
      </el-pagination>

      <!-- 添加分类 -->
      <el-dialog title="添加分类" :visible.sync="typedialogVisible" width="30%" @close="clearAddType">
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormEl" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="ruleForm.cat_name"></el-input>
          </el-form-item>
          <!-- 联级选择器 -->
          <!-- options 数据源  props：联系选中的与下级菜单-->
          <!-- clearable 可清空 v-model选中的值为数组 -->
          <!-- @change 选择项发生变化事件 -->
          <el-form-item label="父级分类">
            <el-cascader v-model="selectKeys" :options="paraentArr" :props="cascaderProps" clearable @change="parentChange" change-on-select></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="typedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addtypecommit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类
      cateList: [],
      // 总数据条数
      totalnum: 0,
      // 为树形表格制定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 自定义模板
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      typedialogVisible: false,
      ruleForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      rules: {
        cat_name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      paraentArr: [],
      // 选中配置
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectKeys: [],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      await this.$http.get("categories", { params: this.queryInfo }).then((res) => {
        console.log(res)
        if (res.data.meta.status == 200) {
          this.cateList = res.data.data.result
          this.totalnum = res.data.data.total
        } else {
          this.$message.error("获取失败")
        }
      })
    },
    sizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    pageChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加分类
    async addType() {
      //点击，获取前面父级分类
      await this.$http.get("categories", { params: { type: 2 } }).then((res) => {
        console.log(res)
        if (res.data.meta.status == 200) {
          this.paraentArr = res.data.data
          this.typedialogVisible = true
        } else {
          this.$message.error("获取父级分类失败")
        }
      })
    },
    // 联级选择器，父级分类改变事件
    parentChange() {
      // console.log(this.selectKeys)
      // 直接父级就是数组中的最后一项
      if (this.selectKeys.length > 0) {
        // 将直接父级id赋值给表单提交参数
        this.ruleForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 将表单提交level值也跟进
        this.ruleForm.cat_level = this.selectKeys.length
      } else {
        this.ruleForm.cat_pid = 0
        this.ruleForm.cat_level = 0
      }
    },
    // 点击添加分类的确定按钮
    addtypecommit() {
      this.$refs.ruleFormEl.validate(async (valid) => {
        if (valid) {
          await this.$http.post("categories", this.ruleForm).then((res) => {
            // console.log(res)
            if (res.data.meta.status === 200 || res.data.meta.status === 201) {
              this.getCateList()
              this.$message.success("添加成功")
              this.typedialogVisible = false
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
        }
      })
    },
    // 关闭对话框清空
    clearAddType() {
      // 清空表单
      this.$refs.ruleFormEl.resetFields()
      // 清空父级联机选择器
      this.selectKeys = []
      // console.log("1",this.ruleForm)
      this.ruleForm.cat_pid = 0
      this.ruleForm.cat_level = 0
    },
  },
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
.addtypebtn {
  margin-bottom: 10px;
}
.el-icon-success {
  color: green;
}
.el-icon-error {
  color: red;
}
.el-cascader {
  width: 100%;
}
</style>