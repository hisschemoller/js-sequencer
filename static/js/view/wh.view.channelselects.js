/**
 * Buton row to select a channel.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createChannelSelectView(specs, my) {
        var that,
            channelSelectTemplate = $('#template-channel-select'),
            classes = {
                
            },
            /**
             * Initialise, create the select buttons.
             */
            init = function() {
                var i, n, channelSelectEl;
                
                n = my.conf.getTrackCount();
                for (i = 0; i < n; i++) {
                    channelSelectEl = channelSelectTemplate.children().first().clone();
                    channelSelectEl.find(settings.ctrlTextClass).text(String.fromCharCode(65 + i));
                }
            };
        
        var my = my || {};
        my.rootEl = $('.channel-selects');
        
        that = WH.createBaseView(specs, my);
        
        init();
        
        return that;
    }

    WH.createChannelSelectView = createChannelSelectView;

})(WH);
