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
    //Misspellings are shown or hidden again after clicking out or moving cursor in another way...
    const cursorobserver = new MutationObserver(function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            //console.log(mutation);
        }
        let missed = document.getElementsByClassName('kix-spelling-error-hover-interceptor').length;
        //Make sure it has gone from x+1 to x some number of times because while reworking a word the underline does not show.
        //TODO better way to do it
        console.log('changed. ' + missed + ' misspellings');
        queue.push(missed);
        queue = queue.slice(-10); //latest 10
        if (queue[0] > queue[queue.length - 1]) {
            //Got better!
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
            }, 1000);
        }
    });
    cursorobserver.observe(document.getElementsByClassName('kix-cursor')[0], { attributes: true });

});