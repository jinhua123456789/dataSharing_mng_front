import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'pcs-auth/oauth/token',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'pcs-auth/user/info',
    method: 'get',
  })
}

export function getPermission() {
  return request({
    url: 'pcs-auth/user/permission',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: 'pcs-auth/oauth/access-token',
    method: 'delete'
  })
}
