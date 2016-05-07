import { Meteor } from 'meteor/meteor';
import { deck } from '../collection/collection.js';
import { fireworkCards } from '../collection/collection.js';
import { player1HandCollection } from '../collection/collection.js';
import { player2HandCollection } from '../collection/collection.js';
//server
Meteor.startup(() => {
    
    //create the deck
    //remove any database values that are present
  fireworkCards.remove({}); //delete all records ( this will only work on server side)
  //add my dummy values
  for (var i = 0 ; i < deck.length ; i ++) {
    fireworkCards.insert(deck[i]);
  }
  
  
    var HandNum = 5;
   //clear hands
       player1HandCollection.remove({});
       player2HandCollection.remove({});

   //draw function
   function drawCard(cardCount, handName) {
    for (var i = 0 ; i < cardCount ; i ++) {
            
           //get a random card from the fireworks card
         //  var r = Math.floor(Math.random() * );
          // var randomElement = db.myCollection.find().limit(1).skip(r);
           //add it to hand
           //remove it from fireworks
            handName.insert(deck[Math.round(Math.random() * deck.length) ]);
            //remove it from the deck collection
            fireworkCards.findOne.remove();

            }
   }
   
     
         
         
});
