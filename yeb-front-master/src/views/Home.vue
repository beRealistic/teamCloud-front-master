<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">TeamCloud</div>
        <!-- 1-1 添加在线聊天入口 -->
        <div>
          <!--<el-button type="text" icon="el-icon-bell" size="normal"-->
                     <!--style="margin-right: 8px;color: black;" @click="goChar"></el-button>-->
          <el-dropdown class="userInfo" @command="commandHandler">
          <span class="el-dropdown-link">
            {{ user.name }}<i><img :src="user.userFace"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="info">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened>
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-upload" style="color: black;margin-right: 5px"></i>
                上传文件
              </template>
              <el-menu-item index="/upload">上传文件</el-menu-item>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title"><i class="el-icon-folder-opened" style="color: black;margin-right: 5px"></i>
                文件管理
              </template>
              <el-menu-item index="/myfiles">我的文件</el-menu-item>
              <el-menu-item index="/teamfiles">团队文件</el-menu-item>
            </el-submenu>

            <el-submenu index="3">
              <template slot="title"><i class="el-icon-s-custom" style="color: black;margin-right: 5px"></i>
                团队管理
              </template>
              <!--teamRole 0表示无团队，1表示团队管理人，2表示团队普通成员-->
              <el-menu-item index="/teamManage">{{pathName[user.teamRole]?pathName[user.teamRole]:pathName[0]}}</el-menu-item>
            </el-submenu>

          </el-menu>

        </el-aside>
        <el-main>
          <!-- 面包屑导航区域 -->
          <el-breadcrumb separator-class="el-icon-arrow-right"
                         v-if="this.$router.currentRoute.path!=='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path==='/home'">
            欢迎来到TeamCloud！
          </div>
          <!-- 路由点位符 -->
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'Home',
  data() {
   // var pathName=new Array("加入创建团队","管理团队","退出团队"),
    return {
      // 获取用户信息，将字符串转对象
      user: JSON.parse(window.localStorage.getItem('user')),
        pathName: {
            0:'加入创建团队',
            1:'管理团队',
            2:'退出团队'
        }
    }
  },
  methods: {
    // 1-2 进入在线聊天页面
    // goChar() {
    //   this.$router.push('/chat')
    // },
    // 注销登录
    commandHandler(command) {
      if (command === 'logout') {
        // 弹框提示用户是否要删除
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 注销登录

          this.postRequest('/logout')
          // 清空用户信息
          window.localStorage.removeItem('tokenStr')
          window.localStorage.removeItem('user')
          // 路由替换到登录页面
          this.$router.replace('/');
        }).catch(() => {
            //取消操作
          this.$message({
            type: 'info',
            message: '已取消注销登录'
          });
        });
      }
    }
  }
}
</script>
<style scoped>
.homeHeader {
  background: #3e9ef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;

}

.homeHeader .title {
  font-size: 30px;
  /*font-family: 微软雅黑;*/
  font-family: 华文楷体;
  color: white;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-left: 8px;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 华文楷体;
  color: #409ef4;
  padding-top: 50px;
}

.homeRouterView {
  margin-top: 10px;
}
</style>
