<template>
  <div class="dashboard-editor-container">
    <!-- <el-row :gutter="20">
      <el-col :span="8">
        <div style="text-align:left;margin-bottom:10px">
          <el-date-picker
            v-model="countStoreSkuData"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @blur="countOrderInStore"
          ></el-date-picker>
        </div>
        <div id="countOrderInStore" style="width:100%; height:400px"></div>
      </el-col>
      <el-col :span="8">
        <div style="text-align:left;margin-bottom:10px">
          <el-date-picker
            v-model="countOrderOutStoreData"
            type="daterange"
            :picker-options="pickerOptionsOut"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @blur="countOrderOutStore"
          ></el-date-picker>
        </div>
        <div id="countOrderOutStore" style="width:100%;height:400px"></div>
      </el-col>

      <el-col :span="8">
        <div class="clearfix">
          <span style="font-size: 20px; color: #212121;">
            欢迎您admin使用
            <span style="color: red;">东晓腾飞仓储管理系统</span>
          </span>
        </div>
        <div>
          <img :src="emptyGif" class="emptyGif" />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <div id="countStoreSku" style="width:100%; height:400px;"></div>
      </el-col>
      <el-col :span="8">
        <div id="warnStoreSku" style="width:100%;height:400px;"></div>
      </el-col>
      <el-col :span="8">
        <div id="errorStoreSku" style="width:100%; height:400px;"></div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { formatDate } from "@/utils/datetime";

export default {
  data() {
    return {
      emptyGif: "http://img.soogif.com/kqKSjKYA4YWF7MCPDQ3LRbJO0JaNjlqc.gif",
      countStoreSkuData: [
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      countOrderOutStoreData: [
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      pickerOptionsOut: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      optionline: {
        title: {
          text: "入库货物统计"
        },
        tooltip: {},
        legend: {
          data: ["入库数量"]
        },
        xAxis: {
          data: [],
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              var ret = ""; //拼接加\n返回的类目项
              var maxLength = 2; //每项显示文字个数
              var valLength = value.length; //X轴类目项的文字个数
              var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
              if (rowN > 1) {
                //如果类目项的文字大于3,
                for (var i = 0; i < rowN; i++) {
                  var temp = ""; //每次截取的字符串
                  var start = i * maxLength; //开始截取的位置
                  var end = start + maxLength; //结束截取的位置
                  //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = value.substring(start, end) + "\n";
                  ret += temp; //凭借最终的字符串
                }
                return ret;
              } else {
                return value;
              }
            }
          }
        },
        yAxis: {},
        series: [
          {
            name: "入库数量",
            type: "line", //设置图表主题
            data: []
          }
        ]
      },
      outoptionline: {
        title: {
          text: "出库货物统计"
        },
        tooltip: {},
        legend: {
          data: ["出库数量"]
        },
        xAxis: {
          data: [],
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              var ret = ""; //拼接加\n返回的类目项
              var maxLength = 2; //每项显示文字个数
              var valLength = value.length; //X轴类目项的文字个数
              var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
              if (rowN > 1) {
                //如果类目项的文字大于3,
                for (var i = 0; i < rowN; i++) {
                  var temp = ""; //每次截取的字符串
                  var start = i * maxLength; //开始截取的位置
                  var end = start + maxLength; //结束截取的位置
                  //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = value.substring(start, end) + "\n";
                  ret += temp; //凭借最终的字符串
                }
                return ret;
              } else {
                return value;
              }
            }
          }
        },
        yAxis: {},
        series: [
          {
            name: "出库数量",
            type: "line", //设置图表主题
            data: []
          }
        ]
      },
      optionbar: {
        title: {
          text: "库存数据统计"
        },
        tooltip: {},
        legend: {
          data: ["库存"]
        },
        xAxis: {
          data: [""],
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              var ret = ""; //拼接加\n返回的类目项
              var maxLength = 2; //每项显示文字个数
              var valLength = value.length; //X轴类目项的文字个数
              var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
              if (rowN > 1) {
                //如果类目项的文字大于3,
                for (var i = 0; i < rowN; i++) {
                  var temp = ""; //每次截取的字符串
                  var start = i * maxLength; //开始截取的位置
                  var end = start + maxLength; //结束截取的位置
                  //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = value.substring(start, end) + "\n";
                  ret += temp; //凭借最终的字符串
                }
                return ret;
              } else {
                return value;
              }
            }
          }
        },
        yAxis: {},
        series: [
          {
            name: "库存",
            type: "bar", //设置图表主题
            data: []
          }
        ]
      },
      warnoptionbar: {
        title: {
          text: "预警数据统计"
        },
        tooltip: {},
        legend: {
          data: ["库存"]
        },
        xAxis: {
          data: [""],
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              var ret = ""; //拼接加\n返回的类目项
              var maxLength = 2; //每项显示文字个数
              var valLength = value.length; //X轴类目项的文字个数
              var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
              if (rowN > 1) {
                //如果类目项的文字大于3,
                for (var i = 0; i < rowN; i++) {
                  var temp = ""; //每次截取的字符串
                  var start = i * maxLength; //开始截取的位置
                  var end = start + maxLength; //结束截取的位置
                  //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = value.substring(start, end) + "\n";
                  ret += temp; //凭借最终的字符串
                }
                return ret;
              } else {
                return value;
              }
            }
          }
        },
        yAxis: {},
        series: [
          {
            name: "库存",
            type: "bar", //设置图表主题
            data: []
          }
        ]
      },
      erroroptionbar: {
        title: {
          text: "过期数据统计"
        },
        tooltip: {},
        legend: {
          data: ["库存"]
        },
        xAxis: {
          data: [""],
          axisLabel: {
            interval: 0,
            formatter: function(value) {
              var ret = ""; //拼接加\n返回的类目项
              var maxLength = 2; //每项显示文字个数
              var valLength = value.length; //X轴类目项的文字个数
              var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
              if (rowN > 1) {
                //如果类目项的文字大于3,
                for (var i = 0; i < rowN; i++) {
                  var temp = ""; //每次截取的字符串
                  var start = i * maxLength; //开始截取的位置
                  var end = start + maxLength; //结束截取的位置
                  //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = value.substring(start, end) + "\n";
                  ret += temp; //凭借最终的字符串
                }
                return ret;
              } else {
                return value;
              }
            }
          }
        },
        yAxis: {},
        series: [
          {
            name: "库存",
            type: "bar", //设置图表主题
            data: []
          }
        ]
      },
      option: {
        title: {
          textStyle: {
            fontSize: 18,
            fontWeight: "bolder",
            color: "#ff6666" // 主标题文字颜色
          },
          text: "预警货物统计"
        },
        color: [
          "#ff7f50",
          "#87cefa",
          "#da70d6",
          "#32cd32",
          "#6495ed",
          "#ff69b4",
          "#ba55d3",
          "#cd5c5c",
          "#ffa500",
          "#40e0d0"
        ],
        tooltip: { trigger: "axis" },
        //图例--折线提示提示
        legend: {
          x: "center",
          y: "30",
          borderColor: "#6699FF", //边框颜色
          textStyle: {
            color: "#1e90ff" // 图例文字颜色
          },
          data: ["保质期预警", "过期预警"]
        },

        calculable: true,
        xAxis: {
          data: []
        },
        yAxis: [],
        series: [
          {
            type: "line",
            name: "保质期预警",
            data: []
          },
          {
            type: "line",
            name: "过期预警",
            data: []
          }
        ]
      }
    };
  },
  computed: {},
  mounted: function() {
    //初始化，

    // this.countStoreSku();
    // this.countOrderInStore();
    // this.countOrderOutStore();
    // this.countErrorStore();
    // this.countWarnStore();
  },
  methods: {
    countWarnStore: function() {
      var filter = {};
      filter.limit = 10;
      filter.sql = "queryWarnStore";
      filter.t = "echarts";
      this.utils.request.commonCount(filter, res => {
        let warn = this.$echarts.init(
          document.getElementById("warnStoreSku")
        );
        this.warnoptionbar.xAxis.data = res.data.xAxis;
        this.warnoptionbar.series[0].data = res.data.series;
        warn.setOption(this.warnoptionbar);
      });
    },
    countErrorStore: function() {
      var filter = {};
      filter.limit = 10;
      filter.sql = "queryErrorStore";
      filter.t = "echarts";
      this.utils.request.commonCount(filter, res => {
        let error = this.$echarts.init(
          document.getElementById("errorStoreSku")
        );
        this.erroroptionbar.xAxis.data = res.data.xAxis;
        this.erroroptionbar.series[0].data = res.data.series;
        error.setOption(this.erroroptionbar);
      });
    },
    countStoreSku: function() {
      var filter = {};
      filter.limit = 10;
      filter.sql = "queryCountOrderInStore";
      filter.t = "echarts";
      this.utils.request.commonCount(filter, res => {
        let chartmainbar = this.$echarts.init(
          document.getElementById("countStoreSku")
        );
        this.optionbar.xAxis.data = res.data.xAxis;
        this.optionbar.series[0].data = res.data.series;
        chartmainbar.setOption(this.optionbar);
      });
    },
    countOrderInStore: function() {
      var filter = {};
      filter.limit = 10;
      filter.startTime = formatDate(this.countStoreSkuData[0], "yyyy-MM-dd");
      filter.endTime = formatDate(this.countStoreSkuData[1], "yyyy-MM-dd");
      this.utils.request.countOrderInStore(filter, res => {
        let chartmainline = this.$echarts.init(
          document.getElementById("countOrderInStore")
        );
        this.optionline.xAxis.data = res.data.xAxis;
        this.optionline.series[0].data = res.data.series;
        chartmainline.setOption(this.optionline);
      });
    },
    countOrderOutStore: function() {
      var filter = {};
      filter.limit = 10;
      filter.startTime = formatDate(
        this.countOrderOutStoreData[0],
        "yyyy-MM-dd"
      );
      filter.endTime = formatDate(this.countOrderOutStoreData[1], "yyyy-MM-dd");
      this.utils.request.countOrderOutStore(filter, res => {
        let chartmainlineOut = this.$echarts.init(
          document.getElementById("countOrderOutStore")
        );
        this.outoptionline.xAxis.data = res.data.xAxis;
        this.outoptionline.series[0].data = res.data.series;
        chartmainlineOut.setOption(this.outoptionline);
      });
    },
    drawLine: function() {
      let chartmainbar2 = this.$echarts.init(
        document.getElementById("chartmainbar2")
      );

      // for (var i = 0; i < this.plan_table.length; i++) {
      //   this.option.xAxis.data.push(this.plan_table[i].city);
      //   //大修金额总计
      //   this.option.series[0].data.push(this.plan_table[i].d_money);
      //   //中修金额
      //   this.option.series[1].data.push(this.plan_table[i].z_money);
      //   //预防性养护金额合计
      //   this.option.series[2].data.push(this.plan_table[i].y_money);
      //   //金额总计
      //   this.option.series[3].data.push(this.plan_table[i].sum_money);
      //   //Y轴最大值的设置：向上取整并家500
      //   this.option.yAxis[0].max =
      //     Math.ceil(this.plan_table[0].sum_money) + 500;
      // }

      chartmainbar2.setOption(this.option);

      var myChart = this.$echarts.init(
        document.getElementById("chartmainline2")
      );

      // 绘制图表
      myChart.setOption({
        title: {
          text: "ECharts 入门示例"
        },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.emptyGif {
  display: block;
  width: 45%;
  margin: 0 auto;
}

.dashboard-editor-container {
  width: 90%;
  height: 100%;
  text-align: center
}
</style>
