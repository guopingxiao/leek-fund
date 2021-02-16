"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var ReusedWebviewPanel_1 = require("./ReusedWebviewPanel");
var stockTrendPic_1 = require("./stockTrendPic");
function stockTrend(code, name, stockCode) {
    if (['0dji', '0ixic'].includes(code)) {
        return stockTrendPic_1.default(code, name, stockCode);
    }
    stockCode = stockCode.toLowerCase();
    var market = '1';
    if (stockCode.indexOf('hk') === 0) {
        market = '116';
    }
    else if (stockCode.indexOf('gb_') === 0) {
        stockCode = stockCode.replace('gb_', '.');
    }
    else if (stockCode.indexOf('usr_') === 0) {
        stockCode = stockCode.replace('usr_', '');
        market = '105';
    }
    else {
        market = stockCode.substring(0, 2) === 'sh' ? '1' : '0';
    }
    var mcid = market + '.' + code.substr(1);
    // console.log(`http://quote.eastmoney.com/basic/full.html?mcid=${mcid}`);
    var panel = ReusedWebviewPanel_1.default.create('stockTrendWebview', "\u80A1\u7968\u5B9E\u65F6\u8D70\u52BF(" + code + ")", vscode_1.ViewColumn.One, {
        enableScripts: true,
    });
    panel.webview.html = panel.webview.html = "\n  <!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>\u80A1\u7968\u8D70\u52BF</title>\n    <style>\n    html.vscode-dark, body.vscode-dark, html.vscode-high-contrast, body.vscode-high-contrast {\n      filter: invert(100%) hue-rotate(180deg);\n    }\n    </style>\n  </head>\n  <body>\n    <div  style=\"min-width: 1320px; overflow-x:auto\">\n      <iframe\n      src=\"http://quote.eastmoney.com/basic/full.html?mcid=" + mcid + "\"\n      frameborder=\"0\"\n      style=\"width: 100%; height: 900px\"\n    ></iframe>\n    </div>\n  </body>\n</html>\n\n  ";
}
exports.default = stockTrend;
//# sourceMappingURL=stockTrend.js.map