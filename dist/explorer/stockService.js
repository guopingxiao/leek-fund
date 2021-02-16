"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var axios_1 = require("axios");
var iconv_lite_1 = require("iconv-lite");
var vscode_1 = require("vscode");
var globalState_1 = require("../globalState");
var leekTreeItem_1 = require("../shared/leekTreeItem");
var remindNotification_1 = require("../shared/remindNotification");
var typed_1 = require("../shared/typed");
var utils_1 = require("../shared/utils");
var leekService_1 = require("./leekService");
var StockService = /** @class */ (function (_super) {
    __extends(StockService, _super);
    function StockService(context) {
        var _this = _super.call(this) || this;
        _this.stockList = [];
        _this.defaultBarStock = null;
        _this.searchStockKeyMap = {}; // 标记搜索不到记录，避免死循环
        _this.context = context;
        return _this;
    }
    StockService.prototype.getData = function (codes, order) {
        return __awaiter(this, void 0, void 0, function () {
            var url, resp, stockList, _i, codes_1, code, _a, _b, splitData, aStockCount, usStockCount, hkStockCount, noDataStockCount, i, code, params, type, symbol, stockItem, fixedNumber, open, yestclose, price, high, low, open, yestclose, price, high, low, open, yestclose, price, high, low, open, yestclose, price, high, low, yestclose, open, price, treeItem, treeItem, res, oldStockList, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log('fetching stock data…');
                        if ((codes && codes.length === 0) || !codes) {
                            return [2 /*return*/, []];
                        }
                        url = "https://hq.sinajs.cn/list=" + codes.join(',');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, axios_1.default.get(url, {
                                // axios 乱码解决
                                responseType: 'arraybuffer',
                                transformResponse: [
                                    function (data) {
                                        var body = iconv_lite_1.decode(data, 'GB18030');
                                        return body;
                                    },
                                ],
                                headers: utils_1.randHeader(),
                            })];
                    case 2:
                        resp = _c.sent();
                        stockList = [];
                        if (!/FAILED/.test(resp.data)) return [3 /*break*/, 7];
                        if (codes.length === 1) {
                            vscode_1.window.showErrorMessage("fail: error Stock code in " + codes + ", please delete error Stock code");
                            return [2 /*return*/, [
                                    {
                                        id: codes[0],
                                        type: '',
                                        contextValue: 'failed',
                                        isCategory: false,
                                        info: { code: codes[0], percent: '0', name: '错误代码' },
                                        label: codes[0] + ' 错误代码，请查看是否缺少交易所信息',
                                    },
                                ]];
                        }
                        _i = 0, codes_1 = codes;
                        _c.label = 3;
                    case 3:
                        if (!(_i < codes_1.length)) return [3 /*break*/, 6];
                        code = codes_1[_i];
                        _b = (_a = stockList).concat;
                        return [4 /*yield*/, this.getData(new Array(code), order)];
                    case 4:
                        stockList = _b.apply(_a, [_c.sent()]);
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, stockList];
                    case 7:
                        splitData = resp.data.split(';\n');
                        aStockCount = 0;
                        usStockCount = 0;
                        hkStockCount = 0;
                        noDataStockCount = 0;
                        for (i = 0; i < splitData.length - 1; i++) {
                            code = splitData[i].split('="')[0].split('var hq_str_')[1];
                            params = splitData[i].split('="')[1].split(',');
                            type = code.substr(0, 2) || 'sh';
                            symbol = code.substr(2);
                            stockItem = void 0;
                            fixedNumber = 2;
                            if (params.length > 1) {
                                if (/^(sh|sz)/.test(code)) {
                                    open = params[1];
                                    yestclose = params[2];
                                    price = params[3];
                                    high = params[4];
                                    low = params[5];
                                    fixedNumber = utils_1.calcFixedPriceNumber(open, yestclose, price, high, low);
                                    stockItem = {
                                        code: code,
                                        name: params[0],
                                        open: utils_1.formatNumber(open, fixedNumber, false),
                                        yestclose: utils_1.formatNumber(yestclose, fixedNumber, false),
                                        price: utils_1.formatNumber(price, fixedNumber, false),
                                        low: utils_1.formatNumber(low, fixedNumber, false),
                                        high: utils_1.formatNumber(high, fixedNumber, false),
                                        volume: utils_1.formatNumber(params[8], 2),
                                        amount: utils_1.formatNumber(params[9], 2),
                                        time: params[30] + " " + params[31],
                                        percent: '',
                                    };
                                    aStockCount += 1;
                                }
                                else if (/^hk/.test(code)) {
                                    open = params[2];
                                    yestclose = params[3];
                                    price = params[6];
                                    high = params[4];
                                    low = params[5];
                                    fixedNumber = utils_1.calcFixedPriceNumber(open, yestclose, price, high, low);
                                    stockItem = {
                                        code: code,
                                        name: params[1],
                                        open: utils_1.formatNumber(open, fixedNumber, false),
                                        yestclose: utils_1.formatNumber(yestclose, fixedNumber, false),
                                        price: utils_1.formatNumber(price, fixedNumber, false),
                                        low: utils_1.formatNumber(low, fixedNumber, false),
                                        high: utils_1.formatNumber(high, fixedNumber, false),
                                        volume: utils_1.formatNumber(params[12], 2),
                                        amount: utils_1.formatNumber(params[11], 2),
                                        percent: '',
                                    };
                                    hkStockCount += 1;
                                }
                                else if (/^gb_/.test(code)) {
                                    symbol = code.substr(3);
                                    open = params[5];
                                    yestclose = params[26];
                                    price = params[1];
                                    high = params[6];
                                    low = params[7];
                                    fixedNumber = utils_1.calcFixedPriceNumber(open, yestclose, price, high, low);
                                    stockItem = {
                                        code: code,
                                        name: params[0],
                                        open: utils_1.formatNumber(open, fixedNumber, false),
                                        yestclose: utils_1.formatNumber(yestclose, fixedNumber, false),
                                        price: utils_1.formatNumber(price, fixedNumber, false),
                                        low: utils_1.formatNumber(low, fixedNumber, false),
                                        high: utils_1.formatNumber(high, fixedNumber, false),
                                        volume: utils_1.formatNumber(params[10], 2),
                                        amount: '接口无数据',
                                        percent: '',
                                    };
                                    type = code.substr(0, 3);
                                    noDataStockCount += 1;
                                }
                                else if (/^usr_/.test(code)) {
                                    symbol = code.substr(4);
                                    open = params[5];
                                    yestclose = params[26];
                                    price = params[1];
                                    high = params[6];
                                    low = params[7];
                                    fixedNumber = utils_1.calcFixedPriceNumber(open, yestclose, price, high, low);
                                    stockItem = {
                                        code: code,
                                        name: params[0],
                                        open: utils_1.formatNumber(open, fixedNumber, false),
                                        yestclose: utils_1.formatNumber(yestclose, fixedNumber, false),
                                        price: utils_1.formatNumber(price, fixedNumber, false),
                                        low: utils_1.formatNumber(low, fixedNumber, false),
                                        high: utils_1.formatNumber(high, fixedNumber, false),
                                        volume: utils_1.formatNumber(params[10], 2),
                                        amount: '接口无数据',
                                        percent: '',
                                    };
                                    type = code.substr(0, 4);
                                    usStockCount += 1;
                                }
                                if (stockItem) {
                                    yestclose = stockItem.yestclose, open = stockItem.open;
                                    price = stockItem.price;
                                    /*  if (open === price && price === '0.00') {
                                    stockItem.isStop = true;
                                  } */
                                    // 竞价阶段部分开盘和价格为0.00导致显示 -100%
                                    try {
                                        if (Number(open) <= 0) {
                                            price = yestclose;
                                        }
                                    }
                                    catch (err) {
                                        console.error(err);
                                    }
                                    stockItem.showLabel = this.showLabel;
                                    stockItem.isStock = true;
                                    stockItem.type = type;
                                    stockItem.symbol = symbol;
                                    stockItem.updown = utils_1.formatNumber(+price - +yestclose, fixedNumber, false);
                                    stockItem.percent =
                                        (stockItem.updown >= 0 ? '+' : '-') +
                                            utils_1.formatNumber((Math.abs(stockItem.updown) / +yestclose) * 100, 2, false);
                                    treeItem = new leekTreeItem_1.LeekTreeItem(stockItem, this.context);
                                    // if (code === 'sh000001') {
                                    //   sz = treeItem;
                                    // }
                                    // if (statusBarStocks.includes(code)) {
                                    //   barStockList.push(treeItem);
                                    // }
                                    stockList.push(treeItem);
                                }
                            }
                            else {
                                // 接口不支持的
                                noDataStockCount += 1;
                                stockItem = {
                                    id: code,
                                    name: "\u63A5\u53E3\u4E0D\u652F\u6301\u8BE5\u80A1\u7968 " + code,
                                    showLabel: this.showLabel,
                                    isStock: true,
                                    percent: '',
                                    type: 'nodata',
                                    contextValue: 'nodata',
                                };
                                treeItem = new leekTreeItem_1.LeekTreeItem(stockItem, this.context);
                                stockList.push(treeItem);
                            }
                        }
                        res = utils_1.sortData(stockList, order);
                        remindNotification_1.executeStocksRemind(res, this.stockList);
                        oldStockList = this.stockList;
                        this.stockList = res;
                        utils_1.events.emit('stockListUpdate', this.stockList, oldStockList);
                        /* if (barStockList.length === 0) {
                          // 用户没有设置股票时，默认展示上证或第一个
                          barStockList.push(this.defaultBarStock);
                        }
                        this.statusBarStockList = sortData(barStockList, order); */
                        globalState_1.default.aStockCount = aStockCount;
                        globalState_1.default.hkStockCount = hkStockCount;
                        globalState_1.default.usStockCount = usStockCount;
                        globalState_1.default.noDataStockCount = noDataStockCount;
                        return [2 /*return*/, res];
                    case 8:
                        err_1 = _c.sent();
                        console.info(url);
                        console.error(err_1);
                        if (globalState_1.default.showStockErrorInfo) {
                            vscode_1.window.showErrorMessage("fail: Stock error " + url);
                            globalState_1.default.showStockErrorInfo = false;
                            globalState_1.default.telemetry.sendEvent('error: stockService', {
                                url: url,
                                error: err_1,
                            });
                        }
                        return [2 /*return*/, []];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    StockService.prototype.getStockSuggestList = function (searchText, type) {
        if (searchText === void 0) { searchText = ''; }
        if (type === void 0) { type = '2'; }
        return __awaiter(this, void 0, void 0, function () {
            var url, response, text, tempArr, result_1, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!searchText) {
                            return [2 /*return*/, [{ label: '请输入关键词查询，如：0000001 或 上证指数' }]];
                        }
                        url = "http://suggest3.sinajs.cn/suggest/type=" + type + "&key=" + encodeURIComponent(searchText);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('getStockSuggestList: getting...');
                        return [4 /*yield*/, axios_1.default.get(url, {
                                responseType: 'arraybuffer',
                                transformResponse: [
                                    function (data) {
                                        var body = iconv_lite_1.decode(data, 'GB18030');
                                        return body;
                                    },
                                ],
                                headers: utils_1.randHeader(),
                            })];
                    case 2:
                        response = _a.sent();
                        text = response.data.slice(18, -1);
                        if (text.length <= 1 && !this.searchStockKeyMap[searchText]) {
                            this.searchStockKeyMap[searchText] = true;
                            // 兼容一些查询不到的股票，如sz123044
                            return [2 /*return*/, this.getStockSuggestList(searchText, '')];
                        }
                        this.searchStockKeyMap = {};
                        tempArr = text.split(';');
                        result_1 = [];
                        tempArr.forEach(function (item) {
                            var arr = item.split(',');
                            var code = arr[0];
                            if (code.substr(0, 2) === 'of') {
                                // 修改lof以及etf的前缀，防止被过滤
                                // http://www.csisc.cn/zbscbzw/cpbmjj/201212/f3263ab61f7c4dba8461ebbd9d0c6755.shtml
                                // 在上海证券交易所挂牌的证券投资基金使用50～59开头6位数字编码，在深圳证券交易所挂牌的证券投资基金使用15～19开头6位数字编码。
                                code = code.replace(/^(of)(5[0-9])/g, 'sh$2').replace(/^(of)(1[5-9])/g, 'sz$2');
                            }
                            if (code === 'hkhsi' || code === 'hkhscei') {
                                code = code.toUpperCase().replace('HK', 'hk');
                            }
                            // 过滤多余的 us. 开头的股干扰
                            if (typed_1.STOCK_TYPE.includes(code.substr(0, 2)) && !code.startsWith('us.')) {
                                result_1.push({
                                    label: code + " | " + arr[4],
                                    description: arr[7] && arr[7].replace(/"/g, ''),
                                });
                            }
                        });
                        return [2 /*return*/, result_1];
                    case 3:
                        err_2 = _a.sent();
                        console.log(url);
                        console.error(err_2);
                        return [2 /*return*/, [{ label: '查询失败，请重试' }]];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return StockService;
}(leekService_1.LeekService));
exports.default = StockService;
//# sourceMappingURL=stockService.js.map