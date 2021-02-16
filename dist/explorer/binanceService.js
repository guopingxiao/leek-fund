"use strict";
/*
 * @Author: John Trump
 * @Date: 2020-12-04 13:37:38
 * @LastEditors: John Trump
 * @LastEditTime: 2021-01-26 23:14:24
 */
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
var globalState_1 = require("../globalState");
var leekTreeItem_1 = require("../shared/leekTreeItem");
var typed_1 = require("../shared/typed");
var utils_1 = require("../shared/utils");
var leekService_1 = require("./leekService");
var BinanceService = /** @class */ (function (_super) {
    __extends(BinanceService, _super);
    function BinanceService(context) {
        var _this = _super.call(this) || this;
        _this.parisUrl = 'https://api.binance.com/api/v1/exchangeInfo';
        _this.ticker24hrUrl = 'https://api.binance.com/api/v1/ticker/24hr';
        _this.context = context;
        return _this;
    }
    /** 获取支持的交易对 */
    BinanceService.prototype.getParis = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this.parisUrl, {
                            headers: utils_1.randHeader(),
                        }).catch(function (err) {
                            globalState_1.default.telemetry.sendEvent('error: binanceService', {
                                url: _this.parisUrl,
                                error: err,
                            });
                        })];
                    case 1:
                        res = _b.sent();
                        if (res && res.data) {
                            return [2 /*return*/, (_a = res.data.symbols) === null || _a === void 0 ? void 0 : _a.map(function (i) { return i.baseAsset + "_" + i.quoteAsset; })];
                        }
                        return [2 /*return*/, ['']];
                }
            });
        });
    };
    BinanceService.prototype._fetchPairData = function (symbolWithSplit) {
        return __awaiter(this, void 0, void 0, function () {
            var symbol, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        symbol = symbolWithSplit.split('_').join('');
                        _a = {};
                        return [4 /*yield*/, axios_1.default.get(this.ticker24hrUrl, {
                                params: { symbol: symbol },
                                headers: utils_1.randHeader(),
                            }).catch(function (err) {
                                globalState_1.default.telemetry.sendEvent('error: binanceService', {
                                    url: _this.ticker24hrUrl,
                                    error: err,
                                });
                            })];
                    case 1: return [2 /*return*/, (_a.data = _b.sent(),
                            _a.symbol = symbolWithSplit,
                            _a)];
                }
            });
        });
    };
    BinanceService.prototype.getData = function (codes) {
        return __awaiter(this, void 0, void 0, function () {
            var pairList, promises, results, _i, results_1, item, _a, status, _b, value, data, symbol, obj, symbol, obj;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        pairList = [];
                        promises = codes.map(function (i) { return _this._fetchPairData(i); });
                        /* Shim for Promise.allSettled */
                        if (!Promise.allSettled) {
                            // @ts-ignore
                            Promise.allSettled = function (promises) {
                                var wrappedPromises = promises.map(function (p) {
                                    return Promise.resolve(p).then(function (val) { return ({ status: 'fulfilled', value: val }); }, function (err) { return ({ status: 'rejected', reason: err }); });
                                });
                                return Promise.all(wrappedPromises);
                            };
                        }
                        return [4 /*yield*/, Promise.allSettled(promises)];
                    case 1:
                        results = _c.sent();
                        // console.log('results=', results);
                        for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                            item = results_1[_i];
                            _a = item || {}, status = _a.status, _b = _a.value, value = _b === void 0 ? {} : _b;
                            if (status === 'fulfilled' && value.data) {
                                data = value.data.data, symbol = value.symbol;
                                obj = {
                                    id: symbol,
                                    code: '',
                                    name: symbol,
                                    price: data.lastPrice,
                                    open: data.openPrice,
                                    yestclose: data.prevClosePrice,
                                    volume: data.volume,
                                    amount: data.quoteVolume,
                                    percent: data.priceChangePercent,
                                    updown: data.priceChange,
                                    high: data.highPrice,
                                    low: data.lowPrice,
                                    showLabel: this.showLabel,
                                    _itemType: typed_1.TreeItemType.BINANCE,
                                };
                                pairList.push(new leekTreeItem_1.LeekTreeItem(obj, this.context));
                            }
                            else {
                                symbol = value.symbol;
                                obj = {
                                    id: symbol,
                                    code: '',
                                    percent: '0',
                                    name: symbol + '网络错误',
                                    showLabel: this.showLabel,
                                    _itemType: typed_1.TreeItemType.BINANCE,
                                };
                                pairList.push(new leekTreeItem_1.LeekTreeItem(obj, this.context));
                            }
                        }
                        return [2 /*return*/, pairList];
                }
            });
        });
    };
    return BinanceService;
}(leekService_1.LeekService));
exports.default = BinanceService;
//# sourceMappingURL=binanceService.js.map