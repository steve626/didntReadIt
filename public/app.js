//Grab the articles as a json
$.getJSON('/articles', function(data){
    //loop for each article
    for (var i = 0; i < data.length; i++) {
        //displays information on page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "<br />" + data[i].comment +"</p>");

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
        $("#comments").append("<input id='username' name='user' >");
        //comment textarea
        $("#comments").append("textarea id='bodyinput' name='body'></textarea>");
        //submit button
        $("#comments").append("button data-id='" + data._id + "' id='saveComment'>Save Comment</button>");

        if(data.comment) {
            $("#titleinput").val(data.comment.title).trim();
            $("#bodyinput").val(data.comment.body).trim();
        }
    });
});

//when click submit button
$(document).on("click", "#saveComment",function() {
    //grabs id assoc with article
    var thisId = $(this).attr("data-id");
    
    $.ajax({
        method: "PUT",
        url: "/articles/" + thisId,
        data:{
            user: $("#username").val().trim(),
            body: $("#bodyinput").val().trim()
        }
    })

    .then(function(data){
        console.log(data);
        $("#newComment").empty();
        //shows all comments from oldest to newest needs a sort?
        for (var j = 0; j < data.length; j++) {
            
            $("#comments").append("<p data-id='" + data[i]._id + "'>" + data[i].user + "<br />" + data[i].body +"</p>");
    
        }
    });
    

    $("#username").val("");
    $("#bodyinput").val("");
});