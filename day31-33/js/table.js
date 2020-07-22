// 修正“全选”框函数
function modifyAllSelect(table, data, selectRegionStatus, selectProductStatus){
    // 当地区选择了一个,而商品选择多个时候,地区作为第一列
    if(selectRegionStatus[0] === 1 && selectProductStatus[0] > 1){
        var tempCol;
        var tempFisrtNode;
        var tempSecondNode;
        for(var i = 0; i <= data.length; i++){
            tempFisrtNode = table.childNodes[i].firstChild;
            tempSecondNode = tempFisrtNode.nextSibling;
            tempCol = tempFisrtNode.cloneNode(true);
            tempFisrtNode.remove();
            tempSecondNode.after(tempCol);
        }
    }
    else if(selectRegionStatus[0] > 1 && selectProductStatus[0] > 1){
        var curNode,preNode;
        var curValue,preValue;
        var cnt = 1;
        for(var i=1;i<=data.length; i++){
            curNode = table.childNodes[i].firstChild;
            curValue = curNode.innerHTML;
            if(curValue === preValue){
                curNode.style.display = "none";
                cnt++;
            }
            else{
                if(preNode){
                    preNode.rowSpan = `${cnt}`;
                }
                preNode = curNode;
                preValue = curValue;
                cnt = 1;
            }
        }
        if(cnt > 1){
            if(preNode){
                preNode.rowSpan = `${cnt}`;
            }
        }
    }
}
function renderingTable(data, selectRegionStatus, selectProductStatus) {
    // 移除已渲染的表格
    var preTable = document.querySelector("table");
    if (preTable) {
        tableWrapper.removeChild(preTable);
    }
    // 输出表头：商品、地区、1月、2月、…… 12月
    var temp,tempTr,tempTd;
    var table = document.createElement('table');
    table.border = "1";
    table.style.borderCollapse = "collapse";

    var tr = document.createElement("tr");
    var thGoods = document.createElement("th");
    thGoods.innerHTML = "商品";
    var thRegion = document.createElement("th");
    thRegion.innerHTML = "地区";
    tr.append(thGoods);tr.append(thRegion);
    for(var i = 1; i <= 12; i++){
        temp = document.createElement("th");
        temp.innerHTML = `${i}月`;
        tr.append(temp);
    }
    table.append(tr);
    // 遍历数据 输出每一行的表格HTML内容
    for(var i = 0; i < data.length; i++){
        tempTr = document.createElement('tr');
        tempTd = document.createElement('td');
        tempTd.innerHTML = data[i].product;
        tempTr.append(tempTd);
        tempTd = document.createElement('td');
        tempTd.innerHTML = data[i].region;
        tempTr.append(tempTd);
        for(var j = 0; j < 12; j++){
            tempTd = document.createElement('td');
            tempTd.innerHTML = data[i].sale[j];
            tempTr.append(tempTd);
        }
        table.append(tempTr);
    }
    modifyAllSelect(table, data, selectRegionStatus, selectProductStatus);
    // 把生成的HTML内容赋给table-wrapper
    tableWrapper.append(table);
}