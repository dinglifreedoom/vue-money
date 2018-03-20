(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            //var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            //document.body.style.height = h + "px";
            if (!clientWidth) return;
            docEl.style.fontSize = (clientWidth >= 750 ? 50 : clientWidth / 7.5) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);