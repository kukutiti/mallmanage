<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="hea_logo">
        <img src="@/assets/pengyuyan.jpg" alt="" />
        <span>不负</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 侧边栏 -->
    <el-container>
      <!-- 宽度：折叠起来时，只显示图标，动态切换宽度。折叠情况下看宽度-->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="topline" @click="toggleall" ref="toggleelem">===</div>
        <!-- active-text-color 选中时颜色 -->
        <!-- unique-opened是否可以一次展开多个 -->
        <!-- 右侧对不齐：记得设置el-menu去掉右侧边框 -->
        <!-- collapse是否水平折叠：会很卡，记得关闭动画 -->
        <!-- router：是否开启跳转模式，会跳转到以index作为path的路由 -->
        <!-- default-active:默认选中。刷新之后任可选中高亮：把状态存入sessionStorage动态获取 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409FFF"
          :unique-opened="true"
          :collapse="iscollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="sessionactivepath"
        >
          <!-- 一级菜单  index相同时：点一个其他index项都要展开-->
          <!-- 只接受字符串不接受数值，所以加上字符串拼接转为字符串 -->
          <el-submenu :index="item.id + ''" v-for="item in asidemenuArr" :key="item.id">
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 每一项id，自己放入对应图标，再遍历 -->
              <i :class="adideicon[item.id]"></i>
              <!-- <i class="el-icon-location"></i> -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="childitem.path" v-for="childitem in item.children" :key="childitem.id" @click="saveStatus(childitem.path)">
              <i class="el-icon-menu"></i>
              <span>{{ childitem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      asidemenuArr: [],
      // 用于动态获取图标
      adideicon: {
        125: "iconfont icon-lvyouchuhang",
        103: "iconfont icon-qian",
        101: "iconfont icon-shangwuhezuo",
        102: "iconfont icon-jiaoyisuo",
        145: "iconfont icon-gongju",
      },
      toplinetf: true,
      // collapse是否水平折叠：会很卡，记得关闭动画
      iscollapse: false,
      // 默认选中，刷新也有效，动态获取的sessionStorage中的
      sessionactivepath: "",
    }
  },
  created() {
    this.menuList()
    this.sessionactivepath = window.sessionStorage.getItem("activepath")
  },
  methods: {
    loginout() {
      sessionStorage.removeItem("token")
      this.$router.push("/")
    },
    //获取左侧菜单栏
    async menuList() {
      await this.$http.get("menus").then((res) => {
        // console.log(res.data)
        if (res.data.meta.status !== 200) {
          this.$message.error(res.data.meta.msg)
        }
        this.asidemenuArr = res.data.data
      })
    },
    toggleall() {
      if (this.toplinetf) {
        this.$refs.toggleelem.innerHTML = "|||"
        this.toplinetf = !this.toplinetf
        this.iscollapse = !this.iscollapse
      } else {
        this.$refs.toggleelem.innerHTML = "=="
        this.toplinetf = !this.toplinetf
        this.iscollapse = !this.iscollapse
      }
    },
    saveStatus(activepath) {
      window.sessionStorage.setItem("activepath", activepath)
    },
  },
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background: #333744;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center; //让纵向排列局中，而不是全部布满
  color: #fff;

  .hea_logo {
    display: flex;
    align-items: center; //让这小块纵向局中排列
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: white;
    }
    span {
      margin-left: 10px; //左边隔10px
    }
  }
}
.el-aside {
  background: #333744;
}
.el-main {
  background: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: none;
}
.topline {
  color: white;
  background-color: #7b8083;
  font: 18px/32px "";
  text-align: center;
  cursor: pointer;
}
</style>
