$(document).ready(function () {

  var articlecontainr = $(".article-container")




  $.getJSON("/articles?saved=true").then(function (data) {
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

    var articlebtn = $("<a class='btn btn-danger delete'>Delete From Saved</a>")
    var articlebtn1 = $("<a class='btn btn-info notes'>Article Notes</a>")

    h3.append(articlelink)
    h3.append(articlebtn)
    h3.append(articlebtn1)
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

  $(document).on("click", ".articlesave", function () {

    event.preventDefault()
    console.log("article btn clicked")
    const savethisArticle = $(this).parents(".card").data()

    //console.log(savethisArticle)

    $.ajax({
      method: "PUT",
      url: "/articles/" + savethisArticle,
      data: savethisArticle
    }).then(function (data) {
      //console.log(data)

    })

    

  });

  $(document).on("click", ".dangerbtn", function () {
    console.log("danger clicked")
    $(this).parents(".card").remove();
  });


});


