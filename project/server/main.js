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
 

Meteor.startup(() => {
	//remove any database values that are present
	fireworkCards.remove({}); //delete all records (this will only work on the server)
	
	for (var i = 0 ; i < deck.length ; i ++) {

		fireworkCards.insert(deck[i]);
	}
	
	//remove any database values that are present
	player1HandCollection.remove({}); //delete all records (this will only work on the server)
	player2HandCollection.remove({}); 
	
	for (var i = 0 ; i < player_1.length ; i++) {

		player1HandCollection.insert(player_1[i]);
		player2HandCollection.insert(player_2[i]);
	}
	
		
	//remove any database values that are present
	player_areaCollection.remove({}); //delete all records (this will only work on the server)
	
	for (var i = 0 ; i < play_area.length ; i ++) {

		player_areaCollection.insert(play_area[i]);
	}
});
