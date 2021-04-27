import request from '@/utils/request'

export function getDictlist() {
  return request({
    url: 'pcs-dict/dict/list',
    method: 'get',
    params: {}
  })
}

export function getDictDetailList(dictId) {
  return request({
    url: 'pcs-dict/dict/detailList',
    method: 'get',
    params: {dictId}
  })
}

export function addDict(data) {
  return request({
    url: 'pcs-dict/dict/addDict',
    method: 'post',
    data
  })
}

export function addDictDetail(data) {
  return request({
    url: 'pcs-dict/dict/addDictDetail',
    method: 'post',
    data
  })
}

export function editDict(data) {
  return request({
    url: 'pcs-dict/dict/alterDict',
    method: 'post',
    data
  })
}

export function editDictDetail(data) {
  return request({
    url: 'pcs-dict/dict/alterDictDetail',
    method: 'post',
    data
  })
}

export function deleteDict(dictId) {
  return request({
    url: 'pcs-dict/dict/deleteDict',
    method: 'delete',
    params: { dictId }
  })
}

export function deleteDictDetail(dictDetailId) {
  return request({
    url: 'pcs-dict/dict/deleteDictDetail',
    method: 'delete',
    params: { dictDetailId }
  })
}
