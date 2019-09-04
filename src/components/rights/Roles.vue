<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button @click="operationAdd" class="rolebtn" type="success" plain>添加角色</el-button>
    <!-- 列表 -->
    <el-table :data="rolesList" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag closable @close="delList(row,l1.id)">{{ l1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag type="success" closable @close="delList(row,l2.id)">{{ l2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    class="l3"
                    type="warning"
                    v-for="l3 in l2.children"
                    :key="l3.id"
                    closable
                    @close="delList(row,l3.id)"
                  >{{ l3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-row>
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="small"
              @click="operation(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="small"
              @click="delCurrent(row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              plain
              size="small"
              @click="setCheckedKeys(row)"
            >分配权限</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配对话框 -->
    <el-dialog title="分配权限" :visible.sync="rolesVisible" width="30%">
      <el-tree
        default-expand-all
        ref="tree"
        :data="dataList"
        show-checkbox
        node-key="id"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer">
        <el-button @click="rolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCheckedKeys">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改，添加对话框 -->
    <el-dialog :title="newLabel" :visible.sync="addRoleList" width="30%">
      <el-form
        class="form"
        ref="addRolesform"
        :rules="rules"
        status-icon
        :model="addRolesform"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesform.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesform.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeList">取 消</el-button>
        <el-button type="primary" @click="addRoleListForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      newLabel: '添加角色',
      rolesList: [],
      rolesVisible: false,
      dataList: [],
      addRoleList: false,
      addRolesform: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      newId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: ['change', blur]
          }
        ],
        roleDesc: {
          required: true,
          message: '请输入角色描述',
          trigger: ['change', blur]
        }
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.rolesList = data
      }
    },
    async delList (row, id) {
      const { meta, data } = await this.$axios.delete(
        `roles/${row.id}/rights/${id}`
      )
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async setCheckedKeys (row) {
      this.newId = row.id
      this.rolesVisible = true
      const { meta, data } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        this.dataList = data
        const arr = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              arr.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(arr)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async getCheckedKeys () {
      const rids = this.$refs.tree.getCheckedKeys().join(',')
      const { meta } = await this.$axios.post(`roles/${this.newId}/rights`, {
        rids
      })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getRolesList()
        this.rolesVisible = false
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delCurrent (id) {
      try {
        await this.$confirm('是否删除当前角色？？', '温馨提示')
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    operationAdd () {
      this.addRoleList = true
      this.newLabel = '添加角色'
    },
    operation (row) {
      this.addRoleList = true
      this.newLabel = '修改角色'
      this.$nextTick(() => {
        this.addRolesform.id = row.id
        this.addRolesform.roleName = row.roleName
        this.addRolesform.roleDesc = row.roleDesc
      })
    },
    removeList () {
      this.addRoleList = false
      this.$refs.addRolesform.resetFields()
    },
    async addRoleListForm () {
      const bleen = this.newLabel === '添加角色'
      const url = bleen ? 'roles' : `roles/${this.addRolesform.id}`
      const method = bleen ? 'post' : 'put'
      const { meta } = await this.$axios[method](url, this.addRolesform)
      if (meta.status === 200 || meta.status === 201) {
        this.$message.success(meta.msg)
        this.getRolesList()
        this.addRoleList = false
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss">
.roles {
  .rolebtn {
    margin-bottom: 10px;
  }
  .l1 {
    margin-bottom: 5px;

    .l2 {
      margin-bottom: 5px;
    }

    .l3 {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
}
</style>
