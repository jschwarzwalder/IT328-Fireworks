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
import { player_areaCollection } from '../collection/collection.js'; 
import { discardCollection }  from '../collection/collection.js'; 
//sort discards - 	discardCollection.find({}, {sort :[["cardColor", "asc"], ["cardValue", "asc"]]});


var errors = 0;
var clues = 8;
var state = "inactive"
Session.set("errors", errors);
Session.set("clues", clues);
Session.set ("playState", state );


 /*Array of arrays
 This is a sample play area which is stack of 5 columns of cards. The first column is red cards with 1 and 2 .... 
 */




//Get opponent hand
Template.opponentHand.helpers({
	card: function() {
		return player2HandCollection.find();
	}
	
});

//Get Player Hand 
Template.playerHand.helpers({
	card: function() {
		return player1HandCollection.find();
	}
	
});	

//Get Play Area
Template.play_area.helpers({
	card: function() {
		return player_areaCollection.find();
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
	//listen for a card click
	//if card is clicked then run play fuction as described below
	var card = player1HandCollection.findOne({cardValue: 1});
	Meteor.call('playACard', "player2HandCollection", card );
	var errors = Session.get('errors');
	if(errors < 3){
		
			errors ++;
			console.log(errors)
			Session.set("errors", errors);
			
		//draw a new card	
		
	}else{
	  console.log("Game Over!");
	}
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
		//listen for a card click
		//if card is clicked then run cluecolor fuction as described below
		
		//get card color
		//find all card objects with that color
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
  'click #discard': function(event, template) {
var clues = Session.get('clues');

	//set state to discards
	Session.set("playState", "discard");

	var card = player1HandCollection.findOne();
	Meteor.call('discardACard', "player2HandCollection", card );

	if(clues < 8 ){
		clues ++;
		console.log(clues);
		Session.set("clues", clues);
	} else {
		console.log("Do Nothing... Cannot have negative clues!");
	} 	

}
  
  
});

Template.newGame.events({
	'click #newGame': function(event, template) {
	//remove any database values that are present

	/* fireworkCards.find().forEach(function(card){
		fireworkCards.remove( {"_id": card._id});
	});
	player1HandCollection.find().forEach(function(card){
		player1HandCollection.remove( {"_id": card._id});
	});
	player2HandCollection.find().forEach(function(card){
		player2HandCollection.remove( {"_id": card._id});
	});
	player_areaCollection.find().forEach(function(card){
		player_areaCollection.remove( {"_id": card._id});
	});
	discardCollection.find().forEach(function(card){
		discardCollection.remove( {"_id": card._id});
	}); 

	//add a card from deck to the hand
		player1HandCollection.insert(fireworkCards.findOneAndDelete({}));
		player2HandCollection.insert(fireworkCards.findOneAndDelete({}));

	 */
	
	
	//build deck
	for (var i = 0 ; i < deck.length ; i ++) {

		fireworkCards.insert(deck[i]);
	}
	 //shuffle deck
	 
	 //deal out hand
	//for (i = 0; i< 5; i++){
		

	//console.log(Meteor.call('newGame' , 5, fireworkCards, player1HandCollection, player2HandCollection));
	Meteor.call('startNewGame');

	} 
});

