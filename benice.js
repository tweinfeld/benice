(function(Tools){
    [
        { detect: function(){ return !!((typeof define === "function") && define.amd); }, register: function(Tools){ define(Tools); } },
        { detect: function(){ return !!(typeof exports !== "undefined"); }, register: function(Tools){ module.exports = Tools; } },
        { detect: function(){ return true; }, register: function(Tools){ window.Benice = Tools; } }
    ].filter(function(){ return !!window; }).filter(function(o){ return o.detect(); }).splice(0,1).forEach(function(o){ o.register(Tools(window)); });
})(function(window){

    var	DEFAULT_SAMPLE_INTERVAL = 150,
        IDLE_THRESHOLD = 50,
        RESOLUTION_SAMPLES = 5,
        DETECTION_EXPIRATION = 60000;

    var setTimeout = window.setTimeout,
        clearInterval = window.clearInterval,
        now = Date.now.bind(Date);

    var Monitor = function(listener, sampleInterval){
        var sampleInterval = sampleInterval || DEFAULT_SAMPLE_INTERVAL,
            timer;

        (function sampler(prev){
            timer = setTimeout(sampler, sampleInterval, now());
            prev && listener(now() - prev - sampleInterval);
        })();

        return function(){
            timer = clearInterval(timer);
        };
    };

    var onIdle = function(){
        var args = Array.prototype.slice.call(arguments),
            func = args.shift(),
            expiration = args.shift() || DETECTION_EXPIRATION,
            resolutionSamples = args.shift() || RESOLUTION_SAMPLES,
            sampleInterval = args.shift() || DEFAULT_SAMPLE_INTERVAL,
            sampleThreshold = args.shift() || IDLE_THRESHOLD,
            samplesBuffer = [],
            detectionStart = now(),
            stopMonitoring = Monitor(
                function(sample){
                    ((samplesBuffer = samplesBuffer.concat([Math.abs(sample)])
                        .splice(-resolutionSamples, resolutionSamples))
                        .filter(function(sample){ return sample < sampleThreshold; })
                        .length === resolutionSamples || (now() - detectionStart) > expiration) && stopMonitoring(func.apply(undefined, args));
                }, sampleInterval
            );

        return stopMonitoring;
    };

    return {
        "Monitor": Monitor,
        "onIdle": onIdle
    }
});