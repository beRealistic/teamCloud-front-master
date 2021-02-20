<template>
    <div>
        <!--没有团队则显示加入或创建团队-->
        <div v-if="user.teamRole <= 0">
            <div v-if="user.teamRole == -1">
                <p>您已申请加入团队(团队ID：{{user.teamId}})，正在等待团队负责人审核</p>
            </div>
            <div v-if="user.teamRole == -2">
                <p>您加入团队(团队ID：{{user.teamId}})的申请未通过</p>
            </div>
            <el-divider><el-tag>加入团队</el-tag></el-divider>
            <p>每个人最多只能加入一个团队</p>
            <el-input type="number" v-model="inputTeamId" style="width: 250px;margin-left: 25px;margin-right: 50px;margin-bottom: 75px;" placeholder="请输入欲加入团队的ID" @blur='BlurText($event)' min = "1"></el-input>
            <el-button type="primary" @click="joinTeamById">提交申请</el-button>
            <el-divider><el-tag>创建团队</el-tag></el-divider>
            <p>您也可以选择自行创建一个团队</p>
            <el-input type="text" v-model="inputTeamName" style="width: 250px;margin-left: 25px;margin-right: 50px;margin-bottom: 75px;" placeholder="请输入待创建团队的团队名"></el-input>
            <el-button type="primary" style="margin-bottom: 75px;" @click="createTeam(user.teamRole, inputTeamName)">创建团队</el-button>
        </div>
        <div v-else-if="user.teamRole === 1">
            <el-tag>我的团队号：{{user.teamId}}</el-tag>
            <el-divider><el-tag>审核申请加入团队人员</el-tag></el-divider>
            <div style="margin-top: 10px;">
                <el-table
                        :data="applicants"
                        v-loading="loading1"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                        style="width: 100%" stripe border>
                    <el-table-column
                            type="selection">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="成员名"
                            align="left"
                            fixed>
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="成员用户名"
                            align="left"
                            fixed>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            fixed="right">
                        <template slot-scope="scope">
                            <el-button style="padding: 3px;" size="mini" type="primary" @click="handleApply(scope.row, 2)">通过</el-button>
                            <el-button style="padding: 3px;" size="mini" type="danger" @click="handleApply(scope.row, -2)">拒绝</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-divider><el-tag>团队成员</el-tag></el-divider>
            <div style="margin-top: 10px;">
                <el-table
                        :data="members"
                        v-loading="loading2"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                        style="width: 100%" stripe border>
                    <el-table-column
                            type="selection">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="成员名"
                            align="left"
                            fixed>
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="成员用户名"
                            align="left"
                            fixed>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            fixed="right">
                        <template slot-scope="scope">
                            <el-button style="padding: 3px;" size="mini" type="primary" @click="removeMember(scope.row)">踢出团队</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-button type="danger" @click="disband">解散团队</el-button>
        </div>
        <div v-else-if="user.teamRole === 2">
            <el-button type="danger" @click="quitTeam">退出团队</el-button>
        </div>
    </div>
</template>

<script>
export default {
  name: "team-manage",
  data() {
      return {
          user: JSON.parse(window.localStorage.getItem('user')),
          applicants: [],
          members: [],
          loading1: false,
          loading2: false,
          inputTeamId: '',
          inputTeamName: ''

      }
  },
    created(){
        this.getRequest('/info').then(resp => {
            if (resp) {
                // 存入用户信息，转字符串，存入 sessionStorage

                window.localStorage.setItem('user', JSON.stringify(resp));
            }
        });
        this.user = JSON.parse(window.localStorage.getItem('user'));
    },
    mounted() {
      if(this.user.teamRole == 1){
          this.initApplicants();
          this.initMembers();
      }

  },
  methods: {
      BlurText(e){
          let boolean = new RegExp("^[1-9][0-9]*$").test(e.target.value)
          if(!boolean){
              this.$message.warning("请输入正确的团队ID")
              e.target.value = ''
          }
      },
      joinTeamById(){
          this.postRequest('/team/applyJoinTeamById/' + this.inputTeamId).then(resp => {
              //alert(JSON.stringify(resp));
              if (resp.code == 200) {
                  //还要更新成员本地信息
                  //window.localStorage.removeItem('user');
                  location.reload();
              }

          })
      },
      initApplicants() {
          this.loading1 = true

          let url = '/manager/getApplicants'

          this.getRequest(url).then(resp => {
              this.loading1 = false // 9、关闭 loading
              if (resp) {
                  this.applicants = resp;
              }
          });
      },
      initMembers(){
          this.loading2 = true
          let url = '/manager/getTeamMembers'

          this.getRequest(url).then(resp => {
              this.loading2 = false // 9、关闭 loading
              if (resp) {
                  this.members = resp;
              }
          });
      },
      handleApply(data, role){
          this.postRequest('/manager/handleApply/'+ data.id + '/' + role);
          this.initApplicants();
          if(role == 2){
              this.initMembers();
          }
      },
      removeMember(data){
          this.postRequest('/manager/removeMember/'+data.id);
          this.initMembers();
      },
      quitTeam(){
          this.$confirm('您确定退出该团队吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'danger'
          }).then(() => {
              this.postRequest('/core/quit').then(resp => {
                  window.localStorage.removeItem('user');
                  location.reload();
              })
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消解散团队'
              });
          });
      },
      disband(){
          this.$confirm('您确定解散该团队吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'danger'
          }).then(() => {
              this.postRequest('/manager/disband').then(resp => {
                  //window.localStorage.removeItem('user');
                  location.reload();
              })
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消解散团队'
              });
          });
      },
      createTeam (role, inputTeamName) {
          if(role !== 0){
              this.$confirm('您已有加入的团队，此操作将会退出现有的团队，然后创建属于您的团队，是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'danger'
              }).then(() => {
                  if(role === 1){
                      this.disband();
                  } else if(role === 2){
                      this.quitTeam();
                  }
              }).catch(() => {
                  this.$message({
                      type: 'info',
                      message: '已取消创建团队'
                  });
              });
          }
          this.postRequest('/createTeam/' + inputTeamName);
          //window.localStorage.removeItem('user');
          location.reload();
      }
  }
}
</script>

<style>
</style>