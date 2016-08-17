/**
 * Buton row to select a channel.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createChannelSelectView(specs, my) {
        var that,
            conf = specs.conf,
            rootEl = $('.channel-selects'),
            channelSelectTemplate = $('#template-channel-select'),
            channelSelectEls,
            channelIndex,
            selectors = {
                channelSelect: '.ctrl--channel-select'
            },
            
            /**
             * Initialise, create the select buttons.
             */
            setup = function() {
                var i, n, channelSelectEl;
                
                n = conf.getTrackCount();
                for (i = 0; i < n; i++) {
                    channelSelectEl = channelSelectTemplate.children().first().clone();
                    channelSelectEl.find(my.selectors.ctrlText).text(String.fromCharCode(65 + i));
                    channelSelectEl.find(my.selectors.ctrlBackground).addClass(my.classes.colors[i]);
                    channelSelectEl.find(my.selectors.ctrlHighlight).addClass(my.classes.colors[i]);
                    my.rootEl.append(channelSelectEl);
                }
                
                channelSelectEls = my.rootEl.find(selectors.channelSelect);
                channelSelectEls.on(my.eventType.click, onClick);
            },
            
            /**
             * Click on channel select button.
             */
            onClick = function(e) {
                var index = channelSelectEls.index(e.currentTarget);
                setSelectedChannel(index);
            },
            
            /**
             * Set selected channel.
             * @param {number} index Index of the channel to select.
             */
            setSelectedChannel = function(index) {
                if (index === channelIndex) {
                    return;
                }
                
                channelIndex = index;
                
                channelSelectEls.removeClass(my.classes.selected);
                channelSelectEls.get(channelIndex).className += ' ' + my.classes.selected;
                
                // TODO: set selected plugin
                elements.racks.removeClass(settings.selectedClass);
                elements.racks.get(channelIndex).className += ' ' + settings.selectedClass;
                
                // TODO: set steps of selected channel 
                this.setSelectedSteps();
            };
        
        var my = my || {};
        my.rootEl = rootEl;
        
        that = WH.createBaseView(specs, my);
        
        that.setup = setup;
        return that;
    }

    WH.createChannelSelectView = createChannelSelectView;

})(WH);
