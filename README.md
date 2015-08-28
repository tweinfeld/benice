# Benice - Be nice to your host!
Benice is a tiny set of browser performance analyzer tools inspired by [Dan Kaminsky's "nice.js"](https://www.youtube.com/watch?v=9wx2TnaRSGs). Benice encourages you to "be nice" to your hosting page (if you're a visitor) by running your logic when the browser is idle enough to handle it gracefully.

# Installation

  * **NPM**: `npm install benice`
  * **Download**: [Direct download](https://raw.githubusercontent.com/tweinfeld/benice/master/benice-min.js)

# onIdle

If your script is encorporated into 3rd party sites, put your code into `Benice.onIdle` to load it with the browser is "idle":
```javascript
Benice.onIdle(function(){
    // Put your unobtrusive logic here
    console.log("Browser's Idle, nice time to show up!");
});
```
To cancel a wait for `onIdle`, call the returned function:

```javascript
var stopWaiting = Benice.onIdle(...);
stopWaiting();  // Wait is canceled!
```


