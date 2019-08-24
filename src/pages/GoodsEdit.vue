<template>
  <div class="goodadd">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="所属类别">
        <el-select v-model="categoryName" placeholder="请选择类别">
          <el-option
            v-for="(item, index) in categories"
            :key="index"
            :label="item.title"
            :value="item.title"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否发布">
        <el-switch v-model="form.status"></el-switch>
      </el-form-item>
      <el-form-item label="推荐类型">
        <el-checkbox label="置顶" v-model="form.is_top"></el-checkbox>
        <el-checkbox label="热门" v-model="form.is_hot"></el-checkbox>
      </el-form-item>
      <el-form-item label="内容标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="副标题">
        <el-input v-model="form.sub_title"></el-input>
      </el-form-item>
      <el-form-item label="封面图片">
        <!-- action：上传图片的地址
                show-file-list: 是否展示文件列表
                on-success：上传成功之后的函数，有3个参数
                before-upload：上传之前的判断
        -->
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8899/admin/article/uploadimg"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <!-- 预览图片 -->
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品货号">
        <el-input v-model="form.goods_no"></el-input>
      </el-form-item>
      <el-form-item label="库存数量">
        <el-input v-model="form.stock_quantity"></el-input>
      </el-form-item>
      <el-form-item label="市场价格">
        <el-input v-model="form.market_price"></el-input>
      </el-form-item>

      <el-form-item label="销售价格">
        <el-input v-model="form.sell_price"></el-input>
      </el-form-item>
      <el-form-item label="图片相册">
        <el-upload
          action="http://localhost:8899/admin/article/uploadimg"
          list-type="picture-card"
          :on-success="handlePictureCardSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="form.fileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="内容摘要">
        <el-input type="textarea" v-model="form.zhaiyao"></el-input>
      </el-form-item>

      <!-- quill-editor -->
      <el-form-item label="内容描述">
        <quill-editor ref="myTextEditor" v-model="form.content"></quill-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onEdit">保存更改</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  data() {
    return {
      form: {
        title: "",
        sub_title: "",
        goods_no: "",
        category_id: "",
        stock_quantity: "",
        market_price: "",
        sell_price: "",
        status: false,
        is_slide: false,
        is_top: false,
        is_hot: false,
        zhaiyao: "",
        content: "",
        imgList: [
          // {
          //   name: "wTgAWDLpQReTQ-ZOMdlAk4vF.jpg",
          //   url: "http://127.0.0.1:8899/imgs/wTgAWDLpQReTQ-ZOMdlAk4vF.jpg",
          //   shorturl: "/imgs/wTgAWDLpQReTQ-ZOMdlAk4vF.jpg"
          // }
        ],
        fileList: [
          // {
          //   name: "HN5d4_wrbsUk5KQNjzYSGGwm.jpg",
          //   url: "http://127.0.0.1:8899/imgs/HN5d4_wrbsUk5KQNjzYSGGwm.jpg",
          //   shorturl: "/imgs/HN5d4_wrbsUk5KQNjzYSGGwm.jpg"
          // }
        ]
      },
      // 类别数组
      categories: [],
      idToCategory: {},
      categoryToId: {},
      categoryName: "",
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      res.shorturl = "/" + res.shorturl;
      this.form.imgList = [res];
    },
    beforeAvatarUpload(file) {
      var isJPGPNG = true;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        isJPGPNG = false;
        this.$message.error("上传封面图片只能是 JPG 或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传封面图片大小不能超过 2MB!");
      }
      return isJPGPNG && isLt2M;
    },
    handleRemove(file, fileList) {
      this.form.fileList = fileList;
    },
    // 相册成功上传
    handlePictureCardSuccess(res) {
      this.form.fileList.push(res);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 保存更改
    onEdit() {
      //   发送更改请求
      this.form.category_id = this.categoryToId[this.categoryName];
      this.$axios({
        method: "POST",
        url: `/admin/goods/edit/${this.$route.params.id}`,
        data: this.form,
        withCredentials: true
      }).then(res => {
        const { status, message } = res.data;
        if (status === 0) {
          this.$message({
            type: "success",
            message
          });
          // 新增商品成功后回到商品列表
          this.$router.back();
        }
      });
    }
  },
  mounted() {
    // 获取id
    this.$axios({
      url: "/admin/category/getlist/goods"
    }).then(res => {
      const { status, message } = res.data;
      if (status === 0) {
        this.categories = message;
        message.forEach(v => {
          this.idToCategory[v.category_id] = v.title;
          this.categoryToId[v.title] = v.category_id;
        });
      }
    });
    const { id } = this.$route.params;
    // 请求商品信息
    this.$axios({
      url: `/admin/goods/getgoodsmodel/${id}`
    }).then(res => {
      const { status, message } = res.data;
      if (status === 0) {
        this.form = message
          
        this.imageUrl = message.imgList[0].url;
        this.fileList
        this.categoryName = this.idToCategory[this.form.category_id];
      }
    });
  },
  components: {
    quillEditor
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.goodadd {
  margin-top: 20px;
}
</style>