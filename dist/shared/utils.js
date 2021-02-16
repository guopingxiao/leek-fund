"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebviewResourcesUrl = exports.formatLabelString = exports.events = exports.multi1000 = exports.getTemplateFileContent = exports.formatHTMLWebviewResourcesUrl = exports.isHoliday = exports.timezoneDate = exports.allHolidays = exports.allStockTimes = exports.allMarkets = exports.isStockTime = exports.isWeekend = exports.randHeader = exports.randomColor = exports.colorOptionList = exports.caculateEarnings = exports.formatTreeText = exports.sortData = exports.formatNumber = exports.calcFixedPriceNumber = exports.toFixed = exports.clean = exports.uniq = exports.formatDateTime = exports.formatDate = exports.objectToQueryString = void 0;
var events_1 = require("events");
var fs = require("fs");
var path = require("path");
var vscode = require("vscode");
var vscode_1 = require("vscode");
var globalState_1 = require("../globalState");
var leekConfig_1 = require("./leekConfig");
var typed_1 = require("./typed");
var stockTimes = allStockTimes();
var formatNum = function (n) {
    var m = n.toString();
    return m[1] ? m : '0' + m;
};
exports.objectToQueryString = function (queryParameters) {
    return queryParameters
        ? Object.entries(queryParameters).reduce(function (queryString, _a, index) {
            var key = _a[0], val = _a[1];
            var symbol = queryString.length === 0 ? '?' : '&';
            queryString += typeof val !== 'object' ? "" + symbol + key + "=" + val : '';
            return queryString;
        }, '')
        : '';
};
exports.formatDate = function (val, seperator) {
    if (seperator === void 0) { seperator = '-'; }
    var date = new Date();
    if (typeof val === 'object') {
        date = val;
    }
    else {
        date = new Date(val || '');
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return [year, month, day].map(formatNum).join(seperator);
};
// 时间格式化
exports.formatDateTime = function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return ([year, month, day].map(formatNum).join('-') +
        ' ' +
        [hour, minute, second].map(formatNum).join(':'));
};
/**
 * 数组去重
 */
exports.uniq = function (elements) {
    if (!Array.isArray(elements)) {
        return [];
    }
    return elements.filter(function (element, index) { return index === elements.indexOf(element); });
};
/**
 * 清除数组里面的非法值
 */
exports.clean = function (elements) {
    if (!Array.isArray(elements)) {
        return [];
    }
    return elements.filter(function (element) { return !!element; });
};
/**
 * toFixed 解决js精度问题，使用方式：toFixed(value)
 * @param {Number | String} value
 * @param {Number} precision 精度，默认2位小数，需要取整则传0
 * @param {Number} percent 倍增
 * 该方法会处理好以下这些问题
 * 1.12*100=112.00000000000001
 * 1.13*100=112.9999999999999
 * '0.015'.toFixed(2)结果位0.01
 * 1121.1/100 = 11.210999999999999
 */
exports.toFixed = function (value, precision, percent) {
    if (value === void 0) { value = 0; }
    if (precision === void 0) { precision = 2; }
    if (percent === void 0) { percent = 1; }
    var num = Number(value);
    if (Number.isNaN(num)) {
        return 0;
    }
    if (num < Math.pow(-2, 31) || num > Math.pow(2, 31) - 1) {
        return 0;
    }
    var newNum = value * percent;
    // console.log(num, precision)
    if (precision < 0 || typeof precision !== 'number') {
        return newNum * percent;
    }
    else if (precision > 0) {
        newNum = Math.round(num * Math.pow(10, precision) * percent) / Math.pow(10, precision);
        return newNum;
    }
    newNum = Math.round(num);
    return newNum;
};
exports.calcFixedPriceNumber = function (open, yestclose, price, high, low) {
    var reg = /0+$/g;
    open = open.replace(reg, '');
    yestclose = yestclose.replace(reg, '');
    price = price.replace(reg, '');
    high = high.replace(reg, '');
    low = low.replace(reg, '');
    var o = open.indexOf('.') === -1 ? 0 : open.length - open.indexOf('.') - 1;
    var yc = yestclose.indexOf('.') === -1 ? 0 : yestclose.length - yestclose.indexOf('.') - 1;
    var p = price.indexOf('.') === -1 ? 0 : price.length - price.indexOf('.') - 1;
    var h = high.indexOf('.') === -1 ? 0 : high.length - high.indexOf('.') - 1;
    var l = low.indexOf('.') === -1 ? 0 : low.length - low.indexOf('.') - 1;
    var max = Math.max(o, yc, p, h, l);
    if (max > 3) {
        max = 2; // 接口返回的指数数值的小数位为4，但习惯两位小数
    }
    return max;
};
exports.formatNumber = function (val, fixed, format) {
    if (val === void 0) { val = 0; }
    if (fixed === void 0) { fixed = 2; }
    if (format === void 0) { format = true; }
    var num = +val;
    if (format) {
        if (num > 1000 * 10000) {
            return (num / (10000 * 10000)).toFixed(fixed) + '亿';
        }
        else if (num > 1000) {
            return (num / 10000).toFixed(fixed) + '万';
        }
    }
    return "" + num.toFixed(fixed);
};
exports.sortData = function (data, order) {
    if (data === void 0) { data = []; }
    if (order === void 0) { order = typed_1.SortType.NORMAL; }
    if (order === typed_1.SortType.ASC || order === typed_1.SortType.DESC) {
        return data.sort(function (a, b) {
            var aValue = +a.info.percent;
            var bValue = +b.info.percent;
            if (order === typed_1.SortType.DESC) {
                return aValue > bValue ? -1 : 1;
            }
            else {
                return aValue > bValue ? 1 : -1;
            }
        });
    }
    else if (order === typed_1.SortType.AMOUNTASC || order === typed_1.SortType.AMOUNTDESC) {
        return data.sort(function (a, b) {
            var aValue = a.info.amount - 0;
            var bValue = b.info.amount - 0;
            if (order === typed_1.SortType.AMOUNTDESC) {
                return aValue > bValue ? -1 : 1;
            }
            else {
                return aValue > bValue ? 1 : -1;
            }
        });
    }
    else {
        return data;
    }
};
exports.formatTreeText = function (text, num) {
    if (text === void 0) { text = ''; }
    if (num === void 0) { num = 10; }
    var str = text + '';
    var lenx = Math.max(num - str.length, 0);
    return str + ' '.repeat(lenx);
};
exports.caculateEarnings = function (money, price, currentPrice) {
    if (Number(currentPrice) > 0) {
        return (money / price) * currentPrice - money;
    }
    else {
        return 0;
    }
};
exports.colorOptionList = function () {
    var list = [
        {
            label: '🔴Red Color',
            description: 'red',
        },
        {
            label: '💹Green Color',
            description: 'green',
        },
        {
            label: '⚪White Color',
            description: 'white',
        },
        {
            label: '⚫Black Color',
            description: 'black',
        },
        {
            label: '🌕Yellow Color',
            description: 'black',
        },
        {
            label: '🔵Blue Color',
            description: 'blue',
        },
        {
            label: 'Gray Color',
            description: '#888888',
        },
        {
            label: 'Random Color',
            description: 'random',
        },
    ];
    return list;
};
exports.randomColor = function () {
    var colors = [
        '#E74B84',
        '#11FB23',
        '#F79ADA',
        '#C9AD06',
        '#82D3A6',
        '#C6320D',
        '#83C06A',
        '#54A0EB',
        '#85AB66',
        '#53192F',
        '#6CD2D7',
        '#6C6725',
        '#7B208B',
        '#B832A5',
        '#C1FDCD',
    ];
    var num = Math.ceil(Math.random() * 10);
    return colors[num];
};
exports.randHeader = function () {
    var head_connection = ['Keep-Alive', 'close'];
    var head_accept = ['text/html, application/xhtml+xml, */*'];
    var head_accept_language = [
        'zh-CN,fr-FR;q=0.5',
        'en-US,en;q=0.8,zh-Hans-CN;q=0.5,zh-Hans;q=0.3',
    ];
    var head_user_agent = [
        'Opera/8.0 (Macintosh; PPC Mac OS X; U; en)',
        'Opera/9.27 (Windows NT 5.2; U; zh-cn)',
        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Win64; x64; Trident/4.0)',
        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)',
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E)',
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E; QQBrowser/7.3.9825.400)',
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; BIDUBrowser 2.x)',
        'Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20070309 Firefox/2.0.0.3',
        'Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20070803 Firefox/1.5.0.12',
        'Mozilla/5.0 (Windows; U; Windows NT 5.2) Gecko/2008070208 Firefox/3.0.1',
        'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.12) Gecko/20080219 Firefox/2.0.0.12 Navigator/9.0.0.6',
        'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36',
        'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; rv:11.0) like Gecko)',
        'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:21.0) Gecko/20100101 Firefox/21.0 ',
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Maxthon/4.0.6.2000 Chrome/26.0.1410.43 Safari/537.1 ',
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.92 Safari/537.1 LBBROWSER',
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36',
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.11 TaoBrowser/3.0 Safari/536.11',
        'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko',
        'Mozilla/5.0 (Macintosh; PPC Mac OS X; U; en) Opera 8.0',
    ];
    var result = {
        Connection: head_connection[0],
        Accept: head_accept[0],
        'Accept-Language': head_accept_language[1],
        'User-Agent': head_user_agent[Math.floor(Math.random() * 10)],
    };
    return result;
};
/**
 * 判断是否周未的方法
 * @param {*} date 参与判断的日期，默认今天
 */
exports.isWeekend = function (date) {
    if (date === void 0) { date = new Date(); }
    var tof = false;
    var dayOfWeek = date.getDay();
    tof = dayOfWeek === 6 || dayOfWeek === 0;
    return tof;
};
exports.isStockTime = function () {
    var markets = allMarkets();
    var date = new Date();
    var hours = date.getHours();
    var minus = date.getMinutes();
    var delay = 5;
    for (var i = 0; i < markets.length; i++) {
        var stockTime = stockTimes.get(markets[i]);
        if (!stockTime || stockTime.length < 2 || isHoliday(markets[i])) {
            continue;
        }
        // 针对美股交易时间跨越北京时间0点
        if (stockTime[0] > stockTime[1]) {
            if (hours >= stockTime[0] ||
                hours < stockTime[1] ||
                (hours === stockTime[1] && minus <= delay)) {
                return true;
            }
        }
        else {
            if ((hours >= stockTime[0] && hours < stockTime[1]) ||
                (hours === stockTime[1] && minus <= delay)) {
                return true;
            }
        }
    }
    return false;
};
function allMarkets() {
    var result = [];
    var funds = leekConfig_1.LeekFundConfig.getConfig('leek-fund.funds');
    if (funds.length > 0) {
        // 针对只配置基金的用户，默认增加A股交易时间
        result.push(typed_1.StockCategory.A);
    }
    var stocks = leekConfig_1.LeekFundConfig.getConfig('leek-fund.stocks');
    stocks.forEach(function (item) {
        var market = typed_1.StockCategory.NODATA;
        if (/^(sh|sz)/.test(item)) {
            market = typed_1.StockCategory.A;
        }
        else if (/^(hk)/.test(item)) {
            market = typed_1.StockCategory.HK;
        }
        else if (/^(usr_)/.test(item)) {
            market = typed_1.StockCategory.US;
        }
        if (!result.includes(market)) {
            result.push(market);
        }
    });
    return result;
}
exports.allMarkets = allMarkets;
function allStockTimes() {
    var stocks = new Map();
    stocks.set(typed_1.StockCategory.A, [9, 15]);
    stocks.set(typed_1.StockCategory.HK, [9, 16]);
    // TODO: 判断夏令时,夏令时交易时间为[21, 4]，非夏令时交易时间为[22, 5]
    stocks.set(typed_1.StockCategory.US, [21, 5]);
    return stocks;
}
exports.allStockTimes = allStockTimes;
function allHolidays() {
    // https://websys.fsit.com.tw/FubonETF/Top/Holiday.aspx
    // 假日日期格式为yyyyMMdd
    var days = new Map();
    var A = [];
    if (globalState_1.default.isHolidayChina) {
        A.push(exports.formatDate(new Date(), ''));
    }
    // https://www.hkex.com.hk/-/media/HKEX-Market/Services/Circulars-and-Notices/Participant-and-Members-Circulars/SEHK/2020/ce_SEHK_CT_038_2020.pdf
    var HK = [
        '20201225',
        '20210101',
        '20210212',
        '20210215',
        '20210402',
        '20210405',
        '20210406',
        '20210519',
        '20210614',
        '20210701',
        '20210922',
        '20211001',
        '20211014',
        '20211227',
    ];
    // https://www.nyse.com/markets/hours-calendars
    var US = [
        '20201225',
        '20210101',
        '20210118',
        '20210215',
        '20210402',
        '20210531',
        '20210705',
        '20210906',
        '20211125',
        '20211224',
        '20220117',
        '20220221',
        '20220415',
        '20220530',
        '20220704',
        '20220905',
        '20221124',
        '20221226',
    ];
    days.set(typed_1.StockCategory.A, A);
    days.set(typed_1.StockCategory.HK, HK);
    days.set(typed_1.StockCategory.US, US);
    return days;
}
exports.allHolidays = allHolidays;
function timezoneDate(timezone) {
    var date = new Date();
    var diff = date.getTimezoneOffset(); // 分钟差
    var gmt = date.getTime() + diff * 60 * 1000;
    var nydate = new Date(gmt + timezone * 60 * 60 * 1000);
    return nydate;
}
exports.timezoneDate = timezoneDate;
function isHoliday(market) {
    var _a;
    var date = new Date();
    if (market === typed_1.StockCategory.US) {
        date = timezoneDate(-5);
    }
    var holidays = allHolidays();
    if (exports.isWeekend(date) || ((_a = holidays.get(market)) === null || _a === void 0 ? void 0 : _a.includes(exports.formatDate(date, '')))) {
        return true;
    }
    return false;
}
exports.isHoliday = isHoliday;
function isRemoteLink(link) {
    return /^(https?|vscode-webview-resource|javascript):/.test(link);
}
function formatHTMLWebviewResourcesUrl(html, conversionUrlFn) {
    var LinkRegexp = /\s?(?:src|href)=('|")(.*?)\1/gi;
    var matcher = LinkRegexp.exec(html);
    while (matcher) {
        var origin = matcher[0];
        var originLen = origin.length;
        var link = matcher[2];
        if (!isRemoteLink(link)) {
            var resourceLink = link;
            try {
                resourceLink = conversionUrlFn(link);
                html =
                    html.substring(0, matcher.index) +
                        origin.replace(link, resourceLink) +
                        html.substring(matcher.index + originLen);
            }
            catch (err) {
                console.error(err);
            }
        }
        matcher = LinkRegexp.exec(html);
    }
    return html;
}
exports.formatHTMLWebviewResourcesUrl = formatHTMLWebviewResourcesUrl;
function getTemplateFileContent(tplPaths, webview) {
    if (!Array.isArray(tplPaths)) {
        tplPaths = [tplPaths];
    }
    var tplPath = path.join.apply(path, __spreadArrays([globalState_1.default.context.extensionPath, 'template'], tplPaths));
    var html = fs.readFileSync(tplPath, 'utf-8');
    var extensionUri = globalState_1.default.context.extensionUri;
    var dirUri = tplPaths.slice(0, -1).join('/');
    return formatHTMLWebviewResourcesUrl(html, function (link) {
        return webview
            .asWebviewUri(vscode.Uri.parse([extensionUri, 'template', dirUri, link].join('/')))
            .toString();
    });
}
exports.getTemplateFileContent = getTemplateFileContent;
function multi1000(n) {
    return Math.ceil(n * 1000);
}
exports.multi1000 = multi1000;
exports.events = new events_1.EventEmitter();
function formatLabelString(str, params) {
    try {
        str = str.replace(/\$\{(.*?)\}/gi, function (_, $1) {
            var formatMatch = /(.*?)\s*\|\s*padRight\s*(\|\s*(\d+))?/gi.exec($1);
            if (formatMatch) {
                return exports.formatTreeText(params[formatMatch[1]], formatMatch[3] ? parseInt(formatMatch[3]) : undefined);
            }
            else {
                return String(params[$1]);
            }
        });
    }
    catch (err) {
        vscode_1.window.showErrorMessage("fail: Label format Error, " + str + ";\n" + err.message);
        return '模板格式错误！';
    }
    return str;
}
exports.formatLabelString = formatLabelString;
function getWebviewResourcesUrl(webview, _extensionUri, args) {
    return args.map(function (arg) {
        return webview.asWebviewUri(vscode.Uri.parse([_extensionUri.toString(), 'template', arg].join('/')));
    });
}
exports.getWebviewResourcesUrl = getWebviewResourcesUrl;
//# sourceMappingURL=utils.js.map