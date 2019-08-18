<template>
  <div class="admin-container">
    <el-container>
      <el-aside width="auto">
        <Aside :collapse="isCollapse"></Aside>
      </el-aside>
      <el-container>
        <el-header>
          <Header @updatecollapse="UpdateCollapse"></Header>
        </el-header>
        <el-main>
            <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item, index) in getBreadCrumbs" :key="index">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
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
    UpdateCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  },
  components: {
    Header,
    Aside
  },
  computed: {
      getBreadCrumbs() {
        //   路由变化时获取面包屑
        var arr = this.$route.matched.map(v => v.meta)
        return arr
      }
  }
  
};
</script>

<style scoped>
.admin-container {
  width: 100%;
  height: 100%;
}

.admin-container > .el-container {
  /* width: 100%; */
  height: 100%;
}
.el-header {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #001529;
}

.el-main {
  background-color: #e9eef3;
}
</style>