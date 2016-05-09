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
	},
	colorClue: function(){
		return this.clueColor 
	}
	
});	

//Get Play Area
Template.play_area.helpers({
	card: function() {
		return play_area_collection.find({}, {sort :[["cardColor", "asc"]]});
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
	var card = player1HandCollection.findOne({cardValue: 3, cardColor: "Red"});
	Meteor.call('playACard', "player1", card , function(error,result){
		var errors = Session.get('errors');
		if((result == false) ){
		
			errors ++;
			console.log(errors)
			Session.set("errors", errors);
			
		
		if ( errors >= 3){
			console.log("Game Over!");
		}
	}
	
	});
	
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
		var card = player1HandCollection.findOne({});
		player1HandCollection.update(
			card._id,
			{$set:{clueColor: true}}
		);
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
	//set state to discards
	Session.set("playState", "discard");

	var card = player1HandCollection.findOne();
	Meteor.call('discardACard', "player1", card, function(error,result){
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
	});
  }
});

Template.newGame.events({
	'click #newGame': function(event, template) {
	//remove any database values that are present
		Session.set("errors", 0);
		Session.set("clues", 8);
		Session.set ("playState", state );
		
		Meteor.call('startNewGame');
	} 
});

