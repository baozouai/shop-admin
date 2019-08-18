<template>
  <el-row type="flex" justify="space-between" align="middle">
    <i class="el-icon-back" @click="handleUpdateCollapse"></i>
    <div class="user">
      {{realname}}
      <span @click="handleLoout">退出</span>
    </div>
  </el-row>
</template>

<script>
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
  methods: {
    handleUpdateCollapse() {
      this.$emit("updatecollapse");
    },
    handleLoout() {
      this.$confirm("是否退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定取消
          // 发送登出请求
          this.$axios({
            url: "/admin/account/logout"
          }).then(res => {
            // 解构赋值
            console.log(res.data);
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
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
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