let enums = null;
chrome.storage.sync.get(['enums'], function(result) {
    enums = result.enums;

    console.log('Enums in background script: ', enums);
});

chrome.runtime.onInstalled.addListener(function() {
    console.log('extension is live');
});

function urlShouldBeTracked (hostname) {
    return undefined !== enums.listOfSitesToFollow.find((site) => {
        return hostname.includes(site)
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if ('complete' === changeInfo.status) {

        const url = new URL(tab.url);

        if (urlShouldBeTracked(url.hostname)) {
            const googleQuery = url.searchParams.get('q');

            console.log('host: ', url.host, "hostname: ", url.hostname);
            console.log('updated from background ', changeInfo, tab.url, googleQuery);
        }
    }
});

chrome.runtime.onMessage.addListener(
(request, sender, sendResponse) => {
    const currentUrl = sender.tab ? new URL(sender.tab.url) : null;

    switch (request.message) {
        case 'shouldBeTracked':
            sendResponse(urlShouldBeTracked(currentUrl.hostname));
            break;
        default:
            break;

    }
});

// chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
//     var url = tabs[0].url;
// });
