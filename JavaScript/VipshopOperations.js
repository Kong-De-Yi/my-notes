class Main {
  static updateRegularProduct() {
    try {
      VipshopGoods.initializeData();
      RegularProduct.initializeData();
    } catch (e) {
      MsgBox(e.message);
      return;
    }

    RegularProduct.data.forEach((item) => {
      let findItem = VipshopGoods.data.find(
        (key) => key.itemNumber === item.itemNumber,
      );
      if (!findItem) {
        VipshopGoods.data.push(new VipshopGoods(item.itemNumber));
      }
    });

    let absentItemNumbers = [];
    VipshopGoods.data.forEach((item) => {
      let findItem = RegularProduct.data.find(
        (key) => key.itemNumber === item.itemNumber,
      );
      if (!findItem) {
        absentItemNumbers.push(item);
      }
    });

    if (absentItemNumbers.length != 0) {
      MsgBox(
        RegularProduct.wsName +
          "中没有找到货号【" +
          absentItemNumbers +
          "】的数据，请检查后重试！",
      );
      return;
    }

    VipshopGoods.data.forEach((item) => {
      let findItem = RegularProduct.data.find(
        (key) => key.itemNumber === item.itemNumber,
      );

      item.thirdLevelCategory = findItem.thirdLevelCategory;
      item.P_SPU = findItem.P_SPU;
      item.MID = findItem.MID;
      item.styleNumber = findItem.styleNumber;
      item.color = findItem.color;
      item.itemStatus = findItem.itemStatus;
      item.vipshopPrice = findItem.vipshopPrice;
      item.finalPrice = findItem.finalPrice;
      item.sellableDays = findItem.sellableDays;
      item.brandSN = findItem.brandSN;

      let products = RegularProduct.data.filter(
        (key) => item.itemNumber === key.itemNumber,
      );
      products.sort(RegularProduct.compare);
      //可售库存
      item.sellableInventory = products.reduce(
        (sum, current) => sum + Number(current.sellableInventory),
        0,
      );

      //是否断码
      item.isOutOfStock = products
        .reduce((sizes, current) => {
          if (
            current.sizeStatus == "尺码上线" &&
            current.sellableInventory == 0
          ) {
            sizes.push(current.size);
          }
          return sizes;
        }, [])
        .join("/");
    });

    DAO.updateWorksheet(
      VipshopGoods.wsName,
      VipshopGoods.data,
      Object.assign(
        {},
        VipshopGoods.keyToTitle,
        VipshopGoods.optionalKeyToTitle,
      ),
    );
  }

  static updateProductPrice() {
    try {
      this.updateRegularProduct();
      ProductPrice.initializeData();
    } catch (e) {
      MsgBox(e.message);
      return;
    }

    let absentItemNumbers = [];
    VipshopGoods.data.forEach((item) => {
      let findItem = ProductPrice.data.find(
        (key) => key.itemNumber === item.itemNumber,
      );
      if (!findItem) {
        absentItemNumbers.push(item);
      }
    });

    if (absentItemNumbers.length != 0) {
      MsgBox(
        ProductPrice.wsName +
          "中没有找到货号【" +
          absentItemNumbers +
          "】的数据，请检查后重试！",
      );
      return;
    }

    VipshopGoods.data.forEach((item) => {
      let findItem = ProductPrice.data.find(
        (key) => key.itemNumber === item.itemNumber,
      );

      item.picture = findItem.picture;
      item.costPrice = findItem.costPrice;
      item.lowestPrice = findItem.lowestPrice;
      item.silverPrice = findItem.silverPrice;
      item.userOperations1 = findItem.userOperations1;
      item.userOperations2 = findItem.userOperations2;
    });

    DAO.updateWorksheet(
      VipshopGoods.wsName,
      VipshopGoods.data,
      Object.assign(
        {},
        VipshopGoods.keyToTitle,
        VipshopGoods.optionalKeyToTitle,
      ),
    );
  }

  static updateInventory() {
    try {
      this.updateRegularProduct();
      ComboProduct.initializeData();
      Inventory.initializeData();
    } catch (e) {
      MsgBox(e.message);
      return;
    }

    VipshopGoods.data.forEach((item) => {
      item.finishedGoodsMainInventory = 0;
      item.finishedGoodsIncomingInventory = 0;
      item.finishedGoodsFinishingInventory = 0;
      item.finishedGoodsOversoldInventory = 0;
      item.finishedGoodsPrepareInventory = 0;
      item.finishedGoodsReturnInventory = 0;
      item.finishedGoodsPurchaseInventory = 0;

      let products = RegularProduct.data.filter(
        (key) => item.itemNumber == key.itemNumber,
      );

      products.forEach((productItem) => {
        let findProuctInventory = Inventory.data.find(
          (key) => key.productCode == productItem.productCode,
        );
        if (findProuctInventory) {
          item.finishedGoodsMainInventory += +findProuctInventory.mainInventory;
          item.finishedGoodsIncomingInventory +=
            +findProuctInventory.incomingInventory;
          item.finishedGoodsFinishingInventory +=
            +findProuctInventory.finishingInventory;
          this.finishedGoodsOversoldInventory +=
            +findProuctInventory.oversoldInventory;
          this.finishedGoodsPrepareInventory +=
            +findProuctInventory.prepareInventory;
          this.finishedGoodsReturnInventory +=
            +findProuctInventory.returnInventory;
          this.finishedGoodsPurchaseInventory +=
            +findProuctInventory.purchaseInventory;
        }
      });
      item.finishedGoodsTotalInventory =
        item.finishedGoodsMainInventory +
        item.finishedGoodsIncomingInventory +
        item.finishedGoodsFinishingInventory +
        item.finishedGoodsOversoldInventory +
        item.finishedGoodsPrepareInventory +
        item.finishedGoodsReturnInventory +
        item.finishedGoodsPurchaseInventory;

      //通货库存计算
    });

    DAO.updateWorksheet(
      VipshopGoods.wsName,
      VipshopGoods.data,
      Object.assign(
        {},
        VipshopGoods.keyToTitle,
        VipshopGoods.optionalKeyToTitle,
      ),
    );
  }
}
//货号总表
class VipshopGoods {
  static wsName = "货号总表";
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
    silverPrice: "白金价",
    userOperations1: "中台1",
    userOperations2: "中台2",
    vipshopPrice: "唯品价",
    finalPrice: "到手价",
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

  static optionalKeyToTitle = {};
  static data = [];
  static initializeData() {
    this.optionalKeyToTitle = Utility.generateDateKeyToTitle();
    this.data = DAO.readWorksheet(
      this.wsName,
      this,
      this.keyToTitle,
      this.optionalKeyToTitle,
    );

    let duplicates = Utility.findDuplicatesByProperty(this.data, "itemNumber");
    if (duplicates.length != 0) {
      throw new Error(
        this.wsName +
          "中存在重复的货号：【" +
          duplicates +
          "】，请核查后重试！",
      );
    }
  }

  static checkData() {}

  constructor(itemNumber) {
    this.itemNumber = itemNumber;
  }

  get salesAge() {
    return this.firstListingTime
      ? Math.floor(
          (Date.now() - Date.parse(this.firstListingTime)) /
            (24 * 60 * 60 * 1000),
        )
      : "";
  }
  set salesAge(value) {
    this._salesAge = value;
  }

  get link() {
    return this.MID
      ? "https://detail.vip.com/detail-1234-" + this.MID + ".html"
      : "";
  }
  set link(value) {
    this._link = value;
  }

  get activityStatus() {
    if (this.vipshopPrice && this.finalPrice) {
      return +this.vipshopPrice > +this.finalPrice ? "活动中" : "";
    }
    return "未知";
  }
  set activityStatus(value) {
    this._activityStatus = value;
  }

  get isPriceBroken() {
    if (this.finalPrice && this.lowestPrice) {
      return +this.lowestPrice >= +this.finalPrice ? "" : "是";
    }
    return "未知";
  }
  set isPriceBroken(value) {
    this._isPriceBroken = value;
  }

  get firstOrderPrice() {
    if (this.finalPrice) return +this.finalPrice - +(this.userOperations1 ?? 0);
  }
  set firstOrderPrice(value) {
    this._firstOrderPrice = value;
  }

  get superVipPrice() {
    let priceInfo = PriceCalculator.priceConfig.find(
      (item) => item.brandSN === this.brandSN,
    );
    if (priceInfo) {
      let vipDiscountAmount =
        this.finalPrice > 50
          ? Math.round(this.finalPrice * priceInfo.vipDiscountRate)
          : Number((this.finalPrice * priceInfo.vipDiscountRate).toFixed(1)); //超V优惠金额

      return (
        this.finalPrice -
        vipDiscountAmount -
        +(this.userOperations1 ?? 0) -
        +(this.userOperations2 ?? 0)
      );
    }
  }
  set superVipPrice(value) {
    this._superVipPrice = value;
  }

  get profit() {
    return PriceCalculator.calProfit(
      this.brandSN,
      +this.costPrice,
      +this.finalPrice,
      +(this.userOperations1 ?? 0),
      +(this.userOperations2 ?? 0),
    );
  }
  set profit(value) {
    this._profit = value;
  }

  get profitRate() {
    return PriceCalculator.calProfitRate(
      this.brandSN,
      +this.costPrice,
      +this.finalPrice,
      +(this.userOperations1 ?? 0),
      +(this.userOperations2 ?? 0),
    );
  }
  set profitRate(value) {
    this._profitRate = value;
  }

  get totalSales() {}
  set totalSales(value) {
    this._totalSales = value;
  }

  static styleSalesOfLast7Days(styleNumber) {}

  toString() {
    return this.itemNumber;
  }
}

//商品价格
class ProductPrice {
  static wsName = "商品价格";
  static keyToTitle = {
    itemNumber: "货号",
    picture: "图片",
    costPrice: "成本价",
    lowestPrice: "最低价",
    silverPrice: "白金价",
    userOperations1: "中台1",
    userOperations2: "中台2",
  };

  static data = [];
  static initializeData() {
    this.data = DAO.readWorksheet(this.wsName, this, this.keyToTitle);
  }
}

//常态商品
class RegularProduct {
  static wsName = "常态商品";
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
  static initializeData() {
    this.data = DAO.readWorksheet(this.wsName, this, this.keyToTitle);
  }

  static compare(productA, productB) {
    const sizeA = Number(productA.size);
    const sizeB = Number(productB.size);

    if (Number.isNaN(sizeA) || Number.isNaN(sizeB)) {
      return 0;
    }

    return sizeA - sizeB;
  }
}

//组合商品
class ComboProduct {
  static wsName = "组合商品";
  static keyToTitle = {
    productCode: "组合商品实体编码",
    subProductCode: "商品编码",
    subProductQuantity: "数量",
  };

  static date = [];
  static initializeData() {
    this.data = DAO.readWorksheet(this.wsName, this, this.keyToTitle);
  }
}

//商品库存
class Inventory {
  static wsName = "商品库存";
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
  static initializeData() {
    this.data = DAO.readWorksheet(this.wsName, this, this.keyToTitle);
  }
}

//商品销售
class ProductSales {
  static wsName = "商品销售";
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
  static initializeData() {
    this.data = DAO.readWorksheet(this.wsName, this, this.keyToTitle);
  }
}

class PriceCalculator {
  static priceConfig = [
    {
      brandSN: "10016178",
      brand: "LAVI",
      packagingFee: 1.5, //发货打包费
      shippingCost: 1.5, //发货运费
      returnRate: 0.3, //退货率
      returnProcessingFee: 1.8, //退货整理费
      vipDiscountRate: 0.05, //超V优惠比例
      vipDiscountBearingRatio: 0.6, //超V优惠商家承担比例
      platformCommission: 0.3, //平台扣点
      brandCommission: 0.07, //品牌回款扣点
    },
    {
      brandSN: "10015023",
      brand: "巴帝巴帝",
      packagingFee: 1.5, //发货打包费
      shippingCost: 1.5, //发货运费
      returnRate: 0.3, //退货率
      returnProcessingFee: 1.8, //退货整理费
      vipDiscountRate: 0.05, //超V优惠比例
      vipDiscountBearingRatio: 0.6, //超V优惠商家承担比例
      platformCommission: 0.25, //平台扣点
      brandCommission: 0.12, //品牌回款扣点
    },
    {
      brandSN: "10000708",
      brand: "史努比",
      packagingFee: 1.5, //发货打包费
      shippingCost: 1.5, //发货运费
      returnRate: 0.3, //退货率
      returnProcessingFee: 1.8, //退货整理费
      vipDiscountRate: 0.02, //超V优惠比例
      vipDiscountBearingRatio: 0, //超V优惠商家承担比例
      platformCommission: 0.3, //平台扣点
      brandCommission: 0.11, //品牌回款扣点
    },
    {
      brandSN: "10000782",
      brand: "小猪班纳",
      packagingFee: 1.5, //发货打包费
      shippingCost: 1.5, //发货运费
      returnRate: 0.3, //退货率
      returnProcessingFee: 1.8, //退货整理费
      vipDiscountRate: 0.05, //超V优惠比例
      vipDiscountBearingRatio: 0.6, //超V优惠商家承担比例
      platformCommission: 0.27, //平台扣点
      brandCommission: 0.1, //品牌回款扣点
    },
  ];

  static calProfit(
    brandSN,
    costPrice,
    salesPrice,
    userOperations1 = 0,
    userOperations2 = 0,
  ) {
    let priceInfo = this.priceConfig.find((item) => item.brandSN === brandSN);
    if (!priceInfo) {
      throw new Error("没有找到品牌SN【" + brandSN + "】的价格信息，请核实！");
    }

    const packagingFee = 1.5; //发货打包费
    const shippingCost = 1.5; //发货运费
    const returnRate = 0.3; //退货率
    const returnProcessingFee = 1.8; //退货整理费
    const vipDiscountRate = priceInfo.vipDiscountRate; //超V优惠比例
    const vipDiscountBearingRatio = priceInfo.vipDiscountBearingRatio; //超V优惠商家承担比例
    const platformCommission = priceInfo.platformCommission; //平台扣点
    const brandCommission = priceInfo.brandCommission; //品牌回款扣点

    let vipDiscountAmount =
      salesPrice > 50
        ? Math.round(salesPrice * vipDiscountRate)
        : Number((salesPrice * vipDiscountRate).toFixed(1)); //超V优惠金额

    let priceAfterCoupon = salesPrice - userOperations1 - userOperations2;

    let profit =
      priceAfterCoupon -
      costPrice -
      packagingFee -
      shippingCost -
      (1 / (1 - returnRate) - 1) * (packagingFee + shippingCost) -
      returnRate * returnProcessingFee -
      vipDiscountAmount * vipDiscountBearingRatio -
      priceAfterCoupon * platformCommission -
      (priceAfterCoupon * (1 - platformCommission) -
        vipDiscountAmount * vipDiscountBearingRatio) *
        brandCommission;

    return Number(profit.toFixed(2));
  }

  static calProfitRate(
    brandSN,
    costPrice,
    salesPrice,
    userOperations1 = 0,
    userOperations2 = 0,
  ) {
    let profit = this.calProfit(
      brandSN,
      costPrice,
      salesPrice,
      userOperations1,
      userOperations2,
    );
    return Number((profit / costPrice).toFixed(5));
  }
}

//更新记录
class UpdateRecord {
  static wsName = "更新记录";
  static keyToTitle = { wsName: "工作表", updateTime: "更新时间" };

  static data = [];
  static initializeData() {
    this.data = DAO.readWorksheet(this.wsName, this, this.keyToTitle);
  }
}

class DAO {
  static wbName = "商品运营表【史努比】"; //当前工作薄的名称

  static readWorksheet(wsName, objType, keyToTitle, optionalKeyToTitle = {}) {
    let data = Workbooks(this.wbName)
      .Sheets(wsName)
      .UsedRange.Value2.filter((subArray) => Boolean(subArray.join("")));
    let titleRow = data.shift();
    let titleIndex = {};

    for (let entry of Object.entries(keyToTitle)) {
      if (!titleRow.includes(entry[1]))
        throw new Error(
          "【" + wsName + "】中没有找到名称为：" + entry[1] + " 的列，请检查！",
        );

      titleIndex[entry[0]] = titleRow.indexOf(entry[1]);
    }

    for (let entry of Object.entries(optionalKeyToTitle)) {
      if (titleRow.includes(entry[1].replace(/^'/, "")))
        titleIndex[entry[0]] = titleRow.indexOf(entry[1].replace(/^'/, ""));
    }

    return data.map((item) => {
      let obj = new objType();
      for (let key of Object.keys(titleIndex)) {
        obj[key] = item[titleIndex[key]];
      }
      return obj;
    });
  }

  static updateWorksheet(wsName, data, keyToTitle) {
    let titleRow = [];
    let showData = [];

    for (let title of Object.values(keyToTitle)) {
      titleRow.push(title);
    }
    showData.push(titleRow);

    data.forEach((item) => {
      let dataRow = [];
      for (let key of Object.keys(keyToTitle)) {
        dataRow.push(item[key]);
      }
      showData.push(dataRow);
    });

    Workbooks(this.wbName).Sheets(wsName).Cells.ClearContents();
    Workbooks(this.wbName)
      .Sheets(wsName)
      .Range("A1")
      .Resize(showData.length, showData[0].length).Value2 = showData;
  }

  static createWorkbook() {}
}
//工具类
class Utility {
  static generateDateKeyToTitle() {
    let result = {};

    let today = new Date();
    let thisYear = today.getFullYear();
    let thisMonth = today.getMonth();

    result["+" + (thisYear - 2)] = `'${thisYear - 2}`;
    result["+" + (thisYear - 1)] = `'${thisYear - 1}`;
    result["+" + thisYear] = `'${thisYear}`;

    for (let i = 1; i <= 12; i++) {
      result["+" + (thisYear - 1) + i.toString().padStart(2, "0")] =
        `'${thisYear - 1}` + i.toString().padStart(2, "0");
    }
    for (let i = 1; i <= thisMonth + 1; i++) {
      result["+" + thisYear + i.toString().padStart(2, "0")] =
        `'${thisYear}` + i.toString().padStart(2, "0");
    }
    for (let i = 60; i > 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      result[`${year}/${month}/${day}`] = `'${month}/${day}`;
    }

    return result;
  }
  //检查重复项目
  static findDuplicatesByProperty(data, prop) {
    let seen = new Set();
    let duplicates = [];

    data.forEach((item) => {
      let value = item[prop];
      if (seen.has(value)) {
        duplicates.push(item);
      } else {
        seen.add(value);
      }
    });

    return duplicates;
  }
}
