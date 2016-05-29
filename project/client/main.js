/*
Authors: Sahba Bahizad, Jami Schwarzwalder
*/

import './main.html';
import { Meteor } from 'meteor/meteor';

//server
//import { deck } from '../collection/collection.js';
//import { fireworkCards } from '../collection/collection.js';

//import Collections so we can use .find() 
import { player1HandCollection } from '../collection/collection.js';
import { player2HandCollection } from '../collection/collection.js';
import { play_area_collection } from '../collection/collection.js'; 
import { discardCollection }  from '../collection/collection.js'; 
import { gameCollection }  from '../collection/collection.js';
import { clues } from '../collection/collection.js';
import { errors } from '../collection/collection.js';


//sort discards - 	discardCollection.find({}, {sort :[["cardColor", "asc"], ["cardValue", "asc"]]});

//subscribe to Collections so we can have permission to view the data when we call .find()
Meteor.subscribe('player1Hand');
Meteor.subscribe('player2Hand');
Meteor.subscribe('player_area');
Meteor.subscribe('discard');
Meteor.subscribe('playerTurn');
Meteor.subscribe('game'); 
// I don't know if game has the clues and errors inside so I used the clues and errors collections you created in the collection file
Meteor.subscribe('clues');
Meteor.subscribe('errors');

//var errors = 0;
//var clues = 8;//normally start at 8, adjusted for testing

//playerState is used to determing if game is over, 
//and whether a button has been pressed before clicking on a card
var state = "inactive"
Session.set ("playState", state );

//until we get routing this allows hotseat. By default when game begins or page refreshed it is player1's turn
Session.set("playerTurn", "No one");

 /*Array of arrays
 This is a sample play area which is stack of 5 columns of cards. The first column is red cards with 1 and 2 .... 
 */




//Get opponent hand
Template.opponentHand.helpers({
	card: function() {
		return player2HandCollection.find();
	},
	colorClue: function(){
		return this.clueColor 
	},
	turn: function(){
		//until we get routing this allows hotseat. 
		//It controls whether cards are visible or display card backs
		var turn = Session.get("playerTurn");
		return turn == "player1"
	}
	
});

//Get Player Hand 
Template.playerHand.helpers({
	card: function() {
		return player1HandCollection.find();
	},
	colorClue: function(){
		return this.clueColor 
	}, 
	turn: function() {
		//until we get routing this allows hotseat. 
		//It controls whether cards are visible or display card backs
		
		var turn = Session.get("playerTurn");
		return turn == "player2"
	}
	
});	

//Get Play Area
Template.play_area.helpers({
	card: function() {
		return play_area_collection.find({}, {sort :[["cardColor", "asc"]]});
	},
	empty: function(){
		return play_area_collection.find({}) == null;
	}
	
});

Template.Counters.helpers({
	error: function() {
		//returns errors in errors Collection and should allow template to display value
		var errorsCurrent =  errors.findOne({}).errors;
		//testing to if findOne({}) worked
		 console.log("errorsCurrent: " + errorsCurrent);
		return errorsCurrent;
	},
	clues: function() {
		//returns clues in clues Collection and should allow template to display value
		 var cluesCurrent = clues.findOne({}).clue;
		 //testing to if findOne({}) worked
		  console.log("cluesCurrent: " + cluesCurrent);
		return cluesCurrent;
	},
	playerTurn: function(){
		return Session.get("playerTurn");
	},
	currentGame: function(){
		return gameCollection.findOne({});
	}
	
});	

Template.discardBoard.helpers({
	card: function() {
		return discardCollection.find({}, {sort :[["cardColor", "asc"], ["cardValue", "asc"]]});
	}
});
function cardClick (handOwner, otherPlayer, cardClicked){
	//Which stat is the game currently in?
	var state = Session.get("playState");
	//How many errors do we have in errors Collection
	var errorsCurrent = errors.findOne({}).errors;
	//testing to see if findOne({}) worked
	console.log(errorsCurrent + " " + state);
	
	//if Game is not over and we have less than or equal to 3 errors 
	//perform action on card
	//otherwise set state to gameOver and pop up message to player
	if (state != "gameOver" && errorsCurrent <= 3) {
		//get information about current player and save it to player
		var turn = Session.get("playerTurn");
		var player = turn;
		
		//store card passed through when function is called.
		var card = cardClicked;

		if (state == "inactive"){
			//if player hasn't click on an action button, remind them to click on button first
			swal("Please press Play, Discard or Clue before selecting a card");
			return;
		} else if ((state == "play" || state =="discard") && turn == otherPlayer){
			//if current player clicks on face up cards when trying to play or discard
			//remind them the face up cards are not their hand.
			swal("That is not your hand!");
			return;
		} else if (state == "play" && turn == handOwner) {
			//if current player clicks on the cards in their hand after pressing play action button
			Meteor.call('playACard', handOwner, card , function(error,result){
				//window.alert(typeof card.cardValue);
				
				//if card could not be played then increase error tokens
				if((result == false) ){
					Meteor.call("increaseError", function(error,result){
						if(result) {
							//if increase an error returns true, alert player which card they played
							swal("Error. That card is not playable.\nIt was a "+ card.cardColor + " " + card.cardValue);
							console.log("Errors: " + errorsCurrent);
							Session.set("playerTurn", "No one");
							return;
						
						} else {
							//if you exceeded allowed amount of errors
							Session.set ("playState", "gameOver");
							swal("Game Over! \nClick New Game to play again");
							return;
						} 
					});
				}
				//if current player was able to play a card, and that card has a value of 5
				if (card.cardValue == 5 ) {
					//get number of clues currently available from Collection
					var cluesCurrent = clues.findOne({}).clue;
					
					//count how many cards with value 5 have been played
					var containsallfives = play_area_collection.find({cardValue: 5}).count();
					
					if (containsallfives == 5){
						swal("Congratulations!\nYou won the game\nClick New Game to play again");
						Session.set ("playState", "gameOver");
						return;//exit function early 
						
						//if current player has not played all 5 cards with value 5
						//increase the clues available
					} else {
						Meteor.call("increaseClue");
						swal("Congratulation by playing a 5 \nYou can get an extra clue\nYou have now finished " + card.cardColor);
					} 
					
				
				} 
				//after card is played and we have adjusted the clues and errors 
				//than set state to inactive and current player to no one
				Session.set ("playState", "inactive");
				Session.set("playerTurn", "No one");
			});

		} else if (state == "discard" && turn == handOwner) {
			Meteor.call('discardACard', handOwner, card, function(error,result){
				if(result) {
					Meteor.call("increaseClue");
					swal("You discarded a "+ card.cardColor + " " + card.cardValue);
				}
				//after card is discarded and we have adjusted the clues  
				//than set state to inactive and current player to no one
				Session.set ("playState", "inactive");
				Session.set("playerTurn", "No one");
			});	
		}
		//color clue 
		else if (state == "clueColor" && turn == otherPlayer) {
			//if current player clicks on opponents hand after clicking on ClueColor action button
			
			//clue color
			Meteor.call('clueColor', card.cardColor , handOwner);
			//decrease the clue value in the Collection
			Meteor.call("decreaseClue");

		  //reset state of game
		  Session.set ("playState", "inactive");
		  Session.set("playerTurn", "No one");
		}
		//number clue
		 else if (state == "clueNum" && turn == otherPlayer) {			
			//if current player clicks on opponents hand after clicking on ClueNum action button
			
			//clue number
			Meteor.call('clueNumber', card.cardValue, handOwner);
			
			//decrease the clue value in the Collection	
			Meteor.call("decreaseClue");
			
		  //reset state of game
		  Session.set ("playState", "inactive");
		  Session.set("playerTurn", "No one");
		
		}
		
	} else {
		
		//if state is gameOver or errors > 3
		Session.set ("playState", "gameOver");
		swal("Game Over! \nClick New Game to play again");
		return;
	}
  }	



//EVENTS START
Template.playerActions.events({
  'click #play': function(event, template) {
	var state = Session.get("playState");
	if (state != "gameOver") {
		var turn = Session.get("playerTurn");
		//swal("turn: " + turn);
		if (turn != "No one")	{
		//set state to play card

				Session.set("playState", "play");
			
		} else {
			swal("Click player button to start your turn");
		}
	} else {
		swal("Game Over \nClick New Game to play again")
	}
 }, 
  'click #cluenum': function(event, template) {
	var state = Session.get("playState");
	if (state != "gameOver") {
		var turn = Session.get("playerTurn");
		if (turn != "No one")	{
		var cluesCurrent = clues.findOne({}).clue;
		  
		  if(cluesCurrent <= 8 && cluesCurrent > 0 ){

			var state = Session.get("playState");
			if (state != "gameOver") {
				//set state to clue number 
				Session.set("playState", "clueNum");
			} else {
				swal("Game Over \nClick New Game to play again")
			}
		  } else {
			 swal("Error. You have no clues");
		  }
	
		} else {
			swal("Click player button to start your turn");
		}
	
	} else {
		swal("Game Over \nClick New Game to play again")
	}
  },
  'click #cluecolor': function(event, template) {
	var state = Session.get("playState");
	if (state != "gameOver") {
		var turn = Session.get("playerTurn");
		if (turn != "No one")	{
			
		  var cluesCurrent = clues.findOne({}).clue;
		  if(cluesCurrent <= 8 && cluesCurrent >0 ){
			
			var state = Session.get("playState");
			if (state != "gameOver") {
				//set state to clue color
				Session.set("playState", "clueColor");
			} else {
				swal("Game Over \nClick New Game to play again")
			}		
		  } else {
			  swal("Error. You have no clues");
		  }
		} else {
			swal("Click player button to start your turn");
		}
	
	} else {
		swal("Game Over \nClick New Game to play again")
	}
  }, 
  'click #discard': function(event, template) {
	var state = Session.get("playState");
	if (state != "gameOver") {
		//set state to discards
		var turn = Session.get("playerTurn");
		if (turn != "No one")	{
		
			var state = Session.get("playState");
			if (state != "gameOver") {
				Session.set("playState", "discard");
			} else {
				swal("Game Over \nClick New Game to play again")
			}
		 } else {
			swal("Click player button to start your turn");
		 }
	} else {
		swal("Game Over \nClick New Game to play again")
	}
	
  }
});
Template.newGame.events({

	'click #newGame': function(event, template) {
	//remove any database values that are present
		
			//Session.set("errors", 0);
			//Session.set("clues", 8);
			Session.set ("playState", "inactive" );
			Session.set("playerTurn", "player1");
			
			
            Meteor.call('startNewGame');
          
			
		
	} ,
	'click #player1': function(event, template) {
	//remove any database values that are present
		var state = Session.get("playState");
		if (state != "gameOver") {
			Session.set("playerTurn", "player1");
			Session.set ("playState", "inactive");
		} else {
		swal("Game Over \nClick New Game to play again")
	}

	},
	'click #player2': function(event, template) {
		var state = Session.get("playState");
		if (state != "gameOver") {
			Session.set("playerTurn", "player2");
			Session.set ("playState", "inactive");
		} else {
		swal("Game Over \nClick New Game to play again")
	}
	} 
	
});
Template.playerHand.events({
	'click a.selectedCard': function(event, template) {
	//remove any database values that are present
	//event.preventDefault();
	cardClick ("player1", "player2", this);
	}
});
//Template.Counters.events({
//	//create a new activity document
//		var newGame = {
//			gameNo: 1;
//			cluesLeft: 80;
//		};
//		//insert our new record on the server side
//		Meteor.call('gameInsert', newGame);
//});
Template.opponentHand.events({
	'click a.selectedCard': function(event, template) {
	cardClick ("player2", "player1", this);
  }
});
