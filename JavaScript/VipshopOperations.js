function main() {}
//货号总表
class VipshopGoods {
  static keyToTitle = {
    listingYear: "上市年份",
    mainSalesSeason: "主销季节",
    applicableGender: "适用性别",
    fourthLevelCategory: "四级分类",
    mainStyle: "主款式",
    marketingPositioning: "营销定位",
    marketingMemorandum: "营销备忘录",
    firstListingTime: "首次上架时间",
    itemNumber: "货号",
    picture: "图片",
    itemStatus: "商品状态",
    offlineReason: "下线原因",
    costPrice: "成本价",
    lowestPrice: "最低价",
    silverPrice: "白金价",
    userOperations1: "中台1",
    userOperations2: "中台2",
    unitPriceOfLast7Days: "近7天件单价",
    stockingMode: "备货模式",
  };
  static data = [];

  /*   constructor({
    salesOfTheYearBeforeLast,
    monthlySalesOfLastYearMap,
    dailySalesOfLast60DaysMap,
  }) {} */
  static initializeData() {
    this.data = DAO.readWorksheet("总表", this.keyToTitle);
  }
  static checkData() {}
  get salesAge() {
    return this.firstListingTime
      ? Math.floor(
          (Date.now() - Date.parse(this.firstListingTime)) /
            (24 * 60 * 60 * 1000),
        )
      : "";
  }
  get link() {
    return this.MID
      ? "https://detail.vip.com/detail-1234-" + this.MID + ".html"
      : "";
  }
  get activityStatus() {
    if (this.vipshopPrice && this.finalPrice) {
      return this.vipshopPrice > this.finalPrice ? "活动中" : "";
    }
    return "未知";
  }
  get isPriceBroken() {
    if (this.finalPrice && this.lowestPrice) {
      return this.lowestPrice >= this.finalPrice ? "" : "是";
    }
    return "未知";
  }
  get firstOrderPrice() {}
  get superVipPrice() {}
  get profit() {}
  get profitRate() {}
  get isOutOfStock() {
    return this._sizesOutOfStock;
  }
  set isOutOfStock(sizes) {
    this._sizesOutOfStock = sizes;
  }
  get totalInventory() {}
  get finishedGoodsTotalInventory() {}
  get generalGoodsTotalInventory() {}
  get totalSales() {}
  get salesOfLastYear() {}
  get salesOfThisYear() {}
  static styleSalesOfLast7Days(styleNumber) {}
}
//常态商品管理
class RegularProduct {
  static keyToTitle = {
    MID: "商品ID",
    P_SPU: "P_SPU",
    productCode: "条码",
    itemNumber: "货号",
    styleNumber: "款号",
    color: "颜色",
    size: "尺码",
    thirdLevelCategory: "三级品类",
    brandSN: "品牌SN",
    brand: "品牌名称",
    sizeStatus: "尺码状态",
    itemStatus: "商品状态",
    vipshopPrice: "唯品价",
    finalPrice: "到手价",
    sellableInventory: "可售库存",
    sellableDays: "可售天数",
  };
  static data = [];
}
//组合装
class ComboProduct {
  static keyToTitle = {
    productCode: "组合商品实体编码",
    subProductCode: "商品编码",
    subProductQuantity: "数量",
  };
  static date = [];
}
//商品库存
class Inventory {
  static keyToTitle = {
    productCode: "商品编码",
    mainInventory: "数量",
    incomingInventory: "进货仓库存",
    finishingInventory: "后整车间",
    oversoldInventory: "超卖车间",
    prepareInventory: "备货车间",
    returnInventory: "销退仓库存",
    purchaseInventory: "采购在途数",
  };
  static data = [];
}
//商品销售
class ProductSales {
  static keyToTitle = {
    salesDate: "日期",
    itemNumber: "货号",
    exposureUV: "曝光UV",
    productDetailsUV: "商详UV",
    addToCartUV: "加购UV(加购用户数)",
    customerCount: "客户数",
    rejectAndReturnCount: "拒退件数",
    salesQuantity: "销售量",
    salesAmount: "销售额",
    firstListingTime: "首次上架时间",
  };
  static data = [];
  get unitPrice() {
    return this.salesAmount / this.salesQuantity;
  }
  get clickThroughRate() {
    return this.productDetailsUV / this.exposureUV;
  }
  get purchaseRate() {
    return this.customerCount / this.productDetailsUV;
  }
  get addToCartRate() {
    return this.addToCartUV / this.productDetailsUV;
  }
  get rejectAndReturnRate() {
    return this.rejectAndReturnCount / this.salesQuantity;
  }
}
class DAO {
  static wbName = "商品运营表【史努比】";
  static readWorksheet(wsName, keyToTitle) {
    let data = Workbooks(this.wbName)
      .Sheets(wsName)
      .UsedRange.Value2.filter((subArray) => Boolean(subArray.join("")));
    let titleRow = data.shift();
    let titleIndex = {};
    for (let value of Object.entries(keyToTitle)) {
      if (titleRow.indexOf(value[1]) === -1)
        throw new Error(
          "【" + wsName + "】中没有找到名称为：" + value[1] + " 的列，请检查！",
        );
      titleIndex[value[0]] = titleRow.indexOf(value[1]);
    }
    return data.map((item) => {
      let obj = {};
      for (let value of Object.entries(keyToTitle)) {
        obj[value[0]] = item[titleIndex[value[0]]];
      }
      return obj;
    });
  }
}
