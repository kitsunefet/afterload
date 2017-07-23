var page = require("webpage").create(),
    encoded_url = require('system').args[1],
    timeout = require('system').args[2],
    useragent = require('system').args[3],
    operation = require('system').args[4];

var url=unescape(encoded_url);

var settings = {
  operation: operation
};

page.settings.userAgent = useragent;
page.settings.resourceTimeout = timeout;
page.settings.loadImages = false;

function onPageReady() {
    var htmlContent = page.evaluate(function () {
        return document.documentElement.outerHTML;
    });

    console.log(htmlContent);
    phantom.exit();
}

page.onResourceTimeout = function(request) {
    console.log('timeout');
};

page.open(url,settings, function (status) {
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
