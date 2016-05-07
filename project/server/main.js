import { Meteor } from 'meteor/meteor';
import { deck } from '../collection/collection.js';
import { fireworkCards } from '../collection/collection.js';
import { player1HandCollection } from '../collection/collection.js';
import { player2HandCollection } from '../collection/collection.js';
import { player_areaCollection } from '../collection/collection.js'; 
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
  }
});
    //create the deck
    //remove any database values that are present
  fireworkCards.remove({});
  player1HandCollection.remove({});
  player2HandCollection.remove({});//delete all records ( this will only work on server side)
  //add my dummy values
  
  function initialize() {
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

//newGame(5, fireworkCards, player1HandCollection, player2HandCollection);

  //get number of cards
  var index = fireworkCards.find().count();
  console.log(index);
//player2HandCollection.insert(fireworkCards.find({}));
   
   
});
