/** 2020/5/31
*作者:Jeannie(ljn)
*功能:
*/
import axios from 'axios'
import request from '@/utils/request'
//根据查询条件查询所有计算任务列表
export function getCalculatePlanList(data) {
  return request({
    url: 'bsd-calculate/getCalculatePlanList',
    method: 'post',
    data
  })
}
//重启计算
export function restartCalculatePlan(id) {
  return request({
    url: 'bsd-calculate/restartCalculatePlan',
    method: 'post',
    params: { id }
  })
}
//
export function passCalculate(id) {
  return request({
    url: 'bsd-calculate/passCalculate',
    method: 'get',
    params: { id }
  })

}

