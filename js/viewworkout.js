$(document).ready(function() {

    var categoryMap = {"Head": ["In-Place Jogging"], "Shoulders": ["Pushups", "Jumping Jacks"], "Abs": ["Planks", "Arm Bends", "Crunch-Ups", "Squats"], 
    "Upper Body": ["Planks", "Arm Bends", "Crunch-Ups", "Squats"], "Lower Body": ["Crunch-Ups", "Jumping Jacks"]}; 

    //stores exercises by {Name : Diff Categories in a List} and {Name : ImageURL}
    var exercisesMap = {};
    var exercisesImages = {}; 

    //gets all the exercises
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

        getWorkouts();
    });

    //stores workouts by {Name : Exercises List in Workout} and {Name: Interval for Workout}
    var workoutsExer = {}
    var workoutsInt = {}

    function getWorkouts() {
        //gets all the workouts
        $.get("https://7x5anc9kic.execute-api.us-east-1.amazonaws.com/prod/RecipeUpdate?TableName=Workouts", function(data, status) {
            var json = JSON.parse(JSON.stringify(data));
            var items = json.Items;
            var workout; 
            if(items) {
            	for(var i = 0; i < items.length; i++) {
            		workout = items[i];
            		var workoutName = workout.Name; 
            		var exercises = workout.Exercises;
            		var interval = workout.Interval; 
            		workoutsExer[workoutName] = exercises; 
            		workoutsInt[workoutName] = interval;  
            	}
                document.getElementById('new-workouts').innerHTML = "";
                appendWorkouts();

            }
        });
    }




    function appendWorkouts() {
        $('#new-workouts').append('<div id="new-workout-grid"><div class="row">');
        // console.log("how many times do i go into here");
        var count = 1; 
        for(var key in workoutsExer) {
            // console.log("appending here");

            // console.log(key);
            var firstExer = workoutsExer[key][0];
            // console.log("first exer: " + firstExer);

            $('#new-workout-grid .row').append('<div class="col-md-6 workout-square"><div class="thumbnail"><img src="' + exercisesImages[firstExer] + '">' +
                          '<div class="caption"><p>' + key + '</p></div></div></div>');

        }
        $('#new-workouts').append('</div></div>');
    }




});