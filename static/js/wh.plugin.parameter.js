/**
 * Plugin parameter objects.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH, WX) {

    function createParameter(specs, my) {
        
        var that,
            type = specs.type,
            name = specs.name || 'Parameter',
            callback = specs.target['$' + specs.id],
            get = function() {
                return my.value;
            },
            getType = function() {
                return type;
            },
            getName = function() {
                return name;
            };
        
        my = my || {};
        my.value;
        my.defaultValue;
        
        that = {};
        
        that.get = get;
        that.getType = getType;
        that.getName = getName;
        return that;
    }

    function createGenericParameter(specs, my) {
        
        var that,
            min,
            max,
            unit = specs.unit || '',
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
            };
        
        my = my || {};
        
        that = createParameter(specs, my);
        
        my.value = my.defaultValue = checkNumeric(specs.default || 0.0);
        min = checkNumeric(specs.min || 0.0);
        max = checkNumeric(specs.max || 1.0);
        
        return that;
    }

    function createItemizedParameter(specs, my) {
        
        var that,
            model = specs.model,
            getModel = function() {
                return model;
            },
            getLabel = function() {
                var i = model.length;
                while (--i > 0) {
                    if (model[i].value === my.value) {
                        return model[i].label;
                    }
                }
            };
            
        my = my || {};
        
        that = createParameter(specs, my);
        
        my.value = my.defaultValue = specs.default ||  model[0].value;
        
        that.getModel = getModel;
        that.getLabel = getLabel;
        return that;
    }

    function createBooleanParameter(specs, my) {
        
        var that;
        
        my = my || {};
        
        that = createParameter(specs, my);
        
        my.value = my.defaultValue = specs.default;
        
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
