"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var globalState_1 = require("../globalState");
var ReusedWebviewPanel;
(function (ReusedWebviewPanel) {
    var webviewPanelsPool = new Map(); // webviewPanel池
    /**
     * 创建webviewPanel
     * @param viewType 唯一标识
     * @param title 标题
     * @param showOptions 显示位置
     * @param options 可选选项
     */
    function create(viewType, title, showOptions, options) {
        if (showOptions === void 0) { showOptions = vscode_1.ViewColumn.Active; }
        var oldPanel = webviewPanelsPool.get(viewType);
        if (oldPanel) {
            oldPanel.title = title;
            oldPanel.reveal();
            return oldPanel;
        }
        var newPanel = vscode_1.window.createWebviewPanel(viewType, title, showOptions, options);
        newPanel.onDidDispose(function () { return webviewPanelsPool.delete(viewType); });
        webviewPanelsPool.set(viewType, newPanel);
        console.log('webviewPanelsPool.size:', webviewPanelsPool.size);
        try {
            globalState_1.default.telemetry.sendEvent(viewType, { title: title });
        }
        catch (err) {
            console.error(err);
        }
        return newPanel;
    }
    ReusedWebviewPanel.create = create;
    /**
     * 销毁webviewPanel
     * @param viewType 唯一标识
     */
    function destroy(viewType) {
        var target = webviewPanelsPool.get(viewType);
        if (target) {
            webviewPanelsPool.delete(viewType);
            // createWebviewPanel是异步的，setTimeout避免创建未完成时调用dispose报错
            setTimeout(function () { return target.dispose(); }, 0);
        }
    }
    ReusedWebviewPanel.destroy = destroy;
})(ReusedWebviewPanel || (ReusedWebviewPanel = {}));
exports.default = ReusedWebviewPanel;
//# sourceMappingURL=ReusedWebviewPanel.js.map