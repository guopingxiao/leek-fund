"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheFundAmountData = exports.updateAmount = void 0;
var vscode_1 = require("vscode");
var explorer_1 = require("../explorer");
var globalState_1 = require("../globalState");
var leekConfig_1 = require("../shared/leekConfig");
var utils_1 = require("../shared/utils");
var ReusedWebviewPanel_1 = require("./ReusedWebviewPanel");
var cloneDeep = require('lodash.clonedeep');
function setAmount(fundService) {
    return __awaiter(this, void 0, void 0, function () {
        var list, panel;
        return __generator(this, function (_a) {
            list = fundDataHandler(fundService);
            panel = ReusedWebviewPanel_1.default.create('setFundAmountWebview', "\u57FA\u91D1\u6301\u4ED3\u91D1\u989D\u8BBE\u7F6E", vscode_1.ViewColumn.One, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            // Handle messages from the webview
            panel.webview.onDidReceiveMessage(function (message) {
                switch (message.command) {
                    case 'success':
                        console.log(JSON.parse(message.text));
                        setAmountCfgCb(JSON.parse(message.text));
                        return;
                    case 'alert':
                        vscode_1.window.showErrorMessage('保存失败！');
                        return;
                    case 'refresh':
                        var list_1 = fundDataHandler(fundService);
                        // console.log(list);
                        // panel.webview.html = `<h3>loading</h3>`;
                        // getWebviewContent(panel);
                        panel.webview.postMessage({
                            command: 'init',
                            data: list_1,
                            sortType: message.sortType,
                        });
                        return;
                    case 'telemetry':
                        globalState_1.default.telemetry.sendEvent('shareByPicture', { type: message.type });
                        return;
                }
            }, undefined);
            getWebviewContent(panel);
            return [2 /*return*/];
        });
    });
}
function fundDataHandler(fundService) {
    var fundList = cloneDeep(fundService.fundList);
    var amountObj = globalState_1.default.fundAmount || {};
    var list = fundList.map(function (item) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return {
            name: (_a = item.info) === null || _a === void 0 ? void 0 : _a.name,
            code: item.id,
            percent: (_b = item.info) === null || _b === void 0 ? void 0 : _b.percent,
            amount: ((_d = amountObj[(_c = item.info) === null || _c === void 0 ? void 0 : _c.code]) === null || _d === void 0 ? void 0 : _d.amount) || 0,
            earningPercent: (_e = item.info) === null || _e === void 0 ? void 0 : _e.earningPercent,
            unitPrice: (_f = item.info) === null || _f === void 0 ? void 0 : _f.unitPrice,
            priceDate: utils_1.formatDate((_g = item.info) === null || _g === void 0 ? void 0 : _g.time),
            earnings: ((_h = item.info) === null || _h === void 0 ? void 0 : _h.earnings) || 0,
            yestEarnings: ((_j = amountObj[item.info.code]) === null || _j === void 0 ? void 0 : _j.earnings) || 0,
        };
    });
    return list;
}
function getWebviewContent(panel) {
    var _getWebviewResourcesUrl = function (arr) {
        return utils_1.getWebviewResourcesUrl(panel.webview, globalState_1.default.context.extensionUri, arr);
    };
    panel.webview.html = utils_1.getTemplateFileContent('fund-amount.html', panel.webview);
}
function setAmountCfgCb(data) {
    var cfg = {};
    data.forEach(function (item) {
        cfg[item.code] = {
            name: item.name,
            amount: item.amount || 0,
            price: item.price,
            unitPrice: item.unitPrice,
            earnings: item.earnings,
            priceDate: item.priceDate,
        };
    });
    leekConfig_1.LeekFundConfig.setConfig('leek-fund.fundAmount', cfg).then(function () {
        cacheFundAmountData(cfg);
        vscode_1.window.showInformationMessage('保存成功！（没开市的时候添加的持仓盈亏为0，开市时会自动计算）');
    });
}
/**
 * 更新持仓金额
 * @param leekModel
 */
function updateAmount() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var amountObj, codes, filterCodes, _i, codes_1, code, amount, _b, _c, Datas, Expansion, e_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    amountObj = globalState_1.default.fundAmount;
                    codes = Object.keys(amountObj);
                    if (codes.length === 0) {
                        return [2 /*return*/];
                    }
                    filterCodes = [];
                    for (_i = 0, codes_1 = codes; _i < codes_1.length; _i++) {
                        code = codes_1[_i];
                        amount = (_a = amountObj[code]) === null || _a === void 0 ? void 0 : _a.amount;
                        if (amount > 0) {
                            filterCodes.push(code);
                        }
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, explorer_1.FundService.qryFundInfo(filterCodes)];
                case 2:
                    _b = _d.sent(), _c = _b.Datas, Datas = _c === void 0 ? [] : _c, Expansion = _b.Expansion;
                    Datas.forEach(function (item) {
                        var _a, _b, _c;
                        var FCODE = item.FCODE, NAV = item.NAV;
                        var time = item.GZTIME.substr(0, 10);
                        var pdate = item.PDATE.substr(0, 10);
                        var isUpdated = pdate === time; // 判断闭市的时候
                        var money = ((_a = amountObj[FCODE]) === null || _a === void 0 ? void 0 : _a.amount) || 0;
                        var price = ((_b = amountObj[FCODE]) === null || _b === void 0 ? void 0 : _b.price) || 0;
                        var priceDate = ((_c = amountObj[FCODE]) === null || _c === void 0 ? void 0 : _c.priceDate) || '';
                        if (priceDate !== pdate) {
                            var currentMoney = (money / price) * NAV;
                            amountObj[FCODE].amount = utils_1.toFixed(currentMoney);
                            if (isUpdated) {
                                // 闭市的时候保留上一次盈亏值
                                amountObj[FCODE].earnings = utils_1.toFixed(currentMoney - money);
                            }
                            amountObj[FCODE].priceDate = pdate;
                            amountObj[FCODE].price = NAV;
                        }
                    });
                    if (Datas.length > 0) {
                        leekConfig_1.LeekFundConfig.setConfig('leek-fund.fundAmount', amountObj).then(function () {
                            cacheFundAmountData(amountObj);
                            console.log('🐥fundAmount has Updated ');
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _d.sent();
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.updateAmount = updateAmount;
function cacheFundAmountData(amountObj) {
    globalState_1.default.fundAmount = amountObj;
    globalState_1.default.fundAmountCacheDate = utils_1.formatDate(new Date());
}
exports.cacheFundAmountData = cacheFundAmountData;
exports.default = setAmount;
//# sourceMappingURL=setAmount.js.map