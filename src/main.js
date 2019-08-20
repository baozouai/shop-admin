import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
// 导入组件
import Login from './pages/Login.vue'
import Admin from './pages/Admin.vue'
import GoodsList from './pages/GoodsList.vue'
import GoodsAdd from './pages/GoodsAdd.vue'
import GoodsEdit from './pages/GoodsEdit.vue'
// 配置路由信息
var routes = [{
        path: '/',
        redirect: '/admin'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/admin',
        component: Admin,
        meta: '管理后台',
        children: [{
                path: 'goodslist',
                component: GoodsList,
                meta: '商品管理'
            },
            {
                path: 'goodsadd',
                component: GoodsAdd,
                meta: '新增商品'
            },
            {
                path: 'goodsedit/:id',
                component: GoodsEdit,
                meta: '修改商品'
            }
        ]

    }
]
// 注册全局路由
Vue.use(VueRouter)
Vue.use(ElementUI)
// 创建路由实例
var router = new VueRouter({
    routes,
    mode: 'history'
})
// 导航守卫
router.beforeEach((to, from, next) => {
    // 如果已登录获取跳转到登录页，则继续
    if (localStorage.getItem('uname') || to.path === '/login') {
        next()
    } else {
        // 否则跳转到登录页
        next('/login')
    }
})
// 将axios绑定到vue实例的属性$axios上
Vue.prototype.$axios = axios
// 每次发请求都加上基本路径
axios.defaults.baseURL = 'http://localhost:8899'
// 是否是生产环境
Vue.config.productionTip = false

new Vue({
    // 将路由实例挂载到根实例
    router,
    render: h => h(App),
}).$mount('#app')