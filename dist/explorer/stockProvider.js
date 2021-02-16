"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockProvider = void 0;
var vscode_1 = require("vscode");
var globalState_1 = require("../globalState");
var leekTreeItem_1 = require("../shared/leekTreeItem");
var typed_1 = require("../shared/typed");
var leekConfig_1 = require("../shared/leekConfig");
var StockProvider = /** @class */ (function () {
    function StockProvider(service) {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.service = service;
        this.order = leekConfig_1.LeekFundConfig.getConfig('leek-fund.stockSort') || typed_1.SortType.NORMAL;
    }
    StockProvider.prototype.refresh = function () {
        this._onDidChangeTreeData.fire(undefined);
    };
    StockProvider.prototype.getChildren = function (element) {
        var _this = this;
        if (!element) {
            // Root view
            var stockCodes = leekConfig_1.LeekFundConfig.getConfig('leek-fund.stocks') || [];
            return this.service.getData(stockCodes, this.order).then(function () {
                return _this.getRootNodes();
            });
        }
        else {
            var resultPromise = Promise.resolve(this.service.stockList || []);
            switch (element.id // First-level
            ) {
                case typed_1.StockCategory.A:
                    return this.getAStockNodes(resultPromise);
                case typed_1.StockCategory.HK:
                    return this.getHkStockNodes(resultPromise);
                case typed_1.StockCategory.US:
                    return this.getUsStockNodes(resultPromise);
                case typed_1.StockCategory.NODATA:
                    return this.getNoDataStockNodes(resultPromise);
                default:
                    return [];
                // return this.getChildrenNodesById(element.id);
            }
        }
    };
    StockProvider.prototype.getParent = function (element) {
        return undefined;
    };
    StockProvider.prototype.getTreeItem = function (element) {
        if (!element.isCategory) {
            return element;
        }
        else {
            return {
                id: element.id,
                label: element.info.name,
                // tooltip: this.getSubCategoryTooltip(element),
                collapsibleState: element.id === typed_1.StockCategory.A
                    ? vscode_1.TreeItemCollapsibleState.Expanded
                    : vscode_1.TreeItemCollapsibleState.Collapsed,
                // iconPath: this.parseIconPathFromProblemState(element),
                command: undefined,
                contextValue: element.contextValue,
            };
        }
    };
    StockProvider.prototype.getRootNodes = function () {
        var nodes = [
            new leekTreeItem_1.LeekTreeItem(Object.assign({ contextValue: 'category' }, typed_1.defaultFundInfo, {
                id: typed_1.StockCategory.A,
                name: "" + typed_1.StockCategory.A + (globalState_1.default.aStockCount > 0 ? "(" + globalState_1.default.aStockCount + ")" : ''),
            }), undefined, true),
            new leekTreeItem_1.LeekTreeItem(Object.assign({ contextValue: 'category' }, typed_1.defaultFundInfo, {
                id: typed_1.StockCategory.HK,
                name: "" + typed_1.StockCategory.HK + (globalState_1.default.hkStockCount > 0 ? "(" + globalState_1.default.hkStockCount + ")" : ''),
            }), undefined, true),
            new leekTreeItem_1.LeekTreeItem(Object.assign({ contextValue: 'category' }, typed_1.defaultFundInfo, {
                id: typed_1.StockCategory.US,
                name: "" + typed_1.StockCategory.US + (globalState_1.default.usStockCount > 0 ? "(" + globalState_1.default.usStockCount + ")" : ''),
            }), undefined, true),
        ];
        // 显示接口不支持的股票，避免用户老问为什么添加了股票没反应
        if (globalState_1.default.noDataStockCount) {
            nodes.push(new leekTreeItem_1.LeekTreeItem(Object.assign({ contextValue: 'category' }, typed_1.defaultFundInfo, {
                id: typed_1.StockCategory.NODATA,
                name: typed_1.StockCategory.NODATA + "(" + globalState_1.default.noDataStockCount + ")",
            }), undefined, true));
        }
        return nodes;
    };
    StockProvider.prototype.getAStockNodes = function (stocks) {
        var aStocks = stocks.then(function (res) {
            var arr = res.filter(function (item) { return /^(sh|sz)/.test(item.type || ''); });
            return arr;
        });
        return aStocks;
    };
    StockProvider.prototype.getHkStockNodes = function (stocks) {
        return stocks.then(function (res) {
            return res.filter(function (item) { return /^(hk)/.test(item.type || ''); });
        });
    };
    StockProvider.prototype.getUsStockNodes = function (stocks) {
        return stocks.then(function (res) {
            return res.filter(function (item) { return /^(usr_)/.test(item.type || ''); });
        });
    };
    StockProvider.prototype.getNoDataStockNodes = function (stocks) {
        return stocks.then(function (res) {
            return res.filter(function (item) {
                return /^(nodata)/.test(item.type || '');
            });
        });
    };
    StockProvider.prototype.changeOrder = function () {
        var order = this.order;
        order += 1;
        if (order > 1) {
            this.order = typed_1.SortType.DESC;
        }
        else if (order === 1) {
            this.order = typed_1.SortType.ASC;
        }
        else if (order === 0) {
            this.order = typed_1.SortType.NORMAL;
        }
        leekConfig_1.LeekFundConfig.setConfig('leek-fund.stockSort', this.order);
        this.refresh();
    };
    return StockProvider;
}());
exports.StockProvider = StockProvider;
//# sourceMappingURL=stockProvider.js.map