import tab from './tab'
import auth from './auth'
import cache from './cache'
import modal from './modal'
import download from './download'
import {App} from "vue";
import type { Plugin } from "vue";


const plugins:Plugin = {
  install:(app: App, options: any) => {
    // 页签操作
    app.config.globalProperties.$tab = tab
    // 认证对象
    app.config.globalProperties.$auth = auth
    // 缓存对象
    app.config.globalProperties.$cache = cache
    // 模态框对象
    // app.config.globalProperties.$modal = modal
    // 下载文件
    app.config.globalProperties.$download = download
    app.provide('$modal', modal)
    app.provide('$options', options)
  }
}
export default plugins

/*export default function installPlugins(app){
  // 页签操作
  app.config.globalProperties.$tab = tab
  // 认证对象
  app.config.globalProperties.$auth = auth
  // 缓存对象
  app.config.globalProperties.$cache = cache
  // 模态框对象
  app.config.globalProperties.$modal = modal
  // 下载文件
  app.config.globalProperties.$download = download
}*/
