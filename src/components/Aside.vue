<template>
  <el-menu
    default-active="1-1"
    class="el-menu-vertical-demo"
    background-color="#001529"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse="collapse"
  >
    <!-- 遍历模版 -->
    <el-submenu v-for="(item, index) in menus" :key="index" :index="`${index + 1}`">
      <template slot="title">
        <i :class="item.icon"></i>
        <span>{{item.name}}</span>
      </template>
      <el-menu-item
        v-for="(subItem, subIndex) in item.children"
        :key="subIndex"
        :index="`${index + 1}-${subIndex + 1}`"
      >
        <router-link :to="subItem.src">{{subItem.name}}</router-link>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      // 侧边栏菜单
      menus: [
        {
          icon: "el-icon-s-goods",
          name: "购物商场",
          children: [
            {
              name: "商品管理",
              src: "/admin/goodslist"
            },
            {
              name: "栏目管理",
              src: "/admin/categorylist"
            }
          ]
        },
        {
          icon: "el-icon-s-order",
          name: "商城订单",
          children: [
            {
              name: "订单管理",
              src: "/admin/orderlist"
            }
          ]
        },
        {
          icon: "el-icon-user-solid",
          name: "会员管理",
          children: [
            {
              name: "会员列表",
              src: "/admin/accountlist"
            }
          ]
        }
      ]
    };
  },
  methods: {
    
  },
  //可以接受的属性
  props: {
    collapse: {
      // 属性的类型
      type: Boolean,
      // 默认值
      value: false
    }
  },
};
</script>

<style>
.el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu {
  border: none;
}
.el-menu-item a {
  color: inherit;
  text-decoration: none;
}
</style>