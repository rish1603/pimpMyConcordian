var jsdiff = require('diff');
var orderedList = document.getElementsByTagName('ol')

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        if (request.message == "removeDiff") {
            manipulateDom(removeActual);
        }
    }
);

function manipulateDom(callback) {

    orderedList[0].parentNode.removeChild(orderedList[0]) //remove list
    var actualToRemove = document.getElementsByClassName('failure')[0].getElementsByClassName('actual')[0]; //points to pre
    var actual = document.getElementsByClassName('failure')[0].getElementsByClassName('actual')[0].textContent;
    var expected = document.getElementsByClassName('failure')[0].getElementsByClassName('expected')[0].textContent;
    var actualDom = document.getElementsByClassName('failure')[0]; //points to div
    var color = '',
        span = null;
    var diff = jsdiff.diffLines(actual, expected, {"ignoreWhitespace": false}),
        description = document.getElementById('description'),

        fragment = document.createDocumentFragment();
    diff.forEach(function(part){
        // green for additions, red for deletions
        // grey for common parts
        color = part.added ? 'green' :
            part.removed ? 'red' : 'grey';
        span = document.createElement('span');
        span.style.backgroundColor = color;
        span.appendChild(document
            .createTextNode(part.value));
        fragment.appendChild(span);
    });
    // description.appendChild(fragment);
    actualDom.appendChild(fragment);
    callback(actualToRemove, actualDom);
}

function removeActual(actualToRemove, actualDom) {
    actualToRemove.parentNode.removeChild(actualToRemove);
    // actualDom.classList.remove('failure');
    // actualDomclassList.add('rishiDiv');
}
