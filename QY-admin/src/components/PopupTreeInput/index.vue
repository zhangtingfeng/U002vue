<template>
  <div>
    <el-popover
      ref="popover"
      :placement="placement"
      trigger="click"
      style="max-height:400px;   overflow: auto;"
    >
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>

      <el-tree
        :data="data"
        :props="props"
        node-key="nodeKey"
        ref="popupTree"
        @current-change="currentChangeHandle"
        :default-expand-all="defaultExpandAll"
        :highlight-current="true"
        :expand-on-click-node="true"
        :filter-node-method="filterNode"
        style="max-height:400px;   overflow: auto;"
      ></el-tree>
    </el-popover>
    <el-input
      v-model="prop"
      v-popover:popover
      :readonly="true"
      :placeholder="placeholder"
      style="cursor:pointer;"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: "PopupTreeInput",
  props: {
    data: {
      type: Array,
      default: []
    },
    filter_key: {
      type: String,
      default: ""
    },
    props: {
      type: Object,
      default: {}
    },
    prop: {
      type: String,
      default: ""
    },
    nodeKey: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "点击选择内容"
    },
    placement: {
      type: String,
      default: "right-start"
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    currentChangeHandle: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      filterText: ""
    };
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
 
      if(this.filter_key == ""){
        return true;
      } 
      return data[this.filter_key].indexOf(value) !== -1;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.popupTree.filter(val);
    }
  }
};
</script>

<style scoped>
/deep/ .el-popover {
  height: 100px;
}
</style>