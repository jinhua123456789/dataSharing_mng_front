import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'pcs-evaluation/evaluationplan/list',
    method: 'get',
    params: query
  })
}

export function fetchplan(id) {
  return request({
    url: 'pcs-evaluation/evaluationplan/detail',
    method: 'get',
    params: { id }
  })
}

export function createPlan(data) {
  return request({
    url: 'pcs-evaluation/evaluationplan/addplan',
    method: 'post',
    data
  })
}

export function updatePlan(data) {
  return request({
    url: 'pcs-evaluation/evaluationplan/updateGroupPlan',
    method: 'post',
    data
  })
}

export function publishPlan(id) {
  return request({
    url: 'pcs-evaluation/evaluationplan/publish',
    method: 'get',
    params: { id }
  })
}

export function deletePlan(id) {
  return request({
    url: 'pcs-evaluation/evaluationplan/delete',
    method: 'delete',
    params: { id }
  })
}

export function getDeptTree() {
  return request({
    url: 'pcs-evaluation/evaluationplan/deptlist',
    method: 'get'
  })
}

export function getScaleTree(id) {
  return request({
    url: 'pcs-evaluation/evaluationplan/scalelist',
    method: 'get',
    params: { id }
  })
}

export function createPersonPlan(data) {
  return request({
    url: 'pcs-evaluation/evaluationplan/addPersonPlan',
    method: 'post',
    data
  })
}

export function getTestee(testeeQuery) {
  return request({
    url: 'pcs-evaluation/evaluationplan/testee',
    method: 'get',
    params: testeeQuery
  })
}
