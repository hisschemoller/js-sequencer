/**
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {

    /**
     * Find element in array by property value.
     * @param {Array} arr The array in which to search.
     * @param {String} propName Name of the property.
     * @param {String} propValue Value of the property.
     */
    WH.findElement = function(arr, propName, propValue) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][propName] == propValue) {
                return arr[i];
            }
        }
    };

    /**
     * 4 bytes UID generator.
     * @return {String} A probably unique ID.
     */
    WH.getUid4 = function() {
        var t = performance.now();
        var id = 'xxxx'.replace(/[x]/g, function(c) {
            var r = (t + Math.random()*16) % 16 | 0;
            t = Math.floor(t/16);
            return (c == 'x' ? r : (r & 0x7|0x8)).toString(16);
        });
        return id;
    }

})(WH);
