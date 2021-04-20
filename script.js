// Wait for window load
	$(window).load(function() {
		// Animate loader off screen
		$(".se-pre-con").fadeOut("slow");;
	});


function updateMovies(movies){
  
}

function deleteMovie(id){
  fetch(`https://elemental-sepia-strawflower.glitch.me/${id}`,{
    method: "DELETE"
  })
}

//we will need movie title, description, etc. from the user 
function addMovie(){
  
}

function 