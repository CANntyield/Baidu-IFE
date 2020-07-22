var regionRadioWrapper = document.querySelector("#region-radio-wrapper");
var productRadioWrapper = document.querySelector("#product-radio-wrapper");
var tableWrapper = document.querySelector("#table-wrapper");

// 设置一个数组用来保存多选框的选择状态，其中第0个位置的值代表选中的数目
var selectRegionStatus = [0, 0, 0, 0];
var selectProductStatus = [0, 0, 0, 0];

// 多选框的选项
var checkBoxRegionValue = {1: "华东", 2: "华南", 3: "华北"};
var checkBoxProductValue = {1: "手机", 2: "笔记本", 3: "智能音箱"};

geneCheckbox("region-radio-wrapper", checkBoxRegionValue, selectRegionStatus);
geneCheckbox("product-radio-wrapper", checkBoxProductValue, selectProductStatus);