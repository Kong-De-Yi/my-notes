// 显式窗口
function Macro() {
  UserForm1.ComboBox6.AddItem("上架时间");
  UserForm1.Show();
}

//更新常态商品
function UserForm1_CommandButton2_Click() {
  try {
    VipshopGoods.initializeData();
    Main.updateRegularProduct();
  } catch (err) {
    MsgBox(err.message);
    return;
  }
  VipshopGoods.saveVipshopGoods();
  MsgBox("【" + RegularProduct.getWsName() + "】更新成功！");
}

//更新商品价格
function UserForm1_CommandButton1_Click() {
  try {
    VipshopGoods.initializeData();
    Main.updateProductPrice();
  } catch (err) {
    MsgBox(err.message);
    return;
  }
  VipshopGoods.saveVipshopGoods();
  MsgBox("【" + ProductPrice.getWsName() + "】更新成功！");
}

//更新商品库存
function UserForm1_CommandButton4_Click() {
  try {
    VipshopGoods.initializeData();
    Main.updateInventory();
  } catch (err) {
    MsgBox(err.message);
    return;
  }
  VipshopGoods.saveVipshopGoods();
  MsgBox("【" + Inventory.getWsName() + "】更新成功！");
}

//更新商品销售
function UserForm1_CommandButton5_Click() {
  try {
    VipshopGoods.initializeData();
    Main.updateProductSales();
  } catch (err) {
    MsgBox(err.message);
    return;
  }
  VipshopGoods.saveVipshopGoods();
  MsgBox("【" + ProductSales.getWsName() + "】更新成功！");
}

//一键更新
function UserForm1_CommandButton6_Click() {
  try {
    VipshopGoods.initializeData();
    Main.updateRegularProduct();
    Main.updateProductPrice();
    Main.updateInventory();
    Main.updateProductSales();
  } catch (err) {
    MsgBox(err.message);
    return;
  }
  VipshopGoods.saveVipshopGoods();
  MsgBox("一键更新成功！");
}

//报表输出
function UserForm1_CommandButton13_Click() {
  try {
    VipshopGoods.initializeData();
  } catch (err) {
    MsgBox(err.message);
    return;
  }

  let keyToTitle = {
    listingYear: "上市年份",
    mainSalesSeason: "主销季节",
    applicableGender: "适用性别",
    mainStyle: "主款式",
    stockingMode: "备货模式",
    marketingPositioning: "营销定位",
    marketingMemorandum: "营销备忘录",
    firstListingTime: "首次上架时间",
    salesAge: "售龄",
    designNumber: "设计号",
    itemNumber: "货号",
    styleNumber: "款号",
    picture: "图片",
    color: "颜色",
    link: "链接",
    itemStatus: "商品状态",
    offlineReason: "下线原因",
    activityStatus: "活动状态",
    isPriceBroken: "是否破价",
    costPrice: "成本价",
    lowestPrice: "最低价",
    silverPrice: "白金价",
    userOperations1: "中台1",
    userOperations2: "中台2",
    finalPrice: "到手价",
    superVipPrice: "超V价",
    profit: "利润",
    profitRate: "利润率",
    unitPriceOfLast7Days: "近7天件单价",
    exposureUVOfLast7Days: "近7天曝光UV",
    productDetailsUVOfLast7Days: "近7天商详UV",
    addToCartUVOfLast7Days: "近7天加购UV",
    customerCountOfLast7Days: "近7天客户数",
    rejectAndReturnCountOfLast7Days: "近7天拒退数",
    salesQuantityOfLast7Days: "近7天销售量",
    salesAmountOfLast7Days: "近7天销售额",
    clickThroughRateOfLast7Days: "近7天点击率",
    addToCartRateOfLast7Days: "近7天加购率",
    purchaseRateOfLast7Days: "近7天转化率",
    rejectAndReturnRateOfLast7Days: "近7天拒退率",
    styleSalesOfLast7Days: "近7天款销量",
    sellableInventory: "可售库存",
    sellableDays: "可售天数",
    isOutOfStock: "是否断码",
    totalInventory: "合计库存",
    finishedGoodsTotalInventory: "成品合计",
    finishedGoodsMainInventory: "成品主仓",
    finishedGoodsIncomingInventory: "成品进货",
    finishedGoodsFinishingInventory: "成品后整",
    finishedGoodsOversoldInventory: "成品超卖",
    finishedGoodsPrepareInventory: "成品备货",
    finishedGoodsReturnInventory: "成品销退",
    finishedGoodsPurchaseInventory: "成品在途",
    generalGoodsTotalInventory: "通货合计",
    generalGoodsMainInventory: "通货主仓",
    generalGoodsIncomingInventory: "通货进货",
    generalGoodsFinishingInventory: "通货后整",
    generalGoodsOversoldInventory: "通货超卖",
    generalGoodsPrepareInventory: "通货备货",
    generalGoodsReturnInventory: "通货销退",
    generalGoodsPurchaseInventory: "通货在途",
    totalSales: "销量总计",
  };

  for (let entry of Object.entries(VipshopGoods.optionalKeyToTitle)) {
    keyToTitle[entry[0]] = entry[1];
  }

  let splitByMap = Main.outputReport({
    splitWs: true,
    splitBy: "fourthLevelCategory",
  });
  let newWb = Workbooks.Add();
  Workbooks(DAO.getWbName())
    .Sheets(ProductPrice.getWsName())
    .Copy(newWb.Sheets.Item(1));

  for (let entry of splitByMap) {
    let outputData = [];
    for (let value of entry[1]) {
      let outputItems = VipshopGoods.filterVipshopGoods({ styleNumber: value });

      outputData.push(...outputItems);
      outputData.push([]);
    }

    let newSt = newWb.Sheets.Add(null, newWb.Sheets.Item(1), 1);
    newSt.Name = entry[0];
    DAO.updateWorksheet(entry[0], outputData, keyToTitle, newWb);
    //格式化
    newSt.UsedRange.Rows("1:1").RowHeight = 30;
    newSt.Range("A1:S1").Interior.Pattern = xlPatternSolid;
    newSt.Range("A1:S1").Interior.ThemeColor = 8;
    newSt.Range("A1:S1").Interior.TintAndShade = 0.8;
    newSt.UsedRange.Rows("2:1000").RowHeight = 30;
  }
}
/*
Sub Macro1()

'

'
    Rows("2:6").Select
    Selection.RowHeight = 30
End Sub
Sub Macro3()
'
' Macro3 Macro
' 宏由 Administrator 录制，时间: 2026/01/28
'

'
    Range("A1:S1").Select
    With Selection.Interior
        .Pattern = xlPatternSolid
        .ThemeColor = 8
        .TintAndShade = 0.8
    End With
    Selection.Font.Name = "微软雅黑 Light"
   
    Range("T1:AD1").Select
    With Selection.Interior
        .Pattern = xlPatternSolid
        .Color = 65535
        .TintAndShade = 0
    End With
    Range("AE1:AM1").Select
    ActiveWindow.ScrollColumn = 15
    Range("AE1:AN1").Select
    ActiveWindow.ScrollColumn = 16
    Range("AE1:AO1").Select
    ActiveWindow.ScrollColumn = 18
    Range("AE1:AQ1").Select
    ActiveWindow.ScrollColumn = 19
    Range("AE1:AR1").Select
    ActiveWindow.ScrollColumn = 20
    Range("AE1:AS1").Select
    ActiveWindow.ScrollColumn = 21
    Range("AE1:AT1").Select
    ActiveWindow.ScrollColumn = 22
    Range("AE1:AQ1").Select
    With Selection.Interior
        .Pattern = xlPatternSolid
        .Color = 9237390
        .TintAndShade = 0
    End With
    Range("AR1:AT1").Select
    With Selection.Interior
        .Pattern = xlPatternSolid
        .Color = 15837675
        .TintAndShade = 0
    End With
    ActiveWindow.ScrollColumn = 35
    Range("AU1").Select
    With Selection.Interior
        .Pattern = xlPatternSolid
        .Color = 15502497
        .TintAndShade = 0
    End With
    Range("AV1:BC1").Select
    With Selection.Interior
        .Pattern = xlPatternSolid
        .Color = 8125439
        .TintAndShade = 0
    End With
    Range("BD1:BH1").Select
    ActiveWindow.ScrollColumn = 36
    Range("BD1:BI1").Select
    ActiveWindow.ScrollColumn = 37
    Range("BD1:BJ1").Select
    ActiveWindow.ScrollColumn = 38
    Range("BD1:BK1").Select
    ActiveWindow.ScrollColumn = 39
    Range("BD1:BK1").Select
    With Selection.Interior
        .Pattern = xlPatternSolid
        .Color = 4512771
        .TintAndShade = 0
    End With
    ActiveWindow.ScrollColumn = 41
    Range("BL1").Select
    With Selection.Interior
        .Pattern = xlPatternSolid
        .Color = 14147196
        .TintAndShade = 0
    End With
    Range("BL1,BD1,AV1,AU1").Select
    Range("BU1").Activate
    ActiveWindow.ScrollColumn = 1
    Selection.Font.Bold = False
    Selection.Font.Bold = True
End Sub

*/
