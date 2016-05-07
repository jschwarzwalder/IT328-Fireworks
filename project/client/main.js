import './main.html';
import { Meteor } from 'meteor/meteor';
import { deck } from '../collection/collection.js';
import { fireworkCards } from '../collection/collection.js';
import { player1HandCollection } from '../collection/collection.js';
import { player2HandCollection } from '../collection/collection.js';
import { player_areaCollection } from '../collection/collection.js'; 
//server

//dummy data
import { player_1 } from '../collection/collection.js';
import { player_2 } from '../collection/collection.js';
import { play_area } from '../collection/collection.js'; 
 

/*
Authors: Sahba Bahizad, Jami Schwarzwalder
*/
var errors = 0;
var clues = 8;
Session.set("errors", errors);
Session.set("clues", clues);


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
		//play_areaCollection.find({cardColor: this.cardColor})

	 var errors = Session.get('errors');
	  if(errors < 3){
	  errors ++;
	  console.log(errors)
	  Session.set("errors", errors);
  }else{
	  console.log("Game Over!");
  }
  }, 
  'click #cluenum': function(event, template) {
	  var clues = Session.get('clues');
	  if(clues <= 8 && clues >0 ){
	  clues --;
	  console.log(clues);
	  Session.set("clues", clues);
  }else{
	  console.log("Do Nothing... Cannot have negative clues!");
  }
  },
  'click #cluecolor': function(event, template) {
	  var clues = Session.get('clues');
	  if(clues <= 8 && clues >0 ){
	  clues --;
	  console.log(clues);
	  Session.set("clues", clues);
  }else{
	  console.log("Do Nothing... Cannot have negative clues!");
  }
  }, 
  'click #discard': function(event, template) {
	  var clues = Session.get('clues');
	  if(clues < 8 && clues > 0 ){
	  clues ++;
	  console.log(clues);
	  Session.set("clues", clues);
	  }else{
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
	for (i = 0; i< 5; i++){
		

	//console.log(Meteor.call('newGame' , 5, fireworkCards, player1HandCollection, player2HandCollection));
	Meteor.call('startNewGame');

	  
});

