"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var ReusedWebviewPanel_1 = require("./ReusedWebviewPanel");
function stockTrendPic(code, name, stockCode) {
    var panel = ReusedWebviewPanel_1.default.create('stockTrendPicWebview', "\u80A1\u7968\u5B9E\u65F6\u8D70\u52BF(" + code + ")", vscode_1.ViewColumn.One, {
        enableScripts: true,
    });
    var timestamp = new Date().getTime();
    var codeByImgPath = {
        normal: 'https://image.sinajs.cn/newchart',
        usstock: 'https://image.sinajs.cn/newchart/v5/usstock',
        hk_stock: 'http://image.sinajs.cn/newchart/hk_stock',
    };
    var sszsImg = code;
    var imageName = stockCode.toLowerCase();
    var timeK = codeByImgPath.normal + "/min/n/" + imageName + ".gif";
    var dailyK = codeByImgPath.normal + "/daily/n/" + imageName + ".gif";
    var weeklyK = codeByImgPath.normal + "/weekly/n/" + imageName + ".gif";
    var monthlyK = codeByImgPath.normal + "/monthly/n/" + imageName + ".gif";
    // console.log(dailyK);
    if (stockCode.indexOf('hk') === 0) {
        imageName = stockCode.replace('hk', '');
        sszsImg = imageName;
        timeK = codeByImgPath.hk_stock + "/min/" + sszsImg + ".gif?" + timestamp;
        dailyK = codeByImgPath.hk_stock + "/daily/" + sszsImg + ".gif?" + timestamp;
        weeklyK = codeByImgPath.hk_stock + "/weekly/" + sszsImg + ".gif?" + timestamp;
        monthlyK = codeByImgPath.hk_stock + "/monthly/" + sszsImg + ".gif?" + timestamp;
    }
    else if (stockCode.indexOf('gb_') === 0) {
        imageName = stockCode.replace('gb_', '.');
        sszsImg = imageName;
        timeK = codeByImgPath.usstock + "/min/" + sszsImg + ".gif?" + timestamp;
        dailyK = codeByImgPath.usstock + "/daily/" + sszsImg + ".gif?" + timestamp;
        weeklyK = codeByImgPath.usstock + "/weekly/" + sszsImg + ".gif?" + timestamp;
        monthlyK = codeByImgPath.usstock + "/monthly/" + sszsImg + ".gif?" + timestamp;
    }
    else if (stockCode.indexOf('usr_') === 0) {
        imageName = stockCode.replace('usr_', '');
        sszsImg = imageName;
        timeK = codeByImgPath.usstock + "/min/" + sszsImg + ".gif?" + timestamp;
        dailyK = codeByImgPath.usstock + "/daily/" + sszsImg + ".gif?" + timestamp;
        weeklyK = codeByImgPath.usstock + "/weekly/" + sszsImg + ".gif?" + timestamp;
        monthlyK = codeByImgPath.usstock + "/monthly/" + sszsImg + ".gif?" + timestamp;
        // console.log(dailyK);
    }
    panel.webview.html = panel.webview.html = "<html><body style=\"background:#eee;color:#333\">\n  <br/>\n  <p style=\"text-align: center; font-size:18px; width: 400px;margin: 0 auto;\">\u300C" + name + "\u300D\u8D8B\u52BF\u56FE\u3001K\u7EBF\u56FE</p>\n  <a style=\"position: absolute;right: 22px;top: 22px;font-size: 12px;\" href=\"http://quote.eastmoney.com/" + imageName + ".html#fullScreenChart\">\u7F51\u9875\u5168\u5C4F\u67E5\u770B>></a>\n  <hr />\n  <h3 style=\"display:inline-block\">\u5B9E\u65F6\u8D70\u52BF\u56FE</h3><span style=\"margin-left:10px;color:#888;font-size:12px;\" id=\"refreshtime\">&nbsp;</span>\n  <br/><br/>\n  <div style=\"width: 710px;margin:0 auto\"><img class=\"sstrend\" src=\"" + timeK + "\" width=\"700\"/></div>\n  <br/>\n  <h3>\u65E5K\u7EBF\u56FE</h3> <br/>\n  <div style=\"width: 710px;margin:0 auto\"><img src=\"" + dailyK + "\" width=\"700\"/></div>\n  <h3>\u5468K\u7EBF\u56FE</h3> <br/>\n  <div style=\"width: 710px;margin:0 auto\"><img src=\"" + weeklyK + "\" width=\"700\"/></div>\n  <h3>\u6708K\u7EBF\u56FE</h3> <br/>\n  <div style=\"width: 710px;margin:0 auto;margin-bottom:20px\"><img src=\"" + monthlyK + "\" width=\"700\"/></div>\n</body>\n<script>\nvar sstrendImgEl = document.querySelector('.sstrend');\nvar timer=null;\nvar timeK=\"" + timeK + "\";\nvar index=timeK.indexOf('?')\nindex=index===-1?timeK.length:index;\n\nvar code=\"" + code + "\";\nif (timer) {\n  clearInterval(timer);\n  timer = null;\n}\nvar timeElement=document.querySelector('#refreshtime');\ntimeElement.innerText='\u5237\u65B0\u65F6\u95F4\uFF1A'+formatDateTime(new Date());\n\ntimer = setInterval(function () {\n  var refreshTime = new Date();\n  sstrendImgEl.src =timeK.substr(0,index) +'?v=' + refreshTime.getTime();\n  document.querySelector('#refreshtime').innerText='\u5237\u65B0\u65F6\u95F4\uFF1A'+formatDateTime(refreshTime);\n  console.log('\u5237\u65B0\u6570\u636E' + code);\n}, 20000);\n\nfunction formatDateTime(date) {\n  var year = date.getFullYear();\n  var month = date.getMonth() + 1;\n  var day = date.getDate();\n  var hour = date.getHours();\n  var minute = date.getMinutes();\n  var second = date.getSeconds();\n\n  return (\n    [year, month, day]\n      .map((n) => {\n        var m = n.toString();\n        return m[1] ? m : '0' + m;\n      })\n      .join('-') +\n    ' ' +\n    [hour, minute, second]\n      .map((n) => {\n        var m = n.toString();\n        return m[1] ? m : '0' + m;\n      })\n      .join(':')\n  );\n}\n</script>\n</html>";
}
exports.default = stockTrendPic;
//# sourceMappingURL=stockTrendPic.js.map