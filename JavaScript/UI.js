// 显示窗口
function Macro() {
  UserForm1.ComboBox4.AddItem(["四级品类", "三级品类", "主销季节"]);
  UserForm1.ComboBox6.AddItem(["上架时间", "近7天款销量"]);
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
    Main.outputReport();
  } catch (err) {
    MsgBox(err.message);
    return;
  }
  MsgBox("报表输出成功！");
}
