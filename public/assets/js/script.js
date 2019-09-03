

$("#scrape-btn").on("click", function(){
	$.get( "/api/scrape", function(data) {
		
	})
	.then(function(response){
		alert("Added " + response + " new articles!");
		displayScrapedArticles();

	})
});

function displayScrapedArticles(){
	$("#articles").empty();
	$.get( "/scraped", function(data) {
		if(data.length == 0){
			$("#articles").html("<div class='card bg-warning text-center warning' >Uh Oh! It looks like we don't have any new articles.</div>");
		}else
		for(var i =0; i < data.length; i++){
			var articleContainer = $("<div>");
			articleContainer.addClass("card article-container container");
			var articleDiv = $("<div>");
			articleDiv.addClass("card-header row");
			var articleBody = $("<div>");
			articleBody.addClass("card-body");
			var title = $("<h5>");
			title.html(data[i].title);
			title.addClass("col-sm-9")
			var link = $("<a>");
			link.html(data[i].link);
			link.attr("href", data[i].link);
			var save = $("<button>");
			save.html("SAVE ARTICLE");
			save.addClass("save-btn btn btn-success col-sm-2 text-center");
			save.attr("id", data[i]["_id"]);

			articleDiv.append(title).append(save);
			articleBody.append(link);
			articleContainer.append(articleDiv).append(articleBody);
			$("#articles").append(articleContainer);
		}

		$(".footer").empty();
		var footer = `<footer class="footer bg-dark"><a href="https://www.foxsports.com/soccer">POWERED BY <span><img src="/assets/images/foxsportslogo.png" alt="FOX SPORTS" class="img-responsive"></span></a><p>&copy; www.cesaracaceres.com 2018</p></footer>`;
		$("body").append(footer);
	});
}

function displaySavedArticles(){
	$("#saved-articles").empty();
	$.get( "/api/saved", function(data) {
		if(data.length == 0){
			$("#saved-articles").html("<div class='card bg-warning text-center warning' >You don't have any saved articles.</div>");
		}
		for(var i =0; i < data.length; i++){
			var articleContainer = $("<div>");
			articleContainer.addClass("card article-container container");
			var articleDiv = $("<div>");
			articleDiv.addClass("card-header row");
			var articleBody = $("<div>");
			articleBody.addClass("card-body");
			var title = $("<h5>");
			title.html(data[i].title);
			title.addClass("col-sm-7");
			var link = $("<a>");
			link.html(data[i].link);
			link.attr("href", data[i].link);
			 var deleteBtn= $("<button>");
			deleteBtn.html("DELETE FROM SAVED");
			deleteBtn.attr("class", "delete-btn btn btn-danger col-sm-2");
			deleteBtn.attr("id", data[i]["_id"]);
			var notes = $("<button>");
			notes.html("ARTICLE NOTES");
			notes.attr("class", "notes-btn btn btn-secondary col-sm-2");
			notes.attr("data-toggle", "modal");
			notes.attr("data-target", "#myModal");
			notes.attr("type", "button");
			notes.attr("id", data[i]["_id"]);

			articleDiv.append(title).append(deleteBtn).append(notes);
			articleBody.append(link);
			articleContainer.append(articleDiv).append(articleBody)
			$("#saved-articles").append(articleContainer);
		}
		var footer = `<footer class="footer bg-dark"><a href="https://www.foxsports.com/soccer">POWERED BY <span><img src="/assets/images/foxsportslogo.png" alt="FOX SPORTS" class="img-responsive"></span></a><p>&copy; www.cesaracaceres.com 2018</p></footer>`;
		$("body").append(footer);
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
		$("#note-box").val("");
	})
});

//function to get saved notes for an article

function getSavedNotes(){
	var id = localStorage.getItem("article");
	var url = "/notes/"+id;	
	$("#note-area").empty();
	$.get(url, function(data){
		if(data.note.length == 0){
			$("#note-area").html("<div class='card bg-warning text-center warning' >No notes for this article yet.</div>");
		}
		for(var i =0; i < data.note.length; i++){
			
			var noteDiv = $("<div>");
			noteDiv.addClass("card container note-container");
			var container = $("<div>");
			container.addClass("row")
			var body = $("<p>");
			body.html(data.note[i].body);
			body.addClass("col-sm-10");
			 var deleteBtn= $("<button>");
			deleteBtn.html("X");
			deleteBtn.attr("class", "delete-note btn btn-danger col-sm-2");
			deleteBtn.attr("id", data.note[i]["_id"]);

			container.append(body).append(deleteBtn);
			noteDiv.append(container);
			$("#note-area").append(noteDiv);

		}
	})


}

//button on click to delete note
$(document).on("click", ".delete-note", function(event){
	event.preventDefault();
	var id = $(this).attr("id");
	var url = "/notes/delete/"+id;
	
	$.post(url, function(response){
		// alert(response);
		getSavedNotes();
	})
});

//function when note area gets scrolled
function scrollNotes(){
	var note = $("#note-area");
	note.scrollTop;
}
