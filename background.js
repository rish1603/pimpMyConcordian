var browserListener = function(tab) {

    if(tab.status === 'complete') {
        //We insert the css
        console.log("hi")
        chrome.tabs.insertCSS(tab.id, {
            file: "styles.css"
        });
    }
}

chrome.browserAction.onClicked.addListener(browserListener);
