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

        if (options.updateWidth && !options.elementSubstitute) {
            throw new Error('The option "updateWidth" requires "elementSubstitute" to be enabled as well');
        }

        var
            container = this.get(0),
            scroller = $(options.scroller),
            scrollerInitialScrollLeft,
            outerContainer = null,
            outerContainerElem,
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
         * Update state of the element
         */
        function updateState()
        {
            var scrollerTop = scroller.scrollTop();
            if (fixing) {
                if (scrollerTop <= getElementY(container, options.scroller) + elementContainerOffset + options.unfixBoundaryOffset) {

                    // unfix
                    fixing = false;

                    // hide substitute
                    if (options.elementSubstitute) {
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
                scrollerInitialScrollLeft = scroller.scrollLeft();
                elementInitialLeftOffset = getElementX(element) - (outerContainer ? getElementX(outerContainerElem) : 0) - scrollerInitialScrollLeft;
                if (element.offsetParent === container) {
                    elementContainerOffset = getElementY(element, container);
                } else {
                    elementContainerOffset = getElementY(element) - getElementY(container);
                }

                // create/enable substitute
                if (options.elementSubstitute) {
                    if (null === elementSubstitute) {
                        elementSubstitute = element.cloneNode(false);
                        elementSubstitute.style.visibility = 'hidden';
                        elementSubstitute = $(elementSubstitute)
                            .insertAfter(element)
                            .addClass('jquery-scrollfix-substitute')
                            .get(0)
                        ;
                    } else {
                        elementSubstitute.style.display = 'block';
                    }
                    if ($(elementSubstitute).height() !== $(element).height()) {
                        $(elementSubstitute).height($(element).height());
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
         * Update dimensions of the element
         */
        function updateDimensions()
        {
            if (fixing) {

                // update element width
                if (options.updateWidth) {
                    $(element).css(
                        'width',
                        $(elementSubstitute).width() + 'px'
                    );
                    if (options.onResize) {
                        options.onResize(element);
                    }
                }

                // update left position
                updateLeftPosition();

            }
        }

        /**
         * Update left position of the element
         */
        function updateLeftPosition()
        {
            var leftPosition = -scroller.scrollLeft() + scrollerInitialScrollLeft;
            if (outerContainer) {
                // use outer  countainer
                leftPosition += getElementX(outerContainerElem) + elementInitialLeftOffset;
            } else if(elementSubstitute) {
                // use element's substitute
                leftPosition += getElementX(elementSubstitute);
            } else {
                // offset only
                leftPosition += elementInitialLeftOffset;
            }
            $(element).css('left', leftPosition + 'px');
        }

        // bind to events
        $(options.scroller)
            .scroll(updateState)
            .resize(updateDimensions)
        ;

        // initial update
        updateState();
        updateDimensions();

        // return controller object
        return {
            update: function () {
                updateState();
                updateDimensions();
                return this;
            },
            updateState: function () {
                updateState();
                return this;
            },
            updateDimensions: function () {
                updateDimensions();
                return this;
            }
        };

    };

    // defaults
    $.fn.scrollFix.defaults = {
        scroller: window,
        containerFixClass: 'scroll-fix',
        elementFixClass: 'scroll-fix',
        elementSubstitute: true,
        fixBoundaryOffset: 0,
        unfixBoundaryOffset: 0,
        outerContainer: null,
        updateWidth: true,
        onResize: null
    };

}(jQuery);
