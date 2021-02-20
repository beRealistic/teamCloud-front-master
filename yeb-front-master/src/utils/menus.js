import {getRequest} from "@/utils/api";

// 菜单请求工具类

// export const formatRoutes = (routes) => {
//     let fmtRoutes = []
//     routes.forEach(router => {
//         let {
//             path,
//             component,
//             name,
//             iconCls,
//             children
//         } = router;
//         // 如果有 children 并且类型是数组
//         if (children && children instanceof Array) {
//             // 递归
//             children = formatRoutes(children)
//         }
//         // 单独对某一个路由格式化 component
//         let fmRouter = {
//             path: path,
//             name: name,
//             iconCls: iconCls,
//             children: children,
//             component(resolve) {
//                 require(['../views/' + component + '.vue'], resolve);
//                 // // 判断组件以什么开头，到对应的目录去找
//                 // if (component.startsWith('Home')) {
//                 //     require(['@/views/' + component + '.vue'], resolve);
//                 // }else if (component.startsWith('Emp')) {
//                 //     require(['@/views/emp/' + component + '.vue'], resolve);
//                 // }else if (component.startsWith('Per')) {
//                 //     require(['@/views/per/' + component + '.vue'], resolve);
//                 // }else if (component.startsWith('Sal')) {
//                 //     require(['@/views/sal/' + component + '.vue'], resolve);
//                 // }else if (component.startsWith('Sta')) {
//                 //     require(['@/views/sta/' + component + '.vue'], resolve);
//                 // }else if (component.startsWith('Sys')) {
//                 //     require(['@/views/sys/' + component + '.vue'], resolve);
//                 // }
//             }
//         }
//         fmtRoutes.push(fmRouter)
//     })
//     return fmtRoutes
// }
