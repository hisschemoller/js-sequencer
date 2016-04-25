/**
 * Plugin Manager.
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {

    function createPluginManager() {
        var that,
            pluginIdCounter = 0,
            createPlugin = function(pluginId) {
                try {
                    if (WH.plugins && WH.plugins[pluginId]) {
                        var plugin = WH.plugins[pluginId].create({
                            id: pluginIdCounter
                        });
                        pluginIdCounter += 1;
                        return plugin;
                    } else {
                        throw {
                            name: 'Plugin Error',
                            message: 'No plugin found with id: ' + pluginId
                        };
                    }
                } catch (error) {
                    WH.DialogView({
                        type: 'alert',
                        headerText: error.name,
                        bodyText: error.message
                    });
                }
            };

        that = {};
        that.createPlugin = createPlugin;
        return that;
    }

    // singleton
    WH.pluginManager = createPluginManager();

})(WH);
