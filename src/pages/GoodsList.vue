<template>
  <div class="goodslist">
    <!-- 新增、删除按钮及搜索框 -->
    <el-row type="flex" justify="space-between" align="middle" class="tool-tips">
      <el-col>
        <el-button type="primary">新增</el-button>
        <el-button type="danger" @click="handleDeleteBatch">批量删除</el-button>
      </el-col>
      <el-col>
        <el-input placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
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
      <el-table-column label="标题" align="center" prop="title"></el-table-column>
      <el-table-column prop="categoryname" align="center" label="类型"></el-table-column>
      <el-table-column prop="sell_price" align="center" label="价格" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      ids: []
    };
  },

  methods: {
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
        const {id} = val
          this.$axios({
            url:`/admin/goods/del/${id}`
          }).then(res => {
            // 解构赋值
            console.log(res);
            const { status, message } = res.data;
            // 如果状态码为0，则退出成功
            if (status === 0) {
              // 提示成功删除
              this.$message({
                type: "success",
                message
              });
            //   重新获取数据
              this.getGoodsList()
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
        const ids = this.ids.join(',')
        if (!ids) {
          this.$message({
              type: 'warning',
              message: '您还没选择任何商品呢'
          })
          return
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
            url:`/admin/goods/del/${ids}`
          }).then(res => {
            // 解构赋值
            console.log(res);
            const { status, message } = res.data;
            // 如果状态码为0，则退出成功
            if (status === 0) {
              // 提示成功删除
              this.$message({
                type: "success",
                message
              });
            //   重新获取数据
              this.getGoodsList()
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
    handleSelectionChange(val) {
      var ids = val.map(v => v.id)
      this.ids = ids
    },
    getGoodsList() {
      // 发起获取商品请求
      this.$axios({
        url: "/admin/goods/getlist?pageIndex=1&pageSize=25"
      }).then(res => {
        if (res.status === 200) {
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

<style>
.el-select .el-input {
  width: 130px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.tool-tips {
  margin: 20px 0;
}
</style>