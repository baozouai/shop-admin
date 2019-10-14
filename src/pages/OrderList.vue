<template>
  <div class="goodslist">
    <!-- 删除按钮及搜索框 -->
    <el-row type="flex" justify="space-between" align="middle" class="tool-tips">
      <el-col>
        <el-button type="danger" @click="handleDeleteBatch">批量删除</el-button>
      </el-col>
      <el-col align="right">
        <!-- 这里@keyup.enter需要加上native -->
        <el-input
          v-model="vipname"
          placeholder="请输入会员名"
          class="input-with-select"
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center"></el-table-column>

      <el-table-column label="订单ID" align="center" prop="id"></el-table-column>
      <el-table-column label="订单编号" align="center" prop="order_no"></el-table-column>
      <el-table-column prop="user_name" align="center" label="会员名称"></el-table-column>
      <el-table-column prop="mobile" align="center" label="手机"></el-table-column>
      <el-table-column prop="area" align="center" label="地址"></el-table-column>
      <el-table-column prop="expressTitle" align="center" label="快递"></el-table-column>
      <el-table-column prop="express_fee" align="center" label="快递费"></el-table-column>
      <el-table-column prop="paymentTitle" align="center" label="支付方式"></el-table-column>
      <el-table-column prop="statusName" align="center" label="状态"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 8, 16]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalcount"
      class="pagination"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      ids: [],
      currentPage: 1,
      pageSize: 4,
      totalcount: 0,
      orderstatus: "",
      vipname: "",
      express_fee: "",
      paymentTitle: ""
    };
  },

  methods: {
    handleSearch() {
      // 根据搜索值获取商品
      this.getOrderList();
    },
    // 每页条数改变的时候
    handleSizeChange(val) {
      // 重新改变每页条数
      this.pageSize = val;
      // 并重新获取数据
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderList();
    },

    // 删除单行数据
    handleDelete(val) {
      // 弹窗确认框
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定则发送删除请求
          //   获取id
          const { id } = val;
          this.$axios({
            url: `/admin/goods/del/${id}`
          }).then(res => {
            // 解构赋值
            // console.log(res);
            const { status, message } = res.data;
            // 如果状态码为0，则退出成功
            if (status === 0) {
              // 提示成功删除
              this.$message({
                type: "success",
                message
              });
              //   重新获取数据
              this.getOrderList();
            } else {
              // 提示删除失败
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
    },
    // 批量删除
    handleDeleteBatch() {
      const ids = this.ids.join(",");
      if (!ids) {
        this.$message({
          type: "warning",
          message: "您还没选择任何订单呢"
        });
        return;
      }
      // 弹窗确认框
      this.$confirm("是否删除所选订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定则发送删除请求
          //   获取id
          this.$axios({
            url: `/admin/order/del/${ids}`
          });
        })
        .then(res => {
          // 解构赋值
          const { status, message } = res.data;
          // 如果状态码为0，则退出成功
          if (status === 0) {
            // 提示成功删除
            this.$message({
              type: "success",
              message
            });
            //   重新获取数据
            this.getOrderList();
          } else {
            // 提示删除失败
            this.$message({
              type: "error",
              message
            });
          }
        })
        .catch(() => {
          // 取消的时候什么都不做
        });
    },
    handleSelectionChange(val) {
      var ids = val.map(v => v.id);
      this.ids = ids;
    },
    getOrderList() {
      // 发起获取订单请求
      this.$axios({
        url: `/admin/order/getorderlist?orderstatus=${this.orderstatus}&vipname=${this.vipname}&pageIndex=${this.currentPage}&pageSize=${this.pageSize}`
      }).then(res => {
        if (res.data.status === 0) {
          this.totalcount = res.data.totalcount;
          this.tableData = res.data.message;
        }
      });
    }
  },
  mounted() {
    //   页面加载成功后获取订单列表
    this.getOrderList();
  }
};
</script>

<style>
.el-select .el-input {
  width: 130px;
}
.input-with-select {
  width: 50%;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.tool-tips {
  margin: 20px 0;
}

.good-img {
  width: 30%;
  padding: 0 10px;
}

.pagination {
  margin-top: 20px;
}
</style>