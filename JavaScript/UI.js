// 显示窗口
function Macro() {
  UserForm1.ComboBox4.AddItem(Object.values(SelectItem.splitBy));
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

  let keyToTitle = VipshopGoods.getFullKeyToTitle();

  let splitByMap = Main.outputReport({
    splitWs: true,
    splitBy: SelectItem.getSplitBy(),
  });

  Workbooks(DAO._wbName).Sheets(VipshopGoods.getWsName()).Copy();
  let newWb = ActiveWorkbook;

  for (let entry of splitByMap) {
    let outputData = [];
    for (let value of entry[1]) {
      let outputItems = VipshopGoods.filterVipshopGoods({ styleNumber: value });

      outputData.push(...outputItems);
      outputData.push([]);
    }
    let worksheetCount = newWb.Worksheets.Count;
    newWb
      .Sheets(VipshopGoods.getWsName())
      .Copy(null, newWb.Worksheets(worksheetCount));
    let newSt = ActiveSheet;
    newSt.Name = entry[0];

    DAO.updateWorksheet(entry[0], outputData, keyToTitle, newWb);
    //隐藏非必要列
    if (UserForm1.CheckBox38.Value) {
      hideNonessentialColumns(newSt);
    }
  }
}

function hideNonessentialColumns(wt) {
  wt.Columns("K:L").EntireColumn.Hidden = true;
  wt.Columns("BA:BG").EntireColumn.Hidden = true;
  wt.Columns("BI:BO").EntireColumn.Hidden = true;
}
//选项配置类
class SelectItem {
  static splitBy = {
    thirdLevelCategory: "三级品类",
    fourthLevelCategory: "四级品类",
    mainSalesSeason: "主销季节",
  };
  static getSplitBy() {
    return Object.entries(this.splitBy).find(
      (item) => item[1] == UserForm1.Combobox4.Value,
    )[0];
  }
}
