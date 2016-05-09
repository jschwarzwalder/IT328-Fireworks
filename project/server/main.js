import { Meteor } from 'meteor/meteor';
import { deck } from '../collection/collection.js';
import { fireworkCards } from '../collection/collection.js';
import { player1HandCollection } from '../collection/collection.js';
import { player2HandCollection } from '../collection/collection.js';
import { player_areaCollection } from '../collection/collection.js'; 
import { discardCollection }  from '../collection/collection.js'; 
//server

 

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
  },
  playACard: function(playerhand, card){
	 play(player1HandCollection, card);
	  
  },
  discardACard: function(playerhand, card){
	  
	 discard(player1HandCollection, card);
	  //discard.find().sort({cardColor: 1, cardValue: 1});
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
	console.log("you've entered the play a card fucntion  \n \n \n \n")
	var play_areaCard = player_areaCollection.findOne({cardColor: card.cardColor})
	
	//find that card color in play area
		if (play_areaCard == null){
			//if color does not exist
			//check to see if this card has value of 1
			if (card.cardValue == 1){
				//if it does add that card to the play area
				player_areaCollection.insert(card);
				
			}
				
		}
		
		//if color exists, compare card values
			//if this card value is play_area card value +1 
			//remove play_area card 
			//add this card to the play area
			//remove this card from players hand
		
		//else add to discard 
			//remove from players hand
			//increase fireworks (errors)
	
	//add card from hand to play area
	
	console.log(discardCollection.insert(card));
	
		
	//remove card from hand
	playerhand.remove(card._id);

	//draw new card
	playerhand.insert(drawCard(fireworkCards));
  }
  
  function discard(playerhand, card) {
	 
	console.log("you've entered the discard fucntion  \n \n \n \n")
	
	
	//add card from hand to discards 
	console.log(discardCollection.insert(card));
	
		
	//remove card from hand
	playerhand.remove(card._id);

	//draw new card
	playerhand.insert(drawCard(fireworkCards));
	
	

	 
  }
  
  
//newGame(5, fireworkCards, player1HandCollection, player2HandCollection);

  //get number of cards
  var index = fireworkCards.find().count();
  console.log(index);
//player2HandCollection.insert(fireworkCards.find({}));


   
   
});
