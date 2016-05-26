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


//sort discards - 	discardCollection.find({}, {sort :[["cardColor", "asc"], ["cardValue", "asc"]]});
Meteor.subscribe('player1Hand');
Meteor.subscribe('player2Hand');
Meteor.subscribe('player_area');
Meteor.subscribe('discard');
Meteor.subscribe('playerTurn');
Meteor.subscribe('game');

var errors = 0;
var clues = 8;//normally start at 8, adjusted for testing
var state = "inactive"
Session.set("errors", errors);
Session.set("clues", clues);
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
		return Session.get('errors');
	},
	//clues: function() {
	//	return Session.get('clues');
	//},
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
	if (state != "gameOver" && errors <= 3) {
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
				var errors = Session.get('errors');
				//window.alert(typeof card.cardValue);
				if((result == false) ){
					if ( errors < 3){
						errors ++;
						swal("Error. That card is not playable.\nIt was a "+ card.cardColor + " " + card.cardValue);
						console.log("Errors: " + errors);
						Session.set("errors", errors);
						Session.set("playerTurn", "No one");
						return;
						
					} else{
						Session.set ("playState", "gameOver");
						swal("Game Over! \nClick New Game to play again");
						return;
					} 
				}

				if (card.cardValue == 5 ) {
					var clues = Session.get("clues");
					var containsallfives = play_area_collection.find({cardValue: 5}).count();
					console.log(containsallfives);
					if (containsallfives == 5){
						swal("Congratulations!\nYou won the game\nClick New Game to play again");
						Session.set ("playState", "gameOver");
						return;
					} else if (clues < 8 ) {
						clues ++;
						console.log("Clues: " + clues);
						Session.set("clues", clues);
						swal("Congratulations, by playing a 5 \nYou can get an extra clue");
					} else {
						swal("Congratulation by playing a 5 \nYou finished " + card.cardColor);
					}
					
				
				} 
				Session.set ("playState", "inactive");
				Session.set("playerTurn", "No one");
			});

		} else if (state == "discard" && turn == handOwner) {
			Meteor.call('discardACard', handOwner, card, function(error,result){
				if(result) {
					var clues = Session.get('clues');
					if(clues < 8 ){
						clues ++;
						console.log("Clues: " + clues);
						Session.set("clues", clues);
					} else {
						console.log("Do Nothing... You have all your clues!");
					} 
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
			
		  var clues = Session.get("clues");
		 
		  if (clues > 0 ) {
			   
			  clues --;
			  console.log("Clues: " + clues);
			  Session.set("clues", clues);
          } 
		  //reset state of game
		  Session.set ("playState", "inactive");
		  Session.set("playerTurn", "No one");
		}
		//number clue
		 else if (state == "clueNum" && turn == otherPlayer) {
			Meteor.call('clueNumber', card.cardValue, handOwner, function(error, result){
				swal("GAME OVER!");
				Session.set ("playState", "gameOver");		
			});
			
		 
			
//		 var clues = Session.get("clues");
//		  if (clues > 0) {
//			   
//			  clues --;
//			 console.log("Clues: " + clues);
//			  Session.set("clues", clues);
//          } 
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
		  var clues = Session.get('clues');
		  if(clues <= 8 && clues > 0 ){

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
		  var clues = Session.get('clues');
		  if(clues <= 8 && clues >0 ){
			
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
		
			Session.set("errors", 0);
			Session.set("clues", 8);
			Session.set ("playState", "inactive" );
			Session.set("playerTurn", "player1");
			
			
            Meteor.call('startNewGame');
          
			
		
	} ,
	'click #player1': function(event, template) {
	//remove any database values that are present
		var state = Session.get("playState");
		if (state != "gameOver" && errors <= 3) {
			Session.set("playerTurn", "player1");
			Session.set ("playState", "inactive");
		} else {
		swal("Game Over \nClick New Game to play again")
	}

	},
	'click #player2': function(event, template) {
		var state = Session.get("playState");
		if (state != "gameOver" && errors <= 3) {
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
