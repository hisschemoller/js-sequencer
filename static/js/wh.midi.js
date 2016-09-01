/**
 * 
 */

window.WH = window.WH || {};

(function(WH) {
    
    function createMidi(specs) {
        var that,
            midiAccess,
            midiInput,  
            midiOutput,
            
            /**
             * Request system for access to MIDI ports.
             * @param {function} successCallback
             * @param {function} failureCallback
             */
            detectPorts = function(successCallback, failureCallback, sysex) {
                if (navigator.requestMIDIAccess) {
                    navigator.requestMIDIAccess({
                        sysex: !!sysex
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
            
            selectPort = function(id, isInput) {
                var port, portMap;
                portMap = isInput ? midiAccess.inputs.values() : midiAccess.outputs.values();
                for (port = portMap.next(); port && !port.done; port = portMap.next()) {
                    if (port.value.id === id) {
                        if (isInput) {
                            midiInput = port.value;
                        } else {
                            midiOutput = port.value;
                        }
                    }
                }
            },
            
            getSelectedPort = function(isInput) {
                return isInput ? midiInput : midiOutput;
            };
        
        that = specs.that;
        that.detectPorts = detectPorts;
        that.selectPort = selectPort;
        that.getSelectedPort = getSelectedPort;
        return that;
    }
    
    WH.createMidi = createMidi;
})(WH);
