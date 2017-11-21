var jsdiff = require('diff');
var counter = 0;
var orderedList = document.getElementsByTagName('ol')
var tdArray = document.getElementsByTagName('td')
var numFails = document.getElementsByClassName('failure').length - 1; //number of fails starting at 0 ;)
var failures, myDivs = [];

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        if (request.message == "removeDiff") {
            var myDivs = [];
            manipulateDom(removeActual);
        }
    }
);

function manipulateDom(callback) {

    if (counter <= numFails) {

        orderedList[0].parentNode.removeChild(orderedList[0]) //remove lists

        var actualDom = document.getElementsByClassName('failure')[0]; //points to div

        var actualToRemove = document.getElementsByClassName('failure')[0].getElementsByClassName('actual')[0]; //points to pre
        var actual = document.getElementsByClassName('failure')[0].getElementsByClassName('actual')[0].textContent;
        var expected = document.getElementsByClassName('failure')[0].getElementsByClassName('expected')[0].textContent;
        document.getElementsByClassName('failure')[0].getElementsByClassName('expected')[0].style.textDecoration = "none"; //remove line-through expected

        var actualDomArray = document.getElementsByClassName('failure'); //points to div
        var color = '',
            code = null;
        var diff = jsdiff.diffLines(actual, expected, {"ignoreWhitespace": false, "newlineIsToken": false}),
            description = document.getElementById('description'),

            fragment = document.createDocumentFragment();
        diff.forEach(function(part){
            // green for additions, red for deletions
            // grey for common parts
            code = document.createElement('code');
            color = part.added ? '#bbffbb' :
                part.removed ? '#ffbbb0' : '#f5f2f0';
            if (part.added || part.removed) {
                code.classList.add('language-diff');
            }
            else {
                code.classList.add('language-XML');
            }
            code.style.backgroundColor = color;
            code.appendChild(document
                .createTextNode(part.value));
            fragment.appendChild(code);
        });
        actualDom.appendChild(fragment);
        callback(actualToRemove, actualDom, manipulateDom); 
    }
    else {
        var preToConvert = document.getElementsByTagName('pre')
        var numberOfPres = preToConvert.length;

        //change all pre's to new class
        for(let x = 0; x < preToConvert.length ; x++) {
            preToConvert[x].classList.add('language-XML');
        }

        //change tag from pre -> code
        for(let x = 0; x < numberOfPres; x++) {
            preToConvert[0].outerHTML = preToConvert[0].outerHTML.replace(/pre/g,"code");
        }

        for(let x = 0; x < numberOfPres ; x++)  {
            tdArray[x].style.background = '#f5f2f0';
        }

        var s = document.createElement('script');
        s.src = chrome.extension.getURL('prism.js');
        (document.head||document.documentElement).appendChild(s);
        s.onload = function() {
            s.parentNode.removeChild(s);
        };

        return;
    }
}

function removeActual(actualToRemove, actualDom, callback) {
    //codify every other pre
    actualToRemove.parentNode.removeChild(actualToRemove);
    actualDom.classList.remove('failure');
    actualDom.classList.add('rishiDiv');
    counter++;
    callback(removeActual);
}

