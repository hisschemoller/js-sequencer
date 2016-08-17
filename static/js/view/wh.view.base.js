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
                disabled: 'disabled'
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
        
        that.setVisible = setVisible;
        return that;
    }

    ns.createBaseView = createBaseView;

})(WH);
