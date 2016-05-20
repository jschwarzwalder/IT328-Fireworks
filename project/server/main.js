import { Meteor } from 'meteor/meteor';
import { deck } from '../collection/collection.js';
import { fireworkCards } from '../collection/collection.js';
import { player1HandCollection } from '../collection/collection.js';
import { player2HandCollection } from '../collection/collection.js';
import { play_area_collection } from '../collection/collection.js'; 
import { discardCollection }  from '../collection/collection.js'; 
//server

 /*
Authors: Sahba Bahizad, Jami Schwarzwalder
*/

Meteor.startup(function () {
Meteor.methods({
  /*newGame:function(handSize, fireworkCards, player1HandCollection, player2HandCollection) {
    for(var i = 0 ; i<handSize ; i++) {
	   player1HandCollection.insert(drawCard(deck));
	   console.log("This is running...")
	   player2HandCollection.insert(drawCard(deck));
	}
  }*/
  startNewGame: function(){
    newGame(5,fireworkCards, player1HandCollection, player2HandCollection )
	discardCollection.remove({});
	play_area_collection.remove({});
  },
  playACard: function(playerhand, card){
	  if (playerhand == "player1") {
		return play(player1HandCollection, card);
	  } else if (playerhand == "player2") {
		return play(player2HandCollection, card);
	  }
	  
  },
  discardACard: function(playerhand, card){
	 if (playerhand == "player1") {
		return discard(player1HandCollection, card);
	  } else if (playerhand== "player2") {
		return discard(player2HandCollection, card);
	  }
  },
  
  clueColorP2: function(colors){
    //find the same colors
   var array =  player2HandCollection.find({"cardColor": colors}).fetch();
   //console.log(array);
   //set them as already clued
   for( var i = 0 ; i < array.length ; i++){
    
    console.log(array[i]);
  player2HandCollection.update(          
 		array[i]._id,
 		{$set:{clueColor: true}}
 	);
    
  }
  },
  
  clueColorP1: function(colors){
    //find the same colors
   var array =  player1HandCollection.find({"cardColor": colors}).fetch();
   //console.log(array);
   //set them as already clued
   for( var i = 0 ; i < array.length ; i++){
    
    console.log(array[i]);
  player1HandCollection.update(          
 		array[i]._id,
 		{$set:{clueColor: true}}
 	);
    
  }
  },
  
  cluenumberP1: function(ValueofCard){
    //find the same colors
   var array =  player1HandCollection.find({"cardValue": ValueofCard}).fetch();
   //console.log(array);
   //set them as already clued
   for( var i = 0 ; i < array.length ; i++){
    
    console.log(array[i]);
  player1HandCollection.update(          
 		array[i]._id,
 		{$set:{clueNum: true}}
 	);
    
  }
  },
    cluenumberP2: function(ValueofCard){
    //find the same colors
   var array =  player2HandCollection.find({"cardValue": ValueofCard}).fetch();
   //console.log(array);
   //set them as already clued
   for( var i = 0 ; i < array.length ; i++){
    
    console.log(array[i]);
  player2HandCollection.update(          
 		array[i]._id,
 		{$set:{clueNum: true}}
 	);
    
  }
  }
  
  
});
    
  
  function initialize() { 
	
    //remove any database values that were present
	fireworkCards.remove({});//delete all records ( this will only work on server side)
    //create the deck
	for( var i = 0 ; i < deck.length ; i ++){
     fireworkCards.insert(deck[i]);
	}
  }
  function drawCard(cardSetName) {
    //get a random card from the firworksCards 
    var array = cardSetName.find().fetch();
    var randomIndex = Math.floor( Math.random() * array.length );
    var element = array[randomIndex];
    //remove the element to avoid redundancy
    cardSetName.remove(element);
   // array.splice(randomIndex, 1);
    //show it
    console.log(element);
    return element;
  }
  //
  function newGame(handSize, deckCards, player1, player2) {
	initialize();
	player1.remove({});
	player2.remove({});
	for(var i = 0 ; i<handSize ; i++) {
		player1.insert(drawCard(deckCards));
		player2.insert(drawCard(deckCards));
	}
  }

  function play(playerhand, card){
	console.log("you've entered the play a card fucntion  \n \n \n \n");
	var play_area_card = play_area_collection.findOne({cardColor: card.cardColor});
	
	//find that card color in play area
		if (play_area_card == null){
			//if color does not exist
			//check to see if this card has value of 1
			if (card.cardValue == 1){
				//if it does add that card to the play area
				play_area_collection.insert(card);
				
				//remove card from hand
				playerhand.remove(card._id);

				//draw new card
				playerhand.insert(drawCard(fireworkCards));
				return true;
			} else {
				//if it does not, add that card to the discard area
				discardCollection.insert(card);
				
				//remove card from hand
				playerhand.remove(card._id);

				//draw new card
				playerhand.insert(drawCard(fireworkCards));
				return false;
			}
		 //if color exists, compare card values
		} else if (play_area_card.cardValue + 1 == card.cardValue ) {
			//if this card value is play_area card value +1 
			
			//remove play_area card
			play_area_collection.remove(play_area_card._id);
			
			//add this card to the play area
			play_area_collection.insert(card);
			
			//remove this card from players hand
			playerhand.remove(card._id);
			
			//draw new card
			playerhand.insert(drawCard(fireworkCards));
			
			return true;
		} else {
			//else add to discard 
			discardCollection.insert(card);
			
			//remove card from hand
			playerhand.remove(card._id);

			//draw new card
			playerhand.insert(drawCard(fireworkCards));
			return false;
		}

  }
  
  function discard(playerhand, card) {
	 
	console.log("you've entered the discard fucntion  \n \n \n \n")
	
	
	//add card from hand to discards 
	console.log(discardCollection.insert(card));
	
		
	//remove card from hand
	playerhand.remove(card._id);

	//draw new card
	playerhand.insert(drawCard(fireworkCards));
	
	return true;

	 
  }
  
  
//newGame(5, fireworkCards, player1HandCollection, player2HandCollection);

  //get number of cards
  var index = fireworkCards.find().count();
  console.log(index);
//player2HandCollection.insert(fireworkCards.find({}));


   
   
});


Meteor.publish('player1Hand', function() {
	//sort by most recent changes
	return player1HandCollection.find();
});

Meteor.publish('player2Hand', function() {
	//sort by most recent changes
	return player2HandCollection.find();
});

Meteor.publish('player_area', function() {
	//sort by most recent changes
	return play_area_collection.find();
});

Meteor.publish('discard', function() {
	//sort by most recent changes
	return discardCollection.find();
});

