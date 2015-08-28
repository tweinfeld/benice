(function(Tools){
    [
        { detect: function(){ return !!((typeof define === "function") && define.amd); }, register: function(Tools){ define(Tools); } },
        { detect: function(){ return !!(typeof exports !== "undefined"); }, register: function(Tools){ module.exports = Tools; } },
        { detect: function(){ return true; }, register: function(Tools){ window.Benice = Tools; } }
    ].filter(function(o){ return o.detect(); }).shift().register(Tools);
})((function(undefined, window){

    var	DEFAULT_INTERVAL = 150,
        IDLE_THRESHOLD = 50,
        RESOLUTION_SAMPLES = 5;

    var setTimeout = window.setTimeout,
        clearInterval = window.clearInterval,
        now = Date.now.bind(Date);

    var Monitor = function(listener, interval){
        var interval = interval || DEFAULT_INTERVAL,
            timer;

        (function sampler(prev){
            timer = setTimeout(sampler, interval, now());
            prev && listener(now() - prev - interval);
        })();

        return function(){
            timer = clearInterval(timer);
        };
    };

    var onIdle = function(){
        var args = Array.prototype.slice.call(arguments),
            func = args.shift(),
            samplesBuffer = [],
            stopMonitoring = Monitor(
                function(sample){
                    (samplesBuffer = samplesBuffer.concat([Math.abs(sample)])
                        .splice(-RESOLUTION_SAMPLES, RESOLUTION_SAMPLES))
                        .filter(function(sample){ return sample < IDLE_THRESHOLD; })
                        .length === RESOLUTION_SAMPLES && stopMonitoring(func.apply(undefined, args));
                }
            );

        return stopMonitoring;
    };

    return {
        "Monitor": Monitor,
        "onIdle": onIdle
    }

})(undefined, window));