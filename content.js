var orderedList = document.getElementsByTagName('ol')
console.log(orderedList)

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        if (request.message == "removeDiff") {
            orderedList[0].parentNode.removeChild(orderedList[0])
        }
    });
