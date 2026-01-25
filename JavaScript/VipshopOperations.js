//货号总表
class VipshopGoods {
  static allVipshopGoods = [];
  constructor({
    listingYear,
    mainSalesSeason,
    applicableGender,
    fourthLevelCategory,
    mainStyle,
    marketingPositioning,
    marketingMemorandum,
    //firstListingTime,
    itemNumber,
    picture,
    offlineReason,
    //costPrice,
    //lowestPrice,
    //silverPrice,
    //userOperations1,
    //userOperations2,
    //unitPriceOfLast7Days,
    stockingMode,
    salesOfTheYearBeforeLast,
    monthlySalesOfLastYearMap,
    dailySalesOfLast60DaysMap,
  }) {
    this.listingYear = listingYear;
    this.mainSalesSeason = mainSalesSeason;
    this.applicableGender = applicableGender;
    this.fourthLevelCategory = fourthLevelCategory;
    this.mainStyle = mainStyle;
    this.marketingPositioning = marketingPositioning;
    this.marketingMemorandum = marketingMemorandum;
    this.itemNumber = itemNumber;
    this.picture = this.picture;
    this.offlineReason = offlineReason;
    this.stockingMode = stockingMode;
    this.salesOfTheYearBeforeLast = salesOfTheYearBeforeLast;
    this.monthlySalesOfLastYearMap = monthlySalesOfLastYearMap;
    this.dailySalesOfLast60DaysMap = dailySalesOfLast60DaysMap;
  }
  get salesAge() {}
  get link() {}
  get activityStatus() {}
  get isPriceBroken() {}
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
class Regularproduct {
  static allRegularproducts = [];
  constructor({
    MID,
    P_SPU,
    productCode,
    itemNumber,
    styleNumber,
    color,
    size,
    thirdLevelCategory,
    sizeStatus,
    itemStatus,
    vipshopPrice,
    finalPrice,
    sellableInventory,
    sellableDays,
  }) {
    this.MID = MID;
    this.P_SPU = P_SPU;
    this.productCode = productCode;
    this.itemNumber = itemNumber;
    this.styleNumber = styleNumber;
    this.color = color;
    this.size = size;
    this.thirdLevelCategory = thirdLevelCategory;
    this.sizeStatus = sizeStatus;
    this.itemStatus = itemStatus;
    this.vipshopPrice = vipshopPrice;
    this.finalPrice = finalPrice;
    this.sellableInventory = sellableInventory;
    this.sellableDays = sellableDays;
  }
}
