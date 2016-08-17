/**
 * Song view object.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createSongView(specs, my) {
        var that,
            listEl,
            partEls,
            partTemplate = $('#template-song-part'),
            selectors = {
                tileLabel: '.ctrl__text',
                part: '.song-part',
                partNr: '.song-part__order',
                partPattern: '.song-part__pattern',
                partRepeats: '.song-part__repeats',
            },
            
            /**
             * Initialise the component.
             */
            init = function() {
                listEl = my.rootEl.find('.song__list');
            }
            
            /**
             * Create a song list from song data.
             * @param {array} songData Array of song parts.
             */
            setSong = function(songData) {
                var i = 0,
                    songLength = songData.length,
                    partData,
                    partEl;
                    
                listEl.empty();
                for (i; i < songLength; i++) {
                    partData = songData[i];
                    partEl = partTemplate.children().first().clone();
                    partEl.find(selectors.partNr).find(selectors.tileLabel).text((i + 1) + '.');
                    partEl.find(selectors.partPattern).find(selectors.tileLabel).text(partData.getPatternIndex() + 1);
                    partEl.find(selectors.partRepeats).find(selectors.tileLabel).text('x ' + partData.getRepeats());
                    listEl.append(partEl);
                }
                partEls = listEl.find(selectors.part);
            },
            
            /**
             * Show an active song part.
             * @param {number} index Index of the active song part.
             */
            setActivePart = function(index) {
                partEls.removeClass(my.classes.active);
                if (!isNaN(index)) {
                    $(partEls[index]).addClass(my.classes.active);
                }
            };
            
        var my = my || {};
        my.rootEl = $('.song');
        
        that = WH.createBaseView(specs, my);
        
        init();
        
        that.setSong = setSong;
        that.setActivePart = setActivePart;
        return that;
    }
    
    WH.createSongView = createSongView;

})(WH);
