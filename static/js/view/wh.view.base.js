/**
 * Base functonality and properties for all views.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (ns) {
    
    function createBaseView(specs, my) {
        var that = specs.that,
            
            /**
             * CSS class names.
             */
            classes = {
                selected: 'selected',
                active: 'active',
                disabled: 'disabled',
                colors: ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8'],
                allColors: 'color1 color2 color3 color4 color5 color6 color7 color8'
            },
            
            /**
             * CSS selectors for DOM elements.
             */
            selectors = {
                ctrl: '.ctrl',
                ctrlGeneric: '.ctrl--generic',
                ctrlBoolean: '.ctrl--boolean',
                ctrlItemized: '.ctrl--itemized',
                ctrlBackground: '.ctrl__background',
                ctrlHighlight: '.ctrl__hilight',
                ctrlLabel: '.ctrl__label',
                ctrlText: '.ctrl__text',
                ctrlName: '.ctrl__name',
                ctrlValue: '.ctrl__value'
            },

            /**
             * True if a touch screen is detected.
             * @type {Boolean}
             */
            isTouchDevice = 'ontouchstart' in document.documentElement,
            
            /**
             * Type of events to use, touch or mouse
             * @type {String}
             */
            eventType = {
                start: isTouchDevice ? 'touchstart' : 'mousedown',
                end: isTouchDevice ? 'touchend' : 'mouseup',
                click: isTouchDevice ? 'touchend' : 'click',
                move: isTouchDevice ? 'touchmove' : 'mousemove',
            },
            
            /**
             * Set DOM element visibility.
             * @param {boolean} isVisible True if visible.
             */
            setVisible = function(isVisible) {
                my.rootEl.toggle(isVisible === true);
            };
        
        my = my || {};
        my.classes = classes;
        my.selectors = selectors;
        my.eventType = eventType;
        
        that.setVisible = setVisible;
        return that;
    }

    ns.createBaseView = createBaseView;

})(WH);
