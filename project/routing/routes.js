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

Router.route('/login', function () {
  this.render('login');
});
//use a hook to prevent unauthorized access to templated with data
Router.onBeforeAction( function() {
    if (Meteor.user() && !Meteor.loggingIn) { //return undefined if no user is logged in
        this.redirect('/login');
    }else{
        this.next(); //tell the router to continue
    }
}, {
    except: ['login']
    
});