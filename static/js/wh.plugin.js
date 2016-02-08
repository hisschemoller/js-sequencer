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
WH.PlugIn = {};

/**
 * Editable parameters that should be shown in the view.
 * @type {Array}
 */
WH.PlugIn.editableParams = [];

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
