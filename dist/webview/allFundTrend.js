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
var ReusedWebviewPanel_1 = require("./ReusedWebviewPanel");
function allFundTrend(service) {
    return __awaiter(this, void 0, void 0, function () {
        var fundList, panel;
        return __generator(this, function (_a) {
            fundList = service.fundList;
            panel = ReusedWebviewPanel_1.default.create('allFundTrendWebview', '基金走势一览', vscode_1.ViewColumn.One, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            panel.webview.html = "<!DOCTYPE html>\n    <html lang=\"en\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <title>\u57FA\u91D1\u8D70\u52BF\u56FE</title>\n        <style>\n           body{background:#fff;color:#333}\n          .header {\n            margin-left: 40px;\n            padding: 4px;\n            height: 30px;\n            line-height: 30px;\n            border-bottom: 1px solid #e8e8e8;\n            font-size: 18px;\n            font-weight: fold;\n          }\n          .list-items {\n            list-style: none;\n            padding:0;\n          }\n          .list-item {\n            cursor: pointer;\n            height: 30px;\n            padding: 4px 8px;\n            line-height: 30px;\n            border-bottom: 1px solid #e8e8e8;\n          }\n          .flex {\n            display: flex;\n          }\n          .list {\n            display: inline-block;\n            max-height:800px;\n            min-width:320px;\n            overflow-y:auto;\n          }\n          .content {\n            display: inline-block;\n            padding-left:10px;\n            padding-right:10px;\n          }\n          img {\n            width: 700px;\n          }\n          .percent {\n            font-size: 24px;\n            font-weight: fond;\n          }\n          .title{\n            font-size:18px;\n            margin:6px 0;\n            color:#1890ff;\n            text-align: center;\n          }\n        </style>\n      </head>\n      <body>\n        <div class=\"flex\">\n          <div class=\"list\">\n            <div class=\"header\">\n              \u57FA\u91D1\u8D70\u52BF\u56FE\n            </div>\n            <ul class=\"list-items\"></ul>\n          </div>\n          <div class=\"content\">\n            <p>\u51C0\u503C\uFF1A<span class=\"percent\">0.00%</span></p>\n            <p class=\"title\">\u5B9E\u65F6\u8D8B\u52BF\u56FE</p>\n            <img\n              class=\"fund-sstrend\"\n              src=\"https://avatars0.githubusercontent.com/u/8676711?s=460&u=b88b7ee37574da3b6aef32da9a5986eb82bc4d11&v=4\"\n              alt=\"\"\n            />\n            <br />\n            <p class=\"title\" style=\"margin-top:6px\">\u5386\u53F2\u8D8B\u52BF\u56FE</p>\n            <img\n              class=\"fund-trend\"\n              src=\"https://xiaoguoping.gallerycdn.vsassets.io/extensions/xiaoguoping/leek-fund/1.1.5/1597052433264/Microsoft.VisualStudio.Services.Icons.Default\"\n              alt=\"\"\n            />\n          </div>\n        </div>\n        <script>\n          var fundList=" + JSON.stringify(fundList) + ";\n          var listEl = document.querySelector('.list');\n          var listItemUlEl = document.querySelector('.list-items');\n          var headerEl = document.querySelector('.header');\n          var childs = listEl.childNodes;\n          listEl.removeChild(listItemUlEl);\n          var listStr = '';\n          var timer=null\n\n          var firstFund = fundList[0].info;\n          for (var j = 0; j < fundList.length; j++) {\n            var info = fundList[j].info;\n            listStr +=\n              '<li class=\"list-item\" data-code=\"' +\n              info.code +\n              '\"  data-percent=\"' +\n              info.percent +\n              '\">' +\n              info.name +\n              '\uFF08' +\n              info.code +\n              '\uFF09' +\n              '</li>';\n          }\n          headerEl.insertAdjacentHTML(\n            'afterend',\n            ' <ul class=\"list-items\">' + listStr + '</ul>'\n          );\n          var trendImgEl = document.querySelector('.fund-trend');\n          var sstrendImgEl = document.querySelector('.fund-sstrend');\n          var percentEl = document.querySelector('.percent');\n          document.querySelector('.list-items').onclick = function (event) {\n            var code = event.target.getAttribute('data-code');\n            var percent = event.target.getAttribute('data-percent');\n            handleClick(code, percent, event.target);\n          };\n          document.querySelector('.list-items').firstChild.click();\n          function handleClick(code, percent, target) {\n            document.querySelector('.list-items').childNodes.forEach((c) => {\n              c.style.background = '#fff';\n              c.style.color = '#333';\n            });\n            target.style.background = '#1890ff';\n            target.style.color = '#fff';\n            sstrendImgEl.src='http://j4.dfcfw.com/charts/pic6/' +\n            code +\n            '.png?v=' +\n            new Date().getTime();\n            trendImgEl.src =\n              'https://image.sinajs.cn/newchart/v5/fund/nav/ss/' +\n              code +\n              '.gif?v=' +\n              new Date().getTime();\n            percentEl.innerHTML = percent + '%';\n            if (percent < 0) {\n              percentEl.style.color = 'green';\n            } else {\n              percentEl.style.color = 'red';\n            }\n\n            if (timer) {\n              clearInterval(timer);\n              timer = null;\n            }\n            timer = setInterval(function () {\n              sstrendImgEl.src =\n                'http://j4.dfcfw.com/charts/pic6/' +\n                code +\n                '.png?v=' +\n                new Date().getTime();\n              console.log('\u5237\u65B0\u6570\u636E' + code);\n            }, 20000);\n          }\n        </script>\n      </body>\n    </html>\n    ";
            return [2 /*return*/];
        });
    });
}
exports.default = allFundTrend;
//# sourceMappingURL=allFundTrend.js.map