<template>
  <div class="goodslist">
    <!-- 删除按钮及搜索框 -->
    <el-row type="flex" justify="space-between" align="middle" class="tool-tips">
      <el-col>
        <el-button type="danger" @click="handleDeleteBatch">批量删除</el-button>
      </el-col>
      <el-col align="right">
        <el-input
          v-model="user_name"
          placeholder="请输入会员名称"
          class="input-with-select"
          @change="handleSearch"
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

      <el-table-column label="姓名" align="center" prop="user_name"></el-table-column>
      <el-table-column label="手机号码" align="center" prop="mobile"></el-table-column>
      <el-table-column prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column prop="reg_time" align="center" label="时间">
        
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">查看</el-button>
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
      mobile: "",
      email: "",
      user_name: "",
      reg_time: ""
    };
  },

  methods: {
    // 搜索
    handleSearch() {
      this.getAccountList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // 重新发起请求之前要情况会员名
      this.user_name = ''
      this.getAccountList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // 重新发起请求之前要情况会员名
      this.user_name = ''
      this.getAccountList();
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
              this.getAccountList();
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
          message: "您还没选择任何会员呢"
        });
        return;
      }
      // 弹窗确认框
      this.$confirm("是否删除所选会员?", "提示", {
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
              this.getAccountList();
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
      var ids = val.map(v => v.id);
      this.ids = ids;
    },
    getAccountList() {
      // 发起获取会员请求
      this.$axios({
        url: `/admin/account/getlist?pageIndex=${this.currentPage}&pageSize=${this.pageSize}&searchvalue=${this.user_name}`
      }).then(res => {
        if (res.status === 200) {
          const {totalcount, message} = res.data
          this.totalcount = totalcount;
          // 这里修改时间格式
          this.tableData = message.map(v => {
            return {...v, reg_time: v.reg_time.replace('T', ' ').slice(0, -5)}
          })
        }
      });
    }
  },
  mounted() {
    //   页面加载成功后获取会员列表
    this.getAccountList();
  },
  
    
  
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