var changeSelect = function(e) {
    var target = e.target;
    if (target.nodeName.toLowerCase() === "input") {
        var allNode = target.parentNode.parentNode.firstChild.firstChild;
        var statusLen = allNode.selectStatus.length;
        if (target.checkboxType === "all"){
            if(target.checked){
                while(target.parentNode.nextSibling){
                    target = target.parentNode.nextSibling.firstChild;
                    target.checked = true;
                    allNode.selectStatus[0] = statusLen - 1;
                    for(var i = 1; i < statusLen; i++){
                        allNode.selectStatus[i] = 1;
                    }
                }
            }
            else{
                target.checked = true;
            }
        }
        else{
            if(target.checked){
                // target.value作为对象checkBoxRegionValue，checkBoxProductValue
                // 中巧妙地作为属性名进行索引
                allNode.selectStatus[target.value] = 1;
                allNode.selectStatus[0] += 1;

                // 考虑是否全部选中,决定是否勾选checkType值为all的input
                var flag = true;
                for(var i = 1; i < statusLen; i++){
                    if(allNode.selectStatus[i] === 0){
                        flag = false;
                    }
                }
                if(flag){
                    allNode.selectStatus[0] = statusLen - 1;
                    allNode.checked = true;
                }
            }
            else{
                if(allNode.selectStatus[0] > 1){
                    allNode.selectStatus[target.value] = 0;
                    allNode.selectStatus[0] -= 1;
                }
                else{
                    target.checked = true;
                }

                // 取消勾选全选框
                allNode.checked = false;
            }
        }
        renderingTable(getData(sourceData, selectRegionStatus, selectProductStatus), selectRegionStatus, selectProductStatus);
    }
}
function geneCheckbox(checkBoxId, checkBoxValue, checkBoxSelectStatus) {
    var boxWrapper = document.querySelector("#" + checkBoxId);
    // 生成全选checkbox的html，给一个自定义属性表示为全选checkbox，比如checkbox-type="all"
    var label = document.createElement('label');
    var checkAll = document.createElement('input');
    var labelText = document.createTextNode('全选');
    checkAll.value = "0";
    checkAll.type = "checkbox";
    // 自定义了两个属性值,checkBoxType为all表示这是一个全选按钮
    // selectStatus引用的是当前多选框的选择状态属性。
    checkAll.checkboxType = "all";
    checkAll.selectStatus = checkBoxSelectStatus;

    label.append(checkAll);label.append(labelText);
    boxWrapper.append(label);

    // 遍历参数对象 生成各个子选项checkbox的html，给一个自定义属性表示为子选项
    for (var x in checkBoxValue) {
        var tempLabel = document.createElement('label');
        var checkItem = document.createElement('input');
        var tempLabelText = document.createTextNode(checkBoxValue[x]);
        checkItem.value = x;

        checkItem.checkboxType = "one";
        checkItem.type = "checkbox";

        tempLabel.append(checkItem);tempLabel.append(tempLabelText);
        boxWrapper.append(tempLabel);
    }

    // 给容器做一个事件委托
    boxWrapper.onchange = changeSelect;
}