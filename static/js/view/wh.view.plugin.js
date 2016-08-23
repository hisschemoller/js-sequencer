/**
 * Mixer view that contains the channel plugin views.
 *
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    
    function createPluginView(specs) {

        // private variables
        var that,
            rootEl,
            headerTemplate: $('#template-plugin-header'),
            
            selectors = {
                plugin: '.plugin',
                header: '.plugin__header',
                name: '.plugin__name-label',
                controls: '.plugin__controls',
                page: '.plugin__page',
                pagePrev: '.plugin__page-prev',
                pageNext: '.plugin__page-next',
                pageNumber: '.plugin__page-number'
            },
            
            init = function() {
                var pluginTemplate;
                
                pluginTemplate = $('#template-plugin-' + specs.plugin.getName());
                rootEl = pluginTemplate.children().first().clone();
                rootEl.appendTo(specs.parentEl);
                addHeader();
            },

            /**
             * Add a header to the plugin if a header container element is
             * present in the plugin template.
             */
            addHeader = function() {
                var headerContainer = rootEl.find(selectors.header);
                if (!headerContainer.length) {
                    return;
                }

                // add the header to the plugin
                var headerEl = headerTemplate.children().clone();
                headerEl.appendTo(headerContainer);
                headerEl.find(my.selectors.name).text(specs.plugin.getTitle());
            };
    
        var my = my || {};
        my.rootEl = rootEl;
        
        that = WH.createBaseView(specs, my);
        
        init();
        
        return that;
    }

    WH.createPluginView = createPluginView;
    
})(WH);
