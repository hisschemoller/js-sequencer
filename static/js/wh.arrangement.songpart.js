/**
 * SongPart is a
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * @constructor
     * @param {Object} pattern WH.Pattern object.
     * @param {Number} repeats Number of times the pattern is repeated.
     */
    function SongPart(pattern, repeats) {
        
    };

    /**
     * Exports
     */
    WH.SongPart = function (pattern, repeats) {
        return new SongPart(pattern, repeats);
    };

})(WH);
