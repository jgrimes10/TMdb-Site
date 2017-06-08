// JS File

// Function to handle clearing out old elements already on the screen
// so that a new search may be done
// === And always check to make sure it's not null, in case it's the first search 
// or there was no table due to no results or vice versa ===
	
// Set a variable for which page the user is currently on
var currentPage = 1;

// Variable to hold and compare the old search term so that we can set the
// current page back to one if a new search term is entered
var oldSearch = "";

function ClearForNewSearch()
{
	// Find and delete the table of results
	var old = document.getElementById("movieTable");
	
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

	// Check if the search term has changed
	if (window.oldSearch != searchText)
	{
		// If it has, change the current page back to one
		window.currentPage = 1;
		// And save the new search text to compare to
		window.oldSearch = searchText;
	}

	// Get user's entry for search year
	var searchYear = document.getElementById("searchYear").value;
	// Check if user entered a year
	if (searchYear != "")
	{
		// Add year to URL search
		yearURL = "&primary_release_year=" + searchYear;
	}
	// User wants movies from all time
	else
	{
		// Don't add URL
		yearURL = "";
	}

	// Save the search URL and enter in the search terms with the spaces replaced
	var apiString = "https://api.themoviedb.org/3/search/movie?api_key=abb2f03094b79c25e3bb5a4d1a3c0f2e&language=en-US&query=" + searchWithNoSpaces + "&page=" + window.currentPage + "&include_adult=false" + yearURL;

	// Create variable to store the image's web location
	var imgString = "http://image.tmdb.org/t/p/w92/"

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
			
			// INSERT TABLE HERE
			CreateTable(myObj, apiString, imgString, "Search");
		}
	};

	// Ask the API for information
	xmlhttp.open("GET", apiString, true);
	xmlhttp.send();
}

function Discover(type)
{
	// Clear info already on screen
	ClearForNewSearch();

	// Create variable to store the image's web location
	var imgString = "http://image.tmdb.org/t/p/w92/"
	// Variable to compare to what has been passed in
	var discoverType = "";
	// If oldSearch is empty
	if (oldSearch == "")
	{
		// Search for what type has been passed in
		discoverType = type;
	}
	// If user picked other button
	else if (oldSearch != type)
	{
		discoverType = type;
		window.currentPage = 1;
	}
	// If oldSearch isn't empty, i.e. changing pages
	else
	{
		// Changing pages: keep the same URL just append new currentPage
		discoverType = oldSearch;
	}
	// Switch on type to know which search URL to use
	switch(discoverType)
	{
		// Searching for most popular movies
		case "mostPopular":
		var apiString = "https://api.themoviedb.org/3/discover/movie?api_key=abb2f03094b79c25e3bb5a4d1a3c0f2e&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page="+ window.currentPage;
		window.oldSearch = "mostPopular";
		break;

		// Searching all moves in database and sort date in descending order
		case "latest":
		var apiString = "https://api.themoviedb.org/3/discover/movie?api_key=abb2f03094b79c25e3bb5a4d1a3c0f2e&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page="+ window.currentPage;
		window.oldSearch = "latest";
		break;

		// Searching for highest voted movies
		case "highestVoted":
		var apiString = "https://api.themoviedb.org/3/discover/movie?api_key=abb2f03094b79c25e3bb5a4d1a3c0f2e&language=en-US&sort_by=highest_voted.desc&include_adult=false&include_video=false&page=" + window.currentPage;
		window.oldSearch = "highestVoted";
		break;

		// Throw an error if something happens that shouldn't.
		// Should NEVER get to this...
		default:
		alert("Something went wrong (SearchBrains.js - switch(type): " + discoverType);
		break;

	}

	// Create the search
	var xmlhttp = new XMLHttpRequest();
	
	// Connect and ask API for information
	xmlhttp.onreadystatechange = function() 
	{
		// Make sure that request finished and response is ready & that status is OK
		if (this.readyState == 4 && this.status == 200) 
		{
			// Parse the JSON object and save to a variable
			 var myObj = JSON.parse(this.responseText);

			// INSERT TABLE HERE
			CreateTable(myObj, apiString, imgString, "Discover");
		}
	};

	// Ask the API for information
	xmlhttp.open("GET", apiString, true);
	xmlhttp.send();
}

// Function to change the current page
function ChangePage(num, totalPages, caller)
{
	// Checking if the user is currently on the first page and tries to press previous
	// Just don't do anything since there is no page before page 1
	if (window.currentPage == 1 && num == -1)
	{
		return;
	}

	// Otherwise handle the page change, either going +1 or -1 depending on which button is pressed
	window.currentPage += num;

	// Check if the user has reached the end of the pages, don't let them go further
	if (currentPage > totalPages && num == 1)
	{
		// Set current page to last page if they are on the last page and click next page
		currentPage = totalPages
		// Return out so page doesn't refresh for nothing
		return;
	}

	if (caller == "Search")
	{
		// Re-run the search function with the new page number so we get the new results from the API
		Search();
	}
	else
	{
		Discover(window.oldSearch);
	}
}

function CreateTable(jsonObject, apiString, imgString, caller)
{
	// Find and save the number of results
	var numResults = jsonObject.total_results;
	
	// Find and save the number of pages returned
	var numPages = jsonObject.total_pages;

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
		for (i = 0; i < jsonObject.results.length; i++) 
		{
			// Create image for the movie poster
			var image = document.createElement('img');
			image.src = imgString + jsonObject.results[i].poster_path;
			// Add a row to the table for each result
			var row = table.insertRow(0);
			// Add cells for each result (movie title, release date, etc.)
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			// Set the cell information for each result
			cell1.innerHTML = jsonObject.results[i].original_title;
			cell2.innerHTML = jsonObject.results[i].release_date;
			cell3.innerHTML = jsonObject.results[i].vote_average;
			cell4.appendChild(image);

			if (jsonObject.results[i].poster_path == null)
			{
				cell4.innerHTML = "No Movie Poster Found";
			}
		}

		// Add the table headers and set their ID
		var tableHeader = table.insertRow(0);
		var header1 = tableHeader.insertCell(0);
		header1.setAttribute("id", "tableHeader");
		var header2 = tableHeader.insertCell(1);
		header2.setAttribute("id", "tableHeader");
		var header3 = tableHeader.insertCell(2);
		header3.setAttribute("id", "tableHeader");
		var header4 = tableHeader.insertCell(3);
		header4.setAttribute("id", "tableHeader");
		// Set table header text
		header1.innerHTML = "Movie Title";
		header2.innerHTML = "Release Date";
		header3.innerHTML = "Average Vote";
		header4.innerHTML = "Movie Poster";
		
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
		backButton.addEventListener("click", function() {ChangePage(-1, numPages, caller);});
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
		nextButton.addEventListener("click", function() {ChangePage (1, numPages, caller);});
		buttons.appendChild(nextButton);

		// Add the button division to the site
		document.getElementById("main").appendChild(buttons);
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
	}
}

// Function to check user input in text fields
function Enter(e)
{
	// If user presses Enter, go ahead and search
	if (e.keyCode == 13)
	{
		Search();
	}
}