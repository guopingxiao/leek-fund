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
exports.HolidayHelper = void 0;
var axios_1 = require("axios");
var utils_1 = require("./utils");
var HolidayHelper = /** @class */ (function () {
    function HolidayHelper() {
    }
    /**
     * 根据年份，取出全年节假日情况
     * @param year 年份字符串，如：'2020'
     */
    HolidayHelper.getHolidayDataByYear = function (year) { return __awaiter(void 0, void 0, void 0, function () {
        var url, response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "http://timor.tech/api/holiday/info/" + year;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 2:
                    response = _a.sent();
                    data = response.data;
                    // 返回的结构体如下：
                    // 解释：
                    //   {
                    //     "code": 0,               // 0服务正常。-1服务出错
                    //     "holiday": {
                    //       "10-01": {
                    //         "holiday": true,     // 该字段一定为true
                    //         "name": "国庆节",     // 节假日的中文名。
                    //         "wage": 3,           // 薪资倍数，3表示是3倍工资
                    //         "date": "2018-10-01" // 节假日的日期
                    //       },
                    //       "10-02": {
                    //         "holiday": true,     // 该字段一定为true
                    //         "name": "国庆节",     // 节假日的中文名。
                    //         "wage": 3,           // 薪资倍数，3表示是3倍工资
                    //         "date": "2018-10-01" // 节假日的日期
                    //       }
                    //     }
                    //   }
                    if (!data || data.code !== 0) {
                        throw new Error('year节假日服务器返回-1，服务出错！');
                    }
                    return [2 /*return*/, data];
                case 3:
                    err_1 = _a.sent();
                    console.log(url);
                    console.error(err_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    /**
     * 根据日取出节假日情况
     * @param date 日期
     */
    HolidayHelper.getHolidayDataByDate = function (date) { return __awaiter(void 0, void 0, void 0, function () {
        var url, response, data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "http://timor.tech/api/holiday/info/" + utils_1.formatDate(date);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 2:
                    response = _a.sent();
                    data = response.data;
                    // 返回的结构体如下：
                    // 实例： {"code":0,"type":{"type":0,"name":"周五","week":5},"holiday":null}
                    // 解释：
                    // {
                    //     "code": 0,              // 0服务正常。-1服务出错
                    //     "type": {
                    //       "type": enum(0, 1, 2, 3), // 节假日类型，分别表示 工作日、周末、节日、调休。
                    //       "name": "周六",         // 节假日类型中文名，可能值为 周一 至 周日、假期的名字、某某调休。
                    //       "week": enum(1 - 7)    // 一周中的第几天。值为 1 - 7，分别表示 周一 至 周日。
                    //     },
                    //     "holiday": { // 非节日节点为null
                    //       "holiday": false,     // true表示是节假日，false表示是调休
                    //       "name": "国庆前调休",  // 节假日的中文名。如果是调休，则是调休的中文名，例如'国庆前调休'
                    //       "wage": 1,            // 薪资倍数，1表示是1倍工资
                    //       "after": false,       // 只在调休下有该字段。true表示放完假后调休，false表示先调休再放假
                    //       "target": '国庆节'     // 只在调休下有该字段。表示调休的节假日
                    //     }
                    //   }
                    if (!data || data.code !== 0) {
                        throw new Error('date节假日服务器返回-1，服务出错！');
                    }
                    return [2 /*return*/, data];
                case 3:
                    err_2 = _a.sent();
                    console.log(url);
                    console.error(err_2);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    HolidayHelper.isHolidayInChina = function (date) {
        if (date === void 0) { date = new Date(); }
        return __awaiter(void 0, void 0, void 0, function () {
            var tof, dataObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tof = false;
                        return [4 /*yield*/, HolidayHelper.getHolidayDataByDate(date)];
                    case 1:
                        dataObj = _a.sent();
                        if (dataObj) {
                            tof = dataObj.type.type === 2;
                        }
                        return [2 /*return*/, tof];
                }
            });
        });
    };
    return HolidayHelper;
}());
exports.HolidayHelper = HolidayHelper;
//# sourceMappingURL=holidayHelper.js.map