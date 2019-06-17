

$(document).ready(function () {

  var articlecontainr = $(".article-container")




  $.getJSON("/articles?saved=false").then(function (data) {
     console.log(data)
    if (data && data.length) {
      showArticle(data)
    } else {
      renderempty()
    }
  })


  function createcard(article) {
    var card = $("<div class= 'card'>");
    var cardHeader = $("<div class='card-header'>")

    var h3 = $("<h3>")
    var articlelink = $("<a class='article-link' target='_blank'>")
    articlelink.attr("href", article.url)
    articlelink.text(article.headline)

    // console.log(articlelink)

    var articlebtn = $("<button class='btn btn-warning articlesave'>Save Article</button>")

    h3.append(articlelink)
    h3.append(articlebtn)
    cardHeader.append(h3)



    var cardbody = $("<div class ='card-body'>").text(article.summary)
    card.append(cardHeader, cardbody)
    card.data("_id", article._id);
    // We return the constructed card jQuery element
    return card;
  }

  function showArticle(articles) {
    var articledata = []
    for (i = 0; i < articles.length; i++) {
      articledata.push(createcard(articles[i]))
    }
    articlecontainr.append(articledata)

  }

  $(document).on("click", ".savearticle", function () {

    event.preventDefault()
    console.log("article btn clicked")
    const savethisArticle = $(this).parents(".card").data()

    //to delete card from page we will do below
    $(this).parents(".card").remove()

    savethisArticle.saved = true
    console.log(savethisArticle)

    $.ajax({
      method: "PUT",
      url: "/articles/" + savethisArticle,
      data: savethisArticle
    }).then(function (data) {
      console.log(data)

      if (data) {
        location.reload()
      }
    })
  })

  $(document).on("click", ".scrapbtn",function(){
    $.get("/scrape").then(function (data) {

      console.log(data)
    
       showArticle(data)
       window.location.href = "/";
     
   })
  
  })


  $(document).on("click", ".cleararticle",function(){
    articlecontainr.empty();

        
  })
});



