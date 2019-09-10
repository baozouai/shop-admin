<template>
  <div class="admin-container">
    <el-container>
      <!-- 侧边导航 侧边栏容器 -->
      <el-aside width="auto">
        <Aside :collapse="isCollapse"></Aside>
      </el-aside>
      <el-container>
        <!-- 头部 顶栏容器 -->
        <el-header>
          <Header @updatecollapse="UpdateCollapse"></Header>
        </el-header>
        <!-- 主体 主要区域容器 -->
        <el-main>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
            <el-breadcrumb-item v-for="(item, index) in getBreadCrumbs" :key="index" :to="item.path">
              {{item.meta}}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 主内容都在这显示 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 导入组件
import Header from "../components/Header.vue";
import Aside from "../components/Aside.vue";

export default {
  data() {
    return {
      isCollapse: false,
      breadCrumbs: []
    };
  },
  methods: {
    // 展开和收起侧边导航栏
    UpdateCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  },
  components: {
    Header,
    Aside,
  },
  computed: {
    getBreadCrumbs() {
      //   路由变化时获取面包屑
      var arr = this.$route.matched
      return arr;
    }
  }
};
</script>

<style lang="less" scoped>
.admin-container {
  width: 100%;
  height: 100%;

  .el-aside {
    background-color: #001529;
  }

  .el-container {
    height: 100%;

    .el-header {
      background-color: #fff;
      color: #333;
      text-align: center;
      line-height: 60px;
    }

    .el-main {
      background-color: #e9eef3;
    }
  }
}
</style>