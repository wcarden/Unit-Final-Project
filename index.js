/**
 * Create a form to create/post new entities
 * Use fetch and async/await to interact with the API
 * Has to have a way for users to delete entities
 * Must have a way to get entities from the API and display them
 * Doesn't need update but can have it
 * Make sure to use Bootstrap and/or CSS to style my project
 */


//State
let dinoList = [];
let editDinoId = null;
let user = "Will";
let dinosaurId = 6

//Rendering and Listening
const dinoContainer = document.getElementById("dino-container");
const dinoName = document.getElementById("dino-name");
const dinoTextarea = document.getElementById("dino-textarea");

//Rendering the list of Dinosaurs
function renderDinoList () {
    dinoContainer.innerHTML = ""
    if (dinoList.length === 0) {
        dinoContainer.innerHTML = "No one has expressed their favorite dinosaur yet!";
    }
    dinoList.map(renderDino).forEach(div => dinoContainer.appendChild(div));
}

//Render your favorite dinosaur
function renderDino(favorite) {
    const dinoDiv = document.createElement("div");
    dinoDiv.className = "bg-light mb-3 p-4"
    dinoDiv.innerHTML = `
        <h5>${favorite.author}</h5>
        <p>${favorite.dino}</p>
        <p>${favorite.text}</p>
        <button id="edit-button" class="btn btn-sm btn-secondary">Edit</button>
        <button id="delete-button" class="btn btn-sm btn-danger">Delete</button>
    `
    dinoDiv.querySelector("#edit-button").addEventListener("click", () => {
        editDinoId = favorite.id
        renderDinoForm(favorite);
    })
    dinoDiv.querySelector("#delete-button").addEventListener("click", async () => {
        await deleteFavorite(favorite.id);
        const indexToDelete = dinoList.indexOf(favorite);
        dinoList.splice(indexToDelete, 1);
        renderDinoList();
    })
    return dinoDiv
}

//Update your favorite dinosaur
function renderDinoForm(favoriteData) {
    dinoName.value = favoriteData.dino
    dinoTextarea.value = favoriteData.text
}

//When save button is hit
async function onSaveDinoClick(event) {
    event.preventDefault()
    const favoriteData = {
        author: user,
        dinosaurId: dinosaurId,
        text: dinoTextarea.value,
        dino: dinoName.value 
    }
    if(editDinoId !== null) {
        favoriteData.id = editDinoId;
        await putDino(favoriteData);
        const indexToReplace = dinoList.findIndex(r => r.id === editDinoId);
        dinoList[indexToReplace] = favoriteData;
    } else {
        const createdFavorite = await postFavorite(favoriteData);
        dinoList.push(createdFavorite);
    }
    renderDinoList();
    editDinoId = null
    renderDinoForm({dino: "", text: ""});
}

//Fetching the data
async function fetchAllFavorites() {
    const response = await fetch("http://localhost:3000/favorite");
    return response.json();
}

async function postFavorite(newFavoriteData) {
    const response = await fetch("http://localhost:3000/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFavoriteData)
    })
    return response.json();
}

async function putDino(updatedFavorite) {
    await fetch("http://localhost:3000/favorite/" + updatedFavorite.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFavorite)
    })
}

async function deleteFavorite(idToDelete) {
    await fetch("http://localhost:3000/favorite/" + idToDelete, {
        method: "DELETE"
    })
}

//Start up
async function startUp() {
    renderDinoList()
    dinoList = await fetchAllFavorites()
    renderDinoList()
}

startUp();