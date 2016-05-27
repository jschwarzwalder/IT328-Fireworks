/*
Authors: Sahba Bahizad, Jami Schwarzwalder
*/

import './main.html';
import { Meteor } from 'meteor/meteor';

//server
//import { deck } from '../collection/collection.js';
//import { fireworkCards } from '../collection/collection.js';
import { player1HandCollection } from '../collection/collection.js';
import { player2HandCollection } from '../collection/collection.js';
import { play_area_collection } from '../collection/collection.js'; 
import { discardCollection }  from '../collection/collection.js'; 
import { gameCollection }  from '../collection/collection.js';
import { clues } from '../collection/collection.js';
import { errors } from '../collection/collection.js';


//sort discards - 	discardCollection.find({}, {sort :[["cardColor", "asc"], ["cardValue", "asc"]]});
Meteor.subscribe('player1Hand');
Meteor.subscribe('player2Hand');
Meteor.subscribe('player_area');
Meteor.subscribe('discard');
Meteor.subscribe('playerTurn');
Meteor.subscribe('game');
Meteor.subscribe('cluesValue');
Meteor.subscribe('errorsValue');

//var errors = 0;
//var clues = 8;//normally start at 8, adjusted for testing
var state = "inactive"
//Session.set("errors", errors);
//Session.set("clues", clues);
Session.set ("playState", state );
Session.set("playerTurn", "player1");

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
		var errorsCurrent =  errors.findOne({}).errors;
		 console.log("errorsCurrent: " + errorsCurrent);
		return errorsCurrent;
	},
	clues: function() {
		 var cluesCurrent = clues.findOne({}).clue;
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
	var state = Session.get("playState");
	var errorsCurrent = errors.findOne({}).errors;
	console.log(errorsCurrent + " " + state);
	if (state != "gameOver" && errorsCurrent <= 3) {
		var turn = Session.get("playerTurn");
		var player = turn;
		
			
		//console.log(this);
		var card = cardClicked;
		
		//console.log(turn);
		//console.log("playerHand")
		//swal(player);
		if (state == "inactive"){
			swal("Please press Play, Discard or Clue before selecting a card");
			return;
		} else if ((state == "play" || state =="discard") && turn == otherPlayer){
			swal("That is not your hand!");
			return;
		} else if (state == "play" && turn == handOwner) {
			Meteor.call('playACard', handOwner, card , function(error,result){
				//window.alert(typeof card.cardValue);
				if((result == false) ){
					Meteor.call("increaseError", function(error,result){
						if(result) {
							//if increase an error
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

				if (card.cardValue == 5 ) {
					var clues = Session.get("clues");
					var containsallfives = play_area_collection.find({cardValue: 5}).count();
					console.log(containsallfives);
					if (containsallfives == 5){
						swal("Congratulations!\nYou won the game\nClick New Game to play again");
						Session.set ("playState", "gameOver");
						return;
					}
					//THIS PARTS NEEDS TO BE FIXED
					 else {
						Meteor.call("increaseClue");
						swal("Congratulation by playing a 5 \nYou can get an extra clue\nYou have now finished " + card.cardColor);
					}
					
				
				} 
				Session.set ("playState", "inactive");
				Session.set("playerTurn", "No one");
			});

		} else if (state == "discard" && turn == handOwner) {
			Meteor.call('discardACard', handOwner, card, function(error,result){
				if(result) {
					Meteor.call("increaseClue");
					swal("You discarded a "+ card.cardColor + " " + card.cardValue);
				}
				Session.set ("playState", "inactive");
				Session.set("playerTurn", "No one");
			});	
		}
		//color clue 
		else if (state == "clueColor" && turn == otherPlayer) {
			//console.log(handOwner);
			Meteor.call('clueColor', card.cardColor , handOwner);
			Meteor.call("decreaseClue");

		  //reset state of game
		  Session.set ("playState", "inactive");
		  Session.set("playerTurn", "No one");
		}
		//number clue
		 else if (state == "clueNum" && turn == otherPlayer) {
			
			Meteor.call('clueNumber', card.cardValue, handOwner);
				//it pratically shouldn't game over they can continue with no clue so we have to restrict them from giving clue
				//Session.set ("playState", "gameOver");		
			Meteor.call("decreaseClue");
			
		  Session.set ("playState", "inactive");
		  Session.set("playerTurn", "No one");
		
		}
		
	} else {
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
		if (turn != "null")	{
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
		if (turn != "null")	{
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
		if (turn != "null")	{
			
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
		if (turn != "null")	{
		
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
