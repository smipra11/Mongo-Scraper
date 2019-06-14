/*$.getJSON("/articles", function (data) {
  console.log(data)
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $(".article-container").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].url + "</p>");
  }
})*/

$(document).ready(function() {
 
    var articlecontainr = $(".article-container")


    //$(document).on("click", ".scrapbtn", initpage(article))
     
       
 


    $.getJSON("/articles", function (data) {
      if (data && data.length) {
        renderArticle(data)
      } else {
        renderempty()
      }
    })
  

  function createcard(article) {
    var card = $("<div class= 'card'>");
    var cardHeader = $("<div class='card-header'>").append(

      $("<h3>").append(
        $("<a class= 'article-link' target='_blank>").
          attr('href', article.url)
          .text(article.headline),
        $("<a class= 'btn btn-success save'> Save Article </a>")


      )
    )
    var cardbody = $("<div class ='card-body'>").text(article.summary)
    card.append(cardHeader, cardbody)
    card.data("_id", article._id);
    // We return the constructed card jQuery element
    return card;
  }

  function renderArticle(articles) {
    var articledata = []
    for (i = 0; i < articles.length; i++) {
      articledata.push(createcard(articles[i]))
    }
    articlecontainr.append(articledata)

  }


  
});



