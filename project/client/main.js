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


var errors = 0;
var clues = 8;
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
	clues: function() {
		return Session.get('clues');
	}
	
});	

Template.playerActions.events({
  'click #play': function(event, template) {
		
	//set state to play card
	Session.set("playState", "play");

 }, 
  'click #cluenum': function(event, template) {
	  var clues = Session.get('clues');
	  if(clues <= 8 && clues >0 ){
		//set state to clue number 
		Session.set("playState", "clueNum");
		//listen for a card click
		//if card is clicked then run cluenum fuction as described below
		
		//get card value
		//find all card objects with that value
		//highlight
		//alert (ask player if they want to clue these cards)
		//if yes then change on server and
		  clues --;
		  console.log(clues);
		  Session.set("clues", clues);
		  
		//draw a new card	
		
  }else{
	  console.log("Do Nothing... Cannot have negative clues!");
  }
  },
  'click #cluecolor': function(event, template) {
	  var clues = Session.get('clues');
	  if(clues <= 8 && clues >0 ){
		//set state to clue color
		Session.set("playState", "clueColor");
				
  }else{
	  console.log("Do Nothing... Cannot have negative clues!");
  }
  }, 
  'click #discard': function(event, template) {
	//set state to discards
	Session.set("playState", "discard");
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
		Session.set("playerTurn", "player1");

	},
	'click #player2': function(event, template) {
		Session.set("playerTurn", "player2");
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
				
					errors ++;
					window.alert("Error. That card is not playable.\nIt was a "+ card.cardColor + " " + card.cardValue);
					console.log(errors);
					Session.set("errors", errors);
					
				
					if ( errors >= 3){
						console.log("Game Over!");
					}
				}
				Session.set ("playState", "inactive");
			});
		} else if (state == "discard" && turn =="player1") {
			Meteor.call('discardACard', player, card, function(error,result){
				if(result) {
					var clues = Session.get('clues');
					if(clues < 8 ){
						clues ++;
						console.log(clues);
						Session.set("clues", clues);
					} else {
						console.log("Do Nothing... You have all your clues!");
					} 
				}
				Session.set ("playState", "inactive");
			});	
		} else if (state == "clueColor" && turn == "player2") {
			//listen for a card click
		//if card is clicked then run cluecolor fuction as described below
		var card = this;
		//get card color
		var cardClueColor = this.cardColor;
		//find all card objects with that color
		var CardstoClue = player1HandCollection.find({cardColor: cardClueColor})
 			
		//highlight
		player1HandCollection.update(
 			card._id,
 			{$set:{clueColor: true}}
 		);
 		
		//alert (ask player if they want to clue these cards)
		//if yes then change on server and
		  var clues = Session.get("clues")
		  clues --;
		  console.log(clues);
		  Session.set("clues", clues);
		}
		Session.set ("playState", "inactive");
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
		if (state == "inactive"){
			window.alert("Please press Play or Discard before selecting a card");
		} else if ((state == "play"|| state =="discard") && turn == "player1"){
			window.alert("That is not your hand");
		} else if (state == "play" && turn =="player2") {
			Meteor.call('playACard', player, card , function(error,result){
				var errors = Session.get('errors');
				if((result == false) ){
				
					errors ++;
					window.alert("Error. That card is not playable.\nIt was a "+ card.cardColor + " " + card.cardValue);
					console.log(errors);
					Session.set("errors", errors);
					
				
					if ( errors >= 3){
						console.log("Game Over!");
					}
				}
				Session.set ("playState", "inactive");
			});
		} else if (state == "discard" && turn =="player2") {
			Meteor.call('discardACard', player, card, function(error,result){
				if(result) {
					var clues = Session.get('clues');
					if(clues < 8 ){
						clues ++;
						console.log(clues);
						Session.set("clues", clues);
					} else {
						console.log("Do Nothing... You have all your clues!");
					} 
				}
				Session.set ("playState", "inactive");
			});	
		} else if (state == "clueColor" && turn =="player1") {
			//listen for a card click
		//if card is clicked then run cluecolor fuction as described below
		var card = this;
		//get card color
		var cardClueColor = this.cardColor;
		//find all card objects with that color
		var CardstoClue = player2HandCollection.find({cardColor: cardClueColor})
 			
		//highlight
		player2HandCollection.update(
 			card._id,
 			{$set:{clueColor: true}}
 		);
		
		Session.set ("playState", "inactive");
		}
	} 
});

