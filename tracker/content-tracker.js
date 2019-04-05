let enums = null;
chrome.storage.sync.get(['enums'], function(result) {
    enums = result.enums;

    console.log('Enums in content script: ', enums);
});

function onSubmit (event) {
    console.log('event ', event);
}

chrome.runtime.sendMessage({message: 'shouldBeTracked'}, function(response) {
    if (true === response) {
        //document.querySelector('.uiTypeahead .textInput [name="q"]').addEventListener('onChange', onInputChange);
        document.querySelector('#bluebarRoot form').addEventListener('onSubmit', onSubmit);
    }
});


//todo nadav I am here.
//Maybe change the code so the content script will be the only responsible for the tracking.
//Depend on the current url settings.
//If it is only by url - than send the url to the server, with the search param.
//If by search - wait for the search and than send the search and the url to the server.

//In the server take the url and the search, check if it's match one of the assets - and save accordingly.

/*
 {
    Domain: 'facebook.com',
    ByInput: true,
    InputElementSelector: '.uiTypeahead .textInput [name="q"]',
    FormElementSelector: '#bluebarRoot form',
    QuerySearchParam: null
 }
* */
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

//document.querySelector('.uiTypeahead .textInput [name="q"]').value