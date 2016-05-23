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
            list = view.find('.song__list'),
            partTemplate = $('#template-song-part'),
            selectors = {
                tileLabel: '.ctrl__text',
                partNr: '.song-part__order',
                partPattern: '.song-part__pattern',
                partRepeats: '.song-part__repeats',
            },
            setVisible = function(isVisible) {
                view.toggle(isVisible === true);
            }, 
            setSong = function(songData) {
                var i = 0,
                    songLength = songData.length,
                    partData,
                    partEl;
                    
                    console.log(songData.length, songData);
                list.empty();
                for (i; i < songLength; i++) {
                    partData = songData[i];
                    partEl = partTemplate.children().first().clone();
                    partEl.find(selectors.partNr).find(selectors.tileLabel).text((i + 1) + '.');
                    partEl.find(selectors.partPattern).find(selectors.tileLabel).text(partData.getPatternIndex() + 1);
                    partEl.find(selectors.partRepeats).find(selectors.tileLabel).text('x ' + partData.getRepeats());
                    list.append(partEl);
                }
            };
        
        that = {};
        that.setVisible = setVisible;
        that.setSong = setSong;
        return that;
    }
    
    WH.createSongView = createSongView;

})(WH);
