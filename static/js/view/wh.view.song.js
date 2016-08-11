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
            listEl = view.find('.song__list'),
            partEls,
            partTemplate = $('#template-song-part'),
            selectors = {
                tileLabel: '.ctrl__text',
                part: '.song-part',
                partNr: '.song-part__order',
                partPattern: '.song-part__pattern',
                partRepeats: '.song-part__repeats',
            },
            classes = {
                active: 'is-active'
            },
            setVisible = function(isVisible) {
                view.toggle(isVisible === true);
            }, 
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
            setActivePart = function(index) {
                partEls.removeClass(classes.active);
                if (!isNaN(index)) {
                    $(partEls[index]).addClass(classes.active);
                }
            };
        
        that = {};
        that.setVisible = setVisible;
        that.setSong = setSong;
        that.setActivePart = setActivePart;
        return that;
    }
    
    WH.createSongView = createSongView;

})(WH);
