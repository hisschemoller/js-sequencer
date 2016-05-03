/**
 * Plugin parameter objects.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH, WX) {

    function createParameter(specs, my) {
        
        var that,
            value,
            name = specs.name || 'Parameter',
            checkNumeric = function(value, defaultValue) {
                var checkedValue;
                if (value === undefined) {
                    checkedValue = defaultValue;
                } else if (isNaN(value)) {
                    console.error('Invalid parameter configuration.');
                } else {
                    checkedValue = value;
                }
                return checkedValue;
            },
            get = function() {
                return value;
            }
        
        my = my || {};
        my.value = value;
        my.checkNumeric = checkNumeric;
        
        that = {};
        that.get = get;
        
        return that;
    }

    function createGenericParameter(specs, my) {
        
        var that,
            defaultValue,
            min,
            max,
            unit = specs.unit || '';
        
        my = my || {};
        
        that = createParameter(specs, my);
        
        my.value = defaultValue = my.checkNumeric(specs.default || 0.0);
        min = my.checkNumeric(specs.min || 0.0);
        max = my.checkNumeric(specs.max || 1.0);
        
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
