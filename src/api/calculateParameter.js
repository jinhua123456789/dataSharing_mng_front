/** 2020/6/1
*作者:Jeannie(ljn)
*功能:
*/
//根据查询条件查询所有计算系数列表
import request from '@/utils/request'
export function getCalculateParamsList(data) {
  return request({
    url: 'bsd-calculate/getCalculateParamsList',
    method: 'post',
    data
  })
}
//修改小流域计算参数
export function updateRunoffCalculateParams(data) {
  return request({
    url: 'bsd-calculate/updateRunoffCalculateParams',
    method: 'post',
    data
  })
}
