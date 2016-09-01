/**
 * 
 */

window.WH = window.WH || {};

(function(WH) {
    
    function createMidi(specs) {
        var that,
            midiAccess,
            
            /**
             * Request system for access to MIDI ports.
             */
            detectPorts = function(successCallback, failureCallback) {
                if (navigator.requestMIDIAccess) {
                    navigator.requestMIDIAccess({
                        sysex: false
                    }).then(function(_midiAccess) {
                        if (!_midiAccess.inputs.size && !_midiAccess.outputs.size) {
                            failureCallback('No MIDI devices found on this system.');
                        } else {
                            midiAccess = _midiAccess;
                            successCallback(midiAccess);
                        }
                    }, function() {
                        failureCallback('RequestMIDIAccess failed. Error message: ', errorMsg);
                    });
                } else {
                    failureCallback('Web MIDI API not available.');
                }
            },
            
            openPort = function(id, isInput) {
                var port, portMap;
                portMap = isInput ? midiAccess.inputs.values() : midiAccess.outputs.values();
                for (port = portMap.next(); port && !port.done; port = portMap.next()) {
                    if (port.value.id === id) {
                        port.value.onmidimessage = onMessage;
                        console.log(port);
                    }
                }
            },
            
            onMessage = function(e) {
                console.log(e.data);
            };
        
        that = specs.that;
        that.detectPorts = detectPorts;
        that.openPort = openPort;
        return that;
    }
    
    WH.createMidi = createMidi;
})(WH);
