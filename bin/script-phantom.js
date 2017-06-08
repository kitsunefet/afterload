var page = require("webpage").create(),
    encoded_url = require('system').args[1];

var url=unescape(encoded_url);

//mobilize link
//var myRegexp = /^https?:\/\/detail\.?m?\.tmall\.com.*&id=(\d*)&.*/g;
//match = myRegexp.exec(url);
//while (match != null) {
//    url = 'https://detail.m.tmall.com?id='+match[0];
//console.log(url)
//console.log('--');
//}

var mobile = new RegExp("^https?:\/\/[^\/]*\.?m\..*");
if (mobile.test(url)) {
page.settings.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25';
}
else{
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.0) Gecko/20120101 Firefox/33.0';
}
page.settings.loadImages = false;

function onPageReady() {
    var htmlContent = page.evaluate(function () {
        return document.documentElement.outerHTML;
    });

    console.log(htmlContent);
    phantom.exit();
}

page.open(url, function (status) {
    function checkReadyState() {
        setTimeout(function () {
            var readyState = page.evaluate(function () {
                return document.readyState;
            });

            if ("complete" === readyState) {
                onPageReady();
            } else {
                checkReadyState();
            }
        });
    }

    checkReadyState();
});
