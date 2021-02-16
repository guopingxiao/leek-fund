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
var axios_1 = require("axios");
var vscode_1 = require("vscode");
var ReusedWebviewPanel_1 = require("./ReusedWebviewPanel");
var utils_1 = require("../shared/utils");
var fundHistoryUrl = function (code) {
    return "http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&code=" + code + "&page=1&per=49";
};
function getFundHistoryByCode(code) {
    return __awaiter(this, void 0, void 0, function () {
        var response, idxs, lastIdx, content, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get(fundHistoryUrl(code), {
                            headers: utils_1.randHeader(),
                        })];
                case 1:
                    response = _a.sent();
                    idxs = response.data.indexOf('"<table');
                    lastIdx = response.data.indexOf('</table>"');
                    content = response.data.slice(idxs + 1, lastIdx);
                    // console.log(idxs, lastIdx, content);
                    return [2 /*return*/, { code: code, content: content }];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [2 /*return*/, { code: code, content: '历史净值获取失败' }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function fundHistory(item) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, code, name, res, panel;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = item.info, code = _a.code, name = _a.name;
                    return [4 /*yield*/, getFundHistoryByCode(code)];
                case 1:
                    res = _b.sent();
                    panel = ReusedWebviewPanel_1.default.create('fundHistoryWebview', "\u57FA\u91D1\u5386\u53F2\u51C0\u503C(" + code + ")", vscode_1.ViewColumn.One, {
                        enableScripts: true,
                        retainContextWhenHidden: true,
                    });
                    panel.webview.html = "<html>\n  <style>\n  .lsjz{\n    width: 100%;\n    min-width:600px;\n    text-align: center;\n  }\n  .red{\n    color:red;\n  }\n  .grn{\n    color:green;\n  }\n  .history{padding: 32px 24px;}\n  .trend{\n    width: 700px;\n    margin: 10px auto;\n    text-align: center;\n  }\n  .fund-sstrend{\n    width:700px;\n  }\n  .box {\n    border-top: 1px solid #bababa;\n    padding: 10px;\n    margin-top:20px;\n  }\n  </style>\n  <body>\n\n    <div class=\"history\">\n    <p style=\"text-align: center; font-size:18px; width: 400px;margin: 0 auto;\">\u300C" + name + "\u300D\u5386\u53F2\u51C0\u503C</p>\n    <div class=\"box\">\n    " + res.content + "\n    <p style=\"text-align: center;\">\n    <a href=\"http://fundf10.eastmoney.com/jjjz_" + code + ".html\" target=\"_blank\">\u67E5\u770B\u5168\u90E8\u5386\u53F2\u51C0\u503C\u660E\u7EC6>></a>\n    </p>\n    </div>\n\n    </div>\n  </body></html>";
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = fundHistory;
//# sourceMappingURL=fundHistory.js.map