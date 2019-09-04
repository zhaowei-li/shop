<template>
  <div class="goods">
    <el-button class="goodBtn" type="success" plain @click="addGoodList">添加商品</el-button>
    <el-table :data="goodList">
      <el-table-column type="index" :index="indexList"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品名称"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量 "></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot:default="{row}">{{ row.add_time | dateFilter}}</template>
      </el-table-column>
      <el-table-column>
        <template v-slot:default="{ row }">
          <el-button type="success" plain icon="el-icon-edit" size="small"></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="small"
            @click="delGoodList(row.goods_id)"
          ></el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodList: [
        {
          goods_name: '',
          goods_id: '',
          goods_price: '',
          goods_weight: '',
          add_time: ''
        }
      ],
      total: 0,
      pagenum: 1,
      pagesize: 5
    }
  },
  created () {
    this.getGoodList()
  },
  methods: {
    async getGoodList () {
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.total = data.total
        this.goodList = data.goods
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagenum = 1
      this.pagesize = val
      this.getGoodList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodList()
    },
    indexList (index) {
      return index + this.pagesize * (this.pagenum - 1) + 1
    },
    delGoodList (id) {
      console.log(id)
    },
    addGoodList () {
      this.$router.push('goods-add')
    }
  }
}
</script>

<style lang="scss">
.goods {
  .goodBtn {
    margin-bottom: 10px;
  }
}
</style>
