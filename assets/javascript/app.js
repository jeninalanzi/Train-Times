// Initialize Firebase
var config = {
    apiKey: "AIzaSyC9G7Pnyv4XN-HXSPTODXu1CwXnWosR-pA",
    authDomain: "train-times-5b4a8.firebaseapp.com",
    databaseURL: "https://train-times-5b4a8.firebaseio.com",
    projectId: "train-times-5b4a8",
    storageBucket: "train-times-5b4a8.appspot.com",
    messagingSenderId: "903131603939"
  };
  firebase.initializeApp(config);


  var database = firebase.database();


  // Initial values
  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequencyMins = "";




  // ==== !! FUNCTION !! ==== Button for CAPTURING train information:
  $("#add-button").on("click", function(event) {
    event.preventDefault();


    // Variables to grab all user input
    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrainTime = $("#firsttraintime-input").val().trim();
    frequencyMins = $("#frequency-input").val().trim();

    
    // Calling the function to convert time inputs.
    // momentTimeConverter();

      
    // Create a local "temporary" object for holding new train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequencyMins: frequencyMins,
    };
  
    // Upload train data to firebase
    database.ref().push(newTrain);

    // Console log the results to ensure function is working:
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrainTime);
    console.log(newTrain.frequencyMins);
    


    // Function to clear the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#firsttraintime-input").val("");
    $("#frequency-input").val("");
  });




// ==== !! FUNCTION !! === For displaying the data from Firebase

  database.ref().on("child_added", function(childSnapshot) {

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var frequencyMins = childSnapshot.val().frequencyMins;

    // Console log what's coming out of snapshot
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrainTime);
    console.log(childSnapshot.val().frequencyMins);




    // Moment.js calculations to calculate time inputs
    var convertedTime = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(convertedTime);

    // Difference between the times (now vs. firstTrainTime)
    var diffTime = moment().diff(moment(convertedTime), "minutes");
    console.log("The difference in time is: " + diffTime);

    //Variables that convert user input of frequency to an numeric value
    var tFrequency = parseInt(frequencyMins);
    var tRemainder = diffTime % tFrequency;
    console.log("Time apart: " + tRemainder);

    // Minutes away until train
    var tMinutesUntilTrain = tFrequency - tRemainder;
    console.log("MINUTES UNTIL TRAIN: " + tMinutesUntilTrain);

    // Next train's arrival
    var nextTrain = moment().add(tMinutesUntilTrain, "minutes");
    console.log("Arrival time of the next train is: " + moment(nextTrain).format("hh:mm a"));
    // Then test the moment re-format in the table display for "Next Train"

 





    // Variable for the new row containing user input
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequencyMins),
      $("<td id='next-train'>").html(moment(nextTrain).format("hh:mm a")),
      $("<td>").text(tMinutesUntilTrain + " min"),
    );

    // Append new row to your table
    $("#train-table > tbody").append(newRow);

  });