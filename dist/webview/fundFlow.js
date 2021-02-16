"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainFundFlow = void 0;
var vscode_1 = require("vscode");
var utils_1 = require("../shared/utils");
var ReusedWebviewPanel_1 = require("./ReusedWebviewPanel");
function fundFlow(context) {
    var panel = ReusedWebviewPanel_1.default.create('leek-fund.fundFlow', '沪深通资金流向', vscode_1.ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
    });
    panel.webview.html = utils_1.getTemplateFileContent('hsgt.html', panel.webview);
}
function mainFundFlow() {
    var panel = ReusedWebviewPanel_1.default.create('leek-fund.mainFundFlow', '主力资金流向', vscode_1.ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
    });
    panel.webview.html = utils_1.getTemplateFileContent('main-flow.html', panel.webview);
}
exports.mainFundFlow = mainFundFlow;
exports.default = fundFlow;
//# sourceMappingURL=fundFlow.js.map