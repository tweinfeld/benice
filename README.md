# Benice - Be nice to your host!
Benice is a tiny set of browser performance estimation tools inspired by [Dan Kaminsky's stupidly simple, genius "nice.js"](https://www.youtube.com/watch?v=9wx2TnaRSGs). It enables you to "be nice" to your surrounding hosting environment by running your non-essencial logic only when the browser is estimated idle enough to handle it gracefully, thus reducing "hogging" resources, and slowing down fellow scripts.  
Benice also includes a rudimentary "Monitor" function that reports periodic estimations regarding how "idle" the browser is.

## Installation

  Benice is UMD compatible, and is available through:

  * **NPM**: `npm install benice`
  * **Direct Download**: [Minified](http://benice.webwise.co.il/benice-min.js)/[Regular](http://benice.webwise.co.il/benice-min.js)

## onIdle

If your script is used on a 3rd party site, among many other scripts unknown to you, and you wish to defer your js code execution until the user's browser is relatively "idle", use:
```javascript
var Benice = require('benice');

var stopWaiting = Benice.onIdle(function(){
    // Put your unobtrusive logic here
    console.log("Browser's Idle, nice time to show up!");
});
```

To cancel this wait for `onIdle`, simply call the function returned by `onIdle()':
```javascript
stopWaiting();  // Wait is canceled, your code will never get executed
```

You can further tweak `onIdle`'s behaviour using the following parameters:

onIdle(functionToExecute, detectionExpiration, resolutionSamples, sampleInterval, sampleThreshold, arg1, arg2, arg3...)

   * **functionToExecute** - The function to be run when an estimated "idle" state is successfully detected
   * **detectionExpiration** - A time interval (in milliseconds) after which `functionToExecute` will run regardless of a successful detection (defaults to 60000ms)
   * **resolutionSamples** - The number of samples requires to establish an "idle" estimation (defaults to 5 samples)
   * **sampleInterval** - The time interval used between samples (defaults to 150ms)
   * **sampleThreshold** - The sample threshold used to assume "idleness" (defaults to 50ms)
   * **arg1, arg2, arg3...** - The arguments to be used when calling `functionToExecute`.

For example:

The following call will exhaust detecting for browser idleness after 1 seconds:

```javascript
onIdle(function(){ console.log('Detection attempt will exhaust in 1 second') }, 1000);
```

This one will require 10 samples to conclude that the browser is actually idle:

```javascript
onIdle(function(){ console.log('After taking 10 samples, it is safe to estimate that the browser\'s idle') }, 60000, 10);
```

## Monitor(functionToExecute, sampleInterval)

Monitor will call `functionToExecute` every `sampleInterval` passing it a coarse value ("samples") implying the browser's "idleness" state. 0 means "idle", X value (positive or negative) means X less idle. The simple method of establishing these values is explained in [this Dan Kaminsky DEFCON talk](https://www.youtube.com/watch?v=9wx2TnaRSGs).

You can abort a `Monitor` interval by calling the function it returns:

```javascript
var stopMonitoring = Monitor(..);
stopMonitoring();
```

## Examples

![Page performance analyzer](https://raw.githubusercontent.com/tweinfeld/benice/master/demos/page-performance-analyzer.gif)  
[Page performance analyzer](http://benice.webwise.co.il)
