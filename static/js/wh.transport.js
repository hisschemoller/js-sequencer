/**
 * WH.transport provides timing for the app.
 * 
 * TIMEBASE INFO
 * WX.now               Time since audio context stream started. Current audio context time in seconds, see waax.extension.js.
 * this._now            Transport playhead position in seconds.
 * this._absOrigin      Transport start time since WX.now in seconds.
 * this._absLastNow     Time  since audio context stream started
 * Step.start           Step start time within its track in ticks.
 * Step.dur             Step duration in ticks.
 * Step.absStart        Step start time since audio stream start in seconds.
 *
 *  stream                             playback
 *  started                            started           now
 *   |                                  |                 |
 *   |----------------------------------|-------//--------|
 *
 *   |-------------------- WX.now --------------//--------|
 *   
 *                                      |--- this._now ---|
 *
 *   |--------- this._absOrigin --------|
 *                                    
 *
 * @namespace WH
 */

window.WH = window.WH || {};

(function (WH) {
    
    /**
     * @description Creates a transport object.
     */
    function createTransport(specs) {
        var that = specs.that,
            arrangement = specs.arrangement,
            channelSelectView = specs.channelSelectView,
            controlBarView = specs.controlBarView,
            core = specs.core,
            stepsView = specs.stepsView,
            studio = specs.studio,
            isRunning = false,
            isLoop = false,
            now = 0,
            absLastNow = now,
            absOrigin = 0,
            loopStart = 0,
            loopEnd = 0,
            bpm = 120,
            ppqn = 480,
            lastBpm = bpm,
            tickInSeconds = 0,
            playbackQueue = [],
            needsScan = true,
            lookAhead = 0,
            scanStart = 0,
            scanEnd = lookAhead,
            
            /**
             * Converts tick to second based on transport tempo.
             * @param  {Number} tick Tick (atomic musical time unit)
             * @return {Number} Time in seconds.
             */
            tick2sec = function (tick) {
                return tick * tickInSeconds;
            }

            /**
             * Converts second to tick based on transport tempo.
             * @param  {Number} sec Time in seconds.
             * @return {Number} Time in ticks.
             */
            sec2tick = function (sec) {
                return sec / tickInSeconds;
            },
            
            /**
             * 
             */
            flushPlaybackQueue = function() {
                playbackQueue.length = 0;
            },
            
            /**
             * Sets current playhead position by seconds (audioContext).
             * @param {number} position Position in seconds 
             */
            setPlayheadPosition = function(position) {
                now = position;
                absOrigin = core.getNow() - now;
            },

            /**
             * Scan events in time range and advance playhead in each pattern.
             */
            scheduleNotesInScanRange = function () {
                var i, n, absStart, step, stepArray, oldAbsStart, viewDelayTime;
                
                if (needsScan) {
                    needsScan = false;

                    // fill playbackQueue with arrangement events 
                    arrangement.scanEvents(sec2tick(scanStart), sec2tick(scanEnd), playbackQueue);

                    if (playbackQueue.length) {
                        // array to collect steps with the same start time
                        stepArray = [];
                        // adjust event timing
                        n = playbackQueue.length;
                        for (i = 0; i < n; i++) {
                            step = playbackQueue[i];
                            
                            // convert step local time to AudioContext time
                            absStart = absOrigin + tick2sec(step.getStart());
                            step.setAbsStart( absStart );
                            step.setAbsEnd( absStart + tick2sec(step.getDuration()));
                            
                            // if this step has a different start time than the previous,
                            // start a new array
                            if (absStart !== oldAbsStart && stepArray.length > 0) {
                                delayNotesForView(oldAbsStart, stepArray);
                                stepArray = [];
                            }
                            
                            // collect all steps with the same start time in arrays
                            stepArray.push(step);
                            oldAbsStart = absStart;
                        }

                        // play the events with sound generating plugin instruments
                        delayNotesForView(oldAbsStart, stepArray);
                        studio.playEvents(playbackQueue);
                    }
                }
            },

            /**
             * Delay screen update to keep it synchronised with the audio.
             * @param  {Number} start AudioContext time of notes start.
             * @param  {Array} activeSteps Steps that play in the current timespan.
             */
            delayNotesForView = function(start, activeSteps) {
                // convert to time to wait before update in milliseconds.
                var viewDelayTime = Math.max(0, core.getNow() - start) * 1000;
                if (viewDelayTime > 0) {
                    setTimeout(function() {
                        updateView(activeSteps);
                    }, viewDelayTime);
                } else {
                    updateView(activeSteps);
                }
            },
            
            /**
             * Update the views with the steps that start play.
             * @param  {Array} activeSteps Steps that play in the current timespan.
             */
            updateView = function(activeSteps) {
                var i, n, step, channelIndex;
                channelIndex = channelSelectView.getSelectedChannel();
                n = activeSteps.length;
                for (i = 0; i < n; i++) {
                    step = activeSteps[i];
                    
                    // update the steps
                    if (step.getChannel() == channelIndex) {
                        stepsView.updateActiveStep(step.getIndex());
                    }
                    
                    // update the channel selects
                    if (step.getVelocity() > 0) {
                        channelSelectView.animateHighlight(step.getChannel());
                    }
                }
            },

            /**
             * Move the scan range of scan forward by runner.
             */
            advanceScanRange = function () {
                // Advances the scan range to the next block, if the scan end point is
                // close enough (< 16.7ms) to playhead.
                if (scanEnd - now < 0.0167) {
                    scanStart = scanEnd;
                    scanEnd = scanStart + lookAhead;
                    needsScan = true;
                }
            },
            
            /**
             * Reset the scan range based on current playhead position.
             */
            resetScanRange = function () {
                scanStart = now;
                scanEnd =  scanStart + lookAhead;
                needsScan = true;
            },
            
            /**
             * Runs the transport (update every 16.7ms).
             */
            run = function () {
                if (isRunning) {
                    // add time elapsed to now_t by checking now_ac
                    var absNow = core.getNow();
                    now += (absNow - absLastNow);
                    absLastNow = absNow;
                    // scan notes in range
                    scheduleNotesInScanRange();
                    // advance when transport is running
                    advanceScanRange();
                    // flush played notes
                    flushPlaybackQueue();
                    // check loop flag
                    if (isLoop) {
                        if (loopEnd - (now + lookAhead) < 0) {
                            setPlayheadPosition(loopStart - (loopEnd - now));
                        }
                    }
                }
                // schedule next step
                requestAnimationFrame(run.bind(this));
            },

            /**
             * Starts playback.
             */
            start = function () {
                // Arrange time references.
                var absNow = core.getNow();
                absOrigin = absNow - now;
                absLastNow = absNow;
                // Reset scan range.
                resetScanRange();
                // Transport is running.
                isRunning = true;
                controlBarView.updateTransportState(isRunning);
            },

            /**
             * Pauses current playback.
             */
            pause = function () {
                isRunning = false;
                flushPlaybackQueue();
                controlBarView.updateTransportState(isRunning);
            },

            /**
             * Toggle between stop and play.
             */
            toggleStartStop = function() {
                if (isRunning) {
                    pause();
                    rewind();
                } else {
                    start();
                }
            },

            /**
             * Sets playhead position by tick.
             * @param {Number} tick Playhead position in ticks.
             */
            setNow = function (tick) {
                setPlayheadPosition(tick2sec(tick));
                resetScanRange();
            },

            /**
             * Returns playhead position by tick.
             * @return {Number}
             */
            getNow = function () {
                return sec2tick(now);
            },

            /**
             * Rewinds playhead to the beginning.
             */
            rewind = function () {
                setPlayheadPosition(0.0);
            },

            /**
             * Sets loop start position by tick.
             * @param {Number} tick Loop start in tick.
             */
            setLoopStart = function (tick) {
                loopStart = tick2sec(tick);
            },

            /**
             * Sets loop end position by tick.
             * @param {Number} tick Loop end in tick.
             */
            setLoopEnd = function (tick) {
                loopEnd = tick2sec(tick);
            },

            /**
             * Returns loop start by tick.
             * @return {Number}
             */
            getLoopStart = function () {
                return sec2tick(loopStart);
            },

            /**
             * Returns loop end by tick.
             * @return {Number}
             */
            getLoopEnd = function () {
                return sec2tick(loopEnd);
            },

            /**
             * Toggles or sets loop status.
             * @param  {Boolean|undefined} bool Loop state. If undefined, it toggles the current state.
             */
            toggleLoop = function (bool) {
                if (bool === undefined) {
                    isLoop = !isLoop;
                } else {
                    isLoop = !!bool;
                }
            },

            /**
             * Sets transport BPM.
             * @param {Number} BPM Beat per minute.
             */
            setBPM = function (newBpm) {
                // calculates change factor
                bpm = (newBpm || 120);
                var factor = lastBpm / bpm;
                lastBpm = bpm;
                // recalcualte beat in seconds, tick in seconds
                var beatInSeconds = 60.0 / bpm;
                tickInSeconds = beatInSeconds / ppqn;
                // lookahead is 16 ticks (1/128th note)
                lookAhead = tickInSeconds * 16;
                // update time references based on tempo change
                now *= factor;
                loopStart *= factor;
                loopEnd *= factor;
                absOrigin = core.getNow() - now;
            },

            /**
             * Returns current BPM.
             * @return {Number}
             */
            getBPM = function () {
                return bpm;
            };
        
        setBPM(bpm);
        run();
        
        that.start = start;
        that.pause = pause;
        that.rewind = rewind;
        that.toggleStartStop = toggleStartStop;
        that.setBPM = setBPM;
        that.getBPM = getBPM;
        return that;
    }
    
    /**
     * Singleton
     */
    WH.createTransport = createTransport;

})(WH);
