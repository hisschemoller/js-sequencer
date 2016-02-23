/**
 * @description Plugin prototype.
 * @author Wouter Hisschemöller
 */

/**
 * @namespace WH
 */
window.WH = window.WH || {};

/**
 * @namespace WX.PlugIn
 */
WH.PlugIn = function() {
    this.id = this.getNewPluginId();
};

/**
 * Editable parameters that should be shown in the view.
 * @type {Array}
 */
WH.PlugIn.editableParams = [];

/**
 * Unique ID of this plugin instance.
 * @type {Number}
 */
WH.PlugIn.id;

/**
 * Create a new plugin ID.
 * @see http://stackoverflow.com/questions/1535631/static-variables-in-javascript
 * @return {Number} The ID is a number.
 */
WH.PlugIn.getNewPluginId = function() {
    // check to see if the counter has been initialized
    if (typeof WH.PlugIn.getNewPluginId.counter == 'undefined') {
        // it has not... perform the initialization
        WH.PlugIn.getNewPluginId.counter = 0;
    }
    return WH.PlugIn.getNewPluginId.counter++;
};

/**
 * Return the plugin's ID.
 * @return {Number} Plugin ID.
 */
WH.PlugIn.getId = function() {
    return this.id;
};

/**
 * Add parameters to the list of editable parameters.
 * @param {Array} paramKeysArray Parameter keys, array of strings.
 */
WH.PlugIn.addEditableParams = function(paramKeysArray) {
    this.editableParams = this.editableParams.concat(paramKeysArray);
};

/**
 * Test if a parameter is editable.
 * @param  {String} paramKey Key of the parameter to test.
 * @return {Boolean} True if the parameter should be rendered on screen.
 */
WH.PlugIn.isEditableParam = function(paramKey) {
    var i = 0,
        n = this.editableParams.length;
    for (i; i < n; i++) {
        if (this.editableParams[i].key == paramKey) {
            return true;
        }
    }
    return false;
};

/**
 * Set parameter value after first converting it based on its type.
 * @param String paramKey Parameter array key.
 * @param {Boolean|Number} paramValue New value for the parameter.
 */
WH.PlugIn.setParameter = function(paramKey, paramValue) {
    if (WX.hasParam(this, paramKey)) {
        var param = this.params[paramKey],
            value;
        switch (param.type) {
            case 'Boolean':
                value = paramValue;
                break;
            case 'Generic':
                value = param.min + ((param.max - param.min) * paramValue);
                break;
            case 'Itemized':
                value = param.model[paramValue].value;
                break;
        }

        this.set(paramKey, value);
    }
}

/**
 * Return parameter value after first converting it based on its type.
 * @param  {String} paramKey Key of the parameter in the parameters array. 
 * @return {Boolean|Number} Parameter value converted to be used by the view.
 */
WH.PlugIn.getParameter = function(paramKey) {
    if (WX.hasParam(this, paramKey)) {
        var param = this.params[paramKey],
            value;
        switch (param.type) {
            case 'Boolean':
                value = param.value;
                break;
            case 'Generic':
                value = (param.value - param.min) / (param.max - param.min);
                break;
            case 'Itemized':
                value = param.model.map(function(item) {
                    return item.value;
                }).indexOf(param.value);
                break;
        }

        return value;
    }
}

/**
 * Get the values of a parameter, not the parameter itself.
 * @param  {String} paramKey Key of the parameter in the parameters array. 
 * @return {Object} Object containing parameter values.
 */
WH.PlugIn.getParameterValues = function(paramKey) {
    if (WX.hasParam(this, paramKey)) {
        var param = this.params[paramKey];
        return {
            name: param.name,
            min: param.min,
            max: param.max,
            value: param.value,
            type: param.type,
            isEditable: this.isEditableParam(paramKey),
            valueNormalized: this.getParameter(paramKey)
        };
    }
};

/**
 * Get the values of all parameters in a preset, not the parameters themselves.
 * @param  {String} paramKey Key of the parameter in the parameters array. 
 * @return {Array} Array of parameter value objects.
 */
WH.PlugIn.getPresetValues = function() {
    var preset = {};
    for (var paramKey in this.params) {
        if (WX.hasParam(this, paramKey)) {
            preset[paramKey] = this.getParameterValues(paramKey);
        }
    }
    return preset;
}
