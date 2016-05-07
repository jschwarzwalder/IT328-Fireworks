import './main.html';
import { fireworkCards } from '../collection/collection.js';
import { discardCollection } from '../collection/collection.js';
import { player1HandCollection } from '../collection/collection.js';
import { player2HandCollection } from '../collection/collection.js';
import { player_areaCollection } from '../collection/collection.js';  


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

var playerHand = player1HandCollection.find();


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
	  var deck = Session.get("deck", deck);
	  var player1 = [];
	  var player2 = [];
	  
	  console.log(deck.length);
	  console.log(deck[deck.length-1]);
	  console.log(deck.length);
	  for (i = 0; i< 5; i++){
		  var card1 = deck[deck.length-1-i];
		  
		player1.push(card1);  
		  var card2 = deck[deck.length-2-i];
		player2.push(card2);  
	  }
	  console.log("player1");	  
	  console.log(player1);
	  console.log("player2");
	  console.log(player2);
	  
	Session.set("deck", deck); 
	Session.set("playerHand", player1);
	Session.set("opponentHand", player2);
  }, 
});

