$(document).on("keen_ready", function(e, KeenClient) {
  var queries = [
    // Total Traffic Series
    new Keen.Query("count_unique",  {
      event_collection: "page_load",
      max_age: 600,
      targetProperty: "guid",
      interval: "daily",
      timeframe: "this_31_days"
    }),

    // Most Read Blogs
    new Keen.Query("count", {
      event_collection: "page_load",
      max_age: 3600,
      groupBy: "page.path",
      filters: [
        {
          "property_name": "page.path",
          "operator": "contains",
          "property_value": "/blog/"
        },
        {
          "property_name": "page.path",
          "operator": "ne",
          "property_value": "/blog/"
        }
      ],
      timeframe: "this_31_days"
    }),

    // Blog Read Count
    new Keen.Query("count", {
      event_collection: "interaction",
      max_age: 3600,
      groupBy: "page.path",
      filters: [{
        "property_name": "action",
        "operator": "eq",
        "property_value": "finished_blog"
      }],
      timeframe: "this_31_days"
    }),

    // Visitor Type
    new Keen.Query("count", {
      event_collection: "page_load",
      max_age: 1800,
      groupBy: "newVisitor",
      timeframe: "this_31_days",
      filters: [{
        "property_name": "newVisitor",
        "operator": "exists",
        "property_value": true
      }]
    }),

    // Twitter Hovers
    new Keen.Query("count", {
      event_collection: "interaction",
      max_age: 600,
      timeframe: "this_31_days",
      filters: [{
        property_name: "action",
        operator: "eq",
        property_value: "social_hover"
      }]
    }),

    // Twitter Clicks
    new Keen.Query("count", {
      event_collection: "interaction",
      max_age: 600,
      timeframe: "this_31_days",
      filters: [{
        property_name: "action",
        operator: "eq",
        property_value: "social_click"
      }]
    }),

    // Total Blog Views
    new Keen.Query("count", {
      event_collection: "page_load",
      max_age: 600,
      timeframe: "this_31_days",
      filters: [
        {
          "property_name": "page.path",
          "operator": "contains",
          "property_value": "/blog/"
        },
        {
          "property_name": "page_path",
          "operator": "ne",
          "property_value": "/blog/"
        } 
      ]
    })
  ];

  var queryNames = [
    "totalTrafficSeries",
    "mostReadBlogs",
    "blogReadCount",
    "visitorType",
    "twitterHovers",
    "twitterClicks",
    "totalBlogPostView"
  ];

  if(queryNames.length !== queries.length) {
    throw new Error("Query names and defined queries do not match");
  }

  var results = false;
  var activeRequest = false;
  var reloadData = function() {
    KeenClient.run(queries, function(res) {
      results = {};
      for(var i=0; i<res.length; i++) {
        results[queryNames[i]] = res[i];
      }

      if(typeof(activeRequest) === "function") {
        activeRequest(results);
        activeRequest = false;
      }
    });
  }

  setInterval(reloadData, 10 * (1000 * 60));
  reloadData();

  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if(request === "keen-data") {
      if(results) {
      sendResponse(results);
      } else {
        activeRequest = sendResponse;
      }
    }
  });
});
