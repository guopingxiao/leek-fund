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
var globalState_1 = require("../globalState");
var leekTreeItem_1 = require("../shared/leekTreeItem");
var utils_1 = require("../shared/utils");
var leekService_1 = require("./leekService");
var remindNotification_1 = require("../shared/remindNotification");
var FUND_RANK_API = "http://vip.stock.finance.sina.com.cn/fund_center/data/jsonp.php/IO.XSRV2.CallbackList['hLfu5s99aaIUp7D4']/NetValueReturn_Service.NetValueReturnOpen?page=1&num=40&sort=form_year&asc=0&ccode=&type2=0&type3=";
var FundService = /** @class */ (function (_super) {
    __extends(FundService, _super);
    function FundService(context) {
        var _this = _super.call(this) || this;
        _this.fundList = [];
        _this.context = context;
        return _this;
    }
    FundService.prototype.getData = function (fundCodes, order) {
        return __awaiter(this, void 0, void 0, function () {
            var totalAmount_1, totalProfit_1, updateTime_1, _a, Datas, fundAmountObj_1, keyLength_1, data, res, oldFundList, err_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!fundCodes.length) {
                            return [2 /*return*/, []];
                        }
                        console.log('fetching fund data……');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        totalAmount_1 = 0;
                        totalProfit_1 = 0;
                        updateTime_1 = '';
                        return [4 /*yield*/, FundService.qryFundInfo(fundCodes)];
                    case 2:
                        _a = (_b.sent()).Datas, Datas = _a === void 0 ? [] : _a;
                        fundAmountObj_1 = globalState_1.default.fundAmount;
                        keyLength_1 = Object.keys(fundAmountObj_1).length;
                        data = Datas.map(function (item) {
                            var _a, _b, _c, _d, _e;
                            var SHORTNAME = item.SHORTNAME, FCODE = item.FCODE, GSZ = item.GSZ, NAV = item.NAV, PDATE = item.PDATE, GZTIME = item.GZTIME, GSZZL = item.GSZZL, NAVCHGRT = item.NAVCHGRT;
                            var time = item.GZTIME.substr(0, 10);
                            var isUpdated = item.PDATE.substr(0, 10) === time; // 判断闭市的时候
                            var earnings = 0;
                            var amount = 0;
                            var unitPrice = 0;
                            var earningPercent = 0;
                            var profitPercent = 0;
                            var priceDate = '';
                            // 不填写的时候不计算
                            if (keyLength_1) {
                                amount = ((_a = fundAmountObj_1[FCODE]) === null || _a === void 0 ? void 0 : _a.amount) || 0;
                                unitPrice = ((_b = fundAmountObj_1[FCODE]) === null || _b === void 0 ? void 0 : _b.unitPrice) || 0;
                                priceDate = ((_c = fundAmountObj_1[FCODE]) === null || _c === void 0 ? void 0 : _c.priceDate) || '';
                                var price = ((_d = fundAmountObj_1[FCODE]) === null || _d === void 0 ? void 0 : _d.price) || 0;
                                var yestEarnings = ((_e = fundAmountObj_1[FCODE]) === null || _e === void 0 ? void 0 : _e.earnings) || 0;
                                var latestProfit = utils_1.caculateEarnings(amount, price, GSZ);
                                // 闭市的时候显示上一次盈亏
                                earnings = amount === 0 ? 0 : isUpdated ? yestEarnings : latestProfit;
                                profitPercent = (price - unitPrice) / unitPrice;
                                // 收益率
                                earningPercent = utils_1.toFixed(profitPercent, 2, 100);
                            }
                            var obj = {
                                name: SHORTNAME,
                                code: FCODE,
                                price: GSZ,
                                percent: isNaN(Number(GSZZL)) ? NAVCHGRT : GSZZL,
                                yestpercent: NAVCHGRT,
                                yestclose: NAV,
                                showLabel: _this.showLabel,
                                earnings: utils_1.toFixed(earnings),
                                isUpdated: isUpdated,
                                amount: amount,
                                unitPrice: unitPrice,
                                priceDate: priceDate,
                                earningPercent: earningPercent,
                                t2: GSZZL === '--' ? true : false,
                                time: GSZZL === '--' ? PDATE : GZTIME,
                                showEarnings: keyLength_1 > 0 && amount !== 0,
                                yestPriceDate: PDATE,
                            };
                            updateTime_1 = obj.time;
                            totalAmount_1 += amount;
                            totalProfit_1 += earnings;
                            return new leekTreeItem_1.LeekTreeItem(obj, _this.context);
                        });
                        res = utils_1.sortData(data, order);
                        remindNotification_1.executeStocksRemind(res, this.fundList);
                        oldFundList = this.fundList;
                        this.fundList = res;
                        utils_1.events.emit('fundListUpdate', this.fundList, oldFundList);
                        utils_1.events.emit('updateBar:profit-refresh', {
                            fundProfit: utils_1.toFixed(totalProfit_1),
                            fundAmount: utils_1.toFixed(totalAmount_1),
                            fundProfitPercent: utils_1.toFixed(totalProfit_1 / totalAmount_1, 2, 100),
                            priceDate: utils_1.formatDate(updateTime_1),
                        });
                        return [2 /*return*/, this.fundList];
                    case 3:
                        err_1 = _b.sent();
                        console.log(err_1);
                        return [2 /*return*/, this.fundList];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FundService.qryFundInfo = function (fundCodes) {
        var params = {
            pageIndex: 1,
            pageSize: fundCodes.length,
            appType: 'ttjj',
            product: 'EFund',
            plat: 'Android',
            deviceid: globalState_1.default.deviceId,
            Version: 1,
            Fcodes: fundCodes.join(','),
        };
        return new Promise(function (resolve) {
            if (!params.deviceid || !params.Fcodes) {
                resolve([]);
            }
            else {
                var url = 'https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo' + utils_1.objectToQueryString(params);
                axios_1.default.get(url, {
                    headers: utils_1.randHeader(),
                })
                    .then(function (resp) {
                    resolve(resp.data);
                })
                    .catch(function (err) {
                    console.error(err);
                    resolve([]);
                });
            }
        });
    };
    FundService.getRankFund = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, sIndex, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('get ranking fund');
                        url = FUND_RANK_API;
                        return [4 /*yield*/, axios_1.default.get(url, {
                                headers: utils_1.randHeader(),
                            })];
                    case 1:
                        response = _a.sent();
                        sIndex = response.data.indexOf(']({');
                        data = response.data.slice(sIndex + 2, -2);
                        return [2 /*return*/, JSON.parse(data).data || []];
                }
            });
        });
    };
    return FundService;
}(leekService_1.LeekService));
exports.default = FundService;
//# sourceMappingURL=fundService.js.map