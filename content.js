var jsdiff = require('diff');
var x = 0;
var orderedList = document.getElementsByTagName('ol')
var numFails = document.getElementsByClassName('failure').length - 1; //number of fails starting at 0 ;)

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        if (request.message == "removeDiff") {
            manipulateDom(removeActual);
        }
    }
);

function manipulateDom(callback) {

    if (x <= numFails) {
        orderedList[0].parentNode.removeChild(orderedList[0]) //remove lists

        var actualDom = document.getElementsByClassName('failure')[0]; //points to div
        var actualToRemove = document.getElementsByClassName('failure')[0].getElementsByClassName('actual')[0]; //points to pre
        var actual = document.getElementsByClassName('failure')[0].getElementsByClassName('actual')[0].textContent;
        var expected = document.getElementsByClassName('failure')[0].getElementsByClassName('expected')[0].textContent;
        var actualDomArray = document.getElementsByClassName('failure'); //points to div
        var color = '',
            code = null;
        var diff = jsdiff.diffLines(actual, expected, {"ignoreWhitespace": false, "newlineIsToken": false}),
            description = document.getElementById('description'),

            fragment = document.createDocumentFragment();
        diff.forEach(function(part){
            // green for additions, red for deletions
            // grey for common parts
            color = part.added ? '#ff1b1b90' :
                part.removed ? '#00ff007a' : '#f5f5f5';
            code = document.createElement('code');
            code.classList.add('test');
            code.style.backgroundColor = color;
            code.appendChild(document
                .createTextNode(part.value));

            if (code.textContent.includes("\n"));
            {
                console.log(code.textContent)
            }
            fragment.appendChild(code);
        });
        // description.appendChild(fragment);
        //
        actualDom.appendChild(fragment);
        callback(actualToRemove, actualDom, manipulateDom); //need to pass in an array of doms, then delete them in a loop in the callback
    }
    else {
        return;
    }

}

function removeActual(actualToRemove, actualDom, callback) {
    x++;
    actualToRemove.parentNode.removeChild(actualToRemove);
    actualDom.classList.remove('failure');
    actualDom.classList.add('rishiDiv');
    callback(removeActual);
}
