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
            getValue = function() {
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
        my.callback = callback;
        
        that = {};
        
        that.getValue = getValue;
        that.getType = getType;
        that.getName = getName;
        return that;
    }

    function createGenericParameter(specs, my) {
        
        var that,
            min,
            max,
            unit = specs.unit || '',
            setValue = function(value) {
                my.value = Math.max(min, Math.min(value, max));
            },
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
        
        that.setValue = setValue;
        return that;
    }

    function createItemizedParameter(specs, my) {
        
        var that,
            model = specs.model,
            index,
            setValue = function(value, time, rampType) {
                my.value = value;
                setIndexByValue(value);
                my.callback(my.value, time, rampType);
            },
            setIndexByValue = function(value) {
                var i, n = model.length;
                for (i = 0; i < n; i++) {
                    if (model[i].value === value) {
                        index = i;
                        break;
                    }
                }
            },
            getModel = function() {
                return model;
            },
            getIndex = function() {
                return index;
            },
            getLabel = function() {
                return model[index].label;
            };
            
        my = my || {};
        
        that = createParameter(specs, my);
        
        setIndexByValue(specs.default ||  model[0].value);
        my.defaultValue = my.value;
        
        that.setValue = setValue;
        that.getModel = getModel;
        that.getIndex = getIndex;
        that.getLabel = getLabel;
        return that;
    }

    function createBooleanParameter(specs, my) {
        
        var that,
            setValue = function(value) {
                my.value = !!value;
                my.callback(my.value, time, rampType);
            };
        
        my = my || {};
        
        that = createParameter(specs, my);
        
        my.value = my.defaultValue = specs.default;
        
        that.setValue = setValue;
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
