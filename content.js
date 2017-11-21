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
        callback(actualToRemove, actualDom, manipulateDom); //need to pass in an array of doms, then delete them in a loop in the callback
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

        //call new function here -> function needs to get to end of html after it has all been pimped
        // make it use updated innerHTML
        failures = document.getElementsByClassName('rishiDiv');
        myDivs = document.getElementsByClassName('expected');
        console.log(myDivs[0].innerHTML)

        for (let x = 0; x < myDivs.length; x++) {
            failures[x].innerHTML = fillLines(failures[x].innerHTML, myDivs[x].innerHTML);
        }

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

function fillLines(string, myDiv) {
    var diffToLongest;
    var longestLine = 0;
    var lastLinePosition;
    var previousIndex = 0;
    var spacesString = 'axax';
    var index = myDiv.length;
    var lineCount;
    var charPosition;
    var arrayOfIndex = []; //stores the indexes at where the line ends
    var numSpaces = [];

    for (lineCount = -1, _index = index; index != -1; lineCount++) {

        index = string.indexOf('&gt;\n', index + 1) //find position of line break
        charPosition = index - previousIndex; //find the difference i.e. number of chars on this line

        arrayOfIndex.push(index);

        if (charPosition > longestLine) { //calculate line with the most chars
            longestLine = charPosition;
        }
        previousIndex = index; //update previous
    }

    for (lineCount = -1, _index = index; index != -1; lineCount++) {

        index = string.indexOf('&gt;\n', index + 1) //find position of line break
        charPosition = index - previousIndex; //find the difference i.e. number of chars on this line
        console.log(charPosition);
        diffToLongest = longestLine - charPosition;
        numSpaces.push(diffToLongest); // (int) diff to longest line

        previousIndex = index; //update previous
    }
    console.log(numSpaces);

    arrayOfIndex.splice(0,1); //remove first element
    arrayOfIndex.pop(arrayOfIndex.length - 1) //remove last element

    for(let x = arrayOfIndex.length - 1; x >= 0; x--) {
        string = string.insert(arrayOfIndex[x] + 4, spacesString);
    }

    return string;
}

String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};


