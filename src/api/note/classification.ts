import request from '@/utils/request'

/**
 * 创建请求分类树的方法
 * @returns 请求分类树的promise对象
 */
export function noteClassificationTreeSelect() {
    return request({
        url: '/note/classification/tree',
        method: 'get'
    })
}

/**
 * 分页请求分类的方法
 * @returns 分页请求分类的promise对象
 */
export function listClassification(params:ClassificationParamsInter) {
    return request({
        url: '/note/classification/page',
        method: 'get',
        params: params
    })
}

/**
 * 分页请求分类的方法
 * @returns 分页请求分类的promise对象
 */
export function viewInfo() {
    return request({
        url: '/note/ext/info',
        method: 'get'
    })
}

/**
 * 分页请求分类的方法
 * @returns 分页请求分类的promise对象
 */
export function addClassification(data:ClassificationDataInter) {
    return request({
        url: '/note/classification',
        method: 'post',
        data: data
    })
}

/**
 * 根据id获取分类的方法
 * @returns 分页请求分类的promise对象
 */
export function getClassification(classificationId:number) {
    return request({
        url: `/note/classification/getInfo/${classificationId}`,
        method: 'get'
    })
}

/**
 * 修改分类的方法
 * @returns 修改分类返回的promise对象
 */
export function updateClassification(data:ClassificationDataInter) {
    return request({
        url: '/note/classification',
        method: 'put',
        data: data
    })
}

/**
 * 删除分类的方法
 * @returns 删除分类返回的promise对象
 */
export function delClassification(classificationId:number) {
    return request({
        url: `/note/classification/${classificationId}`,
        method: 'delete'
    })
}

/**
 * 分页请求分类的方法
 * @returns 分页请求分类的promise对象
 */
export function exportClassification(params:ClassificationParamsInter) {
    return request({
        url: '/note/classification/exprot',
        method: 'get',
        params: params
    })
}

export interface ClassificationParamsInter {
    pageNo: number,
    pageSize: number,
    classificationName: string,
    pid?: number 
}

export interface ClassificationDataInter {
    classificationId: number|undefined,
    classificationName: string|undefined,
    pid: number|undefined,
    level: number,
    description: string|undefined
}