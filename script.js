// Wait for window load
$(window).on("load", function () {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");
});

$(document).ready(function () {
    //  get all the movies and display them on the page
    getAllMovies();

    // add movie -- click submit button to get info from a movie API and then add the info to db.json then display it
    $('#submit-movie-name').click(function (e) {
        e.preventDefault();
        let userInputTitle = $('#Movie-Input-Title').val();

        // format userInputTitle
        userInputTitle = formatTitle(userInputTitle);

        // check if userInputTitle(movie title) is already in db
        fetch(url)
            .then(response => response.json())
            .then(movies => {
                let movieTitles = movies.map(movie => movie.title);
                console.log(movieTitles);
                if (!movieTitles.includes(userInputTitle)) {
                    // do a GET request to movie API called OMDB
                    fetch(`http://www.omdbapi.com/?t=${userInputTitle}&apikey=8f3e93c7`)
                        .then(response => response.json())
                        .then(result => {
                            let userInput = {
                                title: result.Title,
                                rating: result.imdbRating,
                                poster: result.Poster,
                                year: result.Released.split(" ")[2],
                                genre: result.Genre,
                                director: result.Director,
                                plot: result.Plot,
                                actors: result.Actors
                            }
                            console.log(userInput);

                            // do a POST request to db.json and add extra info then reload the page to show
                            fetch(url, {
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(userInput)
                            })
                                .then(response => response.json())
                                .then(jsonMovieData => {
                                    console.log(`Added: ${jsonMovieData}`);

                                    // display new movies
                                    getAllMovies();
                                })
                        })
                        .catch(() => $("#Movie-Input-Title:text").val(`Sorry, cannot find the movie :(`));
                } else {
                    alert("This movie already exists, please try another one.");
                }
            });
    });

    // sort movies by rating
    $("#rating").click(() => {
        // get movie info form db.json
        fetch("https://pollen-impossible-bangle.glitch.me/movies")
            .then(response => response.json())
            .then(movies => {
                // sort movies by title
                movies.sort((a, b) => {
                    let aRating = parseFloat(a.rating),
                        bRating = parseFloat(b.rating);

                    return aRating - bRating;
                });
                console.log(movies);

                // clean the old movie cards and then display the ordered movies
                $(".card-deck").html("");
                displayMovies(movies);
            })
            .catch(() => $(".card-deck").html("Oops, something went wrong :("));
    });

    // sort movies by title
    $("#title").click(() => {
        // get movie info form db.json
        fetch("https://pollen-impossible-bangle.glitch.me/movies")
            .then(response => response.json())
            .then(movies => {
                // sort movies by title
                movies.sort((a, b) => {
                    let aTitle = a.title.toLowerCase(),
                        bTitle = b.title.toLowerCase();

                    if (aTitle < bTitle) {
                        return -1;
                    } else if (aTitle > bTitle) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                console.log(movies);

                // clean the old movie cards and then display the ordered movies
                $(".card-deck").html("");
                displayMovies(movies);
            })
            .catch(() => $(".card-deck").html("Oops, something went wrong :("));
    });

    // sort movies by genre
    $("#genre").click(() => {
        // get movie info form db.json
        fetch("https://pollen-impossible-bangle.glitch.me/movies")
            .then(response => response.json())
            .then(movies => {
                // sort movies by title
                movies.sort((a, b) => {
                    let aGenre = a.genre.toLowerCase(),
                        bGenre = b.genre.toLowerCase();

                    if (aGenre < bGenre) {
                        return -1;
                    } else if (aGenre > bGenre) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                console.log(movies);

                // clean the old movie cards and then display the ordered movies
                $(".card-deck").html("");
                displayMovies(movies);
            })
            .catch(() => $(".card-deck").html("Oops, something went wrong :("));
    });

    // edit movie -- click the plot paragraph the movie poster will show up
    $(document).on("click", ".plot", function () {
        let movieTitle = $(this).siblings()[0].innerHTML;
        console.log(movieTitle);
        fetch(`http://img.omdbapi.com/?t=${movieTitle}&apikey=8f3e93c7`)
            .then(response => {
                console.log(response);
                console.log(response.url);
                $(this).html(`<img src=${response.url}>`);
            });
    });

    // edit movie -- click edit button a form with movie info will popup
    $(document).on("click", ".edit-movie", function (e) {
        e.preventDefault();
        console.log(this);
        const id = $(this).parent().parent().attr('id');
        console.log(id);

        // use the id to get movie info from db.json and then display the info in the inputs for user to edit
        fetch(`https://pollen-impossible-bangle.glitch.me/movies/${id}`)
            .then((response) => {
                return response.json()
            })
            .then(function (results) {
                console.log(results);
                $(".movieModalTitle:text").val(`${results.title}`);
                $(".movieModalPlot").val(`${results.plot}`);
                $(".movieModalGenre:text").val(`${results.genre}`);
                $(".movieModalYear:text").val(`${results.year}`)
                $(".movieModalDirector:text").val(`${results.director}`);
                $(".movieModalActors:text").val(`${results.actors}`);
                $(".movieModalRating:text").val(`${results.rating}`);
            })
            .catch(() => {
                $(".modal-title").html("We're sorry, something went wrong.")
            })

        // click button to submit the edited info to db.json and then reload the page to display the edited info
        $(document).on("click", "#finish-editing", function (e) {
            e.preventDefault();

            // get info form the inputs
            let movieInfo = {
                title: $(".movieModalTitle").val(),
                plot: $(".movieModalPlot").val(),
                genre: $(".movieModalGenre").val(),
                year: $(".movieModalYear").val(),
                director: $(".movieModalDirector").val(),
                actors: $(".movieModalActors").val(),
                rating: $(".movieModalRating").val()
            }

            // do a PUT request
            fetch(`https://pollen-impossible-bangle.glitch.me/movies/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieInfo)
            }).then(() => location.reload())
                .catch(() => console.log("Something went wrong with the movie edit."))
        });
    });

    // delete movie -- click delete button and then delete the movie form db.json and then reload the page to see the result
    $(document).on("click", ".delete-movie", function (e) {
        e.preventDefault();
        const id = $(this).parent().parent().attr('id');
        fetch(`https://pollen-impossible-bangle.glitch.me/movies/${id}`, {
            method: "DELETE"
        }).then(response => {
            console.log(response);
            location.reload()
        })
            .catch(() => console.log("Something went wrong with the movie edit."))
    });
});


// movie API from glitch
const url = "https://pollen-impossible-bangle.glitch.me/movies";

// render all of the movies to html
function displayMovies(movies) {
    movies.forEach(movie => {
        if (movie.title !== undefined) {
            $(".card-deck").append(`
                <div class="card m-3 p-0" id="${movie.id}">
                    <div class="card-body p-0">
                        <img class="rounded-top" src="${movie.poster}" alt="${movie.title}">
                    </div>
                    <div>
                        <h5 class="card-title text-center text-light bg-secondary">${movie.title}(${movie.year})</h5>
                        <p class="card-text"><em>Directed by</em> ${movie.director}</p>
                        <p class="card-text">${movie.rating}/10</p>
                        <ul class="list-group list-group-flush border-bottom-0 ml-3 mr-3">
                            <li class="list-group-item pl-1 pr-1"><em>GENRE:</em> ${movie.genre}</li>
                            <li class="list-group-item pl-1 pr-1"><em>ACTORS:</em> ${movie.actors}</li>
                        </ul>
                        <p class="card-text m-4 plot">${movie.plot}</p>
                        <div class="d-flex justify-content-center mb-2">
                            <button class="btn btn-secondary pl-4 pr-4 mr-2 edit-movie" data-toggle="modal" data-target="#movieModal">Edit</button>
                            <button class="btn btn-secondary delete-movie">Delete</button>
                        </div>    
                    </div>
                    
                </div>`);
        }
    });
}

// get all movies
function getAllMovies() {
    // display movies -- do a GET request to get the movie info form db.json and display it
    fetch(url)
        .then(response => response.json())
        .then(movies => {
            console.log(movies);
            displayMovies(movies);

            // search movies
            $(document).on("click", ".movie-search", () => {
                // Get the selected option & search movie value on small screen
                let selectedTypeSm = $("#movie-search-select-sm option:selected").text(),
                    movieToSearchSm = $("#search-item-sm").val();

                if (movieToSearchSm) {
                    // go through the movies array to filter out the searched movies
                    searchMovies(movies, selectedTypeSm, movieToSearchSm);
                    console.log(moviesSearched);
                }

                // Get the selected option & search movie value on medium screen
                let selectedTypeMd = $("#movie-search-select-md option:selected").text(),
                    movieToSearchMd = $("#search-item-md").val();

                if (movieToSearchMd) {
                    // go through the movies array to filter out the searched movies
                    searchMovies(movies, selectedTypeMd, movieToSearchMd);
                    console.log(moviesSearched);
                }

                // clean the old movie cards and then display the ordered movies
                $(".card-deck").html("");
                displayMovies(moviesSearched);
            });
        })
        .catch(function () {
            $(".card-deck").html("Oops, something went wrong :(");
        });
}

// search movies by rating, title, or genre
let moviesSearched = [];

function searchMovies(movies, selectedType, movieToSearch) {
    if (selectedType === "Rating") { // search by rating
        moviesSearched = movies.filter(movie => movie.rating >= movieToSearch);
    } else if (selectedType === "Title") { // search by title
        moviesSearched = movies.filter(movie => {
            console.log(movie.title);
            if (movie.title !== undefined && movie.title.toLowerCase().includes(movieToSearch.toLowerCase())) {
                return movie;
            }
        });
    } else if (selectedType === "Genre") { // search by genre
        moviesSearched = movies.filter(movie => {
            console.log(movie.genre);
            if (movie.genre !== undefined && movie.genre.toLowerCase().includes(movieToSearch.toLowerCase())) {
                return movie;
            }
        });
    }
}

function formatTitle(string) {
    const titleArr = string.split(' ');

    const formattedArr = titleArr.map(title => title.charAt(0).toUpperCase() + title.slice(1).toLowerCase());

    return formattedArr.join(' ');
}

// function advancedSearch () {
//     if (movie.genre !== undefined) {
//         let movieGenreArr = movie.genre.toLowerCase().split(", "),
//             movieToSearchArr = movieToSearch.toLowerCase().split(", ");
//         function hasAllGenre () {
//             for (let i = 0; i < movieToSearchArr.length; i++) {
//                 if (!movieGenreArr.includes(movieToSearchArr[i])) {
//                     return false;
//                 }
//             }
//             return true;
//         }
//
//         if (hasAllGenre()) {
//             return movie;
//         } else {
//             alert("Sorry, we couldn't find the movie for you :(");
//         }
//     }
// }



