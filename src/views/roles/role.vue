<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="RoleArr" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="childItem in scope.row.children"
              :key="childItem.id"
              class="rolebtn"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removebtn(scope.row, childItem.id)">{{
                  childItem.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="childtwo in childItem.children"
                  :key="childtwo.id"
                  class="rolebtntwo"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removebtn(scope.row, childtwo.id)"
                      >{{ childtwo.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限-->
                  <!--  closable：有×号 close事件：点击×号触发事件 -->
                  <el-col :span="18">
                    <el-tag
                      type="info"
                      v-for="childthree in childtwo.children"
                      :key="childthree.id"
                      class="rolebtnthree"
                      closable
                      @close="removebtn(scope.row, childthree.id)"
                      >{{ childthree.authName }}</el-tag
                    ></el-col
                  >
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="changeRole(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 设置权限，弹出对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="30%"
      @close="moveall"
    >
      <!-- 树形控件 -->
      <!-- :data绑定数据源 :props绑定树的父子取值 show-checkbox复选框 -->
      <!-- node-key="id" 节点唯一标识RoleTree里面自动找的 -->
      <!-- default-checked-keys	默认勾选节点:把底层的全部选中 -->
      <el-tree
        :data="RoleTree"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defalutKeysArr"
        ref="treeref"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- 获取半选中和全选中的id getCheckedKeys getHalfCheckedKeys  -->

        <el-button type="primary" @click="emitRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RoleArr: [],
      RoleTree: "",
      // 父子树取值，儿子级为RoleTree的children属性，展示名字为RoleTree的authName属性
      treeProps: {
        children: "children",
        label: "authName",
      },
      dialogVisible: false,
      defalutKeysArr: [],
      roleId: "",
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      await this.$http.get("roles").then((res) => {
        // console.log(res)
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取角色权限失败")
        }
        this.RoleArr = res.data.data
      })
    },
    // 删除当前权限
    removebtn(role, nowid) {
      // 确认提示框
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.delete(`roles/${role.id}/rights/${nowid}`).then((res) => {
            console.log(res)
            if (res.data.meta.status == 200) {
              this.$message.success("删除权限成功")
              // 这样展开行会关闭
              // this.getRoleList();
              // 直接赋值，避免刷新
              role.children = res.data.data
            } else {
              this.$message.error("删除权限失败")
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          })
        })
    },
    // 点击分配权限
    async changeRole(nowrow) {
      await this.$http.get("rights/tree").then((res) => {
        // console.log(res.data.data)
        if (res.data.meta.status == 200) {
          // 把所有权限数据保存到tree中
          this.RoleTree = res.data.data
          // 递归三级菜单id
          this.getDefaultKeys(nowrow, this.defalutKeysArr)
          // 拿到当前设置权限的id
          this.roleId = nowrow.id
          this.dialogVisible = true
        } else {
          this.$message.error("获取权限失败")
        }
      })
    },
    // 通过递归获取所有三级权限id，然后id保存到tree的默认选中数组中
    getDefaultKeys(node, arr) {
      // 如果有字集，那么不是三级权限
      // 如果没有字集，是三级权限，id保存了
      if (!node.children) {
        return arr.push(node.id)
      }
      // 把有字集的再次遍历
      node.children.forEach((item) => {
        this.getDefaultKeys(item, arr)
      })
    },
    // 关闭权限，恢复初始值，不然选中数组数据任然存在
    moveall() {
      this.defalutKeysArr = []
    },
    // 确定按钮，提交设置权限到后台
    async emitRole() {
      // 将全选中状态的id，和半选中的id，拿出来合并到一起。
      const allkeys = [
        ...this.$refs.treeref.getCheckedKeys(),
        ...this.$refs.treeref.getHalfCheckedKeys(),
      ]
      // 把合并的数组以逗号拼接，用于传递到后端
      const keysStr = allkeys.join(",")
      await this.$http
        .post(`roles/${this.roleId}/rights`, { rids: keysStr })
        .then((res) => {
          if (res.data.meta.status == 200) {
            this.$message.success("更新成功")
            // 重新获取所有权限
            this.getRoleList()
            this.dialogVisible = false
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
.el-table {
  margin-top: 10px;
}
.rolebtn {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgb(133, 177, 31);
  &:nth-child(1) {
    border-top: 1px solid rgb(133, 177, 31);
  }
}
.rolebtntwo {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgb(133, 177, 31);
  &:last-child {
    border-bottom: none;
  }
}
.rolebtnthree {
  margin: 5px;
}
</style>