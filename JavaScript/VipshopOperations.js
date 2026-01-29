class Main {
  static updateRegularProduct() {
    try {
      RegularProduct.initializeData();
    } catch (err) {
      throw err;
    }

    //向货号总表添加新增的常态货号
    let allRegularProducts = RegularProduct.filterRegularProducts({
      brandSN: VipshopGoods.getBrandSN(),
    });
    allRegularProducts.forEach((item) => {
      let findItem = VipshopGoods.findVipshopGoods({
        itemNumber: item.itemNumber,
      });

      if (!findItem) {
        VipshopGoods.addVipshopGoods(new VipshopGoods(item.itemNumber));
      }
    });

    let allVipshopGoods = VipshopGoods.filterVipshopGoods();
    allVipshopGoods.forEach((item) => {
      let findItem = RegularProduct.findRegularProduct({
        itemNumber: item.itemNumber,
      });

      item.thirdLevelCategory = findItem.thirdLevelCategory;
      item.P_SPU = findItem.P_SPU;
      item.MID = findItem.MID;
      item.styleNumber = findItem.styleNumber;
      item.color = findItem.color;
      item.itemStatus = findItem.itemStatus;
      item.vipshopPrice = findItem.vipshopPrice;
      item.finalPrice = findItem.finalPrice;
      item.sellableDays = findItem.sellableDays;

      let products = RegularProduct.filterRegularProducts({
        itemNumber: item.itemNumber,
      }).sort(RegularProduct.compareBySize);

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
  }

  static updateProductPrice() {
    try {
      ProductPrice.initializeData();
    } catch (err) {
      throw err;
    }

    let allVipshopGoods = VipshopGoods.filterVipshopGoods();
    allVipshopGoods.forEach((item) => {
      let findItem = ProductPrice.findProductPrice({
        itemNumber: item.itemNumber,
      });

      item.designNumber = findItem.designNumber;
      item.picture = findItem.picture;
      item.costPrice = findItem.costPrice;
      item.lowestPrice = findItem.lowestPrice;
      item.silverPrice = findItem.silverPrice;
      item.userOperations1 = findItem.userOperations1;
      item.userOperations2 = findItem.userOperations2;
    });
  }

  static updateInventory() {
    try {
      ComboProduct.initializeData();
      Inventory.initializeData();
    } catch (err) {
      throw err;
    }

    let allVipshopGoods = VipshopGoods.filterVipshopGoods();

    allVipshopGoods.forEach((item) => {
      //成品库存清0
      item.finishedGoodsMainInventory = 0;
      item.finishedGoodsIncomingInventory = 0;
      item.finishedGoodsFinishingInventory = 0;
      item.finishedGoodsOversoldInventory = 0;
      item.finishedGoodsPrepareInventory = 0;
      item.finishedGoodsReturnInventory = 0;
      item.finishedGoodsPurchaseInventory = 0;
      //通货库存清0
      item.generalGoodsMainInventory = 0;
      item.generalGoodsIncomingInventory = 0;
      item.generalGoodsFinishingInventory = 0;
      item.generalGoodsOversoldInventory = 0;
      item.generalGoodsPrepareInventory = 0;
      item.generalGoodsReturnInventory = 0;
      item.generalGoodsPurchaseInventory = 0;

      //找出常态商品中货号对应的条码商品
      let products = RegularProduct.filterRegularProducts({
        itemNumber: item.itemNumber,
      });

      products.forEach((productItem) => {
        //查找条码商品对应的库存
        let findProuctInventory = Inventory.findInventory({
          productCode: productItem.productCode,
        });

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
        //成品合计
        item.finishedGoodsTotalInventory =
          item.finishedGoodsMainInventory +
          item.finishedGoodsIncomingInventory +
          item.finishedGoodsFinishingInventory +
          item.finishedGoodsOversoldInventory +
          item.finishedGoodsPrepareInventory +
          item.finishedGoodsReturnInventory +
          item.finishedGoodsPurchaseInventory;

        //通货库存计算
        let findComboProducts = ComboProduct.filterComboProducts({
          productCode: productItem.productCode,
        });

        if (findComboProducts.length != 0) {
          findComboProducts.forEach((comboProduct) => {
            let findSubProductInventory = Inventory.findInventory({
              productCode: comboProduct.subProductCode,
            });

            if (findSubProductInventory) {
              item.generalGoodsMainInventory +=
                +findSubProductInventory.mainInventory /
                +comboProduct.subProductQuantity;
              item.generalGoodsIncomingInventory +=
                +findSubProductInventory.incomingInventory /
                +comboProduct.subProductQuantity;
              item.generalGoodsFinishingInventory +=
                +findSubProductInventory.finishingInventory /
                +comboProduct.subProductQuantity;
              item.generalGoodsOversoldInventory +=
                +findSubProductInventory.oversoldInventory /
                +comboProduct.subProductQuantity;
              item.generalGoodsPrepareInventory +=
                +findSubProductInventory.prepareInventory /
                +comboProduct.subProductQuantity;
              item.generalGoodsReturnInventory +=
                +findSubProductInventory.returnInventory /
                +comboProduct.subProductQuantity;
              item.generalGoodsPurchaseInventory +=
                +findSubProductInventory.purchaseInventory /
                +comboProduct.subProductQuantity;
            }
          });
        }
        //通货合计
        item.generalGoodsTotalInventory =
          item.generalGoodsMainInventory +
          item.generalGoodsIncomingInventory +
          item.generalGoodsFinishingInventory +
          item.generalGoodsOversoldInventory +
          item.generalGoodsPrepareInventory +
          item.generalGoodsReturnInventory +
          item.generalGoodsPurchaseInventory;
      });
      //合计库存
      item.totalInventory =
        item.finishedGoodsTotalInventory + item.generalGoodsTotalInventory;
    });

    //清空组合商品和商品库存
    ComboProduct.clear();
    Inventory.clear();
  }

  static updateProductSales() {
    try {
      ProductSales.initializeData();
    } catch (err) {
      throw err;
    }

    let today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    startDate.setDate(today.getDate() - 7);
    endDate.setDate(today.getDate() - 1);

    let startDateYear = startDate.getFullYear();
    let startDateMonth = String(startDate.getMonth() + 1).padStart(2, "0");
    let startDateDay = String(startDate.getDate()).padStart(2, "0");
    let endDateYear = endDate.getFullYear();
    let endDateMonth = String(endDate.getMonth() + 1).padStart(2, "0");
    let endDateDay = String(endDate.getDate()).padStart(2, "0");

    let dateOfLast7Days = `${startDateYear}-${startDateMonth}-${startDateDay}~${endDateYear}-${endDateMonth}-${endDateDay}`;

    let styleSalesOfLast7DaysMap = new Map();

    let allVipshopGoods = VipshopGoods.filterVipshopGoods();

    allVipshopGoods.forEach((item) => {
      let findItem = ProductSales.findProductSales({
        itemNumber: item.itemNumber,
        salesDate: dateOfLast7Days,
      });

      if (findItem) {
        item.exposureUVOfLast7Days = +findItem.exposureUV;
        item.productDetailsUVOfLast7Days = +findItem.productDetailsUV;
        item.addToCartUVOfLast7Days = +findItem.addToCartUV;
        item.customerCountOfLast7Days = +findItem.customerCount;
        item.rejectAndReturnCountOfLast7Days = +findItem.rejectAndReturnCount;
        item.salesQuantityOfLast7Days = +findItem.salesQuantity;
        item.salesAmountOfLast7Days = +findItem.salesAmount;

        item.unitPriceOfLast7Days =
          item.salesQuantityOfLast7Days == 0
            ? ""
            : item.salesAmountOfLast7Days / item.salesQuantityOfLast7Days;
        item.clickThroughRateOfLast7Days =
          item.exposureUVOfLast7Days == 0
            ? ""
            : item.productDetailsUVOfLast7Days / item.exposureUVOfLast7Days;
        item.addToCartRateOfLast7Days =
          item.productDetailsUVOfLast7Days == 0
            ? ""
            : item.addToCartUVOfLast7Days / item.productDetailsUVOfLast7Days;
        item.purchaseRateOfLast7Days =
          item.productDetailsUVOfLast7Days == 0
            ? ""
            : item.customerCountOfLast7Days / item.productDetailsUVOfLast7Days;
        item.rejectAndReturnRateOfLast7Days =
          item.salesQuantityOfLast7Days == 0
            ? ""
            : item.rejectAndReturnCountOfLast7Days /
              item.salesQuantityOfLast7Days;

        //近7天款销量
        let styleSalesOfLast7Days = styleSalesOfLast7DaysMap.get(
          item.styleNumber,
        );

        if (!styleSalesOfLast7Days) {
          styleSalesOfLast7DaysMap.set(
            item.styleNumber,
            +findItem.salesQuantity,
          );
        } else {
          styleSalesOfLast7DaysMap.set(
            item.styleNumber,
            styleSalesOfLast7Days + +findItem.salesQuantity,
          );
        }

        item.firstListingTime = findItem.firstListingTime
          ? "'" + findItem.firstListingTime
          : "";
      }

      for (let prop of Object.keys(VipshopGoods.optionalKeyToTitle)) {
        let findItem = ProductSales.findProductSales({
          itemNumber: item.itemNumber,
          salesDate: prop.replace(/^\+/, ""),
        });

        if (findItem) {
          item[prop] = findItem.salesQuantity;
          item.firstListingTime = findItem.firstListingTime
            ? "'" + findItem.firstListingTime
            : "";
        }
      }
    });

    allVipshopGoods.forEach((item) => {
      item.styleSalesOfLast7Days =
        styleSalesOfLast7DaysMap.get(item.styleNumber) ?? 0;
    });

    //清空商品销售表
    ProductSales.clear();
  }

  static outputReport({ splitWs, splitBy } = {}) {
    let allVipshopGoods = VipshopGoods.filterVipshopGoods();
    //默认按7天款销量排序
    allVipshopGoods.sort(VipshopGoods.compareByStyleSalesOfLast7Days);

    if (splitWs) {
      let splitByMap = new Map();

      allVipshopGoods.forEach((item) => {
        if (item[splitBy]) {
          let splitBySet = splitByMap.get(item[splitBy]);
          if (splitBySet) {
            splitBySet.add(item.styleNumber);
          } else {
            splitByMap.set(item[splitBy], new Set());
            splitByMap.get(item[splitBy]).add(item.styleNumber);
          }
        }
      });

      return splitByMap;
    } else {
      return allVipshopGoods;
    }
  }

  static signupActivity() {
    //校验同款不同价
  }
  static signUserOperations() {
    //校验同款不同劵
  }
}

//货号总表
class VipshopGoods {
  static _brandSN = "10000708";
  static _wsName = "货号总表";

  static _keyToTitle = {
    listingYear: "上市年份",
    mainSalesSeason: "主销季节",
    applicableGender: "适用性别",
    fourthLevelCategory: "四级品类",
    mainStyle: "主款式",
    stockingMode: "备货模式",
    marketingPositioning: "营销定位",
    marketingMemorandum: "营销备忘录",
    thirdLevelCategory: "三级品类",
    P_SPU: "P_SPU",
    MID: "MID",
    designNumber: "设计号",
    styleNumber: "款号",
    itemNumber: "货号",
    picture: "图片",
    color: "颜色",
    link: "链接",
    firstListingTime: "首次上架时间",
    salesAge: "售龄",
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
  static _data = [];

  static initializeData() {
    this.optionalKeyToTitle = Utility.generateDateKeyToTitle();
    this._data = DAO.readWorksheet(
      this._wsName,
      this,
      this._keyToTitle,
      this.optionalKeyToTitle,
    );

    //货号去重
    let duplicates = Utility.findDuplicatesByProperty(this._data, [
      "itemNumber",
    ]);
    if (duplicates.length != 0) {
      throw new Error(
        this._wsName +
          "中存在重复的货号：【" +
          duplicates +
          "】，请核查后重试！",
      );
    }
  }

  constructor(itemNumber) {
    this.itemNumber = itemNumber;
  }

  toString() {
    return this.itemNumber;
  }

  static getBrandSN() {
    return this._brandSN;
  }
  static getWsName() {
    return this._wsName;
  }

  get salesAge() {
    return this.firstListingTime
      ? Math.floor(
          (Date.now() - Date.parse(this.firstListingTime)) /
            (24 * 60 * 60 * 1000),
        )
      : "";
  }
  set salesAge(value) {}

  get link() {
    return this.MID
      ? "https://detail.vip.com/detail-1234-" + this.MID + ".html"
      : "";
  }
  set link(value) {}

  get activityStatus() {
    if (this.vipshopPrice && this.finalPrice) {
      return +this.vipshopPrice > +this.finalPrice ? "活动中" : "";
    }
    return "(未知)";
  }
  set activityStatus(value) {}

  get isPriceBroken() {
    if (this.finalPrice && this.lowestPrice) {
      return +this.lowestPrice >= +this.finalPrice ? "" : "是";
    }
    return "(未知)";
  }
  set isPriceBroken(value) {}

  get firstOrderPrice() {
    if (this.finalPrice) return +this.finalPrice - +(this.userOperations1 ?? 0);
  }
  set firstOrderPrice(value) {}

  get superVipPrice() {
    let vipDiscountRate = ProductPrice.getVipDiscountRate(
      VipshopGoods._brandSN,
    );

    let vipDiscountAmount =
      this.finalPrice > 50
        ? Math.round(this.finalPrice * vipDiscountRate)
        : Number((this.finalPrice * vipDiscountRate).toFixed(1)); //超V优惠金额

    return (
      this.finalPrice -
      vipDiscountAmount -
      +(this.userOperations1 ?? 0) -
      +(this.userOperations2 ?? 0)
    );
  }
  set superVipPrice(value) {}

  get profit() {
    return ProductPrice.calProfit(
      VipshopGoods._brandSN,
      +this.costPrice,
      +this.finalPrice,
      +(this.userOperations1 ?? 0),
      +(this.userOperations2 ?? 0),
    );
  }
  set profit(value) {}

  get profitRate() {
    return ProductPrice.calProfitRate(
      VipshopGoods._brandSN,
      +this.costPrice,
      +this.finalPrice,
      +(this.userOperations1 ?? 0),
      +(this.userOperations2 ?? 0),
    );
  }
  set profitRate(value) {}

  //查找单个商品
  static findVipshopGoods(querys) {
    if (querys) {
      return this._data.find((item) => {
        for (let entry of Object.entries(querys)) {
          if (item[entry[0]] != entry[1]) {
            return false;
          }
        }
        return true;
      });
    }
    return undefined;
  }

  //查找符合条件的商品
  static filterVipshopGoods(querys) {
    let filterItems = this._data;
    if (querys) {
      filterItems = this._data.filter((item) => {
        for (let entry of Object.entries(querys)) {
          if (item[entry[0]] != entry[1]) {
            return false;
          }
        }
        return true;
      });
    }

    return filterItems;
  }

  //添加新的商品
  static addVipshopGoods(...items) {
    this._data.push(...items);
  }

  //保存货号总表
  static saveVipshopGoods() {
    this._data.sort(VipshopGoods.compareByFirstListingTime);

    DAO.updateWorksheet(
      this._wsName,
      this._data,
      Object.assign({}, this._keyToTitle, this.optionalKeyToTitle),
    );
  }

  static compareByFirstListingTime(VipshopGoodsA, VipshopGoodsB) {
    // 解析日期为当天开始时间的时间戳
    const parseDate = (dateStr) => {
      const timestamp = Date.parse(dateStr);
      if (isNaN(timestamp)) return 0;

      const date = new Date(timestamp);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    };

    const firstListingTimeA = parseDate(VipshopGoodsA.firstListingTime);
    const firstListingTimeB = parseDate(VipshopGoodsB.firstListingTime);

    // 先比较日期
    if (firstListingTimeA !== firstListingTimeB) {
      return firstListingTimeB - firstListingTimeA;
    }

    // 日期相同再比较款式号（按字符串排序）
    const styleA = String(VipshopGoodsA.styleNumber || "");
    const styleB = String(VipshopGoodsB.styleNumber || "");

    return styleA.localeCompare(styleB);
  }

  static compareByStyleSalesOfLast7Days(VipshopGoodsA, VipshopGoodsB) {
    // 先比较销量
    if (
      VipshopGoodsA.styleSalesOfLast7Days !==
      VipshopGoodsB.styleSalesOfLast7Days
    ) {
      return (
        VipshopGoodsB.styleSalesOfLast7Days -
        VipshopGoodsA.styleSalesOfLast7Days
      );
    }

    // 销量相同再比较款式号（按字符串排序）
    const styleA = String(VipshopGoodsA.styleNumber || "");
    const styleB = String(VipshopGoodsB.styleNumber || "");

    return styleA.localeCompare(styleB);
  }
}

//商品价格
class ProductPrice {
  static _wsName = "商品价格";
  static _keyToTitle = {
    designNumber: "设计号",
    itemNumber: "货号",
    picture: "图片",
    costPrice: "成本价",
    lowestPrice: "最低价",
    silverPrice: "白金价",
    userOperations1: "中台1",
    userOperations2: "中台2",
  };

  static _priceConfig = [
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

  static _data = [];

  static initializeData() {
    this._data = DAO.readWorksheet(this._wsName, this, this._keyToTitle);

    //货号去重
    let duplicates = Utility.findDuplicatesByProperty(this._data, [
      "itemNumber",
    ]);
    if (duplicates.length != 0) {
      throw new Error(
        this._wsName +
          "中存在重复的货号：【" +
          duplicates +
          "】，请核查后重试！",
      );
    }
  }

  static getWsName() {
    return this._wsName;
  }
  //查找单个商品价格
  static findProductPrice(querys) {
    if (querys) {
      return this._data.find((item) => {
        for (let entry of Object.entries(querys)) {
          if (item[entry[0]] != entry[1]) {
            return false;
          }
        }
        return true;
      });
    }
    return undefined;
  }

  //计算利润
  static calProfit(
    brandSN,
    costPrice,
    salesPrice,
    userOperations1 = 0,
    userOperations2 = 0,
  ) {
    let priceInfo = this._priceConfig.find((item) => item.brandSN === brandSN);
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

  //计算利润率
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

  //查询品牌超V折扣率
  static getVipDiscountRate(brandSN) {
    let priceInfo = this._priceConfig.find((item) => item.brandSN == brandSN);
    if (priceInfo) return priceInfo.vipDiscountRate;
    return 0;
  }

  toString() {
    return this.itemNumber;
  }
}

//常态商品
class RegularProduct {
  static _wsName = "常态商品";
  static _keyToTitle = {
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

  static _data = [];

  static initializeData() {
    this._data = DAO.readWorksheet(this._wsName, this, this._keyToTitle);
  }

  static getWsName() {
    return this._wsName;
  }

  //查找单个常态商品
  static findRegularProduct(querys) {
    if (querys) {
      return this._data.find((item) => {
        for (let entry of Object.entries(querys)) {
          if (item[entry[0]] != entry[1]) {
            return false;
          }
        }
        return true;
      });
    }
    return undefined;
  }

  //查找符合条件的常态商品
  static filterRegularProducts(querys) {
    let filterItems = this._data;
    if (querys) {
      filterItems = this._data.filter((item) => {
        for (let entry of Object.entries(querys)) {
          if (item[entry[0]] != entry[1]) {
            return false;
          }
        }
        return true;
      });
    }

    return filterItems;
  }

  static compareBySize(productA, productB) {
    const sizeA = Number(productA.size);
    const sizeB = Number(productB.size);

    if (Number.isNaN(sizeA) || Number.isNaN(sizeB)) {
      return 0;
    }

    return sizeA - sizeB;
  }

  toString() {
    return this.productCode;
  }
}

//组合商品
class ComboProduct {
  static _wsName = "组合商品";
  static _keyToTitle = {
    productCode: "组合商品实体编码",
    subProductCode: "商品编码",
    subProductQuantity: "数量",
  };

  static _date = [];

  static initializeData() {
    this._data = DAO.readWorksheet(this._wsName, this, this._keyToTitle);
  }

  //查找符合条件的子商品
  static filterComboProducts(querys) {
    let filterItems = this._data;
    if (querys) {
      filterItems = this._data.filter((item) => {
        for (let entry of Object.entries(querys)) {
          if (
            item[entry[0]] != entry[1] ||
            item.subProductCode.startsWith("YH") ||
            item.subProductCode.startsWith("FL")
          ) {
            return false;
          }
        }
        return true;
      });
    }

    return filterItems;
  }

  //清空组合商品
  static clear() {
    DAO.clearWorksheet(this._wsName);
  }

  toString() {
    return (
      "组合商品实体编码：【" +
      this.productCode +
      "】,商品编码：【" +
      this.subProductCode +
      "】"
    );
  }
}

//商品库存
class Inventory {
  static _wsName = "商品库存";
  static _keyToTitle = {
    productCode: "商品编码",
    mainInventory: "数量",
    incomingInventory: "进货仓库存",
    finishingInventory: "后整车间",
    oversoldInventory: "超卖车间",
    prepareInventory: "备货车间",
    returnInventory: "销退仓库存",
    purchaseInventory: "采购在途数",
  };

  static _data = [];

  static initializeData() {
    this._data = DAO.readWorksheet(this._wsName, this, this._keyToTitle);
  }

  static getWsName() {
    return this._wsName;
  }

  //查找单个商品的库存
  static findInventory(querys) {
    if (querys) {
      return this._data.find((item) => {
        for (let entry of Object.entries(querys)) {
          if (item[entry[0]] != entry[1]) {
            return false;
          }
        }
        return true;
      });
    }
    return undefined;
  }

  //清空商品库存
  static clear() {
    DAO.clearWorksheet(this._wsName);
  }

  toString() {
    return this.productCode;
  }
}

//商品销售
class ProductSales {
  static _wsName = "商品销售";
  static _keyToTitle = {
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

  static _data = [];

  static initializeData() {
    this._data = DAO.readWorksheet(this._wsName, this, this._keyToTitle);
  }

  static getWsName() {
    return this._wsName;
  }

  //查找单个商品销售
  static findProductSales(querys) {
    if (querys) {
      return this._data.find((item) => {
        for (let entry of Object.entries(querys)) {
          if (item[entry[0]] != entry[1]) {
            return false;
          }
        }
        return true;
      });
    }
    return undefined;
  }

  //查找符合条件的商品销售
  static filterProductSales(querys) {
    let filterItems = this._data;
    if (querys) {
      filterItems = this._data.filter((item) => {
        for (let entry of Object.entries(querys)) {
          if (item[entry[0]] != entry[1]) {
            return false;
          }
        }
        return true;
      });
    }

    return filterItems;
  }

  //清空商品销售
  static clear() {
    DAO.clearWorksheet(this._wsName);
  }

  toString() {
    return "日期：【" + this.salesDate + "】,货号：【" + this.itemNumber + "】";
  }
}

class DAO {
  static _wbName = "商品运营表【史努比】"; //当前工作薄的名称

  static getWbName() {
    return this._wbName;
  }

  static readWorksheet(wsName, objType, keyToTitle, optionalKeyToTitle = {}) {
    let data = Workbooks(this._wbName)
      .Sheets(wsName)
      .UsedRange.Value2.filter((subArray) => Boolean(subArray.join("")));
    let titleRow = data.shift();

    if (!titleRow) {
      throw new Error("【" + wsName + "】中没有任何数据，请更新数据后重试！");
    }

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

  static updateWorksheet(
    wsName,
    data,
    keyToTitle,
    workbook = Workbooks(this._wbName),
  ) {
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

    workbook.Sheets(wsName).Cells.ClearContents();
    workbook
      .Sheets(wsName)
      .Range("A1")
      .Resize(showData.length, showData[0].length).Value2 = showData;
    if (workbook == Workbooks(this._wbName)) {
      Workbooks(this._wbName).Save();
    }
  }

  static clearWorksheet(wsName, workbook = Workbooks(this._wbName)) {
    workbook.Sheets(wsName).Cells.ClearContents();
    if (workbook == Workbooks(this._wbName)) {
      Workbooks(this._wbName).Save();
    }
  }
}
//工具类
class Utility {
  //生成实时日期标题
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
    for (let i = 45; i > 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, 0);
      result[`+${year}-${month}-${day}`] = `'${month}/${day}`;
    }

    return result;
  }

  //检查重复项目
  static findDuplicatesByProperty(data, props) {
    let seen = new Set();
    let duplicates = [];

    data.forEach((item) => {
      let value = props.map((prop) => item[prop]).join("#");

      if (seen.has(value) && value) {
        duplicates.push(item);
      } else {
        seen.add(value);
      }
    });

    return duplicates;
  }
}
