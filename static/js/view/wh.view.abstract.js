/**
 * ControlsView.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    function AbstractView(settings) {

        var defaults = {
                activeClass: 'is-active',
                selectedClass: 'is-selected',
                disabledClass: 'is-disabled',
                channelColorClasses: ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8'],
                ctrlClass: '.ctrl',
                ctrlGenericClass: '.ctrl--generic',
                ctrlBooleanClass: '.ctrl--boolean',
                ctrlItemizedClass: '.ctrl--itemized',
                ctrlBackgroundClass: '.ctrl__background',
                ctrlHighlightClass: '.ctrl__hilight',
                ctrlLabelClass: '.ctrl__label',
                ctrlTextClass: '.ctrl__text',
                ctrlNameClass: '.ctrl__name',
                ctrlValueClass: '.ctrl__value'
            };

        settings = Object.assign(settings, defaults);

        /**
         * True if a touch screen is detected.
         * @type {Boolean}
         */
        this.isTouchDevice = 'ontouchstart' in document.documentElement;
        
        /**
         * Type of events to use, touch or mouse
         * @type {String}
         */
        this.eventType = {
            start: this.isTouchDevice ? 'touchstart' : 'mousedown',
            end: this.isTouchDevice ? 'touchend' : 'mouseup',
            click: this.isTouchDevice ? 'touchend' : 'click',
            move: this.isTouchDevice ? 'touchmove' : 'mousemove',
        };

        /**
         * Set the color of a selection of controls.
         * @param {Object} controls jQuery selection of elements.
         * @param {String} colorClass Class to add that contains the color CSS.
         */
        this.setColor = function(controls, colorClass) {
            controls.find(settings.ctrlBackgroundClass).addClass(colorClass);
            controls.find(settings.ctrlHighlightClass).addClass(colorClass);
        };

        /**
         * Clear the colors of a selection of controls.
         * @param {Object} controls jQuery selection of elements.
         * @param  {Array} colorClasses CSS classes to remove from the controls.
         */
        this.clearColors = function(controls, colorClasses) {
            var i = 0,
                n = colorClasses.length;
            for (i; i < n; i++) {
                controls.find(settings.ctrlBackgroundClass).removeClass(colorClasses[i]);
                controls.find(settings.ctrlHighlightClass).removeClass(colorClasses[i]);
            }
        };

        /**
         * Play the light up animation of a control.
         * @param {Object} controlEls jQuery selection of elements.
         */
        this.animateHighlight = function(controlEls) {
            controlEls.find(settings.ctrlHighlightClass)
                .show()
                .stop()
                .fadeIn(0)
                .fadeOut(300);
        }
    }

    AbstractView.prototype = {};

    WH.AbstractView = AbstractView;

})(WH);
