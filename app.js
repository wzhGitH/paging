var app = angular.module('myPaging', []);

// 自定义指令: 分页
app.directive('paging', ["$rootScope", function ($rootScope) {
    return {
        require: '?ngModel', // ?ngModel
        replace: true,
        restrict: 'E',
        templateUrl: './paging.html',
        scope: {
            selPage: "=",           // 选中的页数
            allCount: '=',          // 总页数
            changePage: "&",        // 页数发生变化反馈函数
            pageSize: "=",          // 条数
            selectList: "=",        // 下拉框选择的列表
            inputPage: "=",         // 是否开启输入跳转
            pageHint: "@",          // 加载时的显示文字
            isJsPaging: "=",        // 是否前端分页
            allList: "=",           // 总数据
        },
        link: function ($scope, element, attr, ngModel) {
            // 显示 hint
            $scope.isGetLoading = true;
            $scope.itemList = [];
            $scope.newPages = 0;
            $scope.allPage = 0;
            // 是否没有数据
            $scope.noDataTrue = false;
            // 是否显示多少条数据
            $scope.hasAllCount = true;
            var isClickPage = false;
            // 监听总页数做出对应的动作
            $scope.$watch("allCount", function (newValue) {
                if (!attr.hasOwnProperty('pageHint')) {
                    $scope.pageHint = "正在查询...";
                }
                if (newValue) {
                    // 有条数时
                    if ($scope.pageSize) {
                        $scope.isGetLoading = false;
                        $scope.noDataTrue = false;
                        $scope.hasAllCount = true;
                        $scope.reloadData();
                    }
                }
                // 传999999999 表示无总页数,  隐藏总页数, 最后一页
                if (newValue == 999999999) {
                    $scope.inputPage = false;
                    $scope.hasAllCount = false;
                }
                // 表示无数据
                if (newValue === 0) {
                    $scope.isGetLoading = true;
                    $scope.pageHint = "暂无记录";
                    $scope.noDataTrue = true;
                }
            })
            // 监听选中页数
            $scope.$watch("selPage", function (newValue) {
                if (newValue) {
                    // 第一次传的选中页数不等于1, 执行点击操作
                    if (newValue != 1 && !isClickPage) {
                        $scope.checkPage(newValue);
                    }
                    // 搜索时初始化
                    if (newValue === 1) $scope.reloadData();
                }
            })
            // 初始化
            $scope.reloadData = function () {
                var pageSize = parseInt($scope.pageSize);
                $scope.allPage = Math.ceil($scope.allCount / pageSize);
                $scope.newPages = $scope.allPage < 5 ? $scope.allPage : 5;
                if ($scope.isJsPaging) {
                    $scope.isJsPaging = $scope.allList.slice(0, $scope.pageSize);
                }
                var pageList = [];
                for (var i = 0; i < $scope.newPages; i++) {
                    pageList.push(i + 1);
                }
                $scope.itemList = pageList;
            }
            // 点击页数
            $scope.checkPage = function (page) {
                isClickPage = true;
                page = parseInt(page);
                if (page < 1 || page > $scope.allPage) return;
                var newpageList = [];
                // 判断选中页数时要显示的页数列表
                if ($scope.allPage < 6) {
                    for (var i = 0; i < $scope.allPage; i++) {
                        newpageList.push(i + 1);
                    }
                } else {
                    if (page == 1 || page == 2) {
                        for (var i = 0; i < $scope.newPages; i++) {
                            newpageList.push(i + 1);
                        }
                    }
                    //最多显示分页数5
                    if (page > 2 && page < ($scope.allPage - 1)) {
                        //因为只显示5个页数，大于2页开始分页转换
                        for (var i = (page - 3); i < ((page + 2) > $scope.allPage ? $scope.allPage : (page + 2)); i++) {
                            newpageList.push(i + 1);
                        }
                    }
                    if (page == ($scope.allPage - 1) || page == $scope.allPage) {
                        for (var i = ($scope.allPage - 5); i < $scope.allPage; i++) {
                            newpageList.push(i + 1);
                        }
                    }
                }
                $scope.itemList = newpageList;
                $scope.selPage = page;
                $scope.isActivePage(page);
                if ($scope.isJsPaging) {
                    $scope.setData();
                } else {
                    setTimeout(function () {
                        $scope.changePage({ selPage: $scope.selPage });
                    }, 0)
                }
            }
            $scope.setData = function () {
                $scope.isJsPaging = $scope.allList.slice(($scope.pageSize * ($scope.selPage - 1)), ($scope.selPage * $scope.pageSize));   //通过当前页数筛选出表格当前显示数据
            }
            // 选中样式
            $scope.isActivePage = function (page) {
                return $scope.selPage == page;
            }
            // 下一页
            $scope.nextPage = function () {
                $scope.checkPage($scope.selPage + 1);
            }
            // 上一页
            $scope.prevPage = function () {
                $scope.checkPage($scope.selPage - 1);
            }
            // 最后一页
            $scope.lastPage = function () {
                $scope.checkPage($scope.allPage);
            }
            // 第一页
            $scope.firstPage = function () {
                $scope.checkPage(1);
            }
            // 下拉框选择
            $scope.changePageSize = function () {
                var pageSize = parseInt($scope.pageSize);
                $scope.allPage = Math.ceil($scope.allCount / pageSize);
                $scope.newPages = $scope.allPage < 5 ? $scope.allPage : 5;
                if ($scope.selPage >= $scope.allPage) {
                    $scope.checkPage($scope.allPage);
                } else {
                    $scope.checkPage($scope.selPage);
                }
                if ($scope.isJsPaging) {
                    $scope.setData();
                }
            }
            // 输入input
            $scope.keyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.checkPage($scope.pageInput);
                    $scope.pageInput = "";
                }
            }
        }
    }
}]);