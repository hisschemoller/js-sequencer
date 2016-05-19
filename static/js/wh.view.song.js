/**
 * Song view object.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createSongView(specs, my) {
        var that,
            view = $('.song'),
            setVisible = function(isVisible) {
                view.toggle(isVisible === true);
            };
        
        that = {};
        that.setVisible = setVisible;
        return that;
    }
    
    WH.createSongView = createSongView;

})(WH);
