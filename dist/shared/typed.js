"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockCategory = exports.defaultFundInfo = exports.TreeItemType = exports.IconType = exports.SortType = exports.STOCK_TYPE = void 0;
// 支持的股票类型
exports.STOCK_TYPE = ['sh', 'sz', 'hk', 'gb', 'us'];
var SortType;
(function (SortType) {
    SortType[SortType["NORMAL"] = 0] = "NORMAL";
    SortType[SortType["ASC"] = 1] = "ASC";
    SortType[SortType["DESC"] = -1] = "DESC";
    SortType[SortType["AMOUNTASC"] = 2] = "AMOUNTASC";
    SortType[SortType["AMOUNTDESC"] = -2] = "AMOUNTDESC";
})(SortType = exports.SortType || (exports.SortType = {}));
var IconType;
(function (IconType) {
    IconType["ARROW"] = "arrow";
    IconType["FOOD1"] = "food1";
    IconType["FOOD2"] = "food2";
    IconType["FOOD3"] = "food3";
    IconType["ICON_FOOD"] = "iconfood";
})(IconType = exports.IconType || (exports.IconType = {}));
/** Tree Item Type */
var TreeItemType;
(function (TreeItemType) {
    /** 基金 */
    TreeItemType["FUND"] = "fund";
    /** 股票 */
    TreeItemType["STOCK"] = "stock";
})(TreeItemType = exports.TreeItemType || (exports.TreeItemType = {}));
exports.defaultFundInfo = {
    id: '',
    name: '',
    percent: '',
    code: '',
    showLabel: true,
};
var StockCategory;
(function (StockCategory) {
    StockCategory["A"] = "A Stock";
    StockCategory["US"] = "US Stock";
    StockCategory["HK"] = "HK Stock";
    StockCategory["NODATA"] = "Not Support Stock";
})(StockCategory = exports.StockCategory || (exports.StockCategory = {}));
//# sourceMappingURL=typed.js.map