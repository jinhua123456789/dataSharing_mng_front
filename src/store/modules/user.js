import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import store from "./app";

const state = {
  access_token: getToken(),
  token_type: '',
  refresh_token: '',
  expires_in: '',
  scope: '',
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_ACCESS_TOKEN: (state, access_token) => {
    state.access_token = access_token
  },

  SET_TOKEN_TYPE: (state, token_type) => {
    state.token_type = token_type
  },

  SET_REFRESH_TOKEN: (state, refresh_token) => {
    state.refresh_token = refresh_token
  },

  SET_EXPIRES_IN: (state, expires_in) => {
    state.expires_in = expires_in
  },

  SET_SCOPE: (state, scope) => {
    state.scope = scope
  },

  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },

  SET_NAME: (state, name) => {
    state.name = name
  },

  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },

  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {


      const param = new URLSearchParams();
      param.append('username', username);
      param.append('password', password);
      param.append('grant_type', 'password');
      param.append('scope', 'server');
      param.append('client_id', 'sys');
      param.append('client_secret', 'yang1290');

      login(param).then(response => {

        let  data  = response;
        console.log(data);
        commit('SET_ACCESS_TOKEN', data.access_token);
        commit('SET_TOKEN_TYPE', data.token_type);
        commit('SET_REFRESH_TOKEN', data.refresh_token);
        commit('SET_EXPIRES_IN', data.expires_in);
        commit('SET_SCOPE', data.scope);
        // commit('SET_NAME', username);
        setToken(data.access_token);
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  },

  // // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     // const { data } = response
  //     let data;
  //
  //     if (state.name === "arron") {
  //       data = {
  //         roles: ['admin'],
  //         introduction: '管理员',
  //         avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  //         name: 'admin'
  //       };
  //     }
  //
  //     if (state.name === "psy-expert") {
  //       data = {
  //         roles: ['expert'],
  //         introduction: '心理学专家',
  //         avatar: '',
  //         name: 'psy-expert'
  //       };
  //     }
  //
  //     if (state.name === "device-admin") {
  //       data = {
  //         roles: ['device'],
  //         introduction: '设备管理员',
  //         avatar: '',
  //         name: 'device-admin'
  //       };
  //     }
  //
  //
  //
  //     if (!data) {
  //       reject('Verification failed, please Login again.')
  //     }
  //
  //     const { roles, name, avatar, introduction } = data
  //
  //     // roles must be a non-empty array
  //     if (!roles || roles.length <= 0) {
  //       reject('getInfo: roles must be a non-null array!')
  //     }
  //     commit('SET_ROLES', roles)
  //     commit('SET_NAME', name)
  //     commit('SET_AVATAR', avatar)
  //     commit('SET_INTRODUCTION', introduction)
  //     resolve(data)
  //   })
  // },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, trueName } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', trueName)
        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },


  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_ACCESS_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
