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

Router.route('/play', function () {
  this.render('navigation');
});

Router.route('/help', function () {
  this.render('instructions');
});

Router.route('/login', function () {
  this.render('login');
});
Router.route('/josh', function () {
  this.render('josh');
});
//use a hook to prevent unauthorized access to templated with data
Router.onBeforeAction(function () {
  // all properties available in the route function
  // are also available here such as this.params

  if (!Meteor.userId()) {
    // if the user is not logged in, render the Login template
    this.render('login');
  } else {
    // otherwise don't hold up the rest of hooks or our route/action function
    // from running
    this.next();
  }
});