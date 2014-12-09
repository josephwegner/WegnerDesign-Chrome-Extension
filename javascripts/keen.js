!function(a,b){if(void 0===b[a]){b["_"+a]={},b[a]=function(c){b["_"+a].clients=b["_"+a].clients||{},b["_"+a].clients[c.projectId]=this,this._config=c},b[a].ready=function(c){b["_"+a].ready=b["_"+a].ready||[],b["_"+a].ready.push(c)};for(var c=["addEvent","setGlobalProperties","trackExternalLink","on"],d=0;d<c.length;d++){var e=c[d],f=function(a){return function(){return this["_"+a]=this["_"+a]||[],this["_"+a].push(arguments),this}};b[a].prototype[e]=f(e)}var g=document.createElement("script");g.type="text/javascript",g.async=!0,g.src="https://d26b395fwzu5fz.cloudfront.net/3.0.7/keen.min.js";var h=document.getElementsByTagName("script")[0];h.parentNode.insertBefore(g,h)}}("Keen",this);


// Configure the Keen object with your Project ID and (optional) access keys.
var KeenClient = new Keen({
    projectId: "51cee1b7897a2c5a74000001",
    writeKey: "1cf031f9560d9e59be38b22dd85739d6132766ea78dafb6803c4da904891adc8ff5c04b978b9ff89e369086db3faf331ee0ce68fe52b725006956e0ebd32be0d4e67166ed918734f109c1d55e72c6a9531fef19fafc3967ba260a081df4a3413b16de0333ae14e9a6e88773bbfc69a4f", // required for sending events
    readKey: "d26495906529de8ee6f9ad9cdee37505b3eaf4d6f5b5c8c072eef9fc61db01011e7bff3a0ea98055239921986b15118480463aa1b2b6f89ef6328fa8ee84a43cb4927886657cdaab402dd36f0eca7a4a23761d5df3e50ac787803bd607272a719936261fa61b43458ec51de250fd8cf5"    // required for doing analysis
});

Keen.ready(function() {
  $(document).trigger("keen_ready", KeenClient);
});
