 
<template>
  <div class="page-container">
    <el-tabs 
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      ></el-tab-pane>
    </el-tabs> 
    <component :is="content"></component>
  </div>
</template>

<script>
import ShowroomTypeManage from "@/views/Pages/Activity/ShowroomTypeManage";
import ShopList from "@/views/Pages/Activity/ShowroomShop.vue";

export default {
  components: { ShowroomTypeManage, ShopList },
  data() {
    return {
      activeName: "ShowroomTypeManage",
      editableTabs: [
        {
          title: "展厅分类",
          name: "ShowroomTypeManage",
          content: "ShowroomTypeManage"
        },
        {
          title: "指定商家列表",
          name: "ShopList",
          content: "ShopList"
        }
      ],
      content:"ShowroomTypeManage"
    };
  },
  methods: {
    handleClick(tab, event) {
       this.content = tab.name;
    }
  },
  mounted() {}
};
</script>

<style scoped>
/deep/ .form .el-input__inner {
  width: 200px !important;
}
</style>
