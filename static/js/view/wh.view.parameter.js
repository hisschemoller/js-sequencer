/**
 * Overlay with slider to adjust a generic or itemized parameter value.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    
    function createParameterEditView(specs) {
        var that,
            rootEl = $('#overlay-parameter-edit'),
            
            initDOMEvents = function() {
                
            },
            
            /**
             * 
             */
            showParam = function(param) {
                
            };

        var my = my || {};
        my.rootEl = rootEl;

        that = WH.createBaseView(specs, my);
        
        initDOMEvents();
        
        that.showParam = showParam;
        return that;
    }

    WH.createParameterEditView = createParameterEditView;

})(WH);

        
        
