<template>
  <div style="height: 100vh;background: linear-gradient(to bottom, #222222, #304156, #222222);">
    <div class="left">
      <h4
        style="color: white;text-align: center;font-family: cursive;font-size: x-large;font-weight: bold;line-height: 0px;">
        {{ title }}</h4>
      <div id="c4" class="horn" style="width: 66%;padding: 10px;height: calc(100% - 42px);">
        <h5 class="title1">径流深和含沙量变化</h5>
        <div class="lt"></div>
        <div class="rt"></div>
        <div class="rb"></div>
        <div class="lb"></div>
      </div>
      <div style="float: left;height: 100px;margin: 5px 40px;">
        <h5 style="color: white;">近一个月径流数据：</h5>
        <h2 style="color: yellow;">{{ leftData }}</h2>
      </div>
      <div style="float: left;height: 100px;margin: 5px 40px;">
        <h5 style="color: white;">近一个月雨量数据：</h5>
        <h2 style="color: yellow;">{{ rightData }}</h2>
      </div>
    </div>
    <div v-once id="cesiumContainer">
      <div id="toolbar" class="infoview"><h4 class="title">站点</h4>
        <table class="mark-table">
          <tr>
            <td>雨量站</td>
            <td><i class="iconfont" style='color:#7FFFD4;font-size: 20px'>&#xe615;</i></td>
          </tr>
          <tr>
            <td>小流域控制站</td>
            <td><i class="iconfont" style='color:#00CED1;font-size: 20px'>&#xe615;</i></td>
          </tr>
          <tr>
            <td>采集设备</td>
            <td><i class="iconfont" style='color:#FFA500;font-size: 20px'>&#xe65d;</i></td>
          </tr>
          <tr>
            <td>径流小区</td>
            <td><i class="iconfont" style='color:#f4ea2a;font-size: 20px'>&#xe632;</i></td>
          </tr>
          <tr>
            <td>风蚀场</td>
            <td><i class="iconfont" style='color:#9ACD32;font-size: 20px'>&#xe615;</i></td>
          </tr>
          <tr>
            <td>土壤水分温度采集点</td>
            <td><i class="iconfont" style='color:#32CD32;font-size: 20px'>&#xe520;</i></td>
          </tr>
          <tr>
            <td>面源污染观测点</td>
            <td><i class="iconfont" style='color:#f4ea2a;font-size: 20px'>&#xe520;</i></td>
          </tr>
        </table>
      </div>
    </div>
    <div class="right">
      <div id="c1" class="horn">
        <h5 class="title1">径流量排名</h5>
        <div class="lt"></div>
        <div class="rt"></div>
        <div class="rb"></div>
        <div class="lb"></div>
      </div>
      <div id="c2" class="horn">
        <h5 class="title1">累计降雨量</h5>
        <div class="lt"></div>
        <div class="rt"></div>
        <div class="rb"></div>
        <div class="lb"></div>
      </div>
      <div id="c3" class="horn">
        <h5 class="title1">降雨量排名</h5>
        <div class="lt"></div>
        <div class="rt"></div>
        <div class="rb"></div>
        <div class="lb"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {Chart} from '@antv/g2';
import {getAccrRainFall, getRainFallDayly} from '@/api/rainFall'
import {getRunoffAndSand, getAccrRunoff, getRunOffDayly} from '@/api/runoff';
import {getAllMapPoint} from '@/api/mapPoint'

export default {
  name: "spectaculars",
  data() {
    return {
      title: '九三站数据统计图',
      leftData: 0,
      rightData: 0,
      basicColumnChartProp: {
        data: [],
        container: 'c2'
      },
      basicBarChartProp: {
        container: 'c1',
        data: []
      },
      basicPieChartProp: {
        data: [],
        container: 'c3',
      },
      basicLineChartProp: {
        data: [],
        container: 'c4',
      },
      basicBoxChartProp: {
        data: [],
        container: 'm1',
      },
      rainQueryAccr: {
        kind: "rainfall",
        date: [],
        startDate: null,
        endDate: null
      },
      runoffQueryAccr: {
        kind: "runoff",
        date: [],
        startDate: null,
        endDate: null
      },
      runoffSandQuery: {
        kind: "runoff",
        stationId: "一零一101001234"
      },
      rainQuery: {
        kind: "rainfall",
        stationId: "202005281"
      },
      introduction:
        {
          title: '九三水土保持试验站',
          contents: '九三水土保持试验站位于黑龙江省农垦总局九三分局鹤山农场境内鹤北小流域，' +
            '南距齐齐哈尔市约230 km，北距黑龙江省黑河市嫩江县城约30 km。' +
            '地理位置为纬度48°59′N~49°03′N，经度125°16′E~125°21′E' +
            '是目前我国纬度最北的水土保持试验站。所属一级河流为黑龙江，二级支流为嫩江，三级支流为讷河，四级支流为老莱河。'
        },
      point1: {lng: "125.21102", lat: "48.968419", name: "九三水土保持试验站"},
      MapPoints: [{longitude: "125.182809", latitude: "49.003938"}, {
        longitude: "125.163003",
        latitude: "49.010214"
      }, {longitude: "125.134397", latitude: "49.012346", name: "采集设备点"}],
      pageIndex: 1,
      pageSize: 2,
      MapPointsAll: [],
      deviceCont: [],//采集设备管理
      jingLiu: [],//径流小区
      measurePoints: [],//面源污染
      drainageBasin: [],//小流域
      drainageBasinMS: [],//小流域控制站
      soilTemperaturePoint: [],//土壤水分温度采集点
      rainfallStation: [], //雨量站
      windFieldSite: [],//风蚀场
    }
  },
  methods: {
    getNumData: function () {
      this.leftData = 1;
      getRunOffDayly(this.runoffSandQuery).then(response => {
        for (let key in response.data.runoffs) {
          this.leftData += response.data.runoffs[key];
        }
      })

      getRainFallDayly(this.rainQuery).then(response => {
        for (let key in response.data.rainfalls) {
          this.rightData += response.data.rainfalls[key];
        }
      })
    },
    basicColumnChart: function () {
    },
    basicBarChart: function () {
      const chart = new Chart({
        container: this.basicBarChartProp.container,
        autoFit: true
      });
      getAccrRunoff(this.runoffQueryAccr).then(response => {
        for (let j = response.data.sorted.length - 1; j >= 0; j--) {
          this.basicBarChartProp.data.push({
            "area": response.data.sorted[j].name,
            "value": response.data.sorted[j].precipitation
          })
        }
        chart.data(this.basicBarChartProp.data);
        chart.axis('area', {
          label: {
            offset: 12
          }
        });
        chart.coordinate().transpose();
        chart.interval().position('area*value').label('value')
        chart.legend({
          position: 'right',
        });
        chart.render();
      })
    },
    basicPieChart: function () {
      const chart = new Chart({
        container: this.basicPieChartProp.container,
        autoFit: true
      });
      // Step 1: 创建 Chart 对象
      const chart1 = new Chart({
        container: this.basicColumnChartProp.container, // 指定图表容器 ID
        autoFit: true
      });
      getAccrRainFall(this.rainQueryAccr).then(response => {
        for (let j = response.data.sorted.length - 1; j >= 0; j--) {
          this.basicPieChartProp.data.push({
            "type": response.data.sorted[j].name,
            "value": response.data.sorted[j].precipitation
          })
        }
        chart.data(this.basicPieChartProp.data);
        chart.coordinate('theta', {
          radius: 0.75,
          innerRadius: 0.4
        });
        chart.tooltip({
          showMarkers: false
        });
        const interval = chart.legend({
          position: 'right',
        })
          .interval()
          .adjust('stack')
          .position('value')
          .label('value')
          .color('type', ['#063d8a', '#1770d6', '#47abfc', '#38c060'])
          .style({opacity: 0.4})
          .state({
            active: {
              style: (element) => {
                const shape = element.shape;
                return {
                  matrix: Util.zoom(shape, 1.1),
                }
              }
            }
          })
        chart.interaction('legend-active');

        chart.render();

        // Step 2: 载入数据源
        chart1.data(this.basicPieChartProp.data);
        // Step 3：创建图形语法，绘制柱状图，由 type 和 value 两个属性决定图形位置，type 映射至 x 轴，value 映射至 y 轴
        chart1.interval().position('type*value').color('value').label('value', {offset: -10});
        // Step 4: 渲染图表
        chart1.render();
      })
    },
    basicLineChart: function () {
      // const SECOND = 1000;
      // const MINUTE = 1000 * 60;
      // const HOUR = 60 * MINUTE;
      // const DAY = 24 * HOUR;
      //
      // function toInteger(number, fix = 1) {
      //   if (Math.round(number) === number) {
      //     return number;
      //   }
      //   return Number(number).toFixed(fix);
      // }
      //
      // function humanizeDuration(duration, fix = 1) {
      //   if (duration === 0) {
      //     return '0';
      //   }
      //   if (duration < MINUTE) {
      //     return toInteger(duration / SECOND, fix) + ' 秒';
      //   }
      //   if (duration < HOUR) {
      //     return toInteger(duration / MINUTE, fix) + ' 分';
      //   }
      //   if (duration < DAY) {
      //     return toInteger(duration / HOUR, fix) + '小时';
      //   }
      //   return toInteger(duration / HOUR / 24, fix) + ' 天';
      // }

      const chart = new Chart({
        container: this.basicLineChartProp.container,
        width: this.basicLineChartProp.width,
        height: this.basicLineChartProp.height,
        autoFit: true
      });
      getRunoffAndSand(this.runoffSandQuery).then(response => {
        for (var key in response.data.depth) {
          this.basicLineChartProp.data.push({
            '月份': key,
            '径流深': response.data.depth[key],
            '含沙量': response.data.sediment[key]
          })
        }

        chart.data(this.basicLineChartProp.data);
        chart.axis('径流深', {
          grid: null,
          title: {},
        });
        chart.axis('含沙量', {
          title: {},
        });

        chart.tooltip({
          showCrosshairs: true,
          shared: true,
        });

        chart
          .line()
          .position('月份*径流深')
          .color('#4FAAEB')
          .label('径流深');
        chart
          .line()
          .position('月份*含沙量')
          .color('#9AD681')
          .shape('smooth')
          .label('含沙量');
        chart.render();
      })
      // chart.scale({
      //   date: {
      //     alias: '日期',
      //     type: 'time',
      //   },
      //   pv: {
      //     alias: '径流量',
      //     min: 0,
      //     sync: true, // 将 pv 字段数值同 time 字段数值进行同步
      //     nice: true,
      //   },
      //   time: {
      //     alias: '平均时长',
      //     formatter: (value) => {
      //       return humanizeDuration(value, 0);
      //     },
      //     sync: true,  // 将 pv 字段数值同 time 字段数值进行同步
      //     nice: true,
      //   },
      //   count: {
      //     alias: '次数',
      //   },
      // });

    },
    // basicBoxChart: function () {
    //   const dv = new DataView().source(this.basicBoxChartProp.data);
    //   dv.transform({
    //     type: 'map',
    //     callback: obj => {
    //       obj.range = [obj.low, obj.q1, obj.median, obj.q3, obj.high];
    //       return obj;
    //     }
    //   });
    //   const chart = new Chart({
    //     container: this.basicBoxChartProp.container,
    //     width: this.basicBoxChartProp.width,
    //     height: this.basicBoxChartProp.height,
    //   });
    //   chart.data(dv.rows);
    //   chart.scale('range', {
    //     max: 35,
    //     nice: true,
    //   });
    //   chart.tooltip({
    //     showTitle: false,
    //     showMarkers: false,
    //     itemTpl: '<li class="g2-tooltip-list-item" data-index={index} style="margin-bottom:4px;">'
    //       + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
    //       + '{name}<br/>'
    //       + '<span style="padding-left: 16px">最大值：{high}</span><br/>'
    //       + '<span style="padding-left: 16px">上四分位数：{q3}</span><br/>'
    //       + '<span style="padding-left: 16px">中位数：{median}</span><br/>'
    //       + '<span style="padding-left: 16px">下四分位数：{q1}</span><br/>'
    //       + '<span style="padding-left: 16px">最小值：{low}</span><br/>'
    //       + '</li>'
    //   });
    //   chart
    //     .schema()
    //     .position('x*range')
    //     .shape('box')
    //     .tooltip('x*low*q1*median*q3*high', (x, low, q1, median, q3, high) => {
    //       return {
    //         name: x,
    //         low,
    //         q1,
    //         median,
    //         q3,
    //         high
    //       };
    //     })
    //     .style({
    //       stroke: '#545454',
    //       fill: '#1890FF',
    //       fillOpacity: 0.3
    //     });
    //
    //   chart.interaction('active-region');
    //
    //   chart.render();
    // },
    plotMap() {
      const _this = this;
      let Cesium = this.Cesium;
      var rectangle = Cesium.Rectangle.fromDegrees(100, 39, 130, 50);
      let viewer = new this.Cesium.Viewer("cesiumContainer", {
        //加载在线谷歌地图
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //   url: "http://t0.tianditu.com/img_w/wmts?tk=23fcb43744ad1bd44cb2e217267ea48b&service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
        //   layer: "img",
        //   style: "default",
        //   format: "tiles",
        //   tileMatrixSetID: "w",
        //   //显示地图服务所属的提供商
        //   credit: new Cesium.Credit('天地图全球影像服务', true),
        //   subdomains: ['t0', "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        //   maximumLevel: 18,
        //   show: false
        // }),
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali",
          //  url:'http://localhost:9000/image/8030d030f03f11ea9aeb411461410a40/{z}/{x}/{y}',
          //  url:'../../static/satellite/{z}/{x}/{y}.jpg',
          //  tilingScheme: new Cesium.WebMercatorTilingScheme(),
          fileExtension: 'jpg',
          maximumLevel: 16,
          minimumLevel: 5,
        }),
        baseLayerPicker: false,
        scene3DOnly: true,
        geocoder: false, //搜索
        homeButton: false, //主页 地球回正
        sceneModePicker: false, //地球平铺 网格  3d/2d选择器
        animation: false, //是否创建动画小器件，左下角仪表
        selectionIndicator: false,
        fullscreenButton: false,
        infoBox: false,
        navigationHelpButton: false, //是否显示右上角的帮助按钮
        navigationInstructionsInitiallyVisible: false,
        timeline: false,

        //设置背景透明
        orderIndependentTranslucency: false,
        contextOptions: {
          webgl: {
            alpha: true
          }
        }

      });

      // var layers = viewer.scene.imageryLayers;

      // var blackMarble = layers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
      //   url: 'http://localhost:9000/image/8030d030f03f11ea9aeb411461410a40/{z}/{x}/{y}',
      //   rectangle: Cesium.Rectangle.fromDegrees(125.2, 48.68, 125.47, 49.11)
      // }));

      // var layers = viewer.imageryLayers.addImageryProvider(
      //     new this.Cesium.WebMapServiceImageryProvider({
      //         url:'../../static/test/{z}/{x}/{y}.png',
      //         layers: '',
      //         parameters: {
      //             format: 'image/png',
      //             transparent: true,
      //         }
      //     })
      // )
      // blackMarble.alpha = 0.8; // 0.0 is transparent.  1.0 is opaque.s
      // blackMarble.brightness = 2.0; // > 1.0 increases brightness.  < 1.0 decreases.
      // viewer._cesiumWidget._creditContainer.style.display="none"//取消版权信息

      let testStation = viewer.entities.add({
        id: 1,
        name: this.point1.name,
        position: Cesium.Cartesian3.fromDegrees(this.point1.lng, this.point1.lat),
        //点样式
        point: {
          pixelSize: 8,
          color: Cesium.Color.DARKTURQUOISE,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2
        },

        label: {
          text: this.point1.name,
          font: 'bold 16pt Times,courier',    //字体样式
          fillColor: Cesium.Color.LINEN,        //字体颜色
          showBackground: false,                //是否显示背景颜色
          // pixelOffset:new Cesium.Cartesian2(20.0, 0.0)
          pixelOffset: new Cesium.Cartesian2(9, 9),
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1, 8.0e6, 0.0),
        }
      });
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 800000;
      // viewer.scene.screenSpaceCameraController.minimumZoomDistance = 10;

//setView
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(125.24, 48.93, 4500.0),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-45.0),
          roll: Cesium.Math.toRadians(0.0)
        },
      });

      this.getMapData()
        .then(() => {
          this.clickMark(viewer, Cesium)
        })
      this.clickMark(viewer, Cesium)
    },
    clickMark(viewer, Cesium) {
      let _this = this;
      this.plotAll(viewer)
      const bubble = $("#bubble");
      const tip = $("#tip");
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      handler.setInputAction(function (event) {
        const pick = viewer.scene.pick(event.endPosition);
        //if (Cesium.defined(pick)&&(pick.id._id.indexOf("point")!=-1)) {
        if (viewer.scene.pickPositionSupported && Cesium.defined(pick) && (pick.id._id == 1)) {
          console.log(pick.id)
          const cartesian = viewer.camera.pickEllipsoid(event.endPosition, viewer.scene.globe.ellipsoid);
          const canvasPosition = viewer.scene.cartesianToCanvasCoordinates(cartesian, new Cesium.Cartesian2());//cartesianToCanvasCoordinates 笛卡尔坐标（3维度）到画布坐标
          if (Cesium.defined(canvasPosition)) {
            tip.css({
              left: canvasPosition.x + 10,
              top: canvasPosition.y + 10
            });
          }
          tip.show().html();
        } else if (pick && Cesium.defined(pick.id) && (pick.id._id.indexOf("typeId") != -1)) {
          if (pick.id._data && pick.id._typeId) {
            const cartesian1 = viewer.camera.pickEllipsoid(event.endPosition, viewer.scene.globe.ellipsoid);
            const canvasPosition1 = viewer.scene.cartesianToCanvasCoordinates(cartesian1, new Cesium.Cartesian2());//cartesianToCanvasCoordinates 笛卡尔坐标（3维度）到画布坐标
            $("#longitude").text("经度:" + pick.id._data.longitude);
            $("#latitude").text("纬度:" + pick.id._data.latitude);
            $("#altitude").text("高度:" + pick.id._data.altitude);
            if (Cesium.defined(canvasPosition1)) {
              bubble.css({
                left: canvasPosition1.x + 10,
                top: canvasPosition1.y + 10
              });
            }
            bubble.show().html();
          }
        } else {
          tip.hide();
          bubble.hide();
        }
      }, this.Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      const handler1 = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler1.setInputAction(function (event) {
        var position = viewer.scene.pick(event.position); //单击位置
        if (position && Cesium.defined(position.id) && (position.id._id.indexOf("typeId") != -1)) {
          if (position.id._data && position.id._typeId) {
            _this.$router.push({
              path: '/mapDetails', // 路由名称
              name: 'mapDetails', // 路由名称
              query: {
                pointObj: JSON.stringify(position.id._data),
                typeId: position.id._typeId
              }
            });
          }
        } else {
          console.log('error：');
        }
      }, this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    plotstations(viewer, points, str) {
      console.log(points)
      let that = this;
      for (let i = 0; i < points.length; i++) {
        let pName = points[i].name
        const point = viewer.entities.add({
          id: str.class + i,
          name: pName + '',
          data: points[i],
          typeId: str.typeId,
          description: "类型：" + str.name + "经纬度为：" + points[i].longitude + "<br/>值:" + points[i].latitude + "location:" + points[i].location,
          position: this.Cesium.Cartesian3.fromDegrees(points[i].longitude, points[i].latitude, 0),
          billboard: {
            image: str.img,
            scale: 0.1,//和原始大小相比的缩放比例
            minimumPixelSize: 100, //最小尺寸，防止太小而看不见
            distanceDisplayCondition: new this.Cesium.DistanceDisplayCondition(0.0, 10000000),
            verticalOrigin: this.Cesium.VerticalOrigin.BOTTOM
          },
          label: {
            text: pName + '',
            font: '12px SimHei,courier',    //字体样式
            // fillColor: this.Cesium.Color.DARKCYAN    ,        //字体颜色
            fillColor: this.Cesium.Color.HONEYDEW,
            showBackground: false,                //是否显示背景颜色
            // pixelOffset:new Cesium.Cartesian2(20.0, 0.0)
            pixelOffset: new this.Cesium.Cartesian2(5, 5),
            scaleByDistance: new this.Cesium.NearFarScalar(1.5e2, 1, 8.0e6, 0.0),
          },
        });
      }
    },
    plotAll(viewer) {
      let device = {
        img: require("../../assets/waterSoil/device.png"),
        class: "point0",
        name: "采集设备控制站",
        typeId: 7
      }
      let jingLiu = {
        img: require("../../assets/waterSoil/jingLiu.png"),
        class: "typeId6",
        name: "径流小区",
        typeId: 6
      }
      let measuresP = {
        img: require("../../assets/waterSoil/measuresP.png"),
        class: "typeId5",
        name: "面源污染观测点",
        typeId: 5
      }
      // let draBas = {img:require("../assets/img/waterSoil/drainageBasinMS.png"),class : "point4",name : "小流域",typeId:0}
      let draBaMs = {img: require("../../assets/waterSoil/draBaMs.png"), class: "typeId2", name: "小流域控制站", typeId: 2}
      let soilTemp = {
        img: require("../../assets/waterSoil/soilTe.png"),
        class: "typeId4",
        name: "土壤水分温度采集点",
        typeId: 4
      }
      let stationCont = {
        img: require("../../assets/waterSoil/stationCont.png"),
        class: "typeId1",
        name: "雨量站",
        typeId: 1
      }
      let windField = {img: require("../../assets/waterSoil/windF.png"), class: "typeId3", name: "风蚀场", typeId: 3}
      // this.plotstations(viewer,this.MapPoints,str)
      this.plotstations(viewer, this.deviceCont, device)
      this.plotstations(viewer, this.jingLiu, jingLiu)
      this.plotstations(viewer, this.measurePoints, measuresP)
      // this.plotstations(viewer,this.drainageBasin,draBas)
      this.plotstations(viewer, this.drainageBasinMS, draBaMs)
      this.plotstations(viewer, this.soilTemperaturePoint, soilTemp)
      this.plotstations(viewer, this.rainfallStation, stationCont)
      this.plotstations(viewer, this.windFieldSite, windField)
    },

    getMapData() {
      return this.$axios.all([getAllMapPoint('businessinformation/device/findAll'),//采集设备
        getAllMapPoint('businessinformation/JingLiuController/findAllJinglius'),//径流小区
        getAllMapPoint('businessinformation/measurePoint/findAllMeasurePoints'),//面源污染
        // getAllMapPoint('api/minorDrainageBasinController/findAllBasins'),//小流域
        getAllMapPoint('businessinformation/MinorDrainageBasinManagementStationController/findAllManagementStations'),//小流域控制站
        getAllMapPoint('businessinformation/SoilTemperaturePointController/findAll'),//土壤水分温度采集点
        getAllMapPoint('businessinformation/stationController/findAllStations'),//雨量站
        getAllMapPoint('businessinformation/WindFieldSite/findAllWindFieldSites'),//风蚀场
      ]).then(this.$axios.spread((res1, res2, res3, res5, res6, res7, res8) => {
        this.getdeviceCont(res1)
        this.getJingLiu(res2)
        this.getMeasurePoints(res3)
        // this.drainageBasin = res4
        this.getDrainageBMS(res5)
        this.getSoilTem(res6)
        this.getStationCont(res7)
        this.getWindField(res8)
      }))
    },
    getdeviceCont(res) {//采集设备
      this.deviceCont = res.data.map((item) => {
        let tmp = {}
        tmp.typeId = 7
        tmp.name = item.id
        tmp.longitude = item.longitude
        tmp.latitude = item.latitude
        tmp.image = item.image
        tmp.details = item.details
        return tmp
      })
    },
    getStationCont(res) {//雨量站
      this.rainfallStation = res.data.map((item) => {
        let tmp = {}
        tmp.typeId = 6
        tmp.name = item.stationname
        tmp.longitude = item.longitude
        tmp.latitude = item.latitude
        tmp.altitude = item.altitude
        tmp.image = item.image
        tmp.details = item.details
        return tmp
      })
    },
    getJingLiu(res) { //径流小区
      // let data = []
      this.jingLiu = res.data.map((item) => {
        let tmp = {}
        tmp.typeId = 6
        tmp.name = item.code
        tmp.longitude = item.longitude
        tmp.latitude = item.latitude
        tmp.altitude = item.altitude
        tmp.image = item.image
        tmp.slope = item.slope
        tmp.Slope_length = item.slopeLength
        tmp.Slope_width = item.slopeWidth
        tmp.Area = item.area
        tmp.Slope_aspect = item.slopeAspect
        tmp.Slope_position = item.slopePosition
        tmp.Soil_type = item.soilType
        tmp.Soil_thickness = item.soilThickness
        tmp.slope = item.slope
        tmp.Conservation_measures = item.conservationMeasures
        return tmp
      })
    },
    getMeasurePoints(res) { //面源污染
      this.measurePoints = res.data.map((item) => {
        let tmp = {}
        tmp.typeId = 5
        tmp.name = item.measurePointName
        tmp.longitude = item.longitude
        tmp.latitude = item.latitude
        tmp.altitude = item.altitude
        tmp.image = item.image
        tmp.measureMethod = item.measureMethod
        tmp.details = item.details
        tmp.measurePointType = item.measurePointType
        return tmp
      })
    },
    getDrainageBMS(res) { //小流域控制站
      this.drainageBasinMS = res.data.map((item) => {
        let tmp = {}
        tmp.typeId = 2
        tmp.name = item.name
        tmp.location = item.location
        tmp.longitude = item.longitude
        tmp.latitude = item.latitude
        tmp.altitude = item.altitude
        tmp.image = item.image
        tmp.currentFacility = item.currentFacility
        return tmp
      })
    },
    getSoilTem(res) { //土壤水分
      this.soilTemperaturePoint = res.data.map((item) => {
        let tmp = {}
        tmp.typeId = 4
        tmp.name = item.name
        tmp.longitude = item.longitude
        tmp.latitude = item.latitude
        tmp.altitude = item.altitude
        tmp.image = item.image
        return tmp
      })
    },
    getWindField(res) {
      this.windFieldSite = res.data.map((item) => {
        let tmp = {}
        tmp.typeId = 3
        tmp.name = item.windFieldName
        tmp.longitude = item.longitude
        tmp.latitude = item.latitude
        tmp.altitude = item.altitude
        tmp.image = item.image
        tmp.ultilization = item.ultilization
        return tmp
      })
    }
  },
  created() {
    this.getNumData();
  },
  mounted() {
    this.basicPieChart();
    this.basicBarChart();
    this.basicColumnChart();
    this.basicLineChart();
    this.plotMap();
  },
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background:#000000')
  },
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style')
  }
}
</script>

<style scoped>
.left {
  height: 30vh;
  padding: 10px;
}

.right {
  height: 30vh;
  padding: 10px;
}

.horn {
  position: relative;
  border: 1px solid #3A71A8;
  padding: 0 80px 0 80px;
  background-color: rgba(1, 1, 1, 0.4);
  width: 33.33%;
  height: 100%;
  float: left;
}

.horn > div {
  width: 10px;
  height: 10px;
  position: absolute;
}

.horn .lt {
  border-top: 3px solid lightblue;
  border-left: 3px solid lightblue;
  left: -3px;
  top: -3px;
}

.horn .rt {
  border-top: 3px solid lightblue;
  border-right: 3px solid lightblue;
  right: -3px;
  top: -3px;
}

.horn .rb {
  border-bottom: 3px solid lightblue;
  border-right: 3px solid lightblue;
  right: -3px;
  bottom: -3px;
}

.horn .lb {
  border-bottom: 3px solid lightblue;
  border-left: 3px solid lightblue;
  left: -3px;
  bottom: -3px;
}

#cesiumContainer {
  width: 99%;
  height: 40vh;
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.infoview {
  position: absolute;
  top: 0px;
  padding: 6px 15px;
  border-radius: 4px;
  border: 1px solid rgba(128, 128, 128, .5);
  color: #fff;
  background: rgba(0, 0, 0, .4);
  box-shadow: 0 3px 14px rgba(128, 128, 128, .5);
  z-index: 999;
}

.infoview img {
  width: 15%;
  height: auto;
}

.mark-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-top: 5px;
  margin-bottom: 5px;
}

td {
  display: table-cell;
  vertical-align: inherit;
  font-family: "Helvetica Neue", Helvetica;
  font-size: 14px;
}

.title1 {
  position: absolute;
  top: -20px;
  left: 10px;
  /*margin: 8px 5px -8px 5px;*/
  color: white;
  text-align: center;
  /*border: #3A71A8 1px solid;*/
  /*border-bottom: none;*/
}
</style>
