Meteor.startup(function() {
  
  if (Polls.find().count() === 0) {
    var poll = {
      question: 'Your car?',
      options: [
        { name: 'ACURA', value: 5 },
        { name: 'AUDI',  value: 10 },
        { name: 'BMW', value: 60 },
        { name: 'INFINITY', value: 5 },
        { name: 'LEXUS', value: 8 },
        { name: 'MERCEDES', value: 90 }
      ]
    }
    Polls.insert(poll);
  }
});