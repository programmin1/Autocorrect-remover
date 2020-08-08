function animateValue(id, start, end, duration) {
    var range = end - start;
    var current = start;
    var increment = end > start ? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

window.onload = function() {
    chrome.storage.sync.get(['correct'], function(result) {
        console.log(result)
        let correct = 1 * result.correct || 0;
        let incorrect = 1 * result.incorrect || 0;
        animateValue("count", -1, correct, 2000);
        animateValue("incorrect", -1, incorrect, 2000);
    });
};