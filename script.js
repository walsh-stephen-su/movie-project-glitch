// Wait for window load
$(window).on("load", function () {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");
});

$(document).ready(function () {
    $.ajax("https://pollen-impossible-bangle.glitch.me/movies")
        .done(function (movies) {
            displayMovies(movies)
        })
        .fail(function () {
            $(".card").html("Oops, something went wrong :(");
        });

    $('#submit-movie-rating').click(function (e) {
        e.preventDefault();
        let userInputTitle = $('#Movie-Input-Title').val()
        let userInputRating = $('#Movie-Input-Rating').val()
        let userInput = { title: userInputTitle, rating: userInputRating }
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
    })

    $(document).on("click", ".edit-movie", function (e) {
        e.preventDefault();
        console.log(this);
        const id = $(this).parent().parent().attr('id');

        console.log(id);
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
        
            $(document).on("click", "#finish-editing", function(e){
                e.preventDefault();
                let movieInfo = {
                    title: $(".movieModalTitle").val(),
                    plot: $(".movieModalPlot").val(),
                    genre: $(".movieModalGenre").val(),
                    year: $(".movieModalYear").val(),
                    director: $(".movieModalDirector").val(),
                    actors: $(".movieModalActors").val(),
                    rating: $(".movieModalRating").val()
                }
                fetch(`https://pollen-impossible-bangle.glitch.me/movies/${id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(movieInfo)
                }).then(() => console.log("Posted the movie edit."))
                .catch(() => console.log("Something went wrong with the movie edit."))
        })

    });
    $(document).on("click", ".delete-movie", function(e){
        e.preventDefault();
        const id = $(this).parent().parent().attr('id');
        fetch(`https://pollen-impossible-bangle.glitch.me/movies/${id}`, {
            method: "DELETE"
        }).then(function(response){
            console.log(response);
            location.reload()
        })

    })
});

// Delete the movie

// function deleteMovie(id){
//   fetch(`https://elemental-sepia-strawflower.glitch.me/${id}`,{
//     method: "DELETE"
//   })
// }

// //we will need movie title, description, etc. from the user



// //need to get the options that the user wants to change for that movie
// function editMovie(id){

// }

// //render all of the movies to html
function displayMovies(movies) {
    for (let i = 0; i < movies.length; i++) {
        if (movies[i].title !== undefined && movies[i].rating !== undefined) {
            $(".card-deck").append(`
                <div class="card m-0 mb-3 p-0 col-md-6 col-lg-4 col-xl-3" id="${movies[i].id}">
                    <div class="card-body p-0">
                        <h5 class="card-title text-center text-light bg-secondary rounded-top p-2">${movies[i].title}</h5>
                        <p class="card-text m-4">${movies[i].plot}</p>
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
                </div>`)
        }

    }
}