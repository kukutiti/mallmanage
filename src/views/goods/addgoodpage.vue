<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- alert 提示区 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>

      <!-- 进度条区 -->
      <!-- active默认激活索引 -->
      <!-- 字符串转数字 -0 会自动运算 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeleave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"> </el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"> </el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"> </el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"> </el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- v-model选中各项的数组，options：总数组，props展示设置 -->
              <el-cascader v-model="addForm.goods_cat" :options="cataList" :props="cataProps" @change="handleChange" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in cateAttr" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item" v-for="(item, index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in staticCateAttr" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action:上传图片到后台哪个地址：涉及到跨域，地址用绝对地址，或者带api的。 -->
            <!-- on-preview：点击图片预览触发事件 -->
            <!-- on-remove：点击移除图片触发事件 -->
            <!-- list-type:预览时的样式，图片或者文本形式 -->
            <!-- headers ：因为图片上传不是走的我们的axios，所以发请求提示token获取不到，
            我们需要手动用headers设置请求头 -->
            <!-- on-success	文件上传成功的函数钩子 -->
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handlesuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- 这个是提示内容，按需写 -->
              <!-- <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div> -->
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 :第三方组件 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="addGoodbtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片阅览 -->
    <el-dialog :visible.sync="picdialogVisible" width="30%">
      <img :src="priviewPath" class="previewPicc" />
    </el-dialog>
  </div>
</template>

<script>
// 导入lodash 使用其中的深拷贝
import _ from "lodash"
export default {
  data() {
    return {
      activeIndex: "0",
      // 表单
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: "",
        // 动态参数和静态属性
        attrs: [],
      },
      addRules: {
        goods_name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        goods_price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        goods_number: [{ required: true, message: "请输入商品数量", trigger: "blur" }],
        goods_weight: [{ required: true, message: "请输入商品重量", trigger: "blur" }],
        goods_cat: [{ required: true, message: "请选择商品分类", trigger: "blur" }],
      },
      //   级联选择器 value：选中的值
      cataList: [],
      cataProps: {
        children: "children",
        label: "cat_name",
        value: "cat_id",
      },
      //   参数列表
      cateAttr: [],
      //   静态属性列表
      staticCateAttr: [],
      //   上传文件，手动设置请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 图片真实地址
      priviewPath: "",
      // 图片对话框展示与隐藏
      picdialogVisible: false,
    }
  },
  created() {
    this.getCateist()
  },
  methods: {
    //  获取所有商品分类信息
    async getCateist() {
      await this.$http.get("categories").then((res) => {
        // console.log(res)
        if (res.data.meta.status == 200) {
          this.cataList = res.data.data
          //   console.log(this.cataList)
        } else {
          this.$message.error(res.data.meta.msg)
        }
      })
    },

    // 级联选择器 选中变化事件
    handleChange() {
      //   console.log(this.addForm.goods_cat)
      // 只能选中三级分类，如果是二级的，清空
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        this.$message.error("请选择三级分类")
      }
    },

    // 在标签切换之前 自带前后跳转标签的name
    // return false 就会组织标签切换
    beforeleave(activeName, oldActiveName) {
      //   console.log(activeName, oldActiveName)
      // 第一层
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        // this.$refs[formName].validate((valid) => {
        //   if (valid) {
        //     alert("submit!")
        //   } else {
        //     console.log("error submit!!")
        //     return false
        //   }
        // })
        this.$message.error("请先选择商品分类")
        return false
      }
    },

    // 当前tab 被选中事件
    async tabClick() {
      // 前置条件需要前一个页面验证通过了
      if (this.activeIndex == 1) {
        await this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "many" },
          })
          .then((res) => {
            // console.log(res)
            res.data.data.forEach((item) => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ")
            })
            if (res.data.meta.status == 200) {
              this.cateAttr = res.data.data
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
      } else if (this.activeIndex == 2) {
        await this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "only" },
          })
          .then((res) => {
            if (res.data.meta.status == 200) {
              this.staticCateAttr = res.data.data
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
      }
    },
    // 图片走列表浏览的函数，自带浏览的文件
    handlePreview(file) {
      //   此时的url是可以打开的实际地址，用这个url
      console.log("浏览图片", file)
      //   拿到可以打开的实际地址保存 。用于弹出对话框展示此地址的图片
      this.priviewPath = file.response.data.url
      this.picdialogVisible = true
    },

    // 图片走列表移除的函数 自带被移除的文件
    handleRemove(file) {
      console.log("移除文件：", file)
      //   1、获取移除文件的临时路径
      const filepath = file.response.data.tmp_path
      //   2、从pics 数组中，遍历，如果路径对比相同，返回下标
      const index = this.addForm.pics.findIndex((item) => item.pic === filepath)
      //   3、用splice移除
      this.addForm.pics.splice(index, 1)
      console.log("删除后的临时区图片数组", this.addForm.pics)
    },

    // 图片上传成功的函数  自带拿到的相应内容
    handlesuccess(response) {
      // tmp_path 返回内容之一：图片临时存放路径 。
      // 把这个路径作为addForm表单参数等下一起提交到后台
      console.log("图片上传成功返回：", response)
      // 1、拼接得到图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2、将图片信息对象push到pics图片数组
      this.addForm.pics.push(picInfo)
      console.log("当前临时区图片数组：", this.addForm.pics)
    },

    // 最终添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          console.log("ok")
        } else {
          this.$message.error("请填写必要的表单项")
        }
        // 将表单的goods_cat由数组转为字符串
        // 因为goods_cat 再上面引用的时候需要是数组
        // 这里再改成字符串，上面就会报错
        // 所以需要深拷贝一下，才互不干扰
        // 深拷贝 ：1、Json的parse和stringtify 2、遍历
        //         3、安装 lodash 这个第三方插件,里面有cloneDeep(obj)方法直接深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(",")
        // 处理动态参数
        this.cateAttr.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.staticCateAttr.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        // 发起请求添加商品
        await this.$http.post("goods", form).then((res) => {
          // console.log(res)
          if (res.data.meta.status === 200 || res.data.meta.status === 201) {
            this.$router.push("/home/goods")
            this.$message.success("添加成功")
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
      })
    },
  },
  computed: {
    // 当前 选中的第三层的id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
.el-steps {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 130px;
}
.el-checkbox {
  margin: 0 5px !important;
}
.previewPicc {
  width: 100%;
}
.addGoodbtn {
  margin-top: 10px;
}
</style>