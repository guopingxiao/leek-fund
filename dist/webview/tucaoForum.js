"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var utils_1 = require("../shared/utils");
var ReusedWebviewPanel_1 = require("./ReusedWebviewPanel");
function tucaoForum() {
    var panel = ReusedWebviewPanel_1.default.create('leek-fund.tucaoForum', '果子哥理财社区', vscode_1.ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
    });
    panel.webview.html = utils_1.getTemplateFileContent('tucao.html', panel.webview);
}
exports.default = tucaoForum;
//# sourceMappingURL=tucaoForum.js.map