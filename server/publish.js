// Lists -- {name: String}
Polls = new Meteor.Collection("polls");

Polls.allow({
	insert: function(userId, doc) {
		return false;
	},
	update: function(userId, doc, fields, modifier) {
		return true;
	}
});

Meteor.publish('polls', function() {
	return Polls.find({});
});

Meteor.methods({
	vote: function (pollId, entryName) {
		Polls.update({ _id: pollId, 'options.name': entryName }, { $inc: { 'options.$.value': 1 } });
	}
});
