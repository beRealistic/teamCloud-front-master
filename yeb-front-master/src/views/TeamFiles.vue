<template>
    <div>
        <div style="margin-top: 10px;">
            <!-- 2、表格；6、添加 loading -->
            <el-table
                    :data="files"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    style="width: 100%" stripe border>
                <el-table-column
                        type="selection">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="文件名"
                        align="left"
                        fixed>
                </el-table-column>
                <el-table-column
                        label="文件大小"
                        align="left">
                    <template scope="scope">
                        <span>{{scope.row.fileSize | sizeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="uploadTime"
                        label="上传时间"
                        align="left">
                    <template scope="scope">
                        <span>{{scope.row.uploadTime | dateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        fixed="right">
                    <template slot-scope="scope">
                        <!-- 25-4 给编辑按钮绑定点击事件 @click="showEmpView(scope.row)" -->
                        <el-button style="padding: 3px;" size="mini" type="primary" @click="downloadFile(scope.row)">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 10、分页 -->
            <div style="display: flex;justify-content: flex-end;margin-top: 10px;">
                <!-- 13、@current-change="currentChange" 当前页
                     14、@size-change="sizeChange" 每页显示多少条 -->
                <el-pagination
                        prev-text="上一页"
                        next-text="下一页"
                        @current-change="currentChange"
                        @size-change="sizeChange"
                        :page-sizes="[10,20,50,100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total" background>
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "manage-files",
        data() {
            return {
                headers: { // 27-12 定义请求头
                    Authorization: window.localStorage.getItem('tokenStr')
                },


                files: [], // 3、获取所有文件
                loading: false, // 7、添加 loading
                total: 0, // 11 分页总条数
                currentPage: 1, // 14、默认显示第1页(currentPage 后端字段）
                size: 10, // 15、默认每页显示 10 条
                // 23-21 树形控件
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
                // 23-30 表单数据校验

            }
        },
        mounted() {
            this.initFiles() // 5、获取所有员工（分页）
        },
        methods: {
            downloadFile(data) {
                this.downloadRequest('/downloadFiles/'+ data.fileId);
            },
            // 15、分页 每页显示多少条 默认会把 size 传进来
            sizeChange(size) {
                this.size = size
                this.initFiles()
            },
            // 13、分页-当前页-currentPage 点击的时候自己会带过来
            currentChange(currentPage) {
                this.currentPage = currentPage // 16
                this.initFiles() // 18、调用方法

            },
            // 4、获取所有文件（分页）
            initFiles() {
                this.loading = true // 8、添加 loading
                // 30-11 定义高级搜索 url
                let url = '/teamfiles?pageNo=' + this.currentPage + '&pageSize=' + this.size

                // 17、添加分页参数 ?currentPage='+this.currentPage+'&size='+this.size
                // 19、添加用户名搜索参数 +'&name='+this.empName,传参 根据条件搜索，不传参查询所有
                this.getRequest(url).then(resp => {
                    this.loading = false // 9、关闭 loading
                    if (resp) {
                        this.files = resp.list;
                        this.total = resp.total; // 12、分页
                    }
                });
            }
        }
    }
</script>

<style>
</style>