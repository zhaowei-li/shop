<template>
  <div class="goods-add">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <el-tabs tab-position="left" @tab-click="handleClick" v-model="activeTab">
      <el-tab-pane label="基本信息" name="0">
        <el-form :rules="rules" ref="goodForm" :model="goodForm" label-width="80px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="goodForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="goodForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="goodForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="good_cat">
            <el-cascader clearable v-model="goodForm.goods_cat" :options="options" :props="props"></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="nextGood">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="header"
          multiple
          name="file"
          :on-success="handleAdd"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
        <quill-editor class="inputs" v-model="goodForm.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addForm">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeTab: '0',
      goodForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        pics: [],
        goods_introduce: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      rules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: ['change', blur]
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: ['change', blur]
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: ['change', blur]
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: ['change', blur]
          }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      header: {
        Authorization: localStorage.getItem('shop')
      }
    }
  },
  created () {
    this.getOptions()
  },
  methods: {
    next () {
      this.active++
      this.activeTab = this.active + ''
    },
    handleClick (tab, event) {
      this.active = +tab.index
    },
    async getOptions () {
      const { meta, data } = await this.$axios.get('categories?type=3')
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async nextGood () {
      try {
        await this.$refs.goodForm.validate()
        this.active++
        this.activeTab = this.active + ''
      } catch (e) {
        console.log(e)
      }
    },
    handleAdd (response, file, fileList) {
      console.log(response)
      const { meta, data } = response
      if (meta.status === 200) {
        // const obj = {
        //   pic: data.tmp_path
        // }
        this.goodForm.pics.push({
          pic: data.tmp_path
        })
        console.log(this.goodForm.pics)
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleRemove (file, fileList) {
      const path = file.response.data.tmp_path
      this.goodForm.pics = this.goodForm.pics.filter(item => item.pic !== path)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async addForm () {
      console.log(this.goodForm)
      const { meta } = await this.$axios.post('goods', {
        ...this.goodForm,
        goods_cat: this.goodForm.goods_cat.join(',')
      })
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-add {
  .inputs {
    background-color: #fff;
    ::v-deep .ql-editor {
      min-height: 300px;
    }
  }
}
</style>
