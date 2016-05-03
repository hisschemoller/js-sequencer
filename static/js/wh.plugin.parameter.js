/**
 * Plugin parameter objects.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH, WX) {

    function createParameter(specs, my) {
        
        var that;
        
        my = my || {};
        
        that = {};
        
        return that;
    }

    function createGenericParameter(specs, my) {
        
        var that;
        
        my = my || {};
        
        that = createParameter(specs, my);
        
        return that;
    }

    function createItemizedParameter(specs, my) {
        
        var that;
        
        my = my || {};
        
        that = createParameter(specs, my);
        
        return that;
    }

    function createBooleanParameter(specs, my) {
        
        var that;
        
        my = my || {};
        
        that = createParameter(specs, my);
        
        return that;
    }
    
    WH.createParameter = function(options) {
        switch (options.type) {
            case 'generic':
                return createGenericParameter(options);
            case 'itemized':
                return createItemizedParameter(options);
            case 'boolean':
                return createBooleanParameter(options);
        }
    };

})(WH, WX);
