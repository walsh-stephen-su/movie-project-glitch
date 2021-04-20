
// Wait for window load
$(window).load(function() {
  // Animate loader off screen
  $(".se-pre-con").fadeOut("slow");
});

$(document).ready(function() {
  $.ajax("https://elemental-sepia-strawflower.glitch.me/movies")
    .done(function(data) {
    
    // $(".se-pre-con").fadeOut();
    $(".se-pre-con").css("display", "none");
      console.log(data);
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