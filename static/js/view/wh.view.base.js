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
             * Set DOM element visibility.
             * @param {boolean} isVisible True if visible.
             */
            setVisible = function(isVisible) {
                my.rootEl.toggle(isVisible === true);
            };
        
        that.setVisible = setVisible;
        return that;
    }

    ns.createBaseView = createBaseView;

})(WH);
