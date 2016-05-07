import { Meteor } from 'meteor/meteor';
import { deck } from '../collection/collection.js';
import { player1HandCollection } from '../collection/collection.js';
import { player2HandCollection } from '../collection/collection.js';
//server
Meteor.startup(() => {
    var HandNum = 5;
       player1HandCollection.remove({});
       player2HandCollection.remove({});
         for (var i = 0 ; i < HandNum ; i ++) {
            
           // var randomCard = deck.findOne();
            player1HandCollection.insert(deck[i]);
            deck.splice(i, 1);
            player2HandCollection.insert(deck[i]);
            deck.splice(i, 1);

            }
         
         
});
