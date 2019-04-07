let trackedInputElement = null;
let trackedFormElement = null;

function onSubmit (event) {
    console.log('onSubmit event fired');
    const trackedInputValue = trackedInputElement.value;

    chrome.runtime.sendMessage({
        trackData: {
            searchParam: trackedInputValue
        }
    }, (response) => {
        console.log('track data sent to background script');
    });
}

function trackByInput (inputElementSelector, formElementSelector) {
    if (trackedFormElement) {
        trackedFormElement.removeEventListener('onSubmit', onSubmit());
    }

    trackedInputElement = document.querySelector(inputElementSelector);
    trackedFormElement = document.querySelector(formElementSelector);

    if (trackedFormElement && trackedInputElement) {
        trackedFormElement.addEventListener('onSubmit', onSubmit);
    }
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
    console.log('in messages listener');
    if (request.hasOwnProperty('trackBy')) {
        trackByInput(request.trackBy.InputElementSelector, request.trackBy.FormElementSelector)
    }
});