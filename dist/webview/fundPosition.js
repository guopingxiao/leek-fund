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
var fundPositionUrl = function (code) {
    return " http://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jjcc&code=" + code + "&topline=10&year=&month=&rt=0." + Date.now();
};
function getFundPositionByCode(code) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get(fundPositionUrl(code), {
                            headers: utils_1.randHeader(),
                        })];
                case 1:
                    response = _a.sent();
                    data = response.data.slice(12, -1);
                    data = data
                        .replace('content', '"content"')
                        .replace('arryear', '"arryear"')
                        .replace('curyear', '"curyear"')
                        .replace(/href='\/\//g, "href='http://")
                        .replace(/href='ccbdxq/g, "href='http://fundf10.eastmoney.com/ccbdxq")
                        .replace("onclick='LoadMore(this,6,LoadStockPos)'", "href='http://fundf10.eastmoney.com/ccmx_" + code + ".html'")
                        .replace("onclick='LoadMore(this,3,LoadStockPos)'", "href='http://fundf10.eastmoney.com/ccmx_" + code + ".html'");
                    return [2 /*return*/, JSON.parse(data).content];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [2 /*return*/, '历史净值获取失败'];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function fundPosition(item) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, code, name, content, panel;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = item.info, code = _a.code, name = _a.name;
                    return [4 /*yield*/, getFundPositionByCode(code)];
                case 1:
                    content = _b.sent();
                    panel = ReusedWebviewPanel_1.default.create('fundPositionWebview', "\u57FA\u91D1\u6301\u4ED3(" + code + ")", vscode_1.ViewColumn.One, {
                        enableScripts: true,
                        retainContextWhenHidden: true,
                    });
                    panel.webview.html = "<html>\n  <style>\n  .box {\n    border-top: 1px solid #bababa;\n    padding: 5px;\n    margin-top:20px;\n    margin-bottom:20px;\n  }\n  .w790 {\n    width: 790px;\n    margin: 0 auto;\n}\n.hide{\n  display:none;\n}\n.boxitem h4.t {\n  position: relative;\n  height: 42px;\n  background-position: -1px -46px;\n  width: 790px\n}\n\n.boxitem h4 label {\n  position: absolute;\n  top: 15px;\n  left: 30px;\n  font-size: 14px;\n  font-weight: 700;\n  display: inline-block;\n  word-wrap: normal;\n  white-space: nowrap\n}\n\n.boxitem h4 label.lab2,.boxitem h4 ul.lab2 {\n  position: absolute;\n  left: 405px;\n  top: 10px;\n  z-index: 10;\n  font-size: 12px;\n  font-weight: 400\n}\n\n.boxitem h4 label.xq405,.boxitem h4 ul.xq405 {\n  left: 380px;\n  width: 400px\n}\n\n.boxitem h4 label.xq505,.boxitem h4 ul.xq505 {\n  left: 550px\n}\n\n.boxitem h4 ul.xq405 th {\n  font-size: 12px\n}\n\n.boxitem h4 label.xq656,.boxitem h4 ul.xq656 {\n  left: 656px;\n  top: 10px\n}\n\n.boxitem h4 label.xq730,.boxitem h4 ul.xq730 {\n  left: 730px;\n  padding-top: 5px\n}\n\n.boxitem h4.t label img {\n  vertical-align: middle;\n  border: 0\n}\n\n.boxitem h4.t .FLTip {\n  width: 450px;\n  position: absolute;\n  z-index: 9999;\n  text-align: left;\n  display: none;\n  margin: 33px 0 0 40px\n}\n\n.boxitem .tabul li,.jl_intro .text,.jl_intro img {\n  display: inline;\n  float: left\n}\n\n.boxitem h4.t .tipbox {\n  font: 16px \"\u5B8B\u4F53\";\n  margin-left: 25%;\n  position: absolute\n}\n\n.jdzfnew ul li.pmbd font,.jz_tab h4 .jzr span,table.jdmx td font {\n  font-family: \"\u5B8B\u4F53\"\n}\n\n.boxitem h4.t .tipbox em,.boxitem h4.t .tipbox span {\n  font-style: normal;\n  width: 15px;\n  line-height: 21px;\n  height: 10px;\n  overflow: hidden;\n  position: absolute;\n  color: #f2c87e\n}\n\n.boxitem h4.t .tipbox span {\n  color: #fff;\n  top: 1px;\n  margin: 0\n}\n\n.boxitem h4.t .FLTip .box {\n  width: auto;\n  background: #fffbed;\n  border: 1px solid #f2c87e;\n  padding: 10px;\n  margin-top: 10px;\n  box-shadow: 2px 3px 2px #DDD;\n  border-radius: 6px;\n  line-height: 1.8;\n  font-weight: 400;\n  font-size: 12px\n}\n\n.boxitem h4.t input,.boxitem h4.t span,.boxitem h4.t strong {\n  display: inline;\n  float: left;\n  vertical-align: middle;\n  border: none\n}\n\n.boxitem h4.t span,.boxitem h4.t strong {\n  margin: 3px 0;\n  font-weight: 400\n}\n\n.boxitem h4.t span.cal {\n  margin: 2px 5px 0 2px;\n  width: 14px;\n  height: 16px;\n  background-position: -245px -177px;\n  cursor: pointer\n}\n\n.boxitem h4.t input.text {\n  width: 80px;\n  height: 18px;\n  overflow: hidden;\n  border: 1px solid #68a3cb\n}\n\n.boxitem .tabul {\n  margin-top: 1px;\n  height: 30px\n}\n\n.boxitem .tabul li {\n  width: 106px;\n  padding-top: 2px;\n  height: 30px;\n  line-height: 30px;\n  vertical-align: middle;\n  text-align: center;\n  overflow: hidden;\n  background-position: -596px -88px;\n  font-weight: 400;\n  cursor: pointer\n}\n\n.boxitem .tabul li.at {\n  background-position: -489px -88px;\n  color: #fff\n}\n\n.boxitem p {\n  font-size: 12px;\n  padding: 0;\n  line-height: 1.6\n}\ntable.comm {\n  border: none;\n  font-size: 14px;\n  width: 100%;\n}\n\ntable.comm thead {\n  border: none;\n  background-position: 0 -128px\n}\n\ntable.comm th {\n  width: auto;\n  height: 30px;\n  line-height: 30px;\n  vertical-align: middle;\n}\n.comm tbody tr{\n  text-align:center;\n}\ntable.jjcc,table.jndxq,table.tzxq {\n  margin: 10px auto 5px\n}\n.txt_in table,.txt_in td,.txt_in th {\n  text-align: center;\n  font-size: 14px\n}\n\n.txt_in th {\n  height: 30px;\n  line-height: 30px;\n  vertical-align: middle;\n  font-weight: 400\n}\n\n.txt_in td {\n  height: 28px;\n  line-height: 28px;\n  vertical-align: middle\n}\n\n.txt_in td.cz,.txt_in th.cz {\n  width: 60px\n}\n\ntable.jlchg {\n  margin: 10px auto 5px\n}\n\ntable.jlchg th {\n  width: 20%\n}\n\ntable.jlchg .tor {\n  text-align: right;\n  padding-right: 50px\n}\n.xglj .red{\n  color:#bababa;\n}\n  .red{\n    color:red;\n  }\n  .grn{\n    color:green;\n  }\n  .history{padding: 32px 24px;}\n  .trend{\n    width: 700px;\n    margin: 10px auto;\n    text-align: center;\n  }\n  .fund-sstrend{\n    width:700px;\n  }\n\n.die {\n  color: #097C25\n}\n\n.zhang {\n  color: #DC0000\n}\n\n.ping {\n  color: #eee\n}\n.tfoot{\n  text-align: center;\n    margin-top: 10px;\n}\n#container{\n  width:800px;\n  margin:0 auto;\n}\n  </style>\n  <body>\n    <br/>\n    <p style=\"text-align: center; font-size:18px; width: 400px;margin: 0 auto;\">\u300C" + name + "\u300D\u6301\u4ED3\uD83D\uDCCA</p>\n    <div class=\"trend\"><img\n      class=\"fund-sstrend\"\n      src=\"http://j6.dfcfw.com/charts/StockPos/" + code + ".png?rt=" + new Date().getTime() + "\"\n      alt=\"\u300C" + name + "\u300D- " + code + "\"\n    />\n    </div>\n    <div id=\"container\"></div>\n    <div class=\"history\">\n    <p style=\"text-align: center; font-size:18px; width: 400px;margin: 0 auto;\">\u300C" + name + "\u300D\u6301\u4ED3\u660E\u7EC6</p>\n    " + content + "\n    </div>\n    <script src=\"https://cdn.staticfile.org/jquery/2.0.0/jquery.min.js\"></script>\n    <script src=\"https://gw.alipayobjects.com/os/lib/antv/g2/4.1.0-beta.1/dist/g2.min.js\"></script>\n    <script src=\"https://gw.alipayobjects.com/os/antv/pkg/_antv.data-set-0.11.1/dist/data-set.js\"></script>\n    <script>\n    var stockPercentMap = {};\n\n      function getStockPercent() {\n        var table = document.querySelector('.comm');\n        var tbody = table.querySelector('tbody');\n        var trList = tbody.children;\n        stockPercentMap = {};\n        for (var i = 0; i < trList.length; i++) {\n          var tds = trList[i].children;\n          stockPercentMap[\n            tds[1].firstChild.innerText\n          ] = +tds[6].innerText.replace('%', '');\n        }\n      }\n    // \u597D\u5783\u573E\u7684\u4EE3\u7801\uFF0C\u4ECE\u5929\u5929\u57FA\u91D1\u62D4\u4E0B\u6765\u7684\n    $(function(){\n      var d=document.getElementById(\"gpdmList\").innerHTML\n      LoadGpzd(d);\n     setInterval(function(){\n      LoadGpzd(d);\n     },20000)\n\n     getStockPercent();\n    })\n    function LoadGpzd(e) {\n      if (\"\" != e) {\n          for (var a = e.split(\",\"), t = Math.ceil(a.length / 120), n = [], l = 0, r = \"\", i = 0; i < t; i++)\n              l = 120 * i,\n              endIndex = l + 120,\n              r = a.slice(l, endIndex).join(\",\"),\n              n.push(r);\n          0 < n.length && GpzdData(n, 0)\n      }\n  }\n    function GpzdData(e, a) {\n      var t = \"https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&invt=2&fields=f2,f3,f12,f14,f9&cb=?&ut=267f9ad526dbe6b0262ab19316f5a25b&secids=\" + e[a];\n      // console.log(t)\n      jQuery.getJSON(t, function(e) {\n        // console.log(e)\n          var a, t = new Array, n = new Array, l = new Array, r = new Array;\n          if (null != e && null != e.data && null != e.data.diff) {\n              a = e.data.diff;\n              rectChart(a);\n              for (var i = 0; i < a.length; i++) {\n                  if (null != a[i]) {\n                      var s = a[i]\n                        , c = $(\"#dq\" + s.f12)[0]\n                        , d = $(\"#zd\" + s.f12)[0];\n                      c.innerHTML = \"-\" == s.f2 ? \"-\" : s.f2.toFixed(2),\n                      d.innerHTML = \"-\" == s.f3 ? \"-\" : s.f3.toFixed(2) + \"%\",\n                      n.push(d),\n                      l.push(c);\n                      var o = d.innerHTML.replace(\"%\", \"\");\n                      if (0 != o.indexOf(\"-\"))\n                          try {\n                              0 == (o = parseFloat(o)) || 0 == o || isNaN(o) ? (t.push(\"ping\"),\n                              c.className = \"ping\") : (t.push(\"zhang\"),\n                              c.className = \"zhang\")\n                          } catch (p) {\n                            // console.log(p)\n                              t.push(\"ping\"),\n                              c.className = \"zhang\"\n                          }\n                      else\n                          t.push(\"die\"),\n                          c.className = \"die\"\n                  }\n                  r.push(c.className)\n              }\n              setFlash2(n, \"\", t),\n              setFlash2(l, \"ping\", r)\n          }\n      }),\n      a++,\n      e.length > a && setTimeout(function() {\n        // console.log(a)\n          GpzdData(e, a)\n      }, 240)\n  }\n  function setClass2(e, a) {\n    if (\"object\" == typeof e)\n        for (var t = 0; t < e.length; t++)\n            \"\" != a && 0 < a.length ? e[t].className = \"zf \" + a[t] : e[t].className = \"zf ping\"\n  }\n  function setFlash2(e, a, t) {\n      setTimeout(function() {\n          setClass2(e, a)\n      }, 600),\n      setTimeout(function() {\n          setClass2(e, t)\n      }, 900)\n  }\n\n  var chart;\n  function rectChart(arr) {\n    if(chart && !chart.destroyed){\n      chart.destroy();\n    }\n    let valueArr = [];\n    if(arr.length===0) return;\n    const { DataView } = DataSet;\n    const relationMap = arr.map((item) => {\n      const { f2, f3, f9, f12, f14 } = item;\n      return {\n        name: f14 + '  ' + f3 + '%',\n        code: f12,\n        price: f2,\n        percent: f3,\n        value: stockPercentMap[f12] || Math.ceil(f2 * f9),\n      };\n    });\n    const data = {\n      name: 'root',\n      children: relationMap,\n    };\n    const dv = new DataView();\n    dv.source(data, {\n      type: 'hierarchy',\n    }).transform({\n      field: 'value',\n      type: 'hierarchy.treemap',\n      tile: 'treemapResquarify',\n      as: ['x', 'y'],\n    });\n\n    // \u5C06 DataSet \u5904\u7406\u540E\u7684\u7ED3\u679C\u8F6C\u6362\u4E3A G2 \u63A5\u53D7\u7684\u6570\u636E\n    const nodes = [];\n    for (const node of dv.getAllNodes()) {\n      if (node.data.name === 'root') {\n        continue;\n      }\n      valueArr.push(node.data.value);\n      const eachNode = {\n        name: node.data.name,\n        x: node.x,\n        y: node.y,\n        code: node.data.code,\n        value: node.data.value,\n        price: node.data.price,\n        percent: node.data.percent,\n      };\n\n      nodes.push(eachNode);\n    }\n    valueArr = valueArr.sort((a, b) => a - b);\n    const middleIndex = Math.ceil(valueArr.length / 2);\n     chart = new G2.Chart({\n      container: 'container',\n      autoFit: false,\n      width: 800,\n      height: 400,\n    });\n    chart.data(nodes);\n    chart.scale({\n      x: {\n        nice: true,\n      },\n      y: {\n        nice: true,\n      },\n    });\n\n    chart.axis(false);\n    chart.legend(false);\n    chart.tooltip({\n      showTitle: false,\n      showMarkers: false,\n      itemTpl:\n        '<ul style=\"padding-bottom: 10px;margin-left:-30px\"><li style=\"list-style: none;\">' +\n        '<span style=\"background-color:{color};\" class=\"g2-tooltip-marker\"></span>' +\n        '{name}' +\n        '</li>' +\n        '<li style=\"list-style: none;\">' +\n        '<span style=\"background-color:{color};\" class=\"g2-tooltip-marker\"></span>' +\n        '<span style=\"margin-top:4px\">\u80A1\u7968\u4EE3\u7801\uFF1A{code}</span><br/>' +\n        '</li>' +\n        '<li style=\"list-style: none;\">' +\n        '<span style=\"background-color:{color};\" class=\"g2-tooltip-marker\"></span>' +\n        '<span style=\"margin-top:4px\">\u6700\u65B0\u4EF7\u683C\uFF1A{price}</span><br/>' +\n        '</li></ul>',\n    });\n    chart\n      .polygon()\n      .position('x*y')\n      .color('value*percent', (value, percent) => {\n        if (percent > 0) {\n          return '#F44336';\n        }\n        return 'green';\n      })\n      .tooltip('name*price*code', (name, price, code) => {\n        return {\n          name,\n          price,\n          code,\n        };\n      })\n      .style({\n        lineWidth: 2,\n        stroke: '#fff',\n      })\n      .label('name*value', (name, value) => {\n        let labelStyle = {\n          offset: 0,\n          style: {\n            textBaseline: 'middle',\n            fontSize: 12,\n          },\n          content: (obj) => {\n            if (obj.name !== 'root') {\n              return obj.name;\n            }\n          },\n        };\n        // console.log(value, valueArr[middleIndex]);\n        if (value > valueArr[middleIndex]) {\n          labelStyle.style.fontSize = 20;\n          return labelStyle;\n        }\n        return labelStyle;\n      });\n\n    chart.interaction('element-active');\n\n    chart.render();\n  }\n    </script>\n  </body></html>";
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = fundPosition;
//# sourceMappingURL=fundPosition.js.map