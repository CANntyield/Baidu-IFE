function getData(sourceData, selectRegionStatus, selectProductStatus) {
    // 遍历原始数据 {
    //     判断是否在商品维度 或者 地区维度的选中范围内 {
    //         添加到返回数据list中
    //     }
    // }
    // 返回数据
    var tempData = [];
    for (var i = 0; i < sourceData.length; i++) {
        var tempItem = sourceData[i];
        for (var j = 1; j < selectRegionStatus.length; j++) {
            if (selectRegionStatus[j] === 1 && checkBoxRegionValue[`${j}`] === tempItem.region) {
                for (var k = 1; k < selectProductStatus.length; k++) {
                    if (selectProductStatus[k] === 1 
                        && checkBoxProductValue[`${k}`] === tempItem.product) {
                        tempData.push(tempItem);
                    }
                }
            }
        }
    }
    return tempData;
}