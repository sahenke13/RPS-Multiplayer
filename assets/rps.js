$(document).ready(function(){
  //intialize Global variables
 
  var bannerText = $("#banner");
  var playerOneScore = $("#oneScore");
  var playerTwoScore = $("#twoScore")
  var oneScore = 0;
  var twoScore = 0;
  var oneState;
  var twoState;
  var hasPicked;
  var playerOneChat = "";
  var playerTwoChat = "";
  var player;


  // Initialize Firebase and store firebase.database() in a var
  var config = {
    apiKey: "AIzaSyALk3J0LXvUj3OfH35VKNBt_fIAedLJTO8",
    authDomain: "inclass-firebase-steven.firebaseapp.com",
    databaseURL: "https://inclass-firebase-steven.firebaseio.com",
    projectId: "inclass-firebase-steven",
    storageBucket: "inclass-firebase-steven.appspot.com",
    messagingSenderId: "426217518370"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  //record player one and player two choice
var oneChoice = $(".iconOne").on("click", function(){
  oneChoice = $(this).attr("id");
  hasPicked = true;
  $("#playerOnePrompt").hide();
  database.ref("playerOne").set({
    onePick: oneChoice,
    oneState: hasPicked,
    scoreOne: oneScore
  });
  // console.log(stateOne)
});

var twoChoice = $(".iconTwo").on("click", function(){
  twoChoice = $(this).attr("id");
  hasPicked = true;
  $("#playerTwoPrompt").hide();
  database.ref("playerTwo").set({
    twoPick: twoChoice,
    twoState: hasPicked,
    ScoreTwo: twoScore
  });
  // console.log(stateTwo)

});

//function to hide banner
function bannerhide(){
  bannerText.hide();
  $("#playerTwoPrompt").show();
  $("#playerOnePrompt").show();
}

//function to change states of players  
function resetState(){
  hasPicked = false;
  bannerText.hide();
  database.ref("playerTwo").set({
    twoState: hasPicked

  });

  database.ref("playerOne").set({
    oneState: hasPicked
  });
 
};

//chat click function

$("#chatSubmitOne").on("click",function(event){
event.preventDefault();
playerOneChat = $("#chatOne").val();
player = "Player One: ";
 console.log(playerOneChat);
 database.ref("chat").push({
  playerChat: playerOneChat
});
$("#chatOne").val("");
})

$("#chatSubmitTwo").on("click",function(event){
  event.preventDefault();
  playerTwoChat = $("#chatTwo").val();
  player = "Player Two: ";
 console.log(playerTwoChat);
 database.ref("chat").push({
  playerChat: playerTwoChat
}); 
$("#chatTwo").val("");
})

database.ref("chat").on("child_added", function(snapshotchat){
  var snap = snapshotchat.val().playerChat;
  console.log(snap);

  var newChat = $("<p>");
  newChat.text(player + snap);
  newChat.attr("id","chatDialogue");

  $("#chatBox").prepend(newChat);



}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

//Make a function for playerOne winning and one for playertwo
function playOneWin(){
  oneScore++
  hasPicked = false;
  bannerText.text("Player One Wins")
  bannerText.show();
  setTimeout(bannerhide,1000);
  database.ref("playerOne").set({
    oneState: hasPicked,
    ScoreOne: oneScore
  });
  database.ref("playerTwo").set({
    twoState: hasPicked,
    ScoreTwo: twoScore
  });
}

function playTwoWin(){
  twoScore++
  hasPicked = false;
  bannerText.text("Player Two Wins")
  bannerText.show();
  setTimeout(bannerhide,1000);
  database.ref("playerOne").set({
    oneState: hasPicked,
    ScoreOne: oneScore
  });

  database.ref("playerTwo").set({
    twoState: hasPicked,
    ScoreTwo: twoScore
  });

}

function playersDraw(){
  hasPicked = false;
  bannerText.text("Draw")
  bannerText.show();
  setTimeout(bannerhide,1000);
  
  database.ref("playerOne").set({
    oneState: hasPicked,
    ScoreOne: oneScore
  });

  database.ref("playerTwo").set({
    twoState: hasPicked,
    ScoreTwo: twoScore
  });

}

//a reset game function.  Really just need to reset scores.
$("#resetButton").on("click", function(){
  oneScore = 0;
  twoScore = 0;
  snapshotchat.val().playerChat.delete();
  database.ref("playerOne").set({
    ScoreOne: oneScore,
  })
  database.ref("playerTwo").set({
    ScoreTwo: twoScore,
  })
})

//run resetState function to make hasPicked status for player one and two to false

resetState();



// upload to firebase when value changes

database.ref().on("value", function(snapshot) {
  

  oneState = snapshot.val().playerOne.oneState;
  twoState = snapshot.val().playerTwo.twoState;
  let newScoreOne = snapshot.val().playerOne.ScoreOne;
  let newScoreTwo = snapshot.val().playerTwo.ScoreTwo;
  
  //update player scores
  playerOneScore.text(newScoreOne);
  playerTwoScore.text(newScoreTwo);

  if (oneState === true && twoState === true){
   
    if(oneChoice === twoChoice){
      playersDraw();
     
    }
    else if(oneChoice === "paper" && twoChoice === "rock"){
      console.log("player one wins");
      playOneWin()
      
  
    }
    else if(oneChoice === "paper" && twoChoice === "scissors"){
      console.log("player two wins");
      playTwoWin()
     
    }
    else if(oneChoice === "rock" && twoChoice === "paper"){
      console.log("player two wins");
      playTwoWin()
    
    }
    else if(oneChoice === "rock" && twoChoice === "scissors"){
      console.log("player one wins");
      playOneWin()
     
    }
    else if(oneChoice === "scissors" && twoChoice === "rock"){
      console.log("player two wins");
      playTwoWin()
     
    }
    else if(oneChoice === "scissors" && twoChoice === "paper"){
      console.log("player one wins");
      playOneWin()
      
    }else{
      console.log("someone needs to pick")
    }
  }
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

})