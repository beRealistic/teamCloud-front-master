import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'

import {postRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import {initMenu} from "@/utils/menus";
import {downloadRequest} from "@/utils/download";
import moment from 'moment'
Vue.config.productionTip = false;
Vue.use(ElementUI,{size:'small'});
// 插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest = downloadRequest; // 以插件的形式使用下载相关请求

// 使用 router.beforeEach 注册一个全局前置守卫
router.beforeEach((to, from, next) => {
    // to 要去的路由; from 来自哪里的路由 ; next() 钩子放行
    // 用户登录成功时，把 token 存入 sessionStorage，如果携带 token，初始化菜单，放行
    if (window.localStorage.getItem('tokenStr')) {
        //initMenu(router, store);
        // 如果用户不存在
        if (!window.localStorage.getItem('user')) {
            // 判断用户信息是否存在
            return getRequest('/info').then(resp => {
                if (resp) {
                    // 存入用户信息，转字符串，存入 sessionStorage

                    window.localStorage.setItem('user', JSON.stringify(resp));
                    next();
                }
            })
        }
        next();
    } else {
        if (to.path === '/') {
            next()
        } else {
            next('/?redirect=' + to.path)

        }
    }
});

Vue.filter('dateFormat', function (dateStr,pattern = "YYYY-MM-DD HH:mm:ss") {
    return moment(dateStr).format(pattern);
})

Vue.filter('sizeFormat', function (size) {
    if (!size) return '';
    if (size < 1024) return size + ' B';
    size = size / 1024;
    if (size < 1024 ) return size.toFixed(2) + ' KB';
    size = size / 1024;
    if (size <  1024) return size.toFixed(2) + ' MB';
    size = size / 1024;
    if (size < 1024) return size.toFixed(2) + ' GB';
    return (size / 1024).toFixed(2) + ' TB'
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
