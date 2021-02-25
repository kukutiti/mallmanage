<template>
  <div>
    <el-breadcrumb  separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- stripe隔行变色 border边框 -->
      <el-table :data="rightRoleArr" border style="width: 100%" stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="authName" label="商品管理"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.level == 0">权限0</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1"
              >权限1</el-tag
            >
            <el-tag type="info" v-else>权限2</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightRoleArr: [],
      Rolelevel: {
        0: "danger",
        1: "warning",
        2: "info",
      },
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    async getRightList() {
      await this.$http.get("rights/list").then((res) => {
        // console.log(res)
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取权限失败")
        }
        this.rightRoleArr = res.data.data
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
</style>