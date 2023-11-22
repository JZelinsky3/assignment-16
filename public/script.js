// Add these functions to your script.js

let deleteId = null;

const getComedyMovies = async () => {
    try {
        const response = await fetch("/api/data");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }
};

const showComedyMovies = async () => {
    try {
        let comedyMovies = [];

        // Fetch comedy movies from the server
        const response = await fetch("/api/movies");

        if (response.ok) {
            comedyMovies = await response.json();
            console.log(comedyMovies);
        } else {
            console.error(`HTTP error! Status: ${response.status}`);
            comedyMovies = data;
        }

        const moviesDiv = document.getElementById("movie-list");
        moviesDiv.innerHTML = "";

        comedyMovies.forEach((movie) => {
            const section = document.createElement("section");
            section.classList.add("movie");
            moviesDiv.append(section);

            const a = document.createElement("a");
            a.href = "#";
            section.append(a);

            const h3 = document.createElement("h3");
            h3.innerHTML = movie.title;
            a.append(h3);

            // Add the following code for edit and delete buttons
            const editButton = document.createElement("a");
            editButton.href = "#";
            editButton.classList.add("edit-button");
            editButton.innerHTML = "&#9998;";
            a.append(editButton);

            const deleteButton = document.createElement("a");
            deleteButton.href = "#";
            deleteButton.classList.add("delete-button");
            deleteButton.innerHTML = "&#x2715;";
            a.append(deleteButton);

            // Set onclick events for edit and delete buttons
            editButton.onclick = (e) => {
                e.preventDefault();
                editMovie(movie.id);
            };

            deleteButton.onclick = (e) => {
                e.preventDefault();
                confirmDelete(movie.id);
            };

            // ...
        });
    } catch (error) {
        console.error(error);
    }
};

const displayDetails = (movie) => {
    const movieDetails = document.getElementById("movie-details");
    movieDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = movie.title;
    movieDetails.append(h3);

    const pGenre = document.createElement("p");
    pGenre.innerHTML = `Genre: ${movie.genre}`;
    movieDetails.append(pGenre);

    const pDirector = document.createElement("p");
    pDirector.innerHTML = `Director: ${movie.director}`;
    movieDetails.append(pDirector);

    const pActors = document.createElement("p");
    pActors.innerHTML = `Actors: ${movie.actors.join(", ")}`;
    movieDetails.append(pActors);

    const pRating = document.createElement("p");
    pRating.innerHTML = `Rating: ${movie.rating}`;
    movieDetails.append(pRating);

    const pQuotes = document.createElement("p");
    pQuotes.innerHTML = `Quotes: ${movie.quotes.join(", ")}`;
    movieDetails.append(pQuotes);

    const deleteLink = document.createElement("a");
    deleteLink.innerHTML = "&#x2715;";
    movieDetails.append(deleteLink);
    deleteLink.id = "delete-link";

    const editLink = document.createElement("a");
    editLink.innerHTML = "&#9998;";
    movieDetails.append(editLink);
    editLink.id = "edit-link";

    editLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit-title").innerHTML = "Edit Movie";
        populateEditForm(movie);
    };

    deleteLink.onclick = (e) => {
        e.preventDefault();
        deleteMovie(movie.id);
    };

    populateEditForm(movie);
};

const editMovie = async (id) => {
    const movie = data.find(item => item.id === id);
    if (movie) {
        populateEditForm(movie);
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit-title").innerHTML = "Edit Movie";
    }
};

const confirmDelete = (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this movie?");
    if (confirmDelete) {
        deleteMovie(id);
    }
};

const deleteMovie = async (id) => {
    try {
        deleteId = id; // Set the global variable for deletion
        // Display the delete confirmation modal
        document.getElementById("delete-modal").classList.remove("transparent");
    } catch (error) {
        console.error(error);
    }
};

const populateEditForm = (movie) => {
    const form = document.getElementById("add-edit-movie-form");
    form.id.value = movie.id;
    form.title.value = movie.title;
    form.genre.value = movie.genre;
};

const addEditMovie = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-movie-form");
    const formData = new FormData(form);
    let response;

    if (form.id.value === "") {
        formData.delete("id");
        response = await fetch("/api/comedy-movies", {
            method: "POST",
            body: formData,
        });
    } else {
        response = await fetch(`/api/comedy-movies/${form.id.value}`, {
            method: "PUT",
            body: formData,
        });
    }

    if (response.status !== 200) {
        console.error("Error posting data");
        return;
    }

    movie = await response.json();

    if (form.id.value !== "") {
        displayDetails(movie);
    }

    document.querySelector(".dialog").classList.add("transparent");
    resetForm();
    showComedyMovies();
};

const resetForm = () => {
    const form = document.getElementById("add-edit-movie-form");
    form.reset();
    form.id.value = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Movie";
    resetForm();
    // Clear the movie details when adding or editing
    document.getElementById("movie-details").innerHTML = "";
};

window.onload = () => {
    showComedyMovies();
    document.getElementById("add-edit-movie-form").onsubmit = addEditMovie;
    document.getElementById("add-link").onclick = showHideAdd;

    // Add the following lines for event listeners
    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("cancel-delete").onclick = () => {
        document.getElementById("delete-modal").classList.add("transparent");
    };

    document.getElementById("confirm-delete").onclick = () => {
        document.getElementById("delete-modal").classList.add("transparent");
        deleteMovie(deleteId);
    };
};
