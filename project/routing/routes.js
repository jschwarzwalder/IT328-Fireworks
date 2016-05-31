import { player1HandCollection } from '../collection/collection.js';
import { player2HandCollection } from '../collection/collection.js';
import { play_area_collection } from '../collection/collection.js'; 
import { discardCollection }  from '../collection/collection.js'; 
import { gameCollection }  from '../collection/collection.js';
import { clues } from '../collection/collection.js';
import { errors } from '../collection/collection.js';

Router.route('/', function () {
  this.render('welcomeboard');
});

Router.route('/start', function () {
  this.render('navigation');
});
