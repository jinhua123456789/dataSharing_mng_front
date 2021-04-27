import Mock from 'mockjs'
const scheduleTargets = ['无',
  '80%',
  '无',
  '无'
]
const paymentDemands = ['完成设计批复即可拨付',
  '工程进度完成80%即可拨付',
  '项目通过验收即可拨付',
  '资料汇交完成后即可拨付'
]
function mockList(stageNames, paymentRatios) {
  const List = []
  // 不可过大，因为1. 不显示分页 2. 会慢
  const count = 4

  for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
      // // 项目任务书编号
      // assignmentId: Mock.mock({
      //   'number|10100-10900': 1
      // }),
      // // 监理任务书编号
      // supervisorAssignmentId: Mock.mock({
      //   'number|10100-10900': 1
      // }),
      // // 下达任务书时间
      // assignmentTime: +Mock.Random.date('T'),
      // // 下达监理任务书时间
      // supervisorAssignmentTime: +Mock.Random.date('T'),
      // // 最新审核时间
      // lastCheckTime: +Mock.Random.date('T'),
      // // 审核通过时间
      // checkTime: +Mock.Random.date('T'),

      // 项目名称
      stageName: stageNames[i],
      // 付款比例
      paymentRatio: paymentRatios[i],
      // 进度要求
      scheduleTarget: scheduleTargets[i],
      // 付款要求说明
      paymentDemand: paymentDemands[i]
      // // 勘察单位
      // 'explore|1': explores,
      // // explore: Mock.Random.cword(3, 5),
      // // 监理单位
      // 'supervisor|1': supervisors,
      // // 联系人
      // contact: Mock.Random.cname(),
      // // 探矿权人
      // exploreContact: Mock.Random.cname(),
      // // 批复时间
      // timestamp: +Mock.Random.date('T'),
      // remark: Mock.Random.cparagraph(1, 3)
    }))
  }
  return List
}

export { mockList, scheduleTargets, paymentDemands}
