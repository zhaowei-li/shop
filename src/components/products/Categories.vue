<template>
  <div class="categories">
    <el-button class="addbtn" type="success" plain @click="addCate">添加分类</el-button>
    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="cateList" row-key="cat_id">
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column label="是否有效">{{ cateList.cat_deleted ? '否' : '是'}}</el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button type="primary" plain icon="el-icon-edit" size="small"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="small" @click="delList(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5,10,15,20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="30%" @close="clearbal">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader clearable v-model="form.cat_pid" :options="options" :props="props"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addform">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      dialogVisible: false,
      form: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      options: [],
      props: {
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      rules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: ['change', blur]
          }
        ]
      },
      loading: true
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.loading = false
        this.cateList = data.result
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagenum = 1
      this.pagesize = val
      this.getCateList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCateList()
    },
    async delList (row) {
      console.log(row)
      const { meta } = await this.$axios.delete(`categories/${row.cat_id}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getCateList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    async addCate () {
      this.dialogVisible = true
      const { meta, data } = await this.$axios.get('categories?type=2')
      if (meta.status === 200) {
        this.options = data
        console.log(data)
      } else {
        this.$message.error(meta.msg)
      }
    },
    clearbal () {
      this.$refs.form.resetFields()
    },
    async addform () {
      console.log(this.form)
      try {
        this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0,
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_pid.length
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.getCateList()
        } else {
          this.message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.categories {
  .addbtn {
    margin-bottom: 10px;
  }
}
</style>
