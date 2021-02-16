"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundProvider = void 0;
var vscode_1 = require("vscode");
var leekConfig_1 = require("../shared/leekConfig");
var typed_1 = require("../shared/typed");
var FundProvider = /** @class */ (function () {
    function FundProvider(service) {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.service = service;
        this.order = leekConfig_1.LeekFundConfig.getConfig('leek-fund.fundSort') || typed_1.SortType.NORMAL;
    }
    FundProvider.prototype.refresh = function () {
        this._onDidChangeTreeData.fire(undefined);
    };
    FundProvider.prototype.getChildren = function () {
        var fundCodes = leekConfig_1.LeekFundConfig.getConfig('leek-fund.funds') || [];
        return this.service.getData(fundCodes, this.order);
    };
    FundProvider.prototype.getParent = function (element) {
        return null;
    };
    FundProvider.prototype.getTreeItem = function (element) {
        return element;
    };
    FundProvider.prototype.changeOrder = function () {
        var order = this.order;
        /* fix: 如果基金排序先前是按照持仓金额升序/降序, 按涨跌排序失效的问题 */
        if (Math.abs(order) > 1) {
            this.order = typed_1.SortType.NORMAL;
        }
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
        leekConfig_1.LeekFundConfig.setConfig('leek-fund.fundSort', this.order);
        this.refresh();
    };
    FundProvider.prototype.changeAmountOrder = function () {
        var order = this.order;
        if (order === typed_1.SortType.AMOUNTDESC) {
            this.order = typed_1.SortType.AMOUNTASC;
        }
        else if (order === typed_1.SortType.AMOUNTASC) {
            this.order = typed_1.SortType.AMOUNTDESC;
        }
        else {
            this.order = typed_1.SortType.AMOUNTDESC;
        }
        leekConfig_1.LeekFundConfig.setConfig('leek-fund.fundSort', this.order);
        this.refresh();
    };
    return FundProvider;
}());
exports.FundProvider = FundProvider;
//# sourceMappingURL=fundProvider.js.map