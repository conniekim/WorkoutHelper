$(document).ready(function() {

	var categoryMap; 

    $.get("https://7x5anc9kic.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Exercises", function(data, status) {
        var json = JSON.parse(JSON.stringify(data));
        var items = json.Items;
        var map; 
        if(items) {
        	map = item[0]; 
          
        } else {
            $("#suggested-exercises").text("No exercises found.");
        }
    });

    var checkedValues = {}; 

	$('#first-next-button').click(function(e){    
	    $('.start-workout#create-workout').hide();
	    $('#create-workout').css("display", "none");
	    $('#workout-section').css("display", "block");
	    //save the work that was inputted and use it to generate the next part 
	    checkedValues = $('input:checkbox:checked').map(function() {
    		return this.value;
		}).get();
		console.log(checkedValues);
		// suggestExercises(checkedValues);
	});

	$('#second-next-button').click(function(e){    
	    $('#workout-section').hide();
	    $('.start-workout#create-workout').css("display", "none");
	    $('#workout-section').css("display", "none");
	   	$('.review-workout#create-workout').css("display", "block");

	   	//save the work and use this to generate everything for the review
	});

	$('#second-back-button').click(function(e){    
	    $('#workout-section').hide();
	    $('.start-workout#create-workout').css("display", "block");
	    $('#workout-section').css("display", "none");
	   	$('.review-workout#create-workout').css("display", "none");
	});

	$('#edit-button').click(function(e){    
	    $('.start-workout#create-workout').css("display", "none");
	    $('#workout-section').css("display", "block");
	   	$('.review-workout#create-workout').css("display", "none");
	});


	function suggestExercises(values) {
		//takes suggestions from array and checks database
	}

	//include that create workout button would POST into the WORKOUTS database
	//and then the add to calendar one would POST into the CALENDAR database (jennifer's one)


});