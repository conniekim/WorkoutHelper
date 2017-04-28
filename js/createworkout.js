$(document).ready(function() {
	var query = decodeURIComponent(window.location.search.split('=')[1]);
	checkSuccess(query); 

	function checkSuccess(success_str) {
		if(success_str === "success") {
			// alert("success is here");
			$(".success-box").css("display", "block");
		} else {
			$(".success-box").css("display", "none");
		}
	}

	var categoryMap = {"Head": ["In-Place Jogging"], "Shoulders": ["Pushups", "Jumping Jacks"], "Abs": ["Planks", "Arm Bends", "Crunch-Ups", "Squats"], 
	"Upper Body": ["Planks", "Arm Bends", "Crunch-Ups", "Squats"], "Lower Body": ["Crunch-Ups", "Jumping Jacks"]}; 

	var exercisesMap = {};
	var exercisesImages = {}; 

    $.get("https://7x5anc9kic.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Exercises", function(data, status) {
        var json = JSON.parse(JSON.stringify(data));
        var items = json.Items;
        var exercise; 
        if(items) {
        	for(var i = 0; i < items.length; i++) {
        		exercise = items[i];
        		var exerciseName = exercise.Name; 
        		var categories = exercise.Categories;
        		var image = exercise.ImageURL; 
        		exercisesMap[exerciseName] = categories; 
        		exercisesImages[exerciseName] = image;  
        	}
        }
    });

    // console.log(categoryMap);

    var checkedValues = {}; 

	$('#first-next-button').click(function(e){    
	    $('.start-workout#create-workout').hide();
	    $('#create-workout').css("display", "none");
	    $('#workout-section').css("display", "block");
	    //save the work that was inputted and use it to generate the next part 
	    checkedValues = $('input:checkbox:checked').map(function() {
    		return this.value;
		}).get();
		// console.log(checkedValues);
		if(checkedValues.length == 0) {
			document.getElementById('suggested').innerHTML = '<div class="empty-div">No categories selected! Please choose a category.</div>';
		} else {
		   	document.getElementById('suggested').innerHTML = "";
			suggestExercises(checkedValues);
		}
	});

	$('#second-next-button').click(function(e){    
	    $('#workout-section').hide();
	    $('.start-workout#create-workout').css("display", "none");
	    $('#workout-section').css("display", "none");
	   	$('.review-workout#create-workout').css("display", "block");
	   	//save the work and use this to generate everything for the review
	   	generateReviewPage(); 
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
		// console.log(checkedValues.length);


		var currExer = [];
		for(var i = 0; i < checkedValues.length; i++) {
			var categoryValues = categoryMap[checkedValues[i]];
			if(categoryValues) {
				for(var j = 0; j < categoryValues.length; j++) {
					var eachExer = categoryValues[j]; 
					// console.log("got into here: " + $.inArray(eachExer, currExer) == -1);
					if($.inArray(eachExer, currExer) == -1) {
						currExer.push(eachExer);
						appendExerciseToSuggested(eachExer);
					}
				}
			}
		}
	}

	function appendExerciseToSuggested(exercise) {
		// console.log("append exercise");
		$('#suggested-exercises .container-fluid .inner-suggested').append('<div class="col-md-3"><div class="thumbnail exercise-icon">' + 
                    '<img src="' + exercisesImages[exercise] +'" style="width:60%"><div class="caption"><p>' + 
                    toTitleCase(exercise) + '</p><div class="middle"><div class="text">Remove<br>X</div></div></div></div></div>'); 
	}

	//include that create workout button would POST into the WORKOUTS database
	//and then the add to calendar one would POST into the CALENDAR database (jennifer's one)

    function toTitleCase(str)
    {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    var title; 
    var interval;
    function generateReviewPage() {
    	document.getElementById('review-page-selected').innerHTML = "";
    	
    	//workout title from input
    	title = $("input[name='title']").val(); 
    	$('#create-workout #workout-title small').replaceWith('<small class="resiziing-font">' + title + '</small>');
    	//workout interval from input
    	interval = $("input[name='interval']").val(); 
    	$('#create-workout #workout-interval small').replaceWith('<small class="resiziing-font">' + interval + ' secs, 15 secs rest </small>');

    	//selected exercises
    	var copySelected = $('.inner-selected').clone(); 
    	$('#review-page-selected').append(copySelected); 

    	changeDuration(interval, '#create-workout .duration');
    }

    function changeDuration(interval, changeArea) {
    	//duration calculated from interval 
    	var time = (interval * selectedExercises.length) + (15 * selectedExercises.length); 
    	console.log("selectedExercises: " +selectedExercises);
    	console.log("selectedExercises length: " + selectedExercises.length);
    	var minutes = Math.floor(time / 60);
    	var seconds = time - minutes * 60;
    	$(changeArea).replaceWith('<p class="duration">Duration: ' + minutes + ' mins ' + seconds + ' secs </small></p>');
    }

    //add to SELECTED 

    var selectedExercises = [];
    //click event for DYNAMICALLY ADDED INFORMATION 
	$('body').on('click', '#suggested-exercises .col-md-3', function() {
        var clicked = $(this).find("div.exercise-icon"); 
        // if(!clicked.hasClass('selected-thumbnail')) {
        var copied = $(this).clone();
        var exercise = $(this).find('p').text();
        // console.log(exercise);
        // if($.inArray(exercise, selectedExercises) == -1) {
    	selectedExercises.push(exercise);
    	// }
    	// console.log(clicked);
        $("#selected-exercises .container-fluid .inner-selected").append(copied); 
        // clicked.addClass('selected-thumbnail');
    	// } 

    // clicked.removeClass('selected-thumbnail');
    });

	//deleting selected exercises by clicking on them 
    $('body').on('click', '#selected-exercises .col-md-3', function() {
        // var clicked = $(this).find("div.exercise-icon"); 
        console.log("before: " + selectedExercises);
       	var exercise = $(this).find('p').text();
       	var index = selectedExercises.indexOf(exercise);
       	if (index > -1) {
    		selectedExercises.splice(index, 1);
		}
		console.log(selectedExercises);

        $(this).remove(); 

    // clicked.removeClass('selected-thumbnail');
    });


	$('#add-to-cal-button').click(function(e){   
		var theUrl = "https://7x5anc9kic.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Workouts"; 

		console.log(title);
		console.log(interval);
		console.log(selectedExercises);
		console.log("workout created"); 

		$.post(theUrl, JSON.stringify({
            "type": "POST", 
            "data": {
                "TableName": "Workouts",
                //New item information to be posted 
                "Item": {
                    "Name" : title, 
                    "Exercises" : selectedExercises,
                    "Interval" : interval,
                }
            }
        }), 
        function(data, status){
    		window.location = 'view-workout.html?submit=success';
    	})
	});

	$('#skip-button').click(function(e){   
		var theUrl = "https://7x5anc9kic.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Workouts"; 

		console.log(title);
		console.log(interval);
		console.log(selectedExercises);
		console.log("workout created"); 

		$.post(theUrl, JSON.stringify({
            "type": "POST", 
            "data": {
                "TableName": "Workouts",
                //New item information to be posted 
                "Item": {
                    "Name" : title, 
                    "Exercises" : selectedExercises,
                    "Interval" : interval,
                }
            }
        }), 
        function(data, status){
    		window.location = 'view-workout.html?submit=success';
    	})
	});


	$('.calendar-bottom th').click(function(e) {
		if($(this).hasClass('highlight')) {
			$(this).removeClass('highlight');
		} else {
			$(this).addClass('highlight');
		}
	});

	$('.popup .freq').click(function(e) {
		if($(this).hasClass('highlight')) {
			$(this).removeClass('highlight');
		} else {
			$(this).addClass('highlight');
		}
	});

	$('.popup').fadeIn('slow');



});

