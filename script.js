// Wait for window load
$(window).on("load", function() {
  // Animate loader off screen
  $(".se-pre-con").fadeOut("slow");
});

$(document).ready(function() {
    $.ajax("https://pollen-impossible-bangle.glitch.me/movies")
        .done(function(movies){
            displayMovies(movies)
        })
        .fail(function() {
          $(".card").html("Oops, something went wrong :(");
        });

    $('#submit-movie-rating').click(function (e){
        e.preventDefault();
       let userInputTitle = $('#Movie-Input-Title').val()
        let userInputRating = $('#Movie-Input-Rating').val()
        let userInput = {title: userInputTitle, rating: userInputRating}
        console.log(userInput);
        fetch(`https://pollen-impossible-bangle.glitch.me/movies`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInput)})
            .then((response) => {return response.json()})
            .then(function (results){
            console.log(results);
            displayMovies(results)
        })
    })

    $(".edit-movie").click(function(e) {
        e.preventDefault();
        console.log(this);
        console.log(e.target);
        const id = {id: e.target.parent().attr('id')};

        console.log(e.target.parent())
        console.log(id);
        fetch(`https://pollen-impossible-bangle.glitch.me/movies`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(id)
        })
            .then((response) => {return response.json()})
            .then(function(results) {
                console.log(results);
                // $(".movieModalTitle:text").val()
            })
            .catch(() => {$(".modal-title").html("We're sorry, something went wrong.")})

    });

});


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
function displayMovies(movies){
    for (let i = 0; i < movies.length; i++) {
        if  (movies[i].title !== undefined && movies[i].rating !== undefined)  {
            $(".card-deck").append(`
                <div class="card" id="${movies[i].id}">
                    <div class="card-body">
                        <h5 class="card-title">${movies[i].title}</h5>
                        <p class="card-text">${movies[i].plot}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><em>YEAR:</em> ${movies[i].year}</li>
                        <li class="list-group-item"><em>GENRE:</em> ${movies[i].genre}</li>
                        <li class="list-group-item"><em>DIRECTOR:</em> ${movies[i].director}</li>
                        <li class="list-group-item"><em>ACTORS:</em> ${movies[i].actors}</li>
                        <li class="list-group-item"><em>RATING:</em> ${movies[i].rating}</li>
                    </ul>
                    <button class="btn btn-primary edit-movie" data-toggle="modal" data-target="#movieModal">Edit</button>
                    <button class="btn btn-primary delete-movie">Delete</button>
                </div>`)
        }

    }
}