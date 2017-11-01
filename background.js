var browserListener = function(tab) {

    if(tab.status === 'complete') {
        //insert the css
        chrome.tabs.insertCSS(tab.id, {
            file: "styles.css"
        });
    }
    chrome.tabs.sendMessage(tab.id, {message: "removeDiff"});
}

chrome.browserAction.onClicked.addListener(browserListener);

