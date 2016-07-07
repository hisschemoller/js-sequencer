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
        var t = Date.now();
        var id = 'xxxx'.replace(/[x]/g, function(c) {
            var r = (t + Math.random()*16) % 16 | 0;
            t = Math.floor(t/16);
            return (c == 'x' ? r : (r & 0x7|0x8)).toString(16);
        });
        return id;
    }
    
    /**
     * Converts a MIDI pitch number to frequency.
     * @param  {Number} midi MIDI pitch (0 ~ 127)
     * @return {Number}      Frequency (Hz)
     */
    WH.mtof = function (midi) {
        if (midi <= -1500) return 0;
        else if (midi > 1499) return 3.282417553401589e+38;
        else return 440.0 * Math.pow(2, (Math.floor(midi) - 69) / 12.0);
    };

    /**
     * Converts frequency to MIDI pitch.
     * @param  {Number} freq Frequency
     * @return {Number}      MIDI pitch
     */
    WH.ftom = function (freq) {
        return Math.floor(
            freq > 0 ?
            Math.log(freq/440.0) / Math.LN2 * 12 + 69 : -1500
        );
    };

})(WH);
