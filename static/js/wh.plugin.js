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
