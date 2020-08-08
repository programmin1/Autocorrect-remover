function animateValue(id, start, end, duration)
{
    var range = end - start;
    var current = start;
    var increment = end > start? 1 : -1;
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

window.onload = function () {
  animateValue("count", 0, 30, 2000);
  animateValue("incorrect", 0, 12, 2000);
}
