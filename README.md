# paging
angularjs paging, angularjs 分页插件

## 使用
参数:

参数名            类型           备注

selPage           number          // 选中的页数（必传）

allCount          number          // 总页数（必传）

changePage 　　   function        // 页数,条数发生变化反馈函数

pageSize 　　     string          // 条数（必传）

selectList        list            // 下拉框选择的列表

inputPage         boolean         // 是否开启输入跳转

pageHint          string          // 加载时的显示文字

isJsPaging        string         // 是否前端分页

allList           list           // 总数据

## 示例
`<paging all-count="allCount" sel-page="pagingM" page-size="pageSize" change-page="changePage(selPage)" select-list="selectList" input-page="inputPage"></paging>`
