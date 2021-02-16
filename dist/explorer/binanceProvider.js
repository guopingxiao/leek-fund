"use strict";
/*
 * @Author: John Trump
 * @Date: 2020-12-04 13:37:18
 * @LastEditors: John Trump
 * @LastEditTime: 2020-12-06 20:14:01
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceProvider = void 0;
var vscode_1 = require("vscode");
var leekConfig_1 = require("../shared/leekConfig");
var BinanceProvider = /** @class */ (function () {
    // TODO: 未完成排序功能
    // private order: SortType;
    function BinanceProvider(service) {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.service = service;
        // this.order = LeekFundConfig.getConfig('leek-fund.binanceSort') || SortType.NORMAL;
    }
    BinanceProvider.prototype.getTreeItem = function (element) {
        return element;
    };
    BinanceProvider.prototype.getChildren = function () {
        var paris = leekConfig_1.LeekFundConfig.getConfig('leek-fund.binance') || [];
        return this.service.getData(paris);
    };
    BinanceProvider.prototype.getParent = function (element) {
        return null;
    };
    /* Implement */
    /** Notify data change then refresh */
    BinanceProvider.prototype.refresh = function () {
        // this.service.getParis();
        this._onDidChangeTreeData.fire(undefined);
    };
    /** Modify order */
    BinanceProvider.prototype.changeOrder = function () {
        // leek-fund.binanceSort
        throw new Error("Method not implemented.");
    };
    return BinanceProvider;
}());
exports.BinanceProvider = BinanceProvider;
//# sourceMappingURL=binanceProvider.js.map