<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入搜索关键字" v-model="searchList" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="add"></el-button>
    </el-input>
    <el-button type="success" plain @click="flag = true">添加用户</el-button>
    <!-- 列表 -->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="obj">
          <el-switch
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggle(obj.row.mg_state,obj.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="mp_state" label="操作">
        <template v-slot:default="obj">
          <el-row>
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="small"
              @click="show(obj.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="small"
              @click="del(obj.row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              plain
              size="small"
              @click="distribution(obj.row)"
            >分配角色</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 修改弹框 -->
    <el-dialog title="修改用户" :visible.sync="dialogVisible" width="30%">
      <el-form
        class="from"
        ref="forms"
        :rules="rules"
        status-icon
        :model="forms"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-tag effect="plain" type="info">{{ forms.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="forms.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="forms.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="shows">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹框 -->
    <el-dialog title="添加用户" :visible.sync="flag" width="30%">
      <el-form
        class="from"
        ref="addform"
        :rules="rules"
        status-icon
        :model="addform"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addform.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addform.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="flag = false">取 消</el-button>
        <el-button type="primary" @click="addlist">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="showFlag" width="30%">
      <el-form class="from" ref="formList" status-icon :model="formList" label-width="80px">
        <el-form-item label="用户名">
          <el-tag>{{ formList.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="formList.rid">
            <el-option
              v-for="item in options"
              :label="item.roleName"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showFlag = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showFlag: false,
      list: [],
      searchList: '',
      pagenum: 1,
      total: 1,
      pagesize: 2,
      query: '',
      dialogVisible: false,
      flag: false,
      forms: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['change', 'blur']
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['change', 'blur']
          },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: ['change', 'blur']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['change', 'blur']
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['change', 'blur']
          }
        ]
      },
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formList: {
        id: '',
        username: '',
        rid: ''
      },
      options: []
    }
  },
  created () {
    this.render()
  },
  methods: {
    async render () {
      const { data, meta } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.list = data.users
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }

      // this.$axios
      //   .get('users', {
      //     params: {
      //       query: '',
      //       pagenum: 1,
      //       pagesize: 5
      //     }
      //   })
      //   .then(res => {
      //     const { data, meta } = res.data
      //     if (meta.status === 200) {
      //       this.list = data.users
      //     }
      //   })
    },
    handleSizeChange (val) {
      this.pagenum = 1
      this.pagesize = val
      this.render()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.render()
    },
    async toggle (val, id) {
      const { meta } = await this.$axios.put(`users/${id}/state/${val}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.render()
      } else {
        console.log(meta.msg)
      }
    },
    add () {
      this.query = this.searchList
      this.render()
    },
    async del (id) {
      try {
        await this.$confirm('亲，请确认是否删除', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.list.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.render()
        } else {
          console.log(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async show (id) {
      const { meta, data } = await this.$axios.get(`users/${id}`)
      if (meta.status === 200) {
        this.dialogVisible = true
        this.forms.id = data.id
        this.forms.username = data.username
        this.forms.email = data.email
        this.forms.mobile = data.mobile
      } else {
        console.log(meta.msg)
      }
    },
    async shows () {
      const { id, email, mobile } = this.forms
      const { meta } = await this.$axios.put(`users/${id}`, {
        email,
        mobile
      })
      console.log(meta)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.dialogVisible = false
        this.render()
      } else {
        console.log(meta.msg)
      }
    },
    async addlist () {
      try {
        await this.$refs.addform.validate()
        const { username, password, email, mobile } = this.addform
        const { meta } = await this.$axios.post('users', {
          username,
          password,
          email,
          mobile
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.flag = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.render()
          this.$refs.addform.resetFields()
        } else {
          console.log(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async distribution (row) {
      this.formList.id = row.id
      this.formList.username = row.username
      this.showFlag = true

      const res = await this.$axios.get(`users/${row.id}`)
      if (res.meta.status === 200) {
        if (res.data.rid === -1) {
          this.formList.rid = ''
        } else {
          this.formList.rid = res.data.rid
        }
      } else {
        this.$message.error(res.meta.msg)
      }

      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async addRole () {
      const { id, rid } = this.formList
      const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
      if (meta.status === 200) {
        this.showFlag = false
        this.$message.success(meta.msg)
        this.render()
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss">
.el-input.input-with-select {
  width: 300px;
  margin-bottom: 10px;
  margin-right: 20px;
}
.el-pagination {
  margin-top: 10px;
}
</style>
