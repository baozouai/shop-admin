<template>
  <el-tree
    show-checkbox
    :data="arr"
    node-key="id"
    default-expand-all
    :expand-on-click-node="false"
  >
    <span class="custom-tree-node" slot-scope="{  data }">
      <span>{{ data.title }}</span>
    </span>
  </el-tree>
</template>

<script>
export default {
  data() {
    return {
      arr: []
    };
  },

  methods: {
    // 递归获取树行数组
    loop(arr, item) {
      // 数组遍历
      arr.forEach(v => {
        // 当数组元素的category_id等于传入item的parent_id，意味着item为v的孩子
        if (v.category_id === item.parent_id) {
          // 判断是否有孩子数组存在
          if (!v.children) {
            v.children = [];
          }
          // 加入孩子数组
          v.children.push(item);
          // 返回
          return;
        } else {
          // 如果上面的找不到父元素，且当前元素v还有子数组，则其孩子数组遍历
          if (v.children) {
            this.loop(v.children, item);
          }
        }
      });
    }
  },
  mounted() {
    //   记载完毕后获取分类
    this.$axios({
      url: "/admin/category/getlist"
    }).then(res => {
      if (res.data.status === 0) {
        const {message} = res.data
        // 遍历获取的初始种类数组
        message.forEach(v => {
            // 如果元素的parent_id为0，则为根元素
            if (!v.parent_id) {
                // 直接加入arr数组
                this.arr.push(v)
            } else {
                // 否则判断arr数组是否为空，不为空则进入递归函数
                if (this.arr.length) {
                    this.loop(this.arr, v)
                }
            }
        })
      }
    });
  }
};
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>