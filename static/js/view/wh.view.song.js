/**
 * Song view object.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createSongView(specs, my) {
        var that,
            arrangement = specs.arrangement,
            conf = specs.conf,
            rootEl = $('.song'),
            listEl,
            partEls,
            partTemplate = $('#template-song-part'),
            muteTemplate = $('#template-song-mute'),
            selectors = {
                part: '.song-part',
                partNr: '.song-part__order',
                partPattern: '.song-part__pattern',
                partRepeats: '.song-part__repeats',
                mutes: '.song-part__mutes',
                mute: '.song-part__mute'
            },
            classes = {
                mute: 'song-part__mute'
            }
            
            /**
             * Initialise the component.
             */
            init = function() {
                listEl = my.rootEl.find('.song__list');

                rootEl.on(my.eventType.click, onClick);
            },

            /** 
             * Click on song part.
             * @param  {event} e Mouse or touch event.
             */
            onClick = function(e) {
                e.preventDefault();
                var el, partEl, muteIndex, partIndex;

                el = $(e.target).closest(selectors.mute);
                if (el.hasClass(classes.mute)) {
                    partEl = el.closest(selectors.part);
                    partIndex = rootEl.find(selectors.part).index(partEl);
                    muteIndex = el.closest(selectors.mutes).find(selectors.mute).index(el);

                    arrangement.toggleSongMute(partIndex, muteIndex);
                }
            },
            
            /**
             * Create a song list from song data.
             * @param {array} songData Array of song parts.
             */
            setSong = function(songData) {
                var i, j, songLength, trackCount, partData, partEl, muteEl, mutesEl;
                
                listEl.empty();
                trackCount = conf.getTrackCount();
                songLength = songData.length;
                for (i = 0; i < songLength; i++) {
                    partData = songData[i];
                    
                    partEl = partTemplate.children().first().clone();
                    partEl.find(selectors.partNr).find(my.selectors.ctrlText).text((i + 1) + '.');
                    partEl.find(selectors.partPattern).find(my.selectors.ctrlText).text(partData.getPatternIndex() + 1);
                    partEl.find(selectors.partRepeats).find(my.selectors.ctrlText).text('x ' + partData.getRepeats());

                    // mutes
                    mutesEl = partEl.find(selectors.mutes);
                    for (j = 0; j < trackCount; j++) {
                        muteEl = muteTemplate.children().first().clone();
                        muteEl.addClass(my.classes.colors[j]);
                        muteEl.find(my.selectors.ctrlText).text(String.fromCharCode(65 + j));
                        mutesEl.append(muteEl);

                        if (partData.getMutes()[j]) {
                            muteEl.addClass(my.classes.selected);
                        }
                    }

                    listEl.append(partEl);
                }
                partEls = listEl.find(selectors.part);
            },

            /**
             * Update all mute elements' selected state.
             * @param {number} partIndex Song part in which to update the mutes.
             * @param {array} mutes Mute values to use.
             */
            updateMutes = function(partIndex, mutes) {
                var partEls = rootEl.find(selectors.part),
                    muteEls = $(partEls[partIndex]).find(selectors.mute),
                    i, n = muteEls.length;
                for (i = 0; i < n; i++) {
                    $(muteEls[i]).toggleClass(my.classes.selected, !!mutes[i]);
                }
            }
            
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
        my.rootEl = rootEl;
        
        that = WH.createBaseView(specs, my);
        
        init();
        
        that.setSong = setSong;
        that.updateMutes = updateMutes;
        that.setActivePart = setActivePart;
        return that;
    }
    
    WH.createSongView = createSongView;

})(WH);
