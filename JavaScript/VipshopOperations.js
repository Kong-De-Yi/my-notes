function main() {}
//货号总表
class VipshopGoods {
  static keyToTitle = {
    thirdLevelCategory: "三级品类",
    listingYear: "上市年份",
    mainSalesSeason: "主销季节",
    applicableGender: "适用性别",
    fourthLevelCategory: "四级品类",
    mainStyle: "主款式",
    marketingPositioning: "营销定位",
    marketingMemorandum: "营销备忘录",
    firstListingTime: "首次上架时间",
    salesAge: "售龄",
    P_SPU: "P_SPU",
    MID: "MID",
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
    vipshopPrice: "唯品价",
    silverPrice: "白金价",
    finalPrice: "到手价",
    userOperations1: "中台1",
    userOperations2: "中台2",
    firstOrderPrice: "首单价",
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
    stockingMode: "备货模式",
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
  static data = [];

  static getSalesDate() {
    let today = new Date();
    let thisYear = today.getFullYear();
    let thisMonth = today.getMonth();
    this.keyToTitle[thisYear - 2] = thisYear - 2;
    this.keyToTitle[thisYear - 1] = thisYear - 1;
    this.keyToTitle[thisYear] = thisYear;
    for (let i = 1; i <= 12; i++) {
      this.keyToTitle[thisYear - 1 + i.toString().padStart(2, "0")];
    }
    for (let i = 1; i <= thisMonth + 1; i++) {
      this.keyToTitle[thisYear + i.toString().padStart(2, "0")];
    }
    for (let i = 60; i > 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      this.keyToTitle[`${year}/${month}/${day}`] = `${month}/${day}`;
    }
  }
  static initializeData() {
    this.getSalesDate();
    this.data = DAO.readWorksheet("货号总表", this.keyToTitle);
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
  get unitPriceOfLast7Days() {
    return this.salesAmountOfLast7Days / this.salesQuantityOfLast7Days;
  }
  get clickThroughRateOfLast7Days() {
    return this.productDetailsUVOfLast7Days / this.exposureUVOfLast7Days;
  }
  get purchaseRateOfLast7Days() {
    return this.customerCountOfLast7Days / this.productDetailsUVOfLast7Days;
  }
  get addToCartRateOfLast7Days() {
    return this.addToCartUVOfLast7Days / this.productDetailsUVOfLast7Days;
  }
  get rejectAndReturnRateOfLast7Days() {
    return this.rejectAndReturnCountOfLast7Days / this.salesQuantityOfLast7Days;
  }
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
}
class DAO {
  static wbName = "商品运营表【史努比】";
  static readWorksheet(wsName, keyToTitle) {
    let data = Workbooks(this.wbName)
      .Sheets(wsName)
      .UsedRange.Value2.filter((subArray) => Boolean(subArray.join("")));
    let titleRow = data.shift();
    let titleIndex = {};
    const excludedPattern = /^\d{4}$|^\d{6}$|^\d{1,2}\/\d{1,2}$/;
    for (let value of Object.entries(keyToTitle)) {
      if (titleRow.indexOf(value[1]) === -1)
        if (wsName == "货号总表" && excludedPattern.test(value[1].toString())) {
          //排除日期销量的列
        } else {
          throw new Error(
            "【" +
              wsName +
              "】中没有找到名称为：" +
              value[1] +
              " 的列，请检查！",
          );
        }

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
