/**
 * 
 */

window.WH = window.WH || {};

(function(WH) {
    
    function createMidi(specs) {
        var that,
            detectSuccessCallback,
            detectFailureCallback,
            
            /**
             * Request system for access to MIDI ports.
             */
            detectMidiPorts = function(successCallback, failureCallback) {
                detectSuccessCallback = successCallback;
                detectFailureCallback = failureCallback;
                if (navigator.requestMIDIAccess) {
                    navigator.requestMIDIAccess({
                        sysex: false
                    }).then(onMidiSuccess, onMIDIFailure);
                } else {
                    console.log('Web MIDI API not available.');
                    detectFailureCallback('Web MIDI API not available.');
                }
            },
        
            /**
             * MIDI access request failed.
             * @param {String}  
             */
            onMIDIFailure = function(errorMsg) {
                console.log('RequestMIDIAccess failed. Error message: ', errorMsg);
                detectFailureCallback('RequestMIDIAccess failed. Error message: ', errorMsg);
            },
            
            /**
             * MIDI access request succeeded.
             * @param {Object} midiAccess MidiAccess object.
             */
            onMidiSuccess = function(midiAccess) {
                var i,
                    port,
                    inputs = midiAccess.inputs.values(),
                    outputs = midiAccess.outputs.values();
                
                if (!midiAccess.inputs.size && !midiAccess.inputs.size) {
                    console.log('No MIDI devices found on this system.');
                    detectFailureCallback('No MIDI devices found on this system.');
                } else {
                    for (port = inputs.next(); port && !port.done; port = inputs.next()) {
                        console.log('MIDI input port:', port.value.name + ' (' + port.value.manufacturer + ')');
                    }
                    for (port = outputs.next(); port && !port.done; port = outputs.next()) {
                        console.log('MIDI output port:', port.value.name + ' (' + port.value.manufacturer + ')');
                    }
                    detectSuccessCallback(midiAccess);
                }
            };
        
        that = specs.that;
        that.detectMidiPorts = detectMidiPorts;
        return that;
    }
    
    WH.createMidi = createMidi;
})(WH);
