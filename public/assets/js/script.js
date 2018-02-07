

$("#scrape-btn").on("click", function(){
	alert("scraping ... ");
	$.get( "/api/scrape", function(data) {
	})
	.then(function(){
		displayScrapedArticles();
	})
});

function displayScrapedArticles(){
	$("#articles").empty();
	$.get( "/scraped", function(data) {
		if(data == null){
			$("#articles").html("No articles have been scraped yet");
		}
		for(var i =0; i < data.length; i++){
			var articleDiv = $("<div>");
			var title = $("<h2>");
			title.html(data[i].title);
			var link = $("<a>");
			link.html(data[i].link);
			link.attr("href", data[i].link);
			var save = $("<button>");
			save.html("SAVE ARTICLE");
			save.attr("class", "save-btn");
			save.attr("id", data[i]["_id"]);

			articleDiv.append(title).append(save).append(link);
			$("#articles").append(articleDiv);
		}
		
	});
}

function displaySavedArticles(){
	$("#saved-articles").empty();
	$.get( "/api/saved", function(data) {
		if(data == null){
			$("#saved-articles").html("No articles have been saved yet");
		}
		for(var i =0; i < data.length; i++){
			var articleDiv = $("<div>");
			var title = $("<h2>");
			title.html(data[i].title);
			var link = $("<a>");
			link.html(data[i].link);
			link.attr("href", data[i].link);
			 var deleteBtn= $("<button>");
			deleteBtn.html("DELETE FROM SAVED");
			deleteBtn.attr("class", "delete-btn");
			deleteBtn.attr("id", data[i]["_id"]);
			var notes = $("<button>");
			notes.html("ARTICLE NOTES");
			notes.attr("class", "notes-btn ");
			notes.attr("data-toggle", "modal");
			notes.attr("data-target", "#myModal");
			notes.attr("type", "button");
			notes.attr("id", data[i]["_id"]);

			articleDiv.append(title).append(deleteBtn).append(notes).append(link);
			$("#saved-articles").append(articleDiv);
		}
		
	});
}

//function for saving articles

$(document).on("click", ".save-btn", function(event){
	event.preventDefault();
	var id = $(this).attr("id");
	var url = "/save/"+id;
	
	$.post(url, function(response){
		alert(response);
	})
});

//function for deleting saved articles

$(document).on("click", ".delete-btn", function(event){
	event.preventDefault();
	var id = $(this).attr("id");
	var url = "/delete/"+id;
	
	$.post(url, function(response){
		alert(response);
		location.reload();
	})
});

$(document).on("click", ".notes-btn", function(event){
	var id = $(this).attr("id");
	var url = "/notes/"+id;
	$("#article-id").html(id);
	localStorage.setItem("article", id);

	getSavedNotes();
});

$("#save-note-btn").on("click", function(event){
	var id = localStorage.getItem("article");
	var url = "/notes/"+id;	
	var note = {body : $("#note-box").val().trim()};
	
	$.post(url, note, function(response){
		console.log(response);
	}).then(function(){
		getSavedNotes();
	})
});

//function to get saved notes for an article

function getSavedNotes(){
	var id = localStorage.getItem("article");
	var url = "/notes/"+id;	
	$("#note-area").empty();
	$.get(url, function(data){

		for(var i =0; i < data.note.length; i++){
			
			var noteDiv = $("<div>");
			var body = $("<p>");
			body.html(data.note[i].body);
			 var deleteBtn= $("<button>");
			deleteBtn.html("X");
			deleteBtn.attr("class", "delete-note btn btn-danger");
			deleteBtn.attr("id", data["_id"]);

			noteDiv.append(body).append(deleteBtn);
			$("#note-area").append(noteDiv);
		}
	})
}
