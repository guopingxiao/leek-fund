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
var vscode_1 = require("vscode");
var fundService_1 = require("../explorer/fundService");
var ReusedWebviewPanel_1 = require("./ReusedWebviewPanel");
var fundRankHtmlTemp = function (list) {
    if (list === void 0) { list = []; }
    var tbody = '';
    var thead = "\n  <thead><tr ><th class=\"colorize\">\u5E8F\u53F7</th><th class=\"colorize\">\u57FA\u91D1\u4EE3\u7801</th><th class=\"colorize\">\u57FA\u91D1\u540D\u79F0</th><th class=\"r_20 colorize\">\u5355\u4F4D\u51C0\u503C</th><th class=\"r_20 colorize\">\u7D2F\u8BA1\u51C0\u503C</th><th class=\"r_20\">\u8FD1\u4E09\u4E2A\u6708(%)</th><th class=\"r_20\">\u8FD1\u516D\u4E2A\u6708(%)</th><th class=\" r_20\">\u8FD1\u4E00\u5E74(%)</th><th class=\"sort_down r_20\">\u4ECA\u5E74\u4EE5\u6765(%)</th><th class=\" r_20\">\u6210\u7ACB\u4EE5\u6765(%)</th></tr></thead>";
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var symbol = item.symbol, name = item.name, three_month = item.three_month, six_month = item.six_month, one_year = item.one_year, form_year = item.form_year, form_start = item.form_start, dwjz = item.dwjz, ljjz = item.ljjz;
        tbody += "<tr class=\"red\">\n    <td class=\"colorize\">" + (i + 1) + "</td>\n    <td class=\"colorize\"><a href=\"http://biz.finance.sina.com.cn/suggest/lookup_n.php?q=" + symbol + "&amp;country=fund\" target=\"_blank\">" + symbol + "</a></td>\n    <td class=\"colorize\"><a href=\"http://biz.finance.sina.com.cn/suggest/lookup_n.php?q=" + symbol + "&amp;country=fund\" target=\"_blank\" title=\"" + name + "\" class=\"name\">" + name + "</a></td>\n    <td class=\"r_20 colorize\">" + dwjz + "</td>\n    <td class=\"r_20 colorize\">" + ljjz + "</td>\n    <td class=\"r_20\">" + three_month + "</td>\n    <td class=\"r_20\">" + six_month + "</td>\n    <td class=\"r_20\">" + one_year + "</td>\n    <td class=\"r_20 sort_down r_20\">" + form_year + "</td>\n    <td class=\"r_20\">" + form_start + "</td>\n    </tr>";
    }
    return "<table boder=\"0\">" + thead + "<tbody>" + tbody + " </tbody></table>";
};
function fundRank() {
    return __awaiter(this, void 0, void 0, function () {
        var list, content, panel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fundService_1.default.getRankFund()];
                case 1:
                    list = _a.sent();
                    content = fundRankHtmlTemp(list);
                    panel = ReusedWebviewPanel_1.default.create('fundRankWebview', '基金排行榜', vscode_1.ViewColumn.One, {
                        enableScripts: true,
                        retainContextWhenHidden: true,
                    });
                    panel.webview.html = "<html>\n  <style>\n  /*\u538B\u7F29\u4E86\uFF0C\u9700\u8981\u6539\u683C\u5F0F\u5316\u518D\u4FEE\u6539*/\n  .bg{background-color:#fff;color:#333}.red{color:Red}table{width:100%;min-width:700px;border-collapse:collapse}.name{display:block;width:140px;height:30px;overflow:hidden}.fblue:visited,.fblue a:visited{color:#800080;text-decoration:none}a{outline:0;text-decoration:none}.table{padding:32px 24px}.table thead th{font-size:15px}.table tbody td,.table tbody th{height:30px;line-height:30px;border-bottom:1px dashed #afafaf;text-align:center}tbody .colorize{color:#333}tbody .sort_up,tbody .sort_down{background-color:#eaf1ff}\n  </style>\n  <body class=\"bg\">\n    <br/>\n    <p style=\"text-align: center; font-size:18px; width: 200px;margin: 0 auto;\">\u57FA\u91D1\u56DE\u62A5\u6392\u884C\u699C\u524D40</p>\n    <p style=\"text-align: center; font-size:14px; width: 200px;margin: 0 auto;margin-top:4px\"><a href=\"http://vip.stock.finance.sina.com.cn/fund_center/index.html#hbphall\" target=\"_blank\">\u67E5\u770B\u66F4\u591A</a></p>\n    <div class=\"table\">\n      " + content + "\n    </div>\n  </body></html>";
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = fundRank;
//# sourceMappingURL=fundRank.js.map