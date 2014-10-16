"use_strict";

var Shira;
(function (Shira, $) {
    (function (ScrollFix) {
        /**
         * @constructor
         *
         * @param {HTMLElement} element DOM element that is going to be fixed
         * @param {Object}      options option map
         */
        ScrollFix.Watcher = function (element, options) {
            this.element = element;
            this.options = $.extend({}, ScrollFix.Watcher.defaults, options);
        };

        ScrollFix.Watcher.defaults = {
            fixClass: 'scroll-fix',
            fixTop: 0,
            fixOffset: 0,
            unfixOffset: 0,
            onUpdateFixed: null,
            syncSize: true,
            syncPosition: true,
            style: true
        };

        ScrollFix.Watcher.prototype = {
            element: null,
            substitute: null,
            options: null,
            fixed: false,
            attached: false,

            /**
             * Get absolute X position of the given element
             *
             * @param {HTMLElement} elem
             * @returns {Number}
             */
            getElementX: function (elem) {
                var x = 0;
                do x += elem.offsetLeft;
                while (elem = elem.offsetParent);

                return x;
            },

            /**
             * Get absolute Y position of the given element
             *
             * @param {HTMLElement} elem
             * @returns {Number}
             */
            getElementY: function (elem) {
                var y = 0;
                do y += elem.offsetTop;
                while (elem = elem.offsetParent);

                return y;
            },

            /**
             * Fix the element
             */
            fix: function () {
                // create the substitute
                this.substitute = $(this.element.cloneNode(false))
                    .css('visibility', 'hidden')
                    .height($(this.element).height())
                    .insertAfter(this.element)[0]
                ;

                // add class and styles
                if (this.options.style) {
                    $(this.element)
                        .css('position', 'fixed')
                        .css('top', this.options.fixTop + 'px')
                    ;
                }
                $(this.element).addClass(this.options.fixClass);
            },

            /**
             * Update the fixed element
             */
            updateFixed: function () {
                // size
                if (this.options.syncSize) {
                    $(this.element)
                        .width($(this.substitute).width())
                    ;
                }

                // position
                if (this.options.syncPosition) {
                    var currentScrollLeft = $(window).scrollLeft();
                    var substituteLeftOffset = this.getElementX(this.substitute);

                    $(this.element).css('left', (substituteLeftOffset - currentScrollLeft) + 'px');
                }

                // callback
                if (null !== this.options.onUpdateFixed) {
                    this.options.onUpdateFixed(this);
                }
            },

            /**
             * Unfix the element
             */
            unfix: function () {
                // remove the substitute
                $(this.substitute).remove();
                this.substitute = null;
                
                // reset applied styles and remove class
                var cssReset = {};
                if (this.options.syncPosition) {
                    cssReset.left = '';
                }
                if (this.options.syncSize) {
                    cssReset.width = '';
                }
                if (this.options.style) {
                    cssReset.position = '';
                    cssReset.top = '';
                }
                $(this.element)
                    .css(cssReset)
                    .removeClass(this.options.fixClass)
                ;
            },

            /**
             * Attach the watcher
             */
            attach: function () {
                if (this.attached) {
                    throw new Error('Already attached');
                }

                var that = this;

                this.updateEventHandler = function () {
                    that.pulse();
                };

                $(window)
                    .scroll(this.updateEventHandler)
                    .resize(this.updateEventHandler)
                ;

                this.attached = true;
                this.pulse();
            },

            /**
             * Detach the watcher
             */
            detach: function () {
                if (!this.attached) {
                    throw new Error('Not attached');
                }

                $(window)
                    .unbind('scroll', this.updateEventHandler)
                    .unbind('resize', this.updateEventHandler)
                ;

                this.attached = false;
            },

            /**
             * Pulse the watcher
             */
            pulse: function () {
                var currentScroll = $(window).scrollTop();

                if (this.fixed) {
                    if (currentScroll <= this.getElementY(this.substitute) + this.options.unfixOffset) {
                        this.unfix();
                        this.fixed = false;
                    } else {
                        this.updateFixed();
                    }
                } else {
                    if (currentScroll >= this.getElementY(this.element) + this.options.fixOffset) {
                        this.fix();
                        this.fixed = true;
                        this.updateFixed();
                    }
                }
            }
        };

        // jQuery methods

        /**
         * Attach a watcher to the matched element
         *
         * @param {Object} options watcher option map
         * @returns {ScrollFix.Watcher|Boolean} false if no element was matched
         */
        $.fn.scrollFix = function (options) {
            var element = this[0];

            if (element) {
                var watcher = new ScrollFix.Watcher(element, options);
                watcher.attach();

                return watcher;
            }

            return false;
        };
    })(Shira.ScrollFix || (Shira.ScrollFix = {}));
})(Shira || (Shira = {}), jQuery);
