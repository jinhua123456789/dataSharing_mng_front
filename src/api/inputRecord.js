import request from '@/utils/request'

//对单条记录进行增、删、改、查

//查询
export function fetchList(query) {
  return request({
    url: 'bsd-import/singleImport/list',
    method: 'get',
    params: query
  })
}




//查询观测站
export function getStationId(query) {
  return request({
    url: 'bsd-import/single_import/getForeignIds?table_field_name_zh='+query,
    method: 'get'
  })
}


//根据recordId来查询表的字段信息
export function getTableFieldById(id) {
  return request({
    url: 'bsd-import/common/tableFied?recordId='+id,
    method: 'get',
  })
}

//新增
export function addRecord(data,create_author_id,record_id) {
  return request({
    url: 'bsd-import/single_import/single_check?create_author_id='+create_author_id+'&record_id='+record_id,
    method: 'post',
    data
  })
}
//编辑
export function updateRecord(data) {
  return request({
    url: 'bsd-import/user/edit',
    method: 'put',
    data
  })
}
//删除
export function delRecord(singleDataId,updateAuthorId) {
  return request({
    url: 'bsd-import/singleImport/delete?singleDataId='+singleDataId+'&updateAuthorId='+updateAuthorId,
    method: 'get',
  })
}


