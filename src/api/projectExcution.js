import request from "@/utils/request";

const pathToUploadImage = process.env.VUE_APP_BASE_API + "businessinformation/ImgUpload/upload"

export default pathToUploadImage

export function uploadImage(imgFile) {
  return request({
    url: `/businessinformation/ImgUpload/upload`,
    method: "post",
    imgFile
  });
}

export function fetchDict(dictName) {
  return request({
    url: '/pcs-dict/dict/getDetails?dictName=' + dictName,
    method: "get"
  });
}

//设备
export function getDevices() {
  return request({
    url: '/businessinformation/device/findAllForBusiness',
    method: "get"
  });
}
export function getAllDevices(pageIndex, pageSize) {
  return request({
    url: `/businessinformation/device/findAllPage?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addDevice(data) {
  return request({
    url: "/businessinformation/device/addDevice",
    method: "post",
    data
  });
}
export function modifyDevice(data) {
  return request({
    url: "/businessinformation/device/updateDevice",
    method: "post",
    data
  });
}
export function deleteDevice(id, status) {
  return request({
    url: `businessinformation/device/deleteDevice?id=${id}&status=${status}`,
    method: "delete"
  });
}
export function searchDevice(deviceCode, pageIndex, pageSize) {
  let url = `businessinformation/device/findBydeviceCode?pageIndex=${pageIndex}&pageSize=${pageSize}`
  if (deviceCode) {
    url += `&deviceCode=${deviceCode}`
    return request({
      url: url,
      method: "get"
    });
  } else {
    return getAllDevices(pageIndex, pageSize)
  }

  // return request({
  //   url: 'businessinformation/device/findBydeviceCode?deviceCode=' + deviceCode,
  //   method: "get"
  // });
}

export function searchDeviceByCodeAndType(deviceCode, deviceType) {
  if (!deviceType || deviceType == '') deviceType = 0
  let url = `businessinformation/device/findByCodeAndType?deviceType=${deviceType}`
  if (deviceCode) {
    url += `&deviceCode=${deviceCode}`
  }
  return request({
    url: url,
    method: "get"
  });
}

//风蚀场
export function getAllWindFieldSite(pageIndex, pageSize) {
  return request({
    url: `businessinformation/WindFieldSite/findAll?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addWindFieldSite(data) {
  return request({
    url: "businessinformation/WindFieldSite/addWindFieldSite",
    method: "post",
    data
  });
}
export function modifyWindFieldSite(data) {
  return request({
    url: "businessinformation/WindFieldSite/updateWindFieldSite",
    method: "post",
    data
  });
}
export function deleteWindFieldSite(id) {
  return request({
    // url: "businessinformation/WindFieldSite/deleteBatch?ids=" + id,
    url: "businessinformation/WindFieldSite/deleteById?Id=" + id,
    method: "delete"
  });
}
export function searchWindFieldSiteByName(name, pageIndex, pageSize) {
  return request({
    url: `businessinformation/WindFieldSite/findByName?name=${name}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}

//土壤水分温度
export function getAllSoilTemperaturePoin(pageIndex, pageSize) {
  return request({
    url: `businessinformation/SoilTemperaturePointController/findSoilTemperaturePoint?pageindex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addSoilTemperaturePoin(data) {
  return request({
    url: "businessinformation/SoilTemperaturePointController/addSoilTemperaturePoin",
    method: "post",
    data
  });
}
export function modifySoilTemperaturePoin(data) {
  return request({
    url: "businessinformation/SoilTemperaturePointController/updateSoilTemperaturePoin",
    method: "post",
    data
  });
}
export function deleteSoilTemperaturePoin(id) {
  return request({
    url: "businessinformation/SoilTemperaturePointController/deleteSoilTemperaturePoin?id=" + id,
    method: "delete"
  });
}
export function searchSoilTemperaturePoin(stationName, deviceCode, pageIndex, pageSize) {
  let url = `businessinformation/SoilTemperaturePointController/findByNameOrDeviceCode?pageIndex=${pageIndex}&pageSize=${pageSize}`
  if (stationName) {
    url += `&stationName=${stationName}`
  }
  if (deviceCode) {
    url += `&deviceCode=${deviceCode}`
  }
  return request({
    url: url,
    method: "get"
  });
}

//雨量站
export function getAllStation(pageIndex, pageSize) {
  return request({
    url: `businessinformation/stationController/findAll?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addStation(data) {
  return request({
    url: "businessinformation/stationController/addStation",
    method: "post",
    data
  });
}
export function modifyStation(data) {
  return request({
    url: "businessinformation/stationController/updateStation",
    method: "post",
    data
  });
}
export function deleteStation(id) {
  return request({
    url: "businessinformation/stationController/deleteStation?id=" + id,
    method: "delete"
  });
}
export function searchStation(stationName, deviceCode, sortValue, pageIndex, pageSize) {
  let url = `businessinformation/stationController/findByStationNameOrDeviceCode?pageIndex=${pageIndex}&pageSize=${pageSize}`
  if (stationName) {
    url += `&stationName=${stationName}`
  }
  if (deviceCode) {
    url += `&deviceCode=${deviceCode}`
  }
  if (sortValue) {
    url += `&sortCondition=${sortValue}`
  }
  return request({
    url: url,
    method: "get"
  });
}

//工作记录
export function getAllWorkRecord(pageIndex, pageSize) {
  return request({
    url: `businessinformation/workRecord/findWorkRecords?pageindex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addWorkRecord(data) {
  return request({
    url: "businessinformation/workRecord/addWorkRecord",
    method: "post",
    data
  });
}
export function modifyWorkRecord(data) {
  return request({
    url: "businessinformation/workRecord/updateWorkRecord",
    method: "post",
    data
  });
}
export function deleteWorkRecord(id) {
  return request({
    url: "businessinformation/workRecord/deleteWorkRecord?Id=" + id,
    method: "delete"
  });
}
export function searchWorkRecord(userName, pageIndex, pageSize) {
  return request({
    url: `businessinformation/workRecord/findWorkRecordByUserName?userName=${userName}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}

//小流域
export function setBasinRepresentStation(basin_id, station_id) {
  return request({
    url: `businessinformation/minorDrainageBasinController/selectRepresentStation?minorDrainangeBasinid=${basin_id}&stationId=${station_id}`,
    method: "post"
  });
}
export function getBasinById(id) {
  return request({
    url: `businessinformation/minorDrainageBasinController/findDetailsById?id=${id}`,
    method: "get"
  });
}
export function getAlBasins() {
  return request({
    url: `businessinformation/minorDrainageBasinController/findAllBasins`,
    method: "get"
  });
}
export function getAllMinorDrainageBasin(pageIndex, pageSize) {
  return request({
    url: `businessinformation/minorDrainageBasinController/findAll?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addMinorDrainageBasin(data) {
  return request({
    url: "businessinformation/minorDrainageBasinController/addMinorDrainageBasin",
    method: "post",
    data
  });
}
export function modifyMinorDrainageBasin(data) {
  return request({
    url: "businessinformation/minorDrainageBasinController/updateMinorDrainageBasin",
    method: "post",
    data
  });
}
export function deleteMinorDrainageBasin(id) {
  return request({
    url: "businessinformation/minorDrainageBasinController/deleteMinorDrainageBasin?id=" + id,
    method: "delete"
  });
}
export function searchMinorDrainageBasin(code, location, pageIndex, pageSize) {
  let url = `businessinformation/minorDrainageBasinController/findByCodeOrLocation?pageIndex=${pageIndex}&pageSize=${pageSize}`
  if (location) {
    url += `&location=${location}`
  }
  if (code) {
    url += `&code=${code}`
  }
  return request({
    url: url,
    method: "get"
  });
}
export function locateMinorDrainageBasin(id, pagesize) {
  return request({
    url: `businessinformation/minorDrainageBasinController/locate?id=${id}&pagesize=${pagesize}`,
    method: "get"
  });
}

//小流域控制站
export function deleteFlowCalculateCoefficient(id) {
  return request({
    url: `businessinformation/flowCalculateCoefficient/deleteById?id=${id}`,
    method: "delete"
  })
}
export function addFlowCalculateCoefficient(data) {
  return request({
    url: `businessinformation/flowCalculateCoefficient/addFlowCalculateCoefficient`,
    method: "post",
    data
  })
}
export function findByManagementStationId(managementStationId, pageIndex, pageSize, condition) {
  return request({
    url: `businessinformation/flowCalculateCoefficient/findByManagementStationId`,
    method: "get",
    params: {managementStationId, pageIndex, pageSize, condition}
  })
}
export function getWeirType() {
  return request({
    url: `businessinformation/WeirType/findColums`,
    method: "get"
  })
}
export function getAllMinorDrainageBasinController(pageIndex, pageSize) {
  return request({
    url: `businessinformation/MinorDrainageBasinManagementStationController/findAll?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addMinorDrainageBasinController(data) {
  return request({
    url: "businessinformation/MinorDrainageBasinManagementStationController/add",
    method: "post",
    data
  });
}
export function modifyMinorDrainageBasinController(data) {
  return request({
    url: "businessinformation/MinorDrainageBasinManagementStationController/update",
    method: "post",
    data
  });
}
export function deleteMinorDrainageBasinController(id) {
  return request({
    url: "businessinformation/MinorDrainageBasinManagementStationController/deleteById?id=" + id,
    method: "delete"
  });
}
export function searchMinorDrainageBasinController(code, name, location, yearOfBuild, pageIndex, pageSize) {
  let url = `businessinformation/MinorDrainageBasinManagementStationController/findByCodeOrNameOrLocationOrYearOfBuild?pageIndex=${pageIndex}&pageSize=${pageSize}`
  if (code) {
    url += `&code=${code}`
  }
  if (name) {
    url += `&name=${name}`
  }
  if (location) {
    url += `&location=${location}`
  }
  if (yearOfBuild) {
    url += `&yearOfBuild=${yearOfBuild}`
  }
  return request({
    url: url,
    method: "get"
  });
}

//径流小区
export function setJingLiuRepresentStation(jingliu_id, station_id) {
  return request({
    url: `businessinformation/JingLiuController/selectRepresentStation?jingliuId=${jingliu_id}&stationId=${station_id}`,
    method: "post"
  });
}
export function getAllJingLiu() {
  return request({
    url: 'businessinformation/JingLiuController/findAllJinglius',
    method: "get"
  });
}
export function getAllJingLiuController(pageIndex, pageSize) {
  return request({
    url: `businessinformation/JingLiuController/findAll?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function getJingLiuById(id) {
  return request({
    url: `businessinformation/JingLiuController/findDetailsById?id=${id}`,
    method: "get"
  });
}
export function addJingLiuController(data) {
  return request({
    url: "businessinformation/JingLiuController/add",
    method: "post",
    data
  });
}
export function modifyJingLiuController(data) {
  return request({
    url: "businessinformation/JingLiuController/update",
    method: "post",
    data
  });
}
export function deleteJingLiuController(id) {
  return request({
    url: "businessinformation/JingLiuController/deleteById?id=" + id,
    method: "delete"
  });
}
export function searchJingLiuController(code, measureEquipment, pageIndex, pageSize) {
  let url = `businessinformation/JingLiuController/findByCodeOrMeasure_equipment?pageIndex=${pageIndex}&pageSize=${pageSize}`
  if (code) {
    url += `&code=${code}`
  }
  if (measureEquipment) {
    url += `&measureEquipment=${measureEquipment}`
  }
  return request({
    url: url,
    method: "get"
  });
}
export function locateJingLiu(id, pagesize) {
  return request({
    url: `businessinformation/JingLiuController/locate?id=${id}&pagesize=${pagesize}`,
    method: "get"
  });
}

//采样瓶
export function getAllSamplingBottle(pageIndex, pageSize) {
  return request({
    url: `businessinformation/Bottle/findAll?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addSamplingBottle(data) {
  return request({
    url: "businessinformation/Bottle/addBottle",
    method: "post",
    data
  });
}
export function modifySamplingBottle(data) {
  return request({
    url: "businessinformation/Bottle/updateBottle",
    method: "post",
    data
  });
}
export function deleteSamplingBottle(id) {
  return request({
    url: "businessinformation/Bottle/deleteBottle?id=" + id,
    method: "delete"
  });
}
export function searchSamplingBottle(code) {
  return request({
    url: `businessinformation/Bottle/findByCode?code=${code}`,
    method: "get"
  });
}

//泥沙盒
export function getAllSedimentBox(pageIndex, pageSize) {
  return request({
    url: `businessinformation/sedimentBox/findAll?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addSedimentBox(data) {
  return request({
    url: "businessinformation/sedimentBox/addSedimentBox",
    method: "post",
    data
  });
}
export function modifySedimentBox(data) {
  return request({
    url: "businessinformation/sedimentBox/updateSedimentBox",
    method: "post",
    data
  });
}
export function deleteSedimentBox(id) {
  return request({
    url: "businessinformation/sedimentBox/deleteSedimentBox?id=" + id,
    method: "delete"
  });
}
export function searchSedimentBox(code) {
  return request({
    url: `businessinformation/sedimentBox/findByCode?code=${code}`,
    method: "get"
  });
}
//集沙盒
export function getAllSandBox(pageIndex, pageSize) {
  return request({
    url: `businessinformation/jishaBox/findAll?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function modifySandBox(data) {
  return request({
    url: "businessinformation/jishaBox/updateSedimentBox",
    method: "post",
    data
  });
}
export function searchSandBox(code, pageIndex, pageSize) {
  return request({
    url: `businessinformation/jishaBox/findByCode?code=${code}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addSandBox(data) {
  return request({
    url: "businessinformation/jishaBox/addJishaBox",
    method: "post",
    data
  });
}
export function deleteSandBox(id) {
  return request({
    url: "businessinformation/jishaBox/deleteJishaBox?id=" + id,
    method: "delete"
  });
}
//面源污染
export function getAllPollution(pageIndex, pageSize) {
  return request({
    url: `businessinformation/measurePoint/findAll?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addPollution(data) {
  return request({
    url: "businessinformation/measurePoint/addMeasurePoint",
    method: "post",
    data
  });
}
export function modifyPollution(data) {
  return request({
    url: "businessinformation/measurePoint/updateMeasurePoint",
    method: "post",
    data
  });
}
export function deletePollution(id) {
  return request({
    url: "businessinformation/measurePoint/deleteSoilTemperaturePoin?id=" + id,
    method: "delete"
  });
}
export function searchPollution(JingliuCode, MinordrainagebasinCode, pageIndex, pageSize) {
  let url = `businessinformation/measurePoint/findByJLCodeOrMBCode?pageIndex=${pageIndex}&pageSize=${pageSize}`
  if (JingliuCode) {
    url += `&JingliuCode=${JingliuCode}`
  }
  if (MinordrainagebasinCode) {
    url += `&MinordrainagebasinCode=${MinordrainagebasinCode}`
  }
  return request({
    url: url,
    method: "get"
  });
}


//植被盖度采集点
export function getAllTblFieldSite(pageindex, pageSize) {
  return request({
    url: `businessinformation/TblFieldSite/findTblFieldSites?pageindex=${pageindex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addTblFieldSite(data) {
  return request({
    url: "businessinformation/TblFieldSite/addTblFieldSite",
    method: "post",
    data
  });
}
export function modifyTblFieldSite(data) {
  return request({
    url: "businessinformation/TblFieldSite/updateTblFieldSite",
    method: "post",
    data
  });
}
export function deleteTblFieldSite(id) {
  return request({
    url: "businessinformation/TblFieldSite/deleteTblFieldSite?id=" + id,
    method: "delete"
  });
}
export function searchTblFieldSite(siteName, deviceCode, pageIndex, pageSize) {
  let url = `businessinformation/TblFieldSite/findByNameOrDeviceCode?pageIndex=${pageIndex}&pageSize=${pageSize}`
  if (siteName) {
    url += `&siteName=${siteName}`
  }
  if (deviceCode) {
    url += `&deviceCode=${deviceCode}`
  }
  return request({
    url: url,
    method: "get"
  });
}

//维护记录
export function getAllRecord(deviceId, pageIndex, pageSize) {
  return request({
    url: `businessinformation/deviceMaintainRecord/findByDeviceId?deviceId=${deviceId}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: "get"
  });
}
export function addRecord(data) {
  return request({
    url: "businessinformation/deviceMaintainRecord/addDeviceMaintainRecord",
    method: "post",
    data
  });
}
export function modifyRecord(data) {
  return request({
    url: "businessinformation/deviceMaintainRecord/updateDeviceMaintainRecord",
    method: "post",
    data
  });
}
export function deleteRecord(id, deviceId) {
  return request({
    url: `businessinformation/deviceMaintainRecord/deleteDeviceMaintainRecord?id=${id}&deviceId=${deviceId}`,
    method: "delete"
  });
}
