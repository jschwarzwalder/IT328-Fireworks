/*
Authors: Sahba Bahizad, Jami Schwarzwalder
*/

import './main.html';
import { Meteor } from 'meteor/meteor';

//server
import { deck } from '../collection/collection.js';
import { fireworkCards } from '../collection/collection.js';
import { player1HandCollection } from '../collection/collection.js';
import { player2HandCollection } from '../collection/collection.js';
import { play_area_collection } from '../collection/collection.js'; 
import { discardCollection }  from '../collection/collection.js'; 


//sort discards - 	discardCollection.find({}, {sort :[["cardColor", "asc"], ["cardValue", "asc"]]});
Meteor.subscribe('player1Hand');
Meteor.subscribe('player2Hand');
Meteor.subscribe('player_area');
Meteor.subscribe('discard');
Meteor.subscribe('playerTurn');


var errors = 0;
var clues = 0;//normally start at 8, adjusted for testing
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
		return turn == "player2"
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
		return turn == "player1"
	}
	
});	

//Get Play Area
Template.play_area.helpers({
	card: function() {
		return play_area_collection.find({}, {$sort :["cardColor", "asc"]});
	},
	empty: function(){
		return play_area_collection.find({}) == null;
	}
	
});

Template.Counters.helpers({
	error: function() {
		return Session.get('errors');
	},
	clues: function() {
		return Session.get('clues');
	},
	playerTurn: function(){
		return Session.get("playerTurn");
	}
});	

Template.discardBoard.helpers({
	card: function() {
		return discardCollection.find({}, {sort :[["cardColor", "asc"], ["cardValue", "asc"]]});
	}
});
Template.playerActions.events({
  'click #play': function(event, template) {
	user = Meteor.users.findOne({_id:this.userId}); 
	if(user) {
		var turn = Session.get("playerTurn");
		if (turn != null)	{
		//set state to play card
			Session.set("playState", "play");
		} else {
			window.alert("Click player button to start your turn");
		}
	} else {
		window.alert("Please Log In");
	}
 }, 
  'click #cluenum': function(event, template) {
	user = Meteor.users.findOne({_id:this.userId}); 
	if(user) {
		var turn = Session.get("playerTurn");
		if (turn != null)	{
		  var clues = Session.get('clues');
		  if(clues <= 8 && clues > 0 ){

			//set state to clue number 
			Session.set("playState", "clueNum");
		  } else {
			 window.alert("Error. You have no clues");
		  }
		} else {
			window.alert("Click player button to start your turn");
		}
	} else {
		window.alert("Please Log In");
	}

  },
  'click #cluecolor': function(event, template) {
	user = Meteor.users.findOne({_id:this.userId});
	if(user) {
		var turn = Session.get("playerTurn");
		if (turn != null)	{
		  var clues = Session.get('clues');
		  if(clues <= 8 && clues >0 ){
			//set state to clue color
			Session.set("playState", "clueColor");
					
		  } else {
			  window.alert("Error. You have no clues");
		  }
		} else {
			window.alert("Click player button to start your turn");
		}
	} else {
		window.alert("Please Log In");
	}

  }, 
  'click #discard': function(event, template) {
	user = Meteor.users.findOne({_id:this.userId}); 
	if(user) {
		//set state to discards
		var turn = Session.get("playerTurn");
		if (turn != null)	{
			Session.set("playState", "discard");
		 } else {
			window.alert("Click player button to start your turn");
		 }
	} else {
		window.alert("Please Log In");
	}
	
  }
});

Template.newGame.events({

	'click #newGame': function(event, template) {
	//remove any database values that are present
		user = Meteor.users.findOne({_id:this.userId}); 
		if(user) {
			Session.set("errors", 0);
			Session.set("clues", 8);
			Session.set ("playState", "inactive" );
			Session.set("playerTurn", "player1");
			Meteor.call('startNewGame');
		} else {
			window.alert("Please Log In");
		}
	} ,
	'click #player1': function(event, template) {
	//remove any database values that are present
		Session.set("playerTurn", "player1");
		Session.set ("playState", "inactive");

	},
	'click #player2': function(event, template) {
		Session.set("playerTurn", "player2");
		Session.set ("playState", "inactive");
	} 
	
});

Template.playerHand.events({
	'click a.selectedCard': function(event, template) {
	//remove any database values that are present
	//event.preventDefault();
		var turn = Session.get("playerTurn");
		var player;
		if (turn == "player1") {
			player = "player1";			
		} else if (turn == "player2") {
			player = "player2";	
		}
			
		console.log(this);
		var card = this;
		var state = Session.get("playState");
		console.log(turn);
		console.log("playerHand")
		if (state == "inactive"){
			window.alert("Please press Play or Discard before selecting a card");
		} else if ((state == "play" || state =="discard") && turn == "player2"){
			window.alert("That is not your hand");
		} else if (state == "play" && turn =="player1") {
			Meteor.call('playACard', player, card , function(error,result){
				var errors = Session.get('errors');
				if((result == false) ){
				if ( errors < 3){
					errors ++;
					window.alert("Error. That card is not playable.\nIt was a "+ card.cardColor + " " + card.cardValue);
					console.log(errors);
					Session.set("errors", errors);
					
				
				}else{
						console.log("Game Over!");
					}
				}
				Session.set ("playState", "inactive");
				Session.set("playerTurn", null);
			});
		} else if (state == "discard" && turn =="player1") {
			Meteor.call('discardACard', player, card, function(error,result){
				if(result) {
					var clues = Session.get('clues');
					if(clues < 8 ){
						clues ++;
						window.alert("You discarded a "+ card.cardColor + " " + card.cardValue);
						console.log(clues);
						Session.set("clues", clues);
					} else {
						console.log("Do Nothing... You have all your clues!");
					} 
				}
				Session.set ("playState", "inactive");
				Session.set("playerTurn", null);
			});	
		}
		//color clue 
		else if (state == "clueColor" && turn == "player2") {
			window.alert("Test ClueColor before Meteor.call ");
			Meteor.call('clueColorP1', this.cardColor);
			window.alert("Test ClueColor after Meteor.call ");
		  var clues = Session.get("clues");
		  window.alert("Test ClueColor before if clues >0 ");
		  if (clues > 0 ) {
			   
			  clues --;
			  console.log(clues);
			  Session.set("clues", clues);
          } 
		  //reset state of game
		  Session.set ("playState", "inactive");
		}
		//number clue
		 else if (state == "clueNum" && turn == "player2") {
			Meteor.call('cluenumberP1', this.cardValue);
		  var clues = Session.get("clues");
		  if (clues > 0) {
			   
			  clues --;
			  console.log(clues);
			  Session.set("clues", clues);
          } 
		}
		Session.set ("playState", "inactive");
		Session.set("playerTurn", null);
	} 
});
  
Template.opponentHand.events({
	'click a.selectedCard': function(event, template) {
	//remove any database values that are present
	//event.preventDefault();
		var turn = Session.get("playerTurn");
		var player;
		if (turn == "player1") {
			player = "player1";			
		} else if (turn == "player2") {
			player = "player2";	
		}
			
		console.log(this);
		console.log(turn);
		console.log("opponentHand")
		var card = this;
		var state = Session.get("playState");
		
		if (state == "inactive" && turn =="player2"){
			window.alert("Please press Play or Discard before selecting a card");
		} 
		
		else if ((state == "play"|| state =="discard") && turn == "player1"){
			window.alert("That is not your hand");
		}
		
		else if (state == "play" && turn =="player2") {
			Meteor.call('playACard', player, card , function(error,result){
				var errors = Session.get('errors');
				if((result == false) ){
				if ( errors < 3){
					errors ++;
					window.alert("Error. That card is not playable.\nIt was a "+ card.cardColor + " " + card.cardValue);
					console.log(errors);
					Session.set("errors", errors);
				}else{
				
						console.log("Game Over!");
					}
				}
				Session.set ("playState", "inactive");
			});
		}
		
		else if (state == "discard" && turn =="player2") {
			Meteor.call('discardACard', player, card, function(error,result){
				if(result) {
					var clues = Session.get('clues');
					if(clues < 8 ){
						clues ++;
						window.alert("You discarded a "+ card.cardColor + " " + card.cardValue);
						console.log(clues);
						Session.set("clues", clues);
					} else {
						console.log("Do Nothing... You have all your clues!");
					} 
				}
				Session.set ("playState", "inactive");
				
				});	
		}
		
		else if (state == "clueColor" && turn =="player1") {
			//call the function clueColor in server 
			Meteor.call('clueColorP2', this.cardColor);
		
		  var clues = Session.get("clues");
		  if (clues > 0) {
			clues --;
			console.log(clues);
			window.alert("You clued "+ card.cardColor );
			Session.set("clues", clues);
		  } 
		  Session.set ("playState", "inactive");
		} else if (state == "clueNum" && turn == "player1") {
			//number clue	
		
			Meteor.call('cluenumberP2', this.cardValue);
	

			 
				Meteor.call('cluenumberP2', this.cardValue);
			} 
		  
			var clues = Session.get("clues");
			 if (clues > 0){
		  clues --;
		  console.log(clues);
		  Session.set("clues", clues);
		  	
  
		  //reset state of game
		  Session.set ("playState", "inactive");
		}
	} 
});
