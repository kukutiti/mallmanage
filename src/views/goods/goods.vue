<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card卡片 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row class="topsearchline">
        <el-col :span="5" class="searchline">
          <el-input
            v-model="requestInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="returnbefore"
            @keyup.enter.native="searchcontent"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchcontent"
            >
            </el-button
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="goaddgoodpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="95px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <!-- 用 | 调用过滤器 -->
          <template slot-scope="scope">
            {{ scope.row.add_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRow(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页区域 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="pageChange"
        :current-page="requestInfo.pagenum"
        :page-sizes="[5, 10, 20, 30, 50]"
        :page-size="requestInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
// 全局过滤器
// import Vue from 'vue';
// Vue.filter('formatTime', function (val) {
//   const date = new Date(val);
//   const hour = date.getHours();
//   const minutes = date.getMinutes();
//   const seconds = date.getSeconds();
//   return `${hour} : ${minutes} : ${seconds}`;
// });

export default {
  data() {
    return {
      requestInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品数据
    async getGoodsList() {
      await this.$http
        .get("goods", { params: this.requestInfo })
        .then((res) => {
          if (res.data.meta.status === 200) {
            this.goodsList = res.data.data.goods
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
    },
    // 当前页个数改变事件 ，方法自动有size
    sizeChange(newsize) {
      this.requestInfo.pagesize = newsize
      this.getGoodsList()
    },
    // 页数改变事件 ，方法自动有page
    pageChange(newpage) {
      this.requestInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 搜索功能
    searchcontent() {
      this.getGoodsList()
    },
    // 清空搜索区，还原内容
    returnbefore() {
      this.requestInfo.query = ""
      this.getGoodsList()
    },
    // 删除此商品
    async deleteRow(id) {
      const result = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err)
      if (result !== "confirm") {
        return this.$message.info("已取消删除")
      }
      await this.$http.delete(`goods/${id}`).then((res) => {
        if (res.data.meta.status == 200) {
          this.getGoodsList()
          this.$message.success("删除成功")
        } else {
          this.$message.error("删除失败")
        }
      })
    },
    // 添加商品，跳转到添加商品页面
    goaddgoodpage(){
      this.$router.push("/home/addgoods")
    }
  },
  // 局部过滤器
  // 使用时用 | 调用过滤器
  filters: {
    // padStart()用于头部补全，padEnd()用于尾部补全。  ES6新增字符串方法
    // 'vvv'.padStart(5, '0')  //00vvv
    // 'vvv'.padEnd(5, '0')    // vvv00
    formatDate(val) {
      const date = new Date(val)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1 + "").padStart(2, "0")
      const day = (date.getDate() + "").padStart(2, "0")
      const hours = (date.getHours() + "").padStart(2, "0")
      const min = (date.getMinutes() + "").padStart(2, "0")
      const ss = (date.getSeconds() + "").padStart(2, "0")
      return `${year}-${month}-${day} ${hours}:${min}:${ss}`
    },
  },
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
.topsearchline {
  margin-bottom: 15px;
  .searchline {
    margin-right: 10px;
  }
}
</style>