import request from '@/utils/request'

export function fetchList(listQuery) {
  return request({
    url: 'pcs-scale/scale/management',
    method: 'get',
    params: listQuery
  })
}

export function updateScaleState(scaleId, status) {
  return request({
    url: 'pcs-scale/scale/update-scale-status',
    method: 'post',
    data: {scaleId, status}
  })
}

export function fetchListByScaleId(scaleId) {
  return request({
    url: 'pcs-scale/scale/acquire-scale-info-by-scale-id',
    method: 'get',
    params: {scaleId}
  })
}

export function fetchSavedScaleByScaleId(scaleId) {
  return request({
    url: 'pcs-scale/scale/acquire-saved-scale-info-by-scale-id',
    method: 'get',
    params: {scaleId}
  })
}

export function submitScale(data) {
  return request({
    url: 'pcs-scale/scale/submit-new-scale',
    method: 'post',
    data:data
  })
}

export function saveScale(data) {
  return request({
    url: 'pcs-scale/scale/save-new-scale',
    method: 'post',
    data:data
  })
}

export function checkScale(scaleId, flag, text, status) {
  return request({
    url: 'pcs-scale/scale/check-scale',
    method: 'post',
    data:{scaleId, flag, text, status}
  })
}


























// export function fetchArticle(id) {
//   return request({
//     url: 'pcs-scale/article/detail',
//     method: 'get',
//     params: { id }
//   })
// }
//
// export function fetchPv(pv) {
//   return request({
//     url: 'pcs-scale/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }
//
// export function createArticle(data) {
//   return request({
//     url: 'pcs-scale/article/create',
//     method: 'post',
//     data
//   })
// }
//
// export function updateArticle(data) {
//   return request({
//     url: 'pcs-scale/article/update',
//     method: 'post',
//     data
//   })
// }
