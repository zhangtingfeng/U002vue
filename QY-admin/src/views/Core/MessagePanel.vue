<template>
  <div class="message-panel">
    <div class="message-header">您有 {{total}} 条消息 <span class="refresh" @click="findPage">  <li class="el-icon-refresh"></li>  </span>
    </div>
    <div class="message-content">
      <div v-for="item in tableData" :key="item.in_batch_number" class="message-item">
        <span class="sender">{{ item.client_name }}</span>
        <span class="time"> 
          {{ item.warning_days }}天
        </span>
        <div class="message-cotent">{{ item.sku_name }} 已经到达 {{item.warningday}} 保质期预警</div>
      </div>
    </div>
    <div class="message-footer" @click="$router.push({path:'/business/ValidityWarning'})">查看所有消息</div>
  </div>
</template>

<script>
export default {
  name: "MessagePanel",
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
       tableData:[],
       total:0
    };
  },
  methods: {
    handleClick: function() {
      // 按钮操作处理函数
      this.$emit("click", {});
    },
    findPage: function() {
      let filters = {};
      filters.start = 1;
      filters.t = "norderStoreSku";
      filters.limit = 5;
      filters.max_warning_days = -1;
      filters.min_is_expired_days = 0;
      filters.sendemail = 1; 

      this.utils.request.queryUserPage(filters, res => {
        if ((res.code = "0000")) {
          this.total = res.total;
          this.tableData = res.rows; 
          this.$emit("changeWarnSize", res.total);
        }
      });
    }
  },
  mounted() {
    this.findPage();
  }
};
</script>

<style scoped>
.refresh{
  float:right;
  padding-right:10px;
  cursor:pointer
}
.message-panel {
  font-size: 15px;
  width: 300px;
  margin: -12px;
}
.message-header {
  padding-left: 10px;
  font-size: 14px;
  padding-top: 6px;
  padding-bottom: 6px;
}
.message-content {
  font-size: 15px;
}
.message-item {
  border-color: rgba(180, 190, 190, 0.8);
  border-top-width: 1px;
  border-top-style: solid;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
}
.message-item:hover {
  cursor: pointer;
  background: #b1a6a61e;
}
.message-avatar {
  padding-left: 10px;
}
.avatar {
  margin-right: 10px;
}
.sender {
  font-size: 16px;
  font-weight: bold;
}
.time {
  font-size: 12px;
  float: right;
  padding-right: 10px;
}
.message-footer {
  font-size: 14px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-color: rgba(180, 190, 190, 0.8);
  border-top-width: 1px;
  border-top-style: solid;
}
.message-footer:hover {
  cursor: pointer;
  background: #b1a6a61e;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 90px;
  float: left;
}
</style>