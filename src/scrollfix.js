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

            // set fix & unfix offset defaults based on positions
            if (this.options.topFixOffset === null) {
                this.options.topFixOffset = -this.options.topPosition;
            }
            if (this.options.topUnfixOffset === null) {
                this.options.topUnfixOffset = this.options.topPosition;
            }
            if (this.options.bottomFixOffset === null) {
                this.options.bottomFixOffset = -this.options.bottomPosition;
            }
            if (this.options.bottomUnfixOffset === null) {
                this.options.bottomUnfixOffset = this.options.bottomPosition;
            }

            $(element).data('shira.scrollfix', this);
        };

        ScrollFix.Watcher.defaults = {
            topFixClass: 'scrollfix-top',
            bottomFixClass: 'scrollfix-bottom',
            substituteClass: 'scrollfix-subtitute',
            topPosition: 0,
            bottomPosition: 0,
            topFixOffset: null,
            topUnfixOffset: null,
            bottomFixOffset: null,
            bottomUnfixOffset: null,
            syncSize: true,
            syncPosition: true,
            style: true,
            styleSubstitute: true,
            side: 'top'
        };

        ScrollFix.Watcher.prototype = {
            element: null,
            substitute: null,
            options: null,
            fixed: false,
            fixedAt: null,
            attached: false,
            checkTop: false,
            checkBottom: false,

            /**
             * Get absolute X position of the given element
             *
             * @private
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
             * @private
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
             *
             * @param {String} side top or bottom
             */
            fix: function (side) {
                if (!this.fixed) {
                    // dispatch event
                    if (this.dispatchEvent('fix').isDefaultPrevented()) {
                        return;
                    }

                    var $element = $(this.element);

                    // create the substitute
                    var $substitute = $(this.element.cloneNode(false))
                        .addClass(this.options.substituteClass);

                    if (this.options.styleSubstitute) {
                        $substitute
                            .css('visibility', 'hidden')
                            .height($element.css('box-sizing') === 'border-box' ? $element.outerHeight() : $element.height());
                    }

                    this.substitute = $substitute.insertAfter(this.element)[0];

                    // set styles
                    if (this.options.style) {
                        var styles = {position: 'fixed'};

                        if (side === 'top') {
                            styles.top = this.options.topPosition + 'px';
                        } else {
                            styles.bottom = this.options.bottomPosition + 'px';
                        }

                        $element.css(styles);
                    }

                    // add class
                    $element.addClass(side === 'top' ? this.options.topFixClass : this.options.bottomFixClass);

                    // update state
                    this.fixed = true;
                    this.fixedAt = side;

                    // dispatch event
                    this.dispatchEvent('fixed');
                }
            },

            /**
             * Update the fixed element
             *
             * @private
             */
            updateFixed: function () {
                // size
                if (this.options.syncSize) {
                    $(this.element).width($(this.substitute).width());
                }

                // position
                if (this.options.syncPosition) {
                    var currentScrollLeft = $(window).scrollLeft();
                    var substituteLeftOffset = this.getElementX(this.substitute);

                    $(this.element).css('left', (substituteLeftOffset - currentScrollLeft) + 'px');
                }

                // dispatch event
                this.dispatchEvent('update');
            },

            /**
             * Unfix the element
             */
            unfix: function () {
                if (this.fixed) {
                    // dispatch event
                    if (this.dispatchEvent('unfix').isDefaultPrevented()) {
                        return;
                    }

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
                        cssReset[this.fixedAt] = '';

                    }
                    $(this.element)
                        .css(cssReset)
                        .removeClass(this.fixedAt === 'top' ? this.options.topFixClass : this.options.bottomFixClass);

                    // update state
                    this.fixed = false;
                    this.fixedAt = null;

                    // dispatch event
                    this.dispatchEvent('unfixed');
                }
            },

            /**
             * Attach the watcher
             */
            attach: function () {
                if (!this.attached) {
                    var that = this;

                    this.updateEventHandler = function () {
                        that.pulse();
                    };

                    $(window)
                        .scroll(this.updateEventHandler)
                        .resize(this.updateEventHandler);

                    this.attached = true;
                    this.pulse();
                }
            },

            /**
             * Detach the watcher
             */
            detach: function () {
                if (this.attached) {
                    this.unfix();

                    $(window)
                        .unbind('scroll', this.updateEventHandler)
                        .unbind('resize', this.updateEventHandler);

                    this.attached = false;
                }
            },

            /**
             * Pulse the watcher
             */
            pulse: function () {
                var $window = $(window);
                var currentScrollTop = $window.scrollTop();
                var currentScrollBottom = currentScrollTop + $window.height();

                var elementToCheck = this.fixed ? this.substitute : this.element;
                var elementTop = this.getElementY(elementToCheck);
                var elementBottom = elementTop + $(elementToCheck).outerHeight();

                if (this.fixed) {
                    if (this.fixedAt === 'top') {
                        if (currentScrollTop <= elementTop - this.options.topUnfixOffset) {
                            this.unfix();
                        }
                    } else if (currentScrollBottom >= elementBottom + this.options.bottomUnfixOffset) {
                        this.unfix();
                    }
                } else if (
                    (this.options.side === 'top' || this.options.side === 'both')
                    && currentScrollTop > elementTop + this.options.topFixOffset
                ) {
                    this.fix('top');
                } else if (
                    (this.options.side === 'bottom' || this.options.side === 'both')
                    && currentScrollBottom < elementBottom - this.options.bottomFixOffset
                ) {
                    this.fix('bottom');
                }

                if (this.fixed) {
                    this.updateFixed();
                }
            },

            /**
             * Dispatch an event
             *
             * @private
             *
             * @param {String} type
             * @returns {jQuery.Event}
             */
            dispatchEvent: function (type) {
                var event = new $.Event(type + '.shira.scrollfix', {
                    watcher: this
                });

                $(this.element).trigger(event);

                return event;
            }
        };

        // jQuery methods

        /**
         * Attach a watcher to the matched element
         *
         * @param {Object} options watcher option map
         * @returns {jQuery}
         */
        $.fn.scrollFix = function (options) {
            for (var i = 0; i < this.length; ++i) {
                new ScrollFix.Watcher(this[i], options).attach();
            }

            return this;
        };
    })(Shira.ScrollFix || (Shira.ScrollFix = {}));
})(Shira || (Shira = {}), jQuery);
