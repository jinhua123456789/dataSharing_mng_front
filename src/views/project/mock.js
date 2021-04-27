import Mock from 'mockjs'
const explores = ['甘肃地矿局一勘院',
  '核工业二O三研究所',
  '甘肃核地质219大队',
  '甘肃核地质二一九大队',
  '甘肃省地矿局第三地勘院',
  '青海省地调院',
  '青海省柴达木综合地质矿产勘查院',
  '青海省核工业地质局',
  '青海省第一地质矿产勘查大队'
]
const supervisors = ['深圳市宝安区工程监理公司',
  '北京鑫驰源工程监理有限公司',
  '上海创众工程监理有限公司',
  '湖南兴湘建设监理咨询有限公司',
  '佳木斯市三江建设监理公司',
  '北京乾坤鑫峰工程监理有限公司',
  '北京敬业建设监理有限公司',
  '郑州经济技术开发区国有资产监督管理办公室']
const statusList2 = ['下载', '未上传']
function mockList(statusList, projectNames) {
  const List = []
  // 不可过大，因为1. 不显示分页 2. 会慢
  const count = 5

  for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
      // id: '@increment',
      'projectId|1': [2007611003,
        2007611008,
        2007621009,
        2007621008,
        2007621003,
        2011621037,
        2011621035,
        2007630001,
        2007631003,
        2007630002,
        2011621040,
        2011621036,
        2007631005,
        2007631004,
        2009631003,
        2009631002,
        2009630001,
        2011631042,
        2011631041
      ],
      // projectId: Mock.mock({
      //   'number|101000-109000': 1
      // }),
      // 项目任务书编号
      assignmentId: Mock.mock({
        'number|10100-10900': 1
      }),
      // 监理任务书编号
      supervisorAssignmentId: Mock.mock({
        'number|10100-10900': 1
      }),
      // 下达任务书时间
      assignmentTime: +Mock.Random.date('T'),
      // 下达监理任务书时间
      supervisorAssignmentTime: +Mock.Random.date('T'),
      // 最新审核时间
      lastCheckTime: +Mock.Random.date('T'),
      // 审核通过时间
      checkTime: +Mock.Random.date('T'),
      // 项目名称
      projectName: projectNames[i],
      // 勘察单位
      'explore|1': explores,
      // explore: Mock.Random.cword(3, 5),
      // 监理单位
      'supervisor|1': supervisors,
      // 联系人
      contact: Mock.Random.cname(),
      // 探矿权人
      exploreContact: Mock.Random.cname(),
      // 批复时间
      timestamp: +Mock.Random.date('T'),
      // 项目状态
      // '编辑', '提交'
      // 未审核，审核已通过，审核未通过
      // 'status|1': ['编辑', '提交', '未审核', '审核已通过', '审核未通过', '已确认', '待确认'],
      'status|1': statusList,
      //立项资料上传状态
      'status2|1': statusList2,
      remark: Mock.Random.cparagraph(1, 3)
    }))
  }
  return List
}

export { mockList, explores, supervisors }
