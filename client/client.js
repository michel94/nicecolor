
function randomColor(){
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function updateColor(){
	Session.set('color', randomColor());
}

Session.setDefault('activity', 'train');
Session.setDefault('color', randomColor())
Session.setDefault('conclusion', -1);

// Main

Template.Main.helpers({
	train: function() {
		return Session.get('activity') == 'train'
	},
	test: function() {
		return Session.get('activity') == 'test'
	},
	isTrainSelected: function(){
		if(Session.get('activity') == 'train')
			return 'active';
		else
			return ''
	},
	isTestSelected: function(){
		if(Session.get('activity') == 'test')
			return 'active';
		else
			return ''
	}
});

Template.Main.events({
	'click #trainTab': function (e) {
		Session.set('activity', 'train')
	},
	'click #testTab': function(e) {
		Session.set('activity', 'test')
	}
});

// Train

Template.Train.helpers({
	randomColor: function(){
		return Session.get('color');
	}
});

Template.Train.events({
	'click #yes': function(){
		Meteor.call('addInstance', Session.get('color'), 2);
		updateColor();
	},
	'click #meh': function(){
		Meteor.call('addInstance', Session.get('color'), 1);
		updateColor();
	},
	'click #no': function(){
		Meteor.call('addInstance', Session.get('color'), 0);
		updateColor();
	},
	'input #trainColor': function(e){
		var color = e.target.value;
		Session.set('color', color);
	}
});

// Test

Template.Test.events({
	'input #colorSelector': function(e){
		var color = e.target.value;
		Meteor.call('knn', color, function(e, v){
			console.log(v);
			Session.set("conclusion", v);
		})
	}
});

Template.Conclusion.helpers({
	is: function(n){
		return Session.get("conclusion") == n;
	}
});


