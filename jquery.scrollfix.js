/**
 * ScrollFix 1.1 / jQuery plugin
 * Support: all modern browsers and MSIE 7+
 * @author ShiraNai7 <shira.cz>
 */
void function ($) {

    "use_strict";

    /**
     * Get Y position of DOM element, relative to given offset parent
     *
     * @param elem DOM element
     * @param offsetParent DOM element or null
     * @return integer
     */
    function getElementY(elem, offsetParent)
    {
        // do not check parent if window
        if (window === offsetParent || undefined === offsetParent) {
            offsetParent = null;
        }

        // determine position
        var y = 0;
        do y += elem.offsetTop;
        while ((elem = elem.offsetParent) && elem !== offsetParent);

        // return
        return y;
    }

    /**
     * Get X position of DOM element, relative to given offset parent
     *
     * @param elem DOM element
     * @param offsetParent DOM element or null
     * @return integer
     */
    function getElementX(elem, offsetParent)
    {
        // do not check parent if window
        if (window === offsetParent || undefined === offsetParent) {
            offsetParent = null;
        }

        // determine position
        var x = 0;
        do x += elem.offsetLeft
        while ((elem = elem.offsetParent) && elem !== offsetParent);

        // return
        return x;
    }

    /**
     * Apply ScrollFix to given elements
     *
     * @param element
     * @param options
     * @return object
     */
    $.fn.scrollFix = function (element, options) {

        options = $.extend({}, $.fn.scrollFix.defaults, options);

        if (this.length < 1) {
            throw new Error('Container not found');
        } else if (this.length > 1) {
            throw new Error('More than one countainer matched');
        }

        if (window !== options.scroller) {
            throw new Error('Custom scrollers are not yet supported');
        }

        var
            container = this.get(0),
            scroller = $(options.scroller),
            scrollerInitialScrollLeft,
            outerContainer = null,
            outerContainerElem,
            outerContainerInitialWidth,
            elementSubstitute = null,
            elementContainerOffset,
            elementOrigWidth,
            elementOrigLeftPosition,
            elementInitialWidth,
            elementInitialLeftOffset,
            fixing = false
        ;

        // get element
        if (typeof element === 'string') {
            element = $(element, container);
            if (element.length > 0) {
                element = element.get(0);
            }  else {
                throw new Error('Could not find "' + element + '"');
            }
        } else if (element instanceof jQuery) {
            if (element.length > 0) {
                element = element.get(0);
            } else {
                throw new Error('Could not find the element');
            }
        }

        // get outer container
        if (options.outerContainer) {
            outerContainer = $(options.outerContainer);
            if (outerContainer.length > 0) {
                outerContainerElem = outerContainer.get(0);
            } else {
                throw new Error('Could not find the outer container element');
            }
        }

        /**
         * Update element according to current scroll offset
         */
        function onScroll()
        {
            var scrollerTop = scroller.scrollTop();
            if (fixing) {
                if (scrollerTop <= getElementY(container, options.scroller) + elementContainerOffset + options.unfixBoundaryOffset) {

                    // unfix
                    fixing = false;

                    // hide substitute
                    if (options.autoElementSubstitute) {
                        elementSubstitute.style.display = 'none';
                    }

                    // update element
                    $(element)
                        .css({
                            width: elementOrigWidth,
                            left: elementOrigLeftPosition
                        })
                        .removeClass(options.elementFixClass)
                    ;

                    // update container
                    if (options.containerFixClass) {
                        $(container).removeClass(options.containerFixClass);
                    }

                    // callback
                    if (options.onChange) {
                        options.onChange(fixing);
                    }

                } else {
                    updateLeftPosition();
                }
            } else if (scrollerTop > getElementY(element, options.scroller) + options.fixBoundaryOffset) {

                // fix
                fixing = true;

                // store states
                elementOrigWidth = element.style.width;
                elementOrigLeftPosition = element.style.left;
                elementInitialWidth = $(element).width();
                if (outerContainer) {
                    scrollerInitialScrollLeft = scroller.scrollLeft();
                    elementInitialLeftOffset = getElementX(element) - getElementX(outerContainerElem) - scrollerInitialScrollLeft;
                    outerContainerInitialWidth = outerContainer.width();
                }
                if (element.offsetParent === container) {
                    elementContainerOffset = getElementY(element, container);
                } else {
                    elementContainerOffset = getElementY(element) - getElementY(container);
                }

                // create/enable substitute
                if (options.autoElementSubstitute) {
                    if (null === elementSubstitute) {
                        elementSubstitute = document.createElement('div');
                        elementSubstitute.className = 'jquery-scrollfix-substitute';
                        elementSubstitute.style.width = $(element).outerWidth() + 'px';
                        elementSubstitute.style.height = $(element).outerHeight() + 'px';
                        elementSubstitute = $(elementSubstitute).insertAfter(element).get(0);
                    } else {
                        elementSubstitute.style.display = 'block';
                    }
                }

                // update element
                $(element)
                    .css('width', elementInitialWidth)
                    .addClass(options.elementFixClass)
                ;

                // update container
                if (options.containerFixClass) {
                    $(container).addClass(options.containerFixClass);
                }

                // callback
                if (options.onChange) {
                    options.onChange(fixing);
                }

            }
        }

        /**
         * Update element according to current scroller size
         */
        function onResize()
        {
            if (fixing) {
                // update element width
                $(element).css(
                    'width',
                    (elementInitialWidth + outerContainer.width() - outerContainerInitialWidth) + 'px'
                );

                // update left position
                updateLeftPosition();

                // callback
                if (options.onResize) {
                    options.onResize(element);
                }
            }
        }

        /**
         * Update left position of the element
         */
        function updateLeftPosition()
        {
            $(element).css(
                'left',
                ((outerContainer ? getElementX(outerContainerElem) : 0) + elementInitialLeftOffset - (scroller.scrollLeft() - scrollerInitialScrollLeft)) + 'px'
            );
        }

        // bind to the scroll event
        $(options.scroller).scroll(onScroll);

        // bind to the resize event
        if (outerContainer) {
            $(options.scroller).resize(onResize);
        }

        // initial updates
        onScroll();
        if (outerContainer) {
            onResize();
        }

        // return controller object
        return {
            update: function () {
                onScroll();
                if (outerContainer) {
                    onResize();
                }
                return this;
            },
            updateScroll: function () {
                onScroll();
                return this;
            },
            updateSize: function () {
                if (outerContainer) {
                    onResize();
                }
                return this;
            }
        };

    };

    // defaults
    $.fn.scrollFix.defaults = {
        scroller: window,
        containerFixClass: 'scroll-fix',
        elementFixClass: 'scroll-fix',
        fixBoundaryOffset: 0,
        unfixBoundaryOffset: 0,
        autoElementSubstitute: false,
        outerContainer: null,
        onResize: null
    };

}(jQuery);
