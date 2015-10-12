
function hexToRgb(hex){
	return {r: parseInt(hex.slice(1, 3), 16),
					g: parseInt(hex.slice(3, 5), 16),
					b: parseInt(hex.slice(5, 7), 16) };
}

function fixCollection(){

	Colors.find().forEach(
		function (e) {
			// update document, using its own properties
			var c = hexToRgb(e.color)
			e.r = c.r;
			e.g = c.g;
			e.b = c.b;
			
			Colors.update({_id: e._id}, e)
		}
	);

}

function fetchNearestK(k, color){
	var r = color.r;
	var g = color.g;
	var b = color.b;

	return Colors.aggregate(
		[ {$project: {
				eval: 1,
				order: {$add: [
					{ $multiply: [ 
						{$subtract: ["$r", r] },  {$subtract: ["$r", r] }
					]},
					{ $multiply: [ 
						{$subtract: ["$g", g] },  {$subtract: ["$g", g] }
					]},
					{ $multiply: [ 
						{$subtract: ["$b", b] },  {$subtract: ["$b", b] }
					]}
			]}
		}},
		{$sort: {order: 1}},
		{$limit: k}
	]);
}

function maxKey(count){
	var cmax = 0;
	var imax = -1;
	for (var key in count) {
		if(count[key] > cmax){
			cmax = count[key];
			imax = key;
		}else if(count[key] == cmax){
			imax = -1;
		}
	}
	return imax;
}

K = 3

Meteor.startup(function () {
	// code to run on server at startup
	
});

Meteor.methods({
	'knn': function(hex) {
		var color = hexToRgb(hex);

		console.log(color)
		var l = fetchNearestK(K, color);

		for(var k = K; k > 0; k--){
			var count = {}
			for(var i=0; i<l.length; i++){
				var e = l[i].eval;
				if(!count.hasOwnProperty(e) )
					count[e] = 0;
				count[e]++;
			}
			console.log(count);
			sol = maxKey(count);
			
			if(sol != -1)
				break;

			l.pop();
		}

		return sol; 

	},
	'addInstance': function(hex, eval){
		color = hexToRgb(hex);
		Colors.insert({eval: eval, color: hex, r: color.r, g: color.g, b: color.b});
	}
});


