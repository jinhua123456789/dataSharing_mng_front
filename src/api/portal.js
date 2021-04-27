import request from '@/utils/request'


export function uploadFile(upload) {
  return request({
    url: "bsd-import/upload",
    method: "post",
    timeout: 5000,
    data: upload
  })
}

export function getImageURL(upload) {
  return request({
    url: "pcs-portal/portal-internal-management-image/getImageURL",
    method: "get",
    params: {upload}
  })
}
export function fetchUserDefinedBlockList() {
  return request({
    url: "pcs-portal/portal-internal-management-block/acquireConciseBlockListByBlockType",
    method: "get"
  })
}

export function fetchConciseBlockList() {
  return request({
    url: "pcs-portal/portal-internal-management-block/acquireConciseBlockList",
    method: "get",
  })
}

export function fetchMoreConditionConciseBlockList(blockName,
                                                   blockType,
                                                   page,
                                                   limit) {
  return request({
    url: "pcs-portal/portal-internal-management-block/moreConditionAcquireBlock",
    method: "get",
    params: {blockName, blockType, page, limit}
  })
}


export function fetchBlockListByBlockId(id) {
  return request({
    url: "pcs-portal/portal-internal-management-block/acquireWholeBlockByBlockId",
    method: "get",
    params: {id}
  })
}

export function addBlockList(blockName, blockDictId, blockDescription, image) {
  return request({
    url: "pcs-portal/portal-internal-management-block/addBlock",
    method: "post",
    data: {blockName, blockDictId, blockDescription, image}
  })
}

export function modifyBlockListByBlockId(id, blockName, blockDictId, blockDescription, image) {
  return request({
    url: "pcs-portal/portal-internal-management-block/modifyBlock",
    method: "post",
    data: {id, blockName,blockDictId, blockDescription, image}
  })
}

export function deleteBlockByBlockId(id) {
  return request({
    url: "pcs-portal/portal-internal-management-block/removeBlockByBlockId",
    method: "get",
    params: {id}
  })
}
export function removeBlockByBlockId(id) {
  return request({
    url: "pcs-portal/portal-internal-management-content/removeContent",
    method: "get",
    params: {id}
})
}


export function fetchMoreConditionConciseRegionList(regionNumber,
                                                    blockName,
                                                    page,
                                                    limit) {
  return request({
    url: "pcs-portal/portal-internal-management-region/moreConditionAcquireRegion",
    method: "get",
    params: {regionNumber, blockName, page, limit}
  })
}

export function fetchRegionListByRegionId(id) {
  return request({
    url: "pcs-portal/portal-internal-management-region/acquireWholeRegionById",
    method: "get",
    params: {id}
  })
}

export function addRegionList(regionNumber, blockId) {
  return request({
    url: "pcs-portal/portal-internal-management-region/addRegion",
    method: "get",
    params: {regionNumber, blockId}
  })
}

export function modifyRegionListByRegionId(id, regionNumber, blockId) {
  return request({
    url: "pcs-portal/portal-internal-management-region/modifyRegion",
    method: "get",
    params: {id, regionNumber, blockId}
  })
}

export function deleteRegionByRegionId(id) {
  return request({
    url: "pcs-portal/portal-internal-management-region/removeRegionById",
    method: "get",
    params: {id}
  })
}


export function fetchMoreConditionConciseContentList(contentTitle,
                                                     blockId,
                                                     contentStatus,
                                                     auditStatus,
                                                     page,
                                                     limit) {
  return request({
    url: "pcs-portal/portal-internal-management-content/moreConditionAcquireContent",
    method: "get",
    params: {contentTitle, blockId, contentStatus, auditStatus, page, limit}
  })
}

export function getBlockList(){
  return request({
    url: "pcs-portal/portal-external-management/getBlockNames",
    method: "get"
  })
}

export function fetchContentListByContentId(id) {
  return request({
    url: "pcs-portal/portal-internal-management-content/acquireWholeContentById",
    method: "get",
    params: {id}
  })
}

export function fetchContentPreviewByContentId(id) {
  return request({
    url: "pcs-portal/portal-internal-management-content/acquireContentPreviewById",
    method: "get",
    params: {id}
  })
}

export function addContentList(data) {
  return request({
    url: "pcs-portal/portal-internal-management-content/addContent",
    method: 'post',
    data
  })
}

export function modifyContentListByContentId(data) {
  return request({
    url: "pcs-portal/portal-internal-management-content/modifyContent",
    method: "post",
    data
  })
}

export function onOffLineContentByContentId(id) {
  return request({
    url: "pcs-portal/portal-internal-management-content/onOffLineContentById",
    method: "get",
    params: {id}
  })
}


export function fetchMoreConditionConciseAuditList(contentTitle,
                                                   blockId,
                                                   contentStatus,
                                                   auditStatus,
                                                   page,
                                                   limit) {
  return request({
    url: "pcs-portal/portal-internal-management-audit/moreConditionAcquireAudit",
    method: "get",
    params: {contentTitle, blockId, contentStatus, auditStatus, page, limit}
  })
}

export function modifyAuditListByAuditId(id, auditStatus, auditAdvise) {
  return request({
    url: "pcs-portal/portal-internal-management-audit/modifyAudit",
    method: 'get',
    params: {id, auditStatus, auditAdvise}
  })
}

export function fetchAuditPreviewByContentId(id) {
  return request({
    url: "pcs-portal/portal-internal-management-audit/acquireAuditPreviewById",
    method: "get",
    params: {id}
  })
}
