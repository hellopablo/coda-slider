/*
Coda Slider v1.0, a jQuery plugin
(ported from http://jqueryfordesigners.com/coda-slider-effect/)

Copyright (c) 2010 HelloPablo | http://jquery.hellopablo.co.uk/Coda-Slider/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

Author:         Pablo de la Pena (HelloPablo)
Version:        1.0
Dated:          31st March 2010

Dependency:     jQuery 1.2.6
                jQuery.scrollTo 1.4.2
                jQuery.localScroll 1.2.7
                jQuery.serialScroll 1.2.2
                jQuery.easing 1.3 (find out real name)
			    			    
Documentation:  http://jquery.hellopablo.co.uk/Coda-Slider/
                http://jquery.com
                http://flesler.blogspot.com/2007/10/jqueryscrollto.html
                http://flesler.blogspot.com/2007/10/jquerylocalscroll-10.html
                http://flesler.blogspot.com/2008/02/jqueryserialscroll.html
                http://gsgd.co.uk/sandbox/jquery/easing/

CHANGE LOG


     1.0        - [31 March 2010] Ported original code into a jQuery plugin.
     
*/

(function($) {
	
	//	PLUGIN DEFINITION
	$.fn.codaSlider = function(options, scrollOptions) {
		
		// Extend options
		var opts		= $.extend({}, $.fn.codaSlider.defaults, options);
		
		// Plugin implementation code goes here.
		
		// Collect the $container and $panels
		var $container = $(this).find('.scrollContainer');
		var $panels = $container.children('div');
		

		
	    // float the panels left if we're going horizontal
	    if (opts.horizontal) {
	        $panels.css({
	            'float' : 'left',
	            'position' : 'relative' // IE fix to ensure overflow is hidden
	        });
	
	        // calculate a new width for the container (so it holds all panels)
	        $container.css('width', $panels[0].offsetWidth * $panels.length);
	    }

	    // collect the scroll object, at the same time apply the hidden overflow
	    // to remove the default scrollbars that will appear
	    var $scroll = $(this).find('.scroll').css('overflow', 'hidden');
		
		// apply our left + right arrows
		if (opts.navArrows) {
	    $scroll
	    	.before('<img class="scrollButtons left" src="' + opts.arrowLeft + '" />')
	    	.after('<img class="scrollButtons right" src="' + opts.arrowRight + '" />');
	    }
	    	
	    $(this).find('.navigation').find('a').click($.fn.codaSlider.selectNav);
		
		// Go somewhere if there is a hash
	    if (window.location.hash) {
	        this.trigger({ id : window.location.hash.substr(1) });
	    } else {
	        $('ul.navigation a:first').click();
	    }

	    // offset is used to move to *exactly* the right place, since I'm using
	    // padding on my example, I need to subtract the amount of padding to
	    // the offset.  Try removing this to get a good idea of the effect
	    var offset = parseInt((opts.horizontal ? 
	        $container.css('paddingTop') : 
	        $container.css('paddingLeft')) 
	        || 0) * -1;
	        

		var scrollOptions = {
		    target: $scroll, // the element that has the overflow
		
		    // can be a selector which will be relative to the target
		    items: $panels,
		
		    navigation: '.navigation a',
		
		    // selectors are NOT relative to document, i.e. make sure they're unique
		    prev: 'img.left', 
		    next: 'img.right',
		
		    // allow the scroll effect to run both directions
		    axis: 'xy',
		
		    onAfter: $.fn.codaSlider.trigger, // our final callback
		
		    offset: offset,
		
		    // duration of the sliding effect
		    duration: opts.duration,
		
		    // easing - can be used with the easing plugin: 
		    // http://gsgd.co.uk/sandbox/jquery/easing/
		    easing: opts.easing
		};

	    // apply serialScroll to the slider - we chose this plugin because it 
	    // supports// the indexed next and previous scroll along with hooking 
	    // in to our navigation.
	    
	    $(this).serialScroll(scrollOptions);
    
		// now apply localScroll to hook any other arbitrary links to trigger 
		// the effect
		$.localScroll(scrollOptions);
		
		scrollOptions.duration = 1;
		$.localScroll.hash(scrollOptions);
	
	};
	//	END PLUGIN DEFINITION
	
	
	// PLUGIN DEFAULTS
	$.fn.codaSlider.defaults = {
	
	    // if false, we'll float all the panels left and fix the width 
 	   // of the container
		horizontal:		true,
		arrowLeft:		"images/scroll_left.png",
		arrowRight:		"images/scroll_right.png",
		easing:			"swing",
		duration:		500,
		navArrows:		false
	};
	
	$.fn.codaSlider.trigger = function(data) {
		//	This bit seems a bit hacky....
		//	but scope issues mean a relative path is needed.
		//	Fix if a better solution is available!
		var el = $(data).parent().parent().parent().find('.navigation').find('a[href$="' + data.id + '"]').get(0);
		$.fn.codaSlider.selectNav.call(el);
	};
	
	$.fn.codaSlider.selectNav = function() {
        $(this)
            .parents('ul:first')
                .find('a')
                    .removeClass('selected')
                .end()
            .end()
            .addClass('selected');
	};

})(jQuery);