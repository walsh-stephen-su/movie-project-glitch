// Wait for window load
$(window).on("load", function() {
  // Animate loader off screen
  $(".se-pre-con").fadeOut("slow");
});

$(document).ready(function() {
    $.ajax("https://elemental-sepia-strawflower.glitch.me/movies")
        .done(function(movies) {

            console.log(movies);
            for (let i = 0; i < movies.length; i++) {
                if  (movies[i].title !== undefined && movies[i].rating !== undefined)  {
                    console.log(movies[i].title);
                    $(".card-deck").append(`
                        <div class="card">
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
                        </div>`)
                }

            }
            // movies.forEach(function(movie) {
            //     console.log(movie.year);
            //     $(".card-deck").append(`
            //         <div class="card">
            //             <div class="card-body">
            //                 <h5 class="card-title">${movie.title}</h5>
            //                 <p class="card-text">${movie.plot}</p>
            //             </div>
            //             <ul class="list-group list-group-flush">
            //                 <li class="list-group-item year">${movie.year}</li>
            //                 <li class="list-group-item genre">${movie.genre}</li>
            //                 <li class="list-group-item director">${movie.director}</li>
            //                 <li class="list-group-item actors">${movie.actors}</li>
            //                 <li class="list-group-item rating">${movie.rating}</li>
            //             </ul>
            //         </div>`)
            // })
        })
        .fail(function() {
          $(".card").html("Oops, something went wrong :(");
        });
});

// function updateMovies(movies){

// }

// function deleteMovie(id){
//   fetch(`https://elemental-sepia-strawflower.glitch.me/${id}`,{
//     method: "DELETE"
//   })
// }

// //we will need movie title, description, etc. from the user
// function addMovie(){

// }

// //need to get the options that the user wants to change for that movie
// function editMovie(id){

// }

// //render all of the movies to html
// function displayMovies(movies){
  
// }