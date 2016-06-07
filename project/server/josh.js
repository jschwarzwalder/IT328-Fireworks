import { Meteor } from 'meteor/meteor';
import { matchesCollection } from '../collection/collection.js';

Meteor.startup(() => {
  // code to run on server at startup
});

/*
	Methods for creating matches, adding users to matches
*/
Meteor.methods({
	'addMatch': function(match) {
		//creates a new match document
		return matchesCollection.insert(match);
	},
	'addToMatch': function(user, matchId) {
		//update user profile
		Meteor.users.update({"_id": user._id}, {"$set": {"profile.partOfMatch": user.profile.partOfMatch}});

		//remove from any existing match
		matchesCollection.update({"user1._id": user._id}, {"$set": {"user1": null}});
		matchesCollection.update({"user2._id": user._id}, {"$set": {"user2": null}});

		//add to match
		var match = matchesCollection.findOne({"_id": matchId});

		if (match.user1 == undefined) {
			match.user1 = user;
		} else {
			match.user2 = user;
		}

		matchesCollection.update({"_id": match._id}, {"$set": {"user1": match.user1, "user2": match.user2}})

		return match;
	},
	'updateCardChosen': function(user) {
		//update the chosen card
		Meteor.users.update({"_id": user._id}, {"$set": {"profile.cardChosen": user.profile.cardChosen}});

		//update your record in the match document
		matchesCollection.update({"user1._id": user._id}, {"$set": {"user1": user}});
		matchesCollection.update({"user2._id": user._id}, {"$set": {"user2": user}});
	}
});

//publish all match data to the client
Meteor.publish('allMatches', function() {
	return matchesCollection.find();
});

//publish the current user's profile to the client
Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'profile': 1}});
});