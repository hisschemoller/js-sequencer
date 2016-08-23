/**
 * ControlsView.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     */
    function ControlsView(specs) {

        // private variables
        var arrangement = specs.arrangement,
            conf = specs.conf,
            file = specs.file,
            view = specs.view,

            /**
             * Reference to this once function has closed.
             * @type {Object}
             */
            self = this;
    }

    /**
     * Exports
     */
    WH.ControlsView = function(specs) {
        return new ControlsView(specs);
    };

})(WH);
