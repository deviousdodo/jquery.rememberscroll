(function($) {

// http://www.nczonline.net/blog/2007/11/30/the-throttle-function/
function debounce(method, params, scope) {
    clearTimeout(method._tId);
    
    method._tId = setTimeout(function(){
        method.apply(scope, params);
    }, 100);
}

function rememberScroll(elem, options) {
    log("Plugin applied to ", elem);
    var attr = elem.attr(options.identAttr),
        key = 'remember_scroll_' + attr + options.param,
        val = $.jStorage.get(key);
    
    if (! attr) { 
        throw "Cannot remember scroll on element with no identifying attribute";
    }
    
    if (val) {
        log("Scrolling to: ", val.scroll);
        options.scrollFunction(elem, val.scroll, options);
        options.afterScroll(elem, val.scroll, options);
    }
    
    function storeScroll(elem) {
        log("Storing scroll for ", key);
        $.jStorage.set(key, { time: time(), scroll: elem.scrollTop() });
    }
    
    elem.bind('scroll.rememberScroll', function(e) {
        debounce(storeScroll, [$(e.target)]);
    });
}

function clear() {
    var keys = $.jStorage.index();
    for (var i = keys.length; i--;) {
        if (keys[i].substr(0, 16) == 'remember_scroll_') {
            $.jStorage.deleteKey(keys[i]);
            log("Cleaned ", keys[i]);
        }
    }
}

function detach(elems) {
    elems.each(function() {
        $(this).unbind('scroll.rememberScroll');
    });
}

function gc(options) {
    if (shouldRunGC(options.gcProbability)) {
        setTimeout(function() {
            runGC(options.gcAfter * 1000);
        }, 0);
    }
}

function shouldRunGC(probability) {
    var shouldRun = parseInt(Math.round(Math.random() * 10, 10)) < parseInt(probability * 10, 10);
    if (shouldRun) {
        log("Running GC");
        return true;
    }
    return false;
}

function runGC(cleanAfter) {
    var keys = $.jStorage.index();
    for (var i = keys.length; i--;) {
        if (keys[i].substr(0, 16) == 'remember_scroll_') {
            var v = $.jStorage.get(keys[i]);
            if ((+v.time + cleanAfter) < time()) {
                $.jStorage.deleteKey(keys[i]);
                log("Cleaned ", keys[i]);
            }
        }
    }
}

function time() {
    return +(new Date());
}

function log() {}
function setupLog(shouldLog) {
    if (shouldLog && console && console.log) {
        log = function() {
            console.log.apply(console, ["[rememberScroll] "].concat(Array.prototype.slice.call(arguments)));
        };
    }
}

$.fn.rememberScroll = function(options) {
    options = $.extend({}, $.fn.rememberScroll.defaults, options);
    setupLog(options.debug);
    log("Plugin initialized with options: ", options);
    
    gc(options);
    
    detach($(this));
    $(this).each(function() { rememberScroll($(this), options); });
};

$.fn.rememberScroll.defaults = {
    debug: false,
    param: '',
    identAttr: 'id',
    gcProbability: 0.1, // between 0 and 1
    gcAfter: 60 * 60 * 24 * 7, // one week
    afterScroll: function(elem, distance, options) {},
    scrollFunction: function(elem, distance, options) { 
        elem.scrollTop(distance);
    }
};

$.fn.rememberScroll.clear = clear;
$.fn.rememberScroll.detach = detach;

})(jQuery);
