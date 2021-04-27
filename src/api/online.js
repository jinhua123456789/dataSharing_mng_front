import request from "@/utils/request";

export function fetchPanelData() {
  return request({
    url: "/pcs-statistic/online/panel",
    method: "get"
  });
}

export function fetchLineData() {
  return request({
    url: "/pcs-statistic/online/line",
    method: "get"
  });
}

export function fetchScaleRankingData() {
  return request({
    url: "/pcs-statistic/online/scale-ranking",
    method: "get"
  });
}

export function fetchFactorRankingData() {
  return request({
    url: "/pcs-statistic/online/factor-ranking",
    method: "get"
  });
}

export function fetchOtherBarData() {
  return request({
    url: "/pcs-statistic/online/other-bar",
    method: "get"
  });
}
export function fetchClassData() {
  return request({
    url: "/pcs-statistic/online/class",
    method: "get"
  });
}

export function fetchAgeData() {
  return request({
    url: "/pcs-statistic/online/age",
    method: "get"
  });
}
export function fetchPieData() {
  return request({
    url: "/pcs-statistic/online/pie",
    method: "get"
  });
}

export function fetchScatterData() {
  return request({
    url: "/pcs-statistic/online/scatter",
    method: "get"
  });
}


//
// export function getInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
//
// export function logout() {
//   return request({
//     url: '/user/logout',
//     method: 'post'
//   })
// }
//
