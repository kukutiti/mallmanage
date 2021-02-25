import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '@/views/login/login.vue'

// 懒加载：3步：安装依赖包，插件中导入，路由中箭头函数（注释是归类的，有用不要删）

const Welcome = () => import(/* webpackChunkName: "suibianxie-fenzu" */"@/views/Welcome.vue")
const UserList = () => import(/* webpackChunkName: "suibianxie-fenzu" */"@/views/users/userlist.vue")
const Role = () => import(/* webpackChunkName: "suibianxie-fenzu" */"@/views/roles/role.vue")
const Quanxian = () => import(/* webpackChunkName: "suibianxie-fenzu" */"@/views/roles/quanxian.vue")
const Goods = () => import(/* webpackChunkName: "suibianxie-fenzu" */"@/views/goods/goods.vue")
const Types = () => import(/* webpackChunkName: "suibianxie-fenzu" */"@/views/goods/types.vue")
const Goodtype = () => import(/* webpackChunkName: "suibianxie-fenzu" */"@/views/goods/goodtype.vue")
const AddGoodPage = () => import(/* webpackChunkName: "suibianxie-fenzu" */"@/views/goods/addgoodpage.vue")
const Orderlist = () => import(/* webpackChunkName: "suibianxie-fenzu" */"@/views/orders/orderlist.vue")
const Report = () => import(/* webpackChunkName: "suibianxie-fenzu" */"@/views/report/report.vue")

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    children: [{
        path: '',
        redirect: 'welcome'
      }, {
        path: 'welcome',
        name: 'welcome',
        component: Welcome
      }, {
        path: 'users',
        name: 'users',
        component: UserList
      }, {
        path: 'roles',
        name: 'role',
        component: Role
      }, {
        path: 'rights',
        name: 'quanxian',
        component: Quanxian
      }, {
        path: 'goods',
        name: 'goods',
        component: Goods
      },
      {
        path: 'params',
        name: 'types',
        component: Types
      },
      {
        path: 'addgoods',
        name: 'addgoods',
        component: AddGoodPage
      },
      {
        path: 'categories',
        name: 'goodtype',
        component: Goodtype
      },
      {
        path: 'orders',
        name: 'orderlist',
        component: Orderlist
      },
      {
        path: 'reports',
        name: 'report',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router