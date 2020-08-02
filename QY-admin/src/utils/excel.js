/**
 * excle相关操作
 */
//数据写入excel
export function exportExcel(exxcledate, filterColumns, fileName) {

  import('@/vendor/Export2Excel').then(excel => {
    const tHeader = []; // 导出的表头名信息
    const filterVal = []; // 导出的表头字段名，需要导出表格字段名
    if (filterColumns != null && filterColumns != undefined && filterColumns.length > 0) {
      $.each(filterColumns, function (key, val) {
        tHeader.push(val.label);
        filterVal.push(val.prop);
      })

      const list = exxcledate;

      if (list != null && list != undefined && filterVal != null && filterVal != undefined && filterVal.length > 0) {

        const data = formatJson(filterVal, list);

        if (fileName == undefined || fileName == null) {
          fileName = "excel-list";
        }

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: fileName
        })
      } 

    }

  })



}

//格式转换，直接复制即可
export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}