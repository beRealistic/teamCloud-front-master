import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Home from "@/views/Home";
import Upload from "@/views/Upload";
import ManageFiles from "@/views/ManageFiles";
import TeamFiles from "@/views/TeamFiles";
import TeamManage from "@/views/TeamManage";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden: true // 不会被循环遍历出来
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,

        children: [
            {
                path: '/upload',
                name: '上传文件',
                component: Upload
            },
            {
                path: '/myfiles',
                name: '我的文件',
                component: ManageFiles
            },
            {
                path: '/teamfiles',
                name: '团队文件',
                component: TeamFiles
            },
            {
                path: '/teamManage',
                name: '管理团队',
                component: TeamManage
            }
        ]
    }
]

const router = new VueRouter({
   // mode: 'history',
    routes
})

export default router
