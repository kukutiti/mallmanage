<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row class="serachline">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getSerachRes"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格项 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status == 0">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editorder"></el-button>
          <el-button type="success" icon="el-icon-location" size="mini" @click="editadress"></el-button>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>

      <!-- 物流信息 -->
      <el-dialog title="物流信息" :visible.sync="editdialogVisible" width="50%">
        <el-form :model="editForm" :rules="editrules" ref="editruleRef" label-width="100px"> </el-form>

        <!-- timeline时间线 -->
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改对话框 -->
      <el-dialog title="修改地址" :visible.sync="adressdialogVisible" width="50%" @close="closeAdress">
        <el-form :model="adressForm" :rules="adressrules" ref="adressruleRef" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <!-- 城市级联选择器 -->
            <!-- v-model 双向绑定到adressForm -->
            <!-- props：定义结构层级 -->
            <el-cascader v-model="adressForm.address1" :options="mycityData" @change="handlecityChange" :props="cascaderProp" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="adressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adressdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="adressdialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 全局过滤器
import Vue from "vue"
Vue.filter("formatDate", function (val) {
  const date = new Date(val)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1 + "").padStart(2, "0")
  const day = (date.getDate() + "").padStart(2, "0")
  const hours = (date.getHours() + "").padStart(2, "0")
  const min = (date.getMinutes() + "").padStart(2, "0")
  const ss = (date.getSeconds() + "").padStart(2, "0")
  return `${year}-${month}-${day} ${hours}:${min}:${ss}`
})

// 导入城市 放入data中
import cityData from "./city_data2016.js"

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,
      editdialogVisible: false,
      adressdialogVisible: false,
      editForm: {},
      editrules: {},
      adressForm: {
        address1: [],
        address2: "",
      },
      adressrules: {
        address1: [{ required: true, message: "请选择地址", trigger: "blur" }],
        address2: [{ required: true, message: "请输入详细", trigger: "blur" }],
      },
      mycityData: cityData,
      // 级联选择器层级设置
      cascaderProp: {
        children: "s",
        label: "n",
      },

      // 时间线数据
      activities: [
        {
          content: "活动按期开始",
          timestamp: "2018-04-15",
        },
        {
          content: "通过审核",
          timestamp: "2018-04-13",
        },
        {
          content: "创建成功",
          timestamp: "2018-04-11",
        },
      ],
    }
  },
  created() {
    this.getorderList()
  },
  methods: {
    // 获取订单列表
    async getorderList() {
      await this.$http.get("orders", { params: this.queryInfo }).then((res) => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.orderList = res.data.data.goods
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.meta.msg)
        }
      })
    },

    //搜索事件
    getSerachRes() {
      this.getorderList()
    },

    // 页面个数改变事件
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getorderList()
    },

    // 页数改变事件
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page
      this.getorderList()
    },

    // 物流信息弹出框
    async editorder() {
      // await this.$http.get("kuaidi/804909574412544580").then((res) => {
      //   console.log(res)
      // })
      this.editdialogVisible = true
    },

    // 地址弹出对话框
    editadress() {
      this.adressdialogVisible = true
    },

    // 城市级联选择器改变事件
    handlecityChange() {},

    // 修改对话框关闭事件,清空表单
    closeAdress() {
      this.$refs.adressruleRef.resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
.serachline {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>