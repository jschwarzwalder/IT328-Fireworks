import './main.html';
 
var errors = 0;
/*
Authors: Sahba Bahizad, Jami Schwarzwalder
*/
var clues = 8;
Session.set("errors", errors);
Session.set("clues", clues);

var deck = [
 {
	 cardValue : 1, 
	 cardColor: "Blue",
	 image: "Blue 1.png"
 },
 {
	 cardValue : 1, 
	 cardColor: "Blue",
	 image: "Blue 1.png"
 },
 {
	 cardValue : 2, 
	 cardColor: "Blue",
	 image: "Blue 2.png"
 },
 {
	 cardValue : 3, 
	 cardColor: "Blue",
	 image: "Blue 3.png"
 },
 {
	 cardValue : 4, 
	 cardColor: "Blue",
	 image: "Blue 4.png"
 },
 {
	 cardValue : 5, 
	 cardColor: "Blue",
	 image: "Blue 5.png"
 },
  {
	 cardValue : 1, 
	 cardColor: "Black",
	 image: "Black 1.png"
 },
 {
	 cardValue : 1, 
	 cardColor: "Black",
	 image: "Black 1.png"
 },
 {
	 cardValue : 2, 
	 cardColor: "Black",
	 image: "Black 2.png"
 },
 {
	 cardValue : 2, 
	 cardColor: "Black",
	 image: "Black 2.png"
 },
 {
	 cardValue : 3, 
	 cardColor: "Black",
	 image: "Black 3.png"
 },{
	 cardValue : 3, 
	 cardColor: "Black",
	 image: "Black 3.png"
 },
 {
	 cardValue : 4, 
	 cardColor: "Black",
	 image: "Black 4.png"
 },
 {
	 cardValue : 4, 
	 cardColor: "Black",
	 image: "Black 4.png"
 },
 {
	 cardValue : 5, 
	 cardColor: "Black",
	 image: "Black 5.png"
 }
 ];
var discards = [
 {
	 cardValue : 1, 
	 cardColor: "Yellow",
	 image: "Yellow 1.png"
 },
 {
	 cardValue : 1, 
	 cardColor: "Yellow",
	 image: "Yellow 1.png"
 },
 {
	 cardValue : 2, 
	 cardColor: "Yellow",
	 image: "Yellow 2.png"
 },
 {
	 cardValue : 3, 
	 cardColor: "Yellow",
	 image: "Yellow 3.png"
 },
 {
	 cardValue : 4, 
	 cardColor: "Yellow",
	 image: "Yellow 4.png"
 },
 {
	 cardValue : 4, 
	 cardColor: "Yellow",
	 image: "Yellow 4.png"
 },
 {
	 cardValue : 5, 
	 cardColor: "Yellow",
	 image: "Yellow 5.png"
 },
  {
	 cardValue : 1, 
	 cardColor: "Red",
	 image: "Red 1.png"
 },
 {
	 cardValue : 1, 
	 cardColor: "Red",
	 image: "Red 1.png"
 },
 {
	 cardValue : 2, 
	 cardColor: "Red",
	 image: "Red 2.png"
 },
 {
	 cardValue : 3, 
	 cardColor: "Red",
	 image: "Red 3.png"
 },{
	 cardValue : 3, 
	 cardColor: "Red",
	 image: "Red 3.png"
 },
 {
	 cardValue : 4, 
	 cardColor: "Red",
	 image: "Red 4.png"
 },
 {
	 cardValue : 4, 
	 cardColor: "Red",
	 image: "Red 4.png"
 },
 {
	 cardValue : 5, 
	 cardColor: "Red",
	 image: "Red 5.png"
 }
 ];
 
 /*Array of arrays
 This is a sample play area which is stack of 5 columns of cards. The first column is red cards with 1 and 2 .... 
 */

var play_area = [
	{
		 cardValue : 2, 
		 cardColor: "Red",
		 image: "Red 2.png"
	 }
	,
	 {
		 cardValue : 3, 
		 cardColor: "Yellow",
		 image: "Yellow 3.png"
	 }
	,
	{
		 cardValue : 1, 
		 cardColor: "Black",
		 image: "Black 1.png"
	 }
	 ,
	 {
		 cardValue : 4, 
		 cardColor: "Blue",
		 image: "Blue 4.png"
	 }

];
var playerHand = [{
	 cardValue : 1, 
	 cardColor: "Blue",
	 image: "Blue 1.png"
 },
 {
	 cardValue : 1, 
	 cardColor: "Blue",
	 image: "Blue 1.png"
 },
 {
	 cardValue : 2, 
	 cardColor: "Blue",
	 image: "Blue 2.png"
 },
 {
	 cardValue : 3, 
	 cardColor: "Blue",
	 image: "Blue 3.png"
 },
 {
	 cardValue : 4, 
	 cardColor: "Blue",
	 image: "Blue 4.png"
 }];
var opponentHand = [{
	 cardValue : 1, 
	 cardColor: "Blue",
	 image: "Blue 1.png"
 },
 {
	 cardValue : 1, 
	 cardColor: "Blue",
	 image: "Blue 1.png"
 },
 {
	 cardValue : 2, 
	 cardColor: "Blue",
	 image: "Blue 2.png"
 },
 {
	 cardValue : 3, 
	 cardColor: "Blue",
	 image: "Blue 3.png"
 },
 {
	 cardValue : 4, 
	 cardColor: "Blue",
	 image: "Blue 4.png"
 }];

//Define sessions  
Session.set("deck", deck); 
Session.set("discards", discards); 
Session.set("play_area", play_area); 
Session.set("opponentHand", opponentHand);
Session.set("playerHand", playerHand);

//Get opponent hand
Template.opponentHand.helpers({
	card: function() {
		return Session.get('opponentHand');
	}
	
});

//Get Player Hand 
Template.playerHand.helpers({
	card: function() {
		return Session.get('playerHand');
	}
	
});	


Template.play_area.helpers({
	card: function() {
		return Session.get('play_area');
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
	  var deck = Session.get('deck');
	  var player1 = [];
	  var player2 = Session.get('opponentHand');
	  
	  for (i = 0; i< 5; i++){
		player1.push(deck.pop);  
		player2.push(deck.pop);  
	  }
	  
	  console.log(player2);
	  
	Session.set("deck", deck); 
	Session.set("playerHand", player1);
	Session.set("opponentHand", player2);
  }, 
});

