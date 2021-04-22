// Wait for window load
$(window).on("load", function () {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");
});

// do a GET request to get the movie info form db.json and display it
$(document).ready(function () {
    $.ajax("https://pollen-impossible-bangle.glitch.me/movies")
        .done(function (movies) {
            displayMovies(movies)
        })
        .fail(function () {
            $(".card").html("Oops, something went wrong :(");
        });

    //
    $('#submit-movie-name').click(function (e) {
        e.preventDefault();
        let userInputTitle = $('#Movie-Input-Title').val();
        fetch(`http://www.omdbapi.com/?t=${userInputTitle}&apikey=8f3e93c7`)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            let userInput = { 
                title: result.Title, 
                plot: result.Plot,
                year: result.Released.split(" ")[2],
                genre: result.Genre,
                director: result.Director,
                actors: result.Actors,
                rating: result.imdbRating
            }
            console.log(userInput);
            fetch(`https://pollen-impossible-bangle.glitch.me/movies`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInput)
            })
            .then((response) => { return response.json() })
            .then(function (results) {
                console.log(results);
                displayMovies(results)
                location.reload()
            })
        }).catch(() => $("#Movie-Input-Title:text").val(`Sorry, cannot find the movie :(`));
    });

    // click the plot paragraph the movie poster will show up
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

    // click edit button a form with movie info will popup
    $(document).on("click", ".edit-movie", function (e) {
        e.preventDefault();
        console.log(this);
        const id = $(this).parent().parent().attr('id');
        console.log(id);

        // use the id to get movie info from db.json and then display the info in the inputs for user to edit
        fetch(`https://pollen-impossible-bangle.glitch.me/movies/${id}`)
            .then((response) => { return response.json() })
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
            .catch(() => { $(".modal-title").html("We're sorry, something went wrong.") })

            // click button to submit the edited info to db.json and then reload the page to display the edited info
            $(document).on("click", "#finish-editing", function(e){
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

    // click delete button and then delete the movie form db.json and then reload the page to see the result
    $(document).on("click", ".delete-movie", function(e){
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

    // sort movies by rating
});


// render all of the movies to html
function displayMovies(movies) {
    for (let i = 0; i < movies.length; i++) {
        if (movies[i].title !== undefined) {
            $(".card-deck").append(`
                <div class="card m-0 mb-3 p-0 col-md-6 col-lg-4 col-xl-3" id="${movies[i].id}">
                    <div class="card-body p-0">
                        <h5 class="card-title text-center text-light bg-secondary rounded-top p-2">${movies[i].title}</h5>
                        <p class="card-text m-4 plot">${movies[i].plot}</p>
                    </div>
                    <ul class="list-group list-group-flush border-bottom-0 ml-3 mr-3">
                        <li class="list-group-item pl-1 pr-1"><em>YEAR:</em> ${movies[i].year}</li>
                        <li class="list-group-item pl-1 pr-1"><em>GENRE:</em> ${movies[i].genre}</li>
                        <li class="list-group-item pl-1 pr-1"><em>DIRECTOR:</em> ${movies[i].director}</li>
                        <li class="list-group-item pl-1 pr-1"><em>ACTORS:</em> ${movies[i].actors}</li>
                        <li class="list-group-item pl-1 pr-1"><em>RATING:</em> ${movies[i].rating}</li>
                    </ul>
                    <div class="d-flex justify-content-center mb-2">
                        <button class="btn btn-secondary pl-4 pr-4 mr-2 edit-movie" data-toggle="modal" data-target="#movieModal">Edit</button>
                        <button class="btn btn-secondary delete-movie">Delete</button>
                    </div>    
                </div>`);
        }
    }
}



