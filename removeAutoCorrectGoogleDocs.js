/**
 * Autocorrect Remover

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0
 */
const observer = new MutationObserver(function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (true || mutation.type === 'childList') {
            if (mutation.target.className && mutation.target.className.indexOf('kix-spell-bubble-suggestion-text') > -1 && mutation.target.children.length == 0) {
                console.log('spell check is popped up')
                mutation.target.textContent = 'Guess!!'
                mutation.target.addEventListener('click', function(event) {
                    console.log('cancel-click');
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        } else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
});
observer.observe(document.body, { attributes: true, childList: true, subtree: true });
window.addEventListener('load', function() {
    let queue = []
    let gamepoints = 0;
    let lastCursorTop = 0;
    //Misspellings are shown or hidden again after clicking out or moving cursor in another way...
    const cursorobserver = new MutationObserver(function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            //console.log(mutation);
        }
        let missed = document.getElementsByClassName('kix-spelling-error-hover-interceptor').length;
        let hasMovedAway = (document.getElementsByClassName('kix-cursor')[0].style.top != lastCursorTop);
        lastCursorTop = document.getElementsByClassName('kix-cursor')[0].style.top;
        //Make sure it has gone from x+1 to x some number of times because while reworking a word the underline does not show.
        //TODO better way to do it
        console.log('changed. ' + missed + ' misspellings');
        //Maybe see if cursor is far from the one where it was misspelled at?
        console.log('cursor at ' + document.getElementsByClassName('kix-cursor')[0].style.top);
        queue.push(missed);
        queue = queue.slice(-12); //latest values. are most of them n-1?
        if (queue[0] > queue[queue.length - 1] && hasMovedAway) {
            //Got better! but is it a fluke just once while editing?
            for (let i = 1; i < queue.length * .8; i++) {
                if (queue[queue.length - 1] != queue[queue.length - 1 - i]) {
                    return; // Not consistent, maybe just editing still and temporarily not underlined.
                }
            }
            gamepoints++;
            let hooray = document.createElement('h2');
            document.getElementById('docs-header').appendChild(hooray);
            hooray.setAttribute('style', 'position: fixed;\
            right: 245px;\
            z-index: 99999;\
            font-size: 45px;\
            line-height: 1px;');
            hooray.textContent = 'You fixed it, +1! ' + gamepoints;
            queue = []; //clear out record
            setTimeout(function() {
                hooray.parentNode.removeChild(hooray);
                chrome.storage.sync.get(['correct'], function(result) {
                    let correct = result.correct || 0;
                    console.log(correct);
                    chrome.storage.sync.set({ correct: correct + 1 }, function() {});
                });
            }, 1000);
        }
    });
    cursorobserver.observe(document.getElementsByClassName('kix-cursor')[0], { attributes: true });

    //TODO set the preference for NO AUTO CORRECT from tools options. Where is that token?
    // Set up our request
    //let XHR = XMLHttpRequest;
    //XHR.open( 'POST', 'prefs' );
    //// Add the required HTTP header for form data POST requests
    //XHR.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    //// Finally, send our data.
    //XHR.send( 'preferences=%7B%22docs-autocorrect%22%3A%7B%22acSpelling%22%3Atrue%7D%7D' );
});