// Lists -- {name: String}
Polls = new Meteor.Collection("polls");

Meteor.publish('polls', function() {
	return Polls.find({});
});