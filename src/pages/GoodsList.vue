<template>
  <div>
    <!-- 新增、删除按钮及搜索框 -->
    <el-row type="flex" justify="space-between" align="middle" class="tool-tips">
      <el-col>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="danger" @click="handleDeleteBatch">批量删除</el-button>
      </el-col>
      <el-col align="right">
        <!-- 这里@keyup.enter需要加上native -->
        <el-input
          v-model="searchValue"
          placeholder="请输入内容"
          class="input-with-select"
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <!-- 当内容过长被隐藏时显示 tooltip -->
      <el-table-column label="标题" align="center" prop="title" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-row type="flex" align="middle">
            <img class="good-img" :src="scope.row.imgurl" />
            <span>{{ scope.row.title }}</span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="categoryname" align="center" label="类型"></el-table-column>
      <el-table-column prop="sell_price" align="center" label="价格"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope.row)" icon="el-icon-edit" circle></el-button>
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
      // 表格数据
      tableData: [],
      // 批量删除商品的id
      ids: [],
      // 搜索框的值
      searchValue: "",
      // 分页器当前页
      currentPage: 1,
      // 每页的商品数
      pageSize: 4,
      // 总商品数
      totalcount: 0
    };
  },

  methods: {
    // 点击新增
    handleAdd() {
      // 跳转新增页面
      this.$router.push("./goodsadd");
    },
    // 批量删除
    handleDeleteBatch() {
      // 将所有id变成以","分隔的字符串 如1,2,3
      const ids = this.ids.join(",");
      // 如果字符串为空，以为这还没选择任一商品
      if (!ids) {
        // 弹框提示
        this.$message({
          type: "warning",
          message: "您还没选择任何商品呢"
        });
        return;
      }
      // 弹窗确认框
      this.$confirm("是否删除所选商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定则发送删除请求
          //   获取id
          this.$axios({
            url: `/admin/goods/del/${ids}`
          }).then(res => {
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
              this.getGoodsList();
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
    // 搜索
    handleSearch() {
      // 根据搜索值获取商品
      this.getGoodsList();
    },
    handleSelectionChange(val) {
      // val为选择的行
      var ids = val.map(v => v.id);
      this.ids = ids;
    },
    // 编辑商品
    handleEdit(val) {
      // 点击编辑获取商品的id
      const { id } = val;
      // 跳转到编辑页面
      this.$router.push(`./GoodsEdit/${id}`);
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
            const { status, message } = res.data;
            // 如果状态码为0，则删除成功
            if (status === 0) {
              // 提示成功删除
              this.$message({
                type: "success",
                message
              });
              // 重新获取数据
              this.getGoodsList();
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
    // 每页条数改变的时候
    handleSizeChange(val) {
      // 重新改变每页条数
      this.pageSize = val;
      // 并重新获取数据
      this.getGoodsList();
    },
    // 当前页改变的时候
    handleCurrentChange(val) {
      // 修改当前页
      this.currentPage = val;
      // 并重新获取数据
      this.getGoodsList();
    },
    // 获取商品
    getGoodsList() {
      // 发起获取商品请求
      this.$axios({
        // 由当前页、每页商品数量和搜索值决定
        url: `/admin/goods/getlist?pageIndex=${this.currentPage}&pageSize=${this.pageSize}&searchvalue=${this.searchValue}`
      }).then(res => {
        if (res.status === 200) {
          // 获得商品总数并将总数据赋值给表格
          this.totalcount = res.data.totalcount;
          this.tableData = res.data.message;
        }
      });
    }
  },
  mounted() {
    //   页面加载成功后获取商品列表
    this.getGoodsList();
  }
};
</script>

<style lang="less" scoped>
.tool-tips {
  margin: 20px 0;

  .input-with-select {
    width: 50%;
  }
}
.el-select .el-input {
  width: 130px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.good-img {
  width: 30%;
  padding: 0 10px;
}

.pagination {
  margin-top: 20px;
}
</style>