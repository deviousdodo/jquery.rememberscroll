# Usage
<code>
$('#elements').rememberScroll({debug: true});
$.rememberScroll.clear(); // cleans everything stored by the plugin
$.rememberScroll.detach($('#elements')); // unbinds from the given elements
</code>

## Options

- debug: *false* Set to true if you want to see activity messages in the console.
- param: *''* Any string can be used, if you display multiple things in the same container.
- identAttr: *'id'* Any attribute to differentiate containers.
- gcProbability: *0.1* Anything between 0 and 1.
- gcAfter: *60 * 60 * 24 * 7* Number of seconds after which to clean the values.
- scrollFunction: *function(elem, distance) {}* Function to be used for scrolling. By default it simply scrolls from the top.
- afterScroll: *function(distance, options) {}* Function that will be called after scrolling to remembered position.
