import store from '@/store'
import Layout from '@/layout'


/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}


/**
 *将后台的路由表进行格式化
 * @param {*} asyncRouterMap
 */
export function convertRouter(asyncRouterMap) {
  const accessedRouters = []
  if (asyncRouterMap) {
    asyncRouterMap.forEach(item => {
      var parent = generateRouter(item, true)
      console.log(parent);
      var children = []
      if (item.children) {
        item.children.forEach(child => {
          children.push(generateRouter(child, false))
        })
      }
      parent.children = children
      accessedRouters.push(parent)
    })
  }
  accessedRouters.push({path: '*', redirect: '/404', hidden: true})
  return accessedRouters
}

/*
 *对component的处理
 * https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html#%E9%85%8D%E7%BD%AE%E9%A1%B9
 */
function generateRouter(item, isParent) {
  var router = {
    path: item.path,
    component: isParent ? Layout : componentsMap[item.componentName],
    name: item.path,
    meta: item.meta,
  }
  return router
}

/*
 * componentsMap 需要在事先定义好
 */
export const componentsMap = {
  online: () => import('@/views/online/index'),
  horizontal: () => import('@/views/blank'),
  portrait: () => import('@/views/blank'),
  blank: () => import('@/views/blank'),
  scaleManagement: () => import('@/views/scale/complexTable'),
  scaleVerify: () => import('@/views/scale/verify'),
  scaleEdit: () => import('@/views/scale/edit'),
  institution: () => import('@/views/pcs-institution/institution'),
  sysUser: () => import('@/views/pcs-sysuser/sysuser'),
  role: () => import('@/views/pcs-role/role'),
  privilege: () => import('@/views/pcs-privilege/privilege'),
  log: () => import('@/views/log/log'),
  orgPrivilege: () => import('@/views/pcs-orgPrivilege/orgPrivilege'),
  portalSysBlockManagement: () => import('@/views/portal/block/blockManagement'),
  portalSysContentManagement: () => import('@/views/portal/content/contentManagement'),
  portalSysAuditManagement: () => import('@/views/portal/audit/auditManagement'),
  dictionary:()=>import('@/views/dictionary/dict'),

  depManage:() =>import('@/views/depManage/index'),
  fmCheckAndAccept:() =>import('@/views/checkAndAccept/fmCheckAndAccept'),
  projects:() =>import('@/views/project/basicInfo'),
  //projectMaterialsSubmit:() =>import('@/views/project/projectMaterialsSubmit'),
  jijinProjectMaterialsSubmit:() =>import('@/views/project/jijinProjectMaterialsSubmit'),
  assignmentBookManage:() =>import('@/views/project/assignmentBookManage'),
  supervisionBookManage:() =>import('@/views/project/supervisionBookManage'),
  supervisionPlanManage:() =>import('@/views/project/supervisionPlanManage'),
  designMaterialsManage : () =>import('@/views/project/designMaterialsManage'),
  currentProject:() => import('@/views/ledger/currentProject'),
  finishedProject:() => import('@/views/ledger/finishedProject'),
  importProject:() => import('@/views/ledger/importProject'),
  /*oreProject:() => import('@/views/ledger/oreProject'),*/
  investigatorIndex: () => import('@/views/projectExecution/investigatorIndex'),
  projectQuery: () => import('@/views/projectExecution/projectQuery'),
  supervisorIndex: () => import('@/views/projectExecution/supervisorIndex'),
  workRecord: () => import('@/views/projectExecution/workRecord'),
  budgetApply: () => import('@/views/projectExecution/budgetApply'),
  // budgetIssue: () => import('@/views/projectExecution/budgetIssue'),
  minorDrainageBasinManagementStationManagement: () => import('@/views/projectExecution/minorDrainageBasinManagementStationManagement'),
  pollution: () => import('@/views/projectExecution/pollution'),
  tblFieldSite: () => import('@/views/projectExecution/tblFieldSite'),
  soilTempreture: () => import('@/views/projectExecution/soilTempreture'),
  SamplingBottle: () => import('@/views/projectExecution/SamplingBottle'),
  SedimentBox: () => import('@/views/projectExecution/SedimentBox'),
  SandBox: () => import('@/views/projectExecution/SandBox'),
  contractManage : () =>import('@/views/project/contractManage'),
  allProject:() => import('@/views/ledger/allProject'),
  customProject:() => import('@/views/ledger/customProject'),
  exploreResultDispose:() => import('@/views/resultDispose/exploreResultDispose'),
  rainfall:() => import('@/views/analysis/rainfall/index'),
  watershed:() => import('@/views/analysis/watershed/index'),
  runoff:()=>import('@/views/analysis/runoff/index'),
  soil:()=>import('@/views/analysis/soil/index'),
  projectProgressTracking:() => import('@/views/analysis/projectProgressTracking'),
  projectMap:() => import('@/views/analysis/projectMap'),
  supervisorReportCheck: () => import('@/views/projectExecution/supervisorReportCheck'),
  fundsAllocate: () =>import('@/views/parameter-config/fundsAllocate'),
  statisticsReport: () =>import('@/views/report/statistics'),
  recordData: () =>import('@/views/report/record'),

 inputData:() =>import('@/views/inputAndCheck/inputData'),
 checkData:() =>import('@/views/inputAndCheck/checkData'),
 //autoCollectTrack:() =>import('@/views/inputAndCheck/autoCollectTrack'),
 regulations:() => import('@/views/inputAndCheck/regulations'),
  // smallwaterRain:() =>import('@/views/ledger/smallwaterRain')

  calculatePlan:() => import('@/views/dataCalculate/calculatePlan'),
  calculateParameter:() => import('@/views/dataCalculate/calculateParameter'),

  inputRecord:() => import('@/views/inputAndCheck/inputRecord'),
  checkRecord:() => import('@/views/inputAndCheck/checkRecord'),
  recordTemplate: () => import('@/views/inputAndCheck/recordTemplate'),
}
