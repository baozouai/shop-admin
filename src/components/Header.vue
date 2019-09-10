<template>
  <!-- 头部两边对齐并高度居中 -->
  <el-row type="flex" justify="space-between" align="middle">
    <!-- 点击展开与合并侧边导航 -->
    <i class="el-icon-back" @click="handleUpdateCollapse"></i>
    <!-- 右边管理员信息 -->
    <div class="user">
      {{realname}}
      <!-- 退出按钮 -->
      <el-button size="small" type="danger" @click="handleLoout">退出</el-button>
    </div>
  </el-row>
</template>

<script>
// import {mapState} from 'vuex'
export default {
  data() {
    return {
      uname: "",
      realname: ""
    };
  },
  mounted() {
    // 登出成功后获取uname和realname
    this.uname = localStorage.getItem("uname");
    this.realname = localStorage.getItem("realname");
  },
  // computed: {
  //   ...mapState({
  //     user: 'user'
  //   })
  // },
  
  methods: {
    // 侧边导航展开与合并
    handleUpdateCollapse() {
      this.$emit("updatecollapse");
    },
    // 退出
    handleLoout() {
      // 弹框提示
      this.$confirm("是否退出?", "提示", {
        
        confirmButtonText: '确定',
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定退出
          // 发送登出请求
          this.$axios({
            url: "/admin/account/logout"
          }).then(res => {
            // 解构赋值
            const { status, message } = res.data;
            // 如果状态码为0，则退出成功
            if (status === 0) {
              // 清除本地存储
              localStorage.removeItem("uname");
              localStorage.removeItem("realname");
              // 跳转到登录页面
              this.$router.push("/login");
              // 提示成功退出
              this.$message({
                type: "success",
                message
              });
            } else {
              // 提示退出失败
              this.$message({
                type: "error",
                message
              });
            }
          });
        })
        .catch(() => {
          // 取消的时候什么都不做
          
        });
    }
  }
};
</script>

<style>
.el-icon-back,
.user span {
  cursor: pointer;
}

</style>