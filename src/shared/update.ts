import { commands, extensions, window } from 'vscode';
import axios from 'axios';
const compareVersions = require('compare-versions');

export default () => {
  const leekFundExt = extensions.getExtension('xiaoguoping.leek-fund');
  const version = leekFundExt?.packageJSON?.version;

  // tags 没找到分页查询，数据大的时候考虑删除过旧的tags
  console.log('检查版本……');
  axios.get('https://api.github.com/repos/guopingxiao/leek-fund/tags').then((res) => {
    const newTag = res.data[0];
    const latestVerion = newTag.name.slice(1);
    console.log('latestVerion=', latestVerion);
    console.log('currentVersion=', version);
    if (compareVersions(version, latestVerion) === -1) {
      window
        .showInformationMessage('检查到 [果子哥理财] 插件有新版本，是否立即升级？', '去升级', '取消')
        .then((res) => {
          if (res === '去升级') {
            commands.executeCommand('workbench.extensions.action.listOutdatedExtensions');
          }
        });
    }
  });
};
