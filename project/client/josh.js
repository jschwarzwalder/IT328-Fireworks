import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { matchesCollection } from '../collection/collection.js';

import './main.html';

Meteor.subscribe('allMatches');
Meteor.subscribe('userData');

//only username and password
Accounts.ui.config({
	passwordSignupFields: 'USERNAME_ONLY'
});

Template.matches.events({
   'click button': function(event) {
		var user = Meteor.user();

		//create the new match
		var match = {
			name: $('#matchName').val(),
			dateCreated: new Date(),
			user1: null,
			user2: null,
			started: false
		};

		Meteor.call('addMatch', match, function(error, result) {
			alert('Match created successfully: ' + result);
		});
    },
	'click a.joinMatch': function(event) {
		var matchId = $(event.target).data('id');

		var user = Meteor.user();

		//save the match the user is part of to profile
		if (Meteor.user().profile == undefined) {
			user.profile = {
				partOfMatch: matchId
			};
		} else {
			user.profile.partOfMatch = matchId;
		}

		Meteor.call('addToMatch', user, matchId);
	}
});

Template.matches.helpers({
	'allMatches': function() {
		return matchesCollection.find();
	},
	'playerInMatch': function(match) {
		//determines if a player is in a match or not
		var user = Meteor.user();

		if (user) {
			var profile = user.profile;		

			if (profile) {
				return profile.partOfMatch == match._id;
			}
		}

		return false;
	},
	'matchFull': function(match) {
		//determines if a match is full or not
		return match.user1 && match.user2;
	},
	'getMatchPlayers': function(match) {
		//returns a pretty print string that has the names of players in a match
		var player1 = match.user1 != null ? match.user1.username : '';
		var player2 = match.user2 != null ? match.user2.username : '';

		//if we have undefined or null just display the player as "empty"
		if (!player1) {
			player1 = 'empty';
		}
		if (!player2) {
			player2 = 'empty';
		}

		return player1 + ', ' + player2;
	}
});

Template.game.onCreated(function() {
	//create a few dummy cards to pick randomly
	Session.set('cards', [
		{
			suit: 'ace',
			rank: 'clubs',
			img: 'ace_of_clubs.png'
		},
		{
			suit: '3',
			rank: 'diamonds',
			img: '3_of_diamonds.png'
		},
		{
			suit: 'king',
			rank: 'hearts',
			img: 'king_of_hearts.png'
		},
		{
			suit: '7',
			rank: 'spades',
			img: '7_of_spades.png'
		}
	]);
});

Template.game.helpers({
	'match': function() {
		var user = Meteor.user();
		if (user && user.profile) {
			return matchesCollection.findOne({"_id": user.profile.partOfMatch});
		}
	},
	'playerCards': function(playerNumber) {
		//get the player
		var user = Meteor.user();

		//show the chosen card
		if (user && user.profile) {
			var match = matchesCollection.findOne({"_id": user.profile.partOfMatch});

			//this is the user who is associated with the card with playerNumber number
			var associatedUser = null;
			if (playerNumber == 1)
			{
				associatedUser = match.user1;
			}
			else
			{
				associatedUser = match.user2;
			}

			//show the user's chosen card, or the card back if a choice has not been made
			if (associatedUser.profile.cardChosen)
			{
				return associatedUser.profile.cardChosen.img;
			}
			else
			{
				return 'cardBack.jpeg';
			}
		}
	}
});

Template.game.events({
	'click img#player1': function(event) {
		checkPlayerFlip(1);
	},
	'click img#player2': function(event) {
		checkPlayerFlip(2);
	}
});

function checkPlayerFlip(playerNumber)
{
	var user = Meteor.user();

	//check if we have a user and a match associated with the user
	if (user && user.profile) {
		var match = matchesCollection.findOne({"_id": user.profile.partOfMatch});

		//only flip the card if it's the user's card
		if (playerNumber == 1 && user.username == match.user1.username)
		{
			flipCard(1);
		}
		else if (playerNumber == 2 && user.username == match.user2.username)
		{
			flipCard(2);
		}
	}
}

function flipCard(playerNumber)
{
	//get cards, choose one randomly, save and display it
	var cards = Session.get('cards');

	var randomIndex = Math.floor(Math.random() * cards.length);
	var card = cards[randomIndex];
	
	//save the card choice to the db
	var user = Meteor.user();
	user.profile.cardChosen = card;
	Meteor.call('updateCardChosen', user);
}

Template.registerHelper('loggedIn', function() {
	//is the user logged in?
	return Meteor.user() != undefined;
});

Template.registerHelper('matchReady', function() {
	var user = Meteor.user();

	//check if we have a user and a match associated with the user
	if (user && user.profile) {
		var match = matchesCollection.findOne({"_id": user.profile.partOfMatch});

		if (match)
		{
			//check if two players are in the match
			return match.user1 && match.user2;
		}	
	}

	return false;
});




















