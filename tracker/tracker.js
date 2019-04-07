let currentUrl = null;

const trackedSites = [
    {
        Domain: 'facebook.com',
        ByInput: true,
        InputElementSelector: '.uiTypeahead .textInput [name="q"]',
        FormElementSelector: '#bluebarRoot form',
        QuerySearchParam: null
    },
    {
        Domain: 'google.com',
        ByInput: false,
        InputElementSelector: null,
        FormElementSelector: null,
        QuerySearchParam: 'q'
    },
];

chrome.runtime.onInstalled.addListener(function() {
    console.log('extension is live');
});

function sendTrackData (searchParam) {
    console.log('sending track data', currentUrl.hostname, currentUrl.href, searchParam)
}

function trackByQuery (currentSiteOptions) {
    const searchParam = currentUrl.searchParams.get(currentSiteOptions.QuerySearchParam);
    sendTrackData(searchParam);
}

function trackByInput (tabId, currentSiteOptions) {
    chrome.tabs.sendMessage(tabId,{
        trackBy: {
            InputElementSelector: currentSiteOptions.InputElementSelector,
            FormElementSelector: currentSiteOptions.FormElementSelector
        }
    }, (response) => {});
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        if (request.hasOwnProperty('trackData')) {
            sendTrackData(request.trackData.searchParam);
        }
    });

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    //Maybe there will be a race condition problem here - waiting to the site to load.
    //If the analyst will search too fast - we might miss the submit event
    if ('complete' === changeInfo.status) {

        currentUrl = new URL(tab.url);
        const currentSiteOptions = trackedSites.find((site) => {
            return currentUrl.hostname.includes(site.Domain)
        });

        if (currentSiteOptions) { //The site should be tracked
            if (currentSiteOptions.ByInput) {
                trackByInput(tabId, currentSiteOptions);
            } else {
                trackByQuery(currentSiteOptions);
            }
        }
    }
});