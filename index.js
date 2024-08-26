/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// Import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// Create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// Remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Get the games-container element
const gamesContainer = document.getElementById("games-container");

// Create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // Loop over each item in the data
    for (const game of games) {
        // Create a new div element, which will become the game card
        const gameCard = document.createElement("div");

        // Add the class game-card to the div's class list
        gameCard.classList.add("game-card");

        // Set the inner HTML using a template literal to display some info about each game
        gameCard.innerHTML = `
            <h3>${game.name}</h3>
            <img src="${game.img}" alt="${game.name}" class="game-img" />
            <p>${game.description}</p>
            <p>Pledged: $${game.pledged.toLocaleString()}</p>
            <p>Goal: $${game.goal.toLocaleString()}</p>
        `;

        // Append the game card to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// Call the function with GAMES_JSON to populate the page
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/
// Grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// Use reduce() to count the total number of backers (individual contributions)
const totalBackers = GAMES_JSON.reduce((total, game) => total + game.backers, 0);
contributionsCard.innerHTML = totalBackers.toLocaleString();

// Log the total number of backers to the console for debugging
console.log("Total Backers:", totalBackers);

// Grab the amount raised card element
const raisedCard = document.getElementById("total-raised");

// Use reduce() to find the total amount raised
const totalRaised = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// Log the total amount raised to the console for debugging
console.log("Total Raised:", totalRaised);

// Grab the number of games card element
const gamesCard = document.getElementById("num-games");

// Calculate the total number of games
const totalGames = GAMES_JSON.length;
gamesCard.innerHTML = totalGames.toLocaleString();

// Log the total number of games to the console for debugging
console.log("Total Games:", totalGames);

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // Use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // Log the number of unfunded games
    console.log(`Number of unfunded games: ${unfundedGames.length}`);

    // Use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}

// Show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // Use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // Log the number of funded games
    console.log(`Number of funded games: ${fundedGames.length}`);

    // Use the function we previously created to add the funded games to the DOM
    addGamesToPage(fundedGames);
}

// Show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // Add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// Select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// Add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// Grab the description container
const descriptionContainer = document.getElementById("description-container");

// Use filter to count the number of unfunded games
const numUnfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// Create a string that explains the number of unfunded games using the ternary operator
const descriptionText = `
    A total of $${totalRaised.toLocaleString()} has been raised across ${totalGames.toLocaleString()} games. 
    ${numUnfundedGames === 1 ? 'There is 1 game that has not yet met its funding goal.' : `There are ${numUnfundedGames.toLocaleString()} games that have not yet met their funding goal.`}
`;
// Create a new paragraph element
const descriptionParagraph = document.createElement("p");

// Set the inner HTML of the paragraph to the template string
descriptionParagraph.innerHTML = descriptionText;

// Append the new paragraph element to the description container
descriptionContainer.appendChild(descriptionParagraph);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

// Get the containers for the top games
const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

// Sort the games by the amount pledged in descending order
const sortedGames = [...GAMES_JSON].sort((item1, item2) => item2.pledged - item1.pledged);

// Destructure to get the top two games
const [topGame, runnerUp] = sortedGames;

// Check if topGame and runnerUp are correctly assigned
console.log("Top Game:", topGame);
console.log("Runner Up:", runnerUp);

// Create and append the top funded game to the firstGameContainer
if (topGame) {
    const topGameElement = document.createElement("p");
    topGameElement.textContent = topGame.name;
    firstGameContainer.appendChild(topGameElement);
}

// Create and append the runner-up game to the secondGameContainer
if (runnerUp) {
    const runnerUpElement = document.createElement("p");
    runnerUpElement.textContent = runnerUp.name;
    secondGameContainer.appendChild(runnerUpElement);
}

// Function to filter games by search query
function filterGamesBySearch(query) {
    deleteChildElements(gamesContainer);

    const searchQuery = query.toLowerCase();
    const filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(searchQuery));

    addGamesToPage(filteredGames);
}

// Get the search bar element and add an event listener
const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", () => {
    filterGamesBySearch(searchBar.value);
});