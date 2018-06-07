//Grab the articles as a json
$.getJSON('/articles', function(data){
    //loop for each article
    for (var i = 0; i < data.length; i++) {
        //displays information on page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link +"</p>");

    }
});

//whenever someone clicks a p-tag
$(document).on("click", "p", function(){
    //empty notes from the note section (clean start)
    $("#comments").empty();
    //save the id from the p-tag
    var thisId = $(this).attr("data-id");

    //ajax call for the article
    $.ajax({
        method:"GET",
        url: "/articles/" + thisId
    })

    //after call add comment section
    .then(function(data){
        console.log(data);
        //article's title
        $("#comments").append("<h2" + data.title + "</h2>");
        //Input for username
        $("#comments").append("<input id='titleinput' name='user' >");
        //comment textarea
        $("#comments").append("textarea id-'bodyinput' name='body'></textarea>");
        //submit button
        $("#comments").append("button data-id='" data._id + "' id='savenote'>Save Comment</button>");

        if(data.comment) {
            $("#titleinput").val(data.note.title).trim();
            $("#bodyinput").val(data.note.body).trim();
        }
    });
});