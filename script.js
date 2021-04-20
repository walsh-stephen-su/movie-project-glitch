function updateMovies(movies){
  
}

function deleteMovie(id){
  fetch(`https://elemental-sepia-strawflower.glitch.me/${id}`, {
    method: "DELETE"
  })
}

function addMovie