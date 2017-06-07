// JS File

// Function to handle clearing out old elements already on the screen
// so that a new search may be done
// === And always check to make sure it's not null, incase it's the first search 
// or there was no table due to no results or visa versa ===
	
// Set a variable for which page the user is currently on
var currentPage = 1;

// 
var oldSearch = "";

function ClearForNewSearch()
{
	// Find and delete the table of results
	var old = document.getElementById("movieTable");
	
	if (old != null)
	{
		old.remove();
	}
	
	// Find and delete the old footer
	old = document.getElementById("footer");
	
	if (old != null)
	{
		old.remove();
	}
	
	// If not results were found, delete that message as well
	old = document.getElementById("noResults");
	
	if (old != null)
	{
		old.remove();
	}

	// Delete old previous and next buttons
	old = document.getElementById("buttons");

	if (old != null)
	{
		old.remove();
	}
}

// Function to handle the search and displaying information received
function Search()
{	
	// Clear info already on screen
	ClearForNewSearch();

	// Grab the information entered into the text field and save it
	var searchText = document.getElementById("SearchText").value;
	// Replace the spaces in the search term with %20 so it can be used in the URL
	var searchWithNoSpaces = searchText.replace(/\s/g, "%20");

	if (window.oldSearch != searchText)
	{
		window.currentPage = 1;
		window.oldSearch = searchText;
	}

	// Find the table
	var table = document.getElementById("movieTable");
	// Save the search URL and enter in the search terms with the spaces replaced
	var apiString = "https://api.themoviedb.org/3/search/movie?api_key=abb2f03094b79c25e3bb5a4d1a3c0f2e&language=en-US&query=" + searchWithNoSpaces + "&page=" + window.currentPage + "&include_adult=false";

	// Create the search
	var xmlhttp = new XMLHttpRequest();
	// Create variables needed to create table
	var myObj, x, txt = "";
	
	// Connect and ask API for information
	xmlhttp.onreadystatechange = function() 
	{
		// Make sure that request finished and response is ready & that status is OK
		if (this.readyState == 4 && this.status == 200) 
		{
			// Parse the JSON object and save to a variable
			myObj = JSON.parse(this.responseText);
			
			//var string = JSON.stringify(myObj);
			// Get the number of results and save to a variable
			var numResults = myObj.total_results;

			// Find and save the number of pages returned
			var numPages = myObj.total_pages;
			
			// If there are actually results returned for the entered search
			if (numResults != 0)
				{
				// Create the table
				var table = document.createElement("TABLE");
				// Set table's ID
				table.setAttribute("id", "movieTable");

				// Grab the main div and append the table to it
				var mainEle = document.getElementById("main");
				mainEle.appendChild(table);
				
				// Cycle through all of the results returned in the JSON object
				for (i = 0; i < myObj.results.length; i++) 
				{
					// Add a row to the table for each result
					var row = table.insertRow(0);
					// Add cells for each result (movie title, release date, etc.)
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					// Set the cell information for each result
					cell1.innerHTML = myObj.results[i].original_title;
					cell2.innerHTML = myObj.results[i].release_date;
				}
				// Add the table headers and set their ID
				var tableHeader = table.insertRow(0);
				var header1 = tableHeader.insertCell(0);
				header1.setAttribute("id", "tableHeader");
				var header2 = tableHeader.insertCell(1);
				header2.setAttribute("id", "tableHeader");
				// Set table header text
				header1.innerHTML = "Movie Title";
				header2.innerHTML = "Release Date";
				
				// Find the number of results on the page and set the correct number
				document.getElementById("numResults").innerHTML = numResults;
				
				// If results were found make sure that the number of results text and header are visible
				var num = document.getElementById("numberResults");
				num.style.color = "#CCCCCC";
				num.style.display = 'block';

				// Forward and back buttons to navigate pages
				// Back Button
				var buttons = document.createElement("div");
				buttons.setAttribute("id", "buttons");

				var backButton = document.createElement("button");
				backButton.setAttribute("class", "buttons");
				backButton.setAttribute("id", "prevButton");
				backButton.innerHTML = "&#8249";
				backButton.addEventListener("click", function() {ChangePage(-1);});
				buttons.appendChild(backButton);

				// Show current page
				var page = document.createElement("p");
				page.setAttribute("class", "buttons");
				page.setAttribute("id", "currPage");
				page.innerHTML = window.currentPage + " of " + numPages;
				buttons.appendChild(page);

				// Next button
				var nextButton = document.createElement("button");
				nextButton.setAttribute("class", "buttons");
				nextButton.setAttribute("id", "nextButton");
				nextButton.setAttribute("href", "");
				nextButton.innerHTML = "&#8250";
				nextButton.addEventListener("click", function() {ChangePage (1);});
				buttons.appendChild(nextButton);

				document.getElementById("main").appendChild(buttons);

				// Create the footer after table created so it will appear at bottom of page
				CreateFooter(apiString);
			}
			
			// Else, if there are no results found for search.
			else
			{
				var noResultsMessage = document.createElement("p");
				noResultsMessage.setAttribute("id", "noResults");
				
				// Set no results text
				noResultsMessage.innerHTML = "Sorry: No results were found for '" + searchText + "'. Please try a different search.";
				
				// Turn off the number of results and header if no results were found
				var num = document.getElementById("numberResults");
				num.style.display = 'none';
				
				// Find the main section and add the no results message to it
				var mainEle = document.getElementById("main");
				mainEle.appendChild(noResultsMessage);
				
				// Create the footer after table created so it will appear at bottom of page
				CreateFooter(apiString);
			}
		}
	};

	// Ask the API for information
	xmlhttp.open("GET", apiString, true);
	xmlhttp.send();

	//document.getElementById("resultTitle").innerHTML = "";
}

function ChangePage(num)
{
	if (window.currentPage == 1 && num == -1)
	{
		return;
	}
	window.currentPage += num;

	Search();
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
	
	var container = document.getElementById("container");
	// Add the footer division to the site
	container.appendChild(div);
	// Add the footer title to the site
	div.appendChild(header);
	// Add the footer text to the site
	div.appendChild(para);
}