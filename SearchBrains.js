// JS File

function ClearForNewSearch()
{
	var old = document.getElementById("movieTable");
	
	if (old != null)
	{
		old.remove();
	}
	
	old = document.getElementById("footer");
	
	if (old != null)
	{
		old.remove();
	}
	
	old = document.getElementById("noResults");
	
	if (old != null)
	{
		old.remove();
	}
}

function Search()
{	
	ClearForNewSearch();

	var searchText = document.getElementById("SearchText").value;
	var searchWithNoSpaces = searchText.replace(/\s/g, "%20");
	
	var table = document.getElementById("movieTable");
	
	var apiString = "https://api.themoviedb.org/3/search/movie?api_key=abb2f03094b79c25e3bb5a4d1a3c0f2e&language=en-US&query=" + searchWithNoSpaces + "&page=1&include_adult=false";
	
	var xmlhttp = new XMLHttpRequest();
	
	var myObj, x, txt = "";
	
	xmlhttp.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			myObj = JSON.parse(this.responseText);
			
			var string = JSON.stringify(myObj);
			var numResults = myObj.results.length;
			
			if (numResults != 0)
				{
				
				var table = document.createElement("TABLE");
				table.setAttribute("id", "movieTable");
				document.body.appendChild(table);
		
				for (i = 0; i < numResults; i++) 
				{
					var row = table.insertRow(0);
					
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					cell1.innerHTML = myObj.results[i].original_title;
					cell2.innerHTML = myObj.results[i].release_date;
				}
				var tableHeader = table.insertRow(0);
				var header1 = tableHeader.insertCell(0);
				header1.setAttribute("id", "tableHeader");
				var header2 = tableHeader.insertCell(1);
				header2.setAttribute("id", "tableHeader");
				
				header1.innerHTML = "Movie Title";
				header2.innerHTML = "Movie Release Date";
				
				document.getElementById("numResults").innerHTML = numResults;
				
				// If results were found make sure that the number of results text and header are visible
				var num = document.getElementById("numberResults");
				num.style.display = 'block';
				
				var title = document.getElementById("titlesListHeader");
				title.style.display = 'block';
				
				// Create the footer after table created so it will appear at bottom of page
				CreateFooter(apiString);
			}
			
			else
			{
				var noResultsMessage = document.createElement("p");
				noResultsMessage.setAttribute("id", "noResults");
				
				// Set no results text
				noResultsMessage.innerHTML = "Sorry: No results were found for '" + searchText + "'. Please try a different search.";
				
				// Turn off the number of results and header if no results were found
				var num = document.getElementById("numberResults");
				num.style.display = 'none';
				
				var title = document.getElementById("titlesListHeader");
				title.style.display = 'none';
				
				// Add no results message to site
				document.body.appendChild(noResultsMessage);
				
				// Create the footer after table created so it will appear at bottom of page
				CreateFooter(apiString);
			}
		}
	};

	xmlhttp.open("GET", apiString, true);
	xmlhttp.send();

	document.getElementById("resultTitle").innerHTML = "";
}

// Create the footer
function CreateFooter(url)
{
	// Create the division
	var div = document.createElement("div");
	// Set divisions class so it can be formatted by CSS file
	div.setAttribute("class", "footer");
	// Set footer id
	div.setAttribute("id", "footer");
	
	// Create the header
	var header = document.createElement("p");
	// Set header text
	header.innerHTML = "= Search URL created =";
	// Set header's class so it can be formatted by CSS file
	header.setAttribute("class", "footer");
	
	// Create the paragraph element
	var para = document.createElement("p");
	// Set paragraphs id
	para.setAttribute("id", "searchURL");
	// Set footer text
	para.innerHTML = url;
	

	// Add the footer division to the site
	document.body.appendChild(div);
	// Add the footer title to the site
	div.appendChild(header);
	// Add the footer text to the site
	div.appendChild(para);
}