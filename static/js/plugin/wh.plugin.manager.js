/**
 * Plugin Manager.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createPluginManager(specs) {
        var that = specs.that,
            conf = specs.conf,
            core = specs.core,
            pubSub = specs.pubSub,
            transport = specs.transport
            pluginIdCounter = 0,
            createPlugin = function(pluginName) {
                if (WH.plugins && WH.plugins[pluginName]) {
                    var plugin = WH.plugins[pluginName].create({
                        id: pluginIdCounter,
                        conf: conf,
                        core: core,
                        pubSub: pubSub,
                        transport: transport
                    });
                    pluginIdCounter += 1;
                    return plugin;
                } else {
                    console.error('No plugin found with name: ', pluginName);
                }
            };
            
        that.createPlugin = createPlugin;
        return that;
    }

    WH.createPluginManager = createPluginManager;

})(WH);
