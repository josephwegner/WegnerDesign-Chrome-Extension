$(document).ready(function() {

  chrome.runtime.sendMessage("keen-data", function(data) {
    var totalTrafficSeriesRequest = new Keen.Visualization(data.totalTrafficSeries, $("#total-traffic-series").get(0), {
      chartType: "areachart",
      width: $(window).outerWidth(),
      height: 200,
      chartOptions: {
        enableInteractivity: true,
        backgroundColor: 'transparent',
        series: [
          { color: '#bd4233' }
        ],
        vAxis: {
          gridlines: { count: 0 }
        },
        chartArea: {
          left: 0,
          top: 0,
          width: '100%',
          height: 200
        }
      }
    });
    
    var mostReadBlogs = [] 
    while(data.blogReadCount.result.length && data.mostReadBlogs.result.length) {
      var currentFinish = data.blogReadCount.result.shift();

      for(var i=0,max=data.mostReadBlogs.result.length; i<max; i++) {
        // Find the matching pageview for this finish
        if(currentFinish["page.path"] === data.mostReadBlogs.result[i]["page.path"]) {
          var pageview = data.mostReadBlogs.result.splice(i,1)[0];
          i--;
          max--;

          // Don't even move on if we know this isn't a most read blog
          if(mostReadBlogs.length === 10 && mostReadBlogs[9].pagedata.views.result > pageview.result) {
            break;
          }

          var post = {
            page: currentFinish["page.path"].replace("/blog/", "").replace("/", ""),
            pageviews: pageview.result,
            finish_rate: currentFinish.result / pageview.result
          };

          // We could be iterating this manually, but for clarity lets just read it each time
          var blogPostsFound = mostReadBlogs.length;

          // Insert the post in the correct place of the mostReadBlogs list
          for(var j=0; j<10; j++) {
            if(j === blogPostsFound) {
              mostReadBlogs.push(post);
              break;   
            }

            if(post.pageviews > mostReadBlogs[j].pageviews) {
              mostReadBlogs.splice(j, 1, post);
              break; 
            }
          }
          break;
        }
      }
    }  

    var $popularBlogList = $("#popular-blog-list");
    for(var i=0; i<mostReadBlogs.length; i++) {
      var post = mostReadBlogs[i];
      $popularBlogList.append("<li><span class='blog-path'>"+post.page+"</span><span class='finish-rate'>"+((post.finish_rate * 100).toFixed(2))+"%</span><div class='clearfix'></div></li>");
    }
  
    new Keen.Visualization(data.visitorType, $("#visitor-type").get(0), {
      chartType: "piechart",
      title: "New Visitors",
      width: $("#visitor-type").width(),
      colors: ["#dd524b", "#92c5dd"],
      chartOptions: {
        titleTextStyle: {
          color: 'white'
        },
        enableInteractivity: true,
        backgroundColor: 'transparent',
        legend: "none",
        chartArea: {
          left: $("#visitor-type").get(0) * .125,
          top: $("#visitor-type").get(0) * .125,
          width: $("#visitor-type").get(0) * .75,
          height: $("#visitor-type").get(0) * .75
        }
      }
    });

   
    hover_rate = data.twitterHovers.result / data.totalBlogPostView.result;
    click_rate = data.twitterClicks.results / data.totalBlogPostView.result;

    $("#twitter-clicks").css('background-size', ((click_rate * 100) * .9) + "%");
    $("#twitter-hovers").css('background-size', ((hover_rate * 100) * .9) + "%");

    $(".twitter-views-num").text(data.totalBlogPostView.result+" Views");
    $(".twitter-hovers-num").text((hover_rate * 100).toFixed(2)+"% hover rate ("+data.twitterHovers.result+")");
    $(".twitter-clicks-num").text((click_rate * 100).toFixed(2)+"% click rate ("+data.twitterClicks.results+")");
   
  });
});
