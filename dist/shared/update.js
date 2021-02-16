"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var axios_1 = require("axios");
var compareVersions = require('compare-versions');
exports.default = (function () {
    var _a;
    var leekFundExt = vscode_1.extensions.getExtension('xiaoguoping.leek-fund');
    var version = (_a = leekFundExt === null || leekFundExt === void 0 ? void 0 : leekFundExt.packageJSON) === null || _a === void 0 ? void 0 : _a.version;
    // tags 没找到分页查询，数据大的时候考虑删除过旧的tags
    console.log('检查版本……');
    axios_1.default.get('https://api.github.com/repos/guopingxiao/leek-fund/tags').then(function (res) {
        var newTag = res.data[0];
        var latestVerion = newTag.name.slice(1);
        console.log('latestVerion=', latestVerion);
        console.log('currentVersion=', version);
        if (compareVersions(version, latestVerion) === -1) {
            vscode_1.window
                .showInformationMessage('检查到 [果子哥理财] 插件有新版本，是否立即升级？', '去升级', '取消')
                .then(function (res) {
                if (res === '去升级') {
                    vscode_1.commands.executeCommand('workbench.extensions.action.listOutdatedExtensions');
                }
            });
        }
    });
});
//# sourceMappingURL=update.js.map