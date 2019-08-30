<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logos.png" alt />
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        <span>欢迎光临~</span>
        <a @click="logout" href="javascript:;">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$confirm('是否退出当前账号？？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$message.success('退出成功')
          localStorage.removeItem('shop')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;

  .el-header {
    background-color: #d8d8d8;
    display: flex;
    height: 60px;
    width: 100%;

    .logo {
      float: left;
      height: 60px;
      width: 180px;

      img {
        height: 40px;
        margin: 10px;
      }
    }

    .logout {
      float: right;
      height: 60px;
      width: 180px;
      line-height: 60px;
      font-weight: 700;
      text-align: right;

      a {
        color: orange;
      }
    }

    .title {
      flex: 1;
      height: 60px;
      h1 {
        text-align: center;
        line-height: 60px;
      }
    }
  }

  .el-container {
    .el-aside {
      background-color: #545c64;

      .el-menu {
        width: 200px;
        border-right: none;
      }
    }

    .el-main {
      background-color: #ecf0f1;
    }
  }
}
</style>
