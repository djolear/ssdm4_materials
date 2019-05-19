/* ************************************ */
/* Define helper functions */
/* ************************************ */


function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}

var survey = function() {
	//turk.submit(dietary_decision_experiment);
	turk.submit(toObject(dietary_decision_experiment));
	window.location.replace("https://stanforduniversity.qualtrics.com/jfe/form/SV_9S2gvTSPVA7c3xX");
}

function evalAttentionChecks() {
	var check_percent = 1
	if (run_attention_checks) {
		var attention_check_trials = jsPsych.data
				.getTrialsOfType('attention-check')
		var checks_passed = 0
		for (var i = 0; i < attention_check_trials.length; i++) {
			if (attention_check_trials[i].correct === true) {
				checks_passed += 1
			}
		}
		check_percent = checks_passed / attention_check_trials.length
	}
	return check_percent
}

function assessPerformance() {
	/*
	 * Function to calculate the "credit_var", which is a boolean used to credit
	 * individual experiments in expfactory.
	 */
	var experiment_data = jsPsych.data.getTrialsOfType('single-stim-button');
	var missed_count = 0;
	var trial_count = 0;
	var rt_array = [];
	var rt = 0;
	var avg_rt = -1;
	// record choices participants made
	for (var i = 0; i < experiment_data.length; i++) {
		trial_count += 1
		rt = experiment_data[i].rt
		if (rt == -1) {
			missed_count += 1
		} else {
			rt_array.push(rt)
		}
	}
	// calculate average rt
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array)
	} else {
		avg_rt = -1
	}
	credit_var = (avg_rt > 200)
	jsPsych.data.addDataToLastTrial({
		"credit_var" : credit_var
	})
}

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
}

var getHealthStim = function() {
	curr_stim = health_stims.shift()
	var stim = base_path + curr_stim
	return '<div class = dd_stimBox><img class = dd_Stim src = ' + stim
			+ ' </img></div>' + health_response_area
}

var getTasteStim = function() {
	curr_stim = taste_stims.shift()
	var stim = base_path + curr_stim
	return '<div class = dd_stimBox><img class = dd_Stim src = ' + stim
			+ ' </img></div>' + taste_response_area
}

var getDecisionStim = function() {
	// curr_stim = decision_stims.shift()

	curr_pairing = pairings_list.shift();

	var left_stim = base_path + curr_pairing[0]
	var right_stim = base_path + curr_pairing[1]
	// return "<div class ='left center-content'><button class = dd_response_button id = Left_Stim><img src = " + left_stim
	// 		+ ' </button></div>'
	// 		+ "<div class ='right center-content'><button class = dd_response_button id = Right_Stim><img src = " + right_stim
	// 		+ ' </button></div>' 
	return "<div class = 'dd_choice_div'> <div class = 'dd_left_image'><button class = dd_choice_button id = Left_Stim><img src = " + left_stim
			+ ' </button></div>'
			+ "<div class = 'dd_right_image'><button class = dd_choice_button id = Right_Stim><img src = " + right_stim
			+ ' </button></div></div>' 

}



var getDecisionText = function() {
	return '<div class = dd_centerbox><p class = "block-text">In the next block of trials you will choose between eating various foods.  In each trial,  you will see two foods.  Please select the food that you would rather have.</p><p class = block-text>Take these decisions seriously. Imagine that at the end of the experiment you had to eat the food you chose in one random decision.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>'

}

var setUpTest = function() {
	// categorize ratings
	// var random_stims = jsPsych.randomization.shuffle(stims)
	// var ratings = {
	// 'taste': [],
	// 'health': []
	// }
	var healthy_tasty_stims = [];
	var healthy_untasty_stims = [];
	var unhealthy_tasty_stims = [];
	var unhealthy_untasty_stims = [];

	var key = ''

	for (var i = 0; i < stims.length; i++) {
		key = stim_ratings[stims[i]]

		if (key.taste !== 'NaN' && key.health !== 'NaN') {
			if (key.taste > 0 && key.health > 0) {
				healthy_tasty_stims.push(stims[i])
			} else if (key.taste < 0 && key.health > 0) {
				healthy_untasty_stims.push(stims[i])
			} else if (key.taste > 0 && key.health < 0) {
				unhealthy_tasty_stims.push(stims[i])
			} else if (key.taste < 0 && key.health < 0) {
				unhealthy_untasty_stims.push(stims[i])
			}
		}
	}
	// consider randomizing stims here once you get the rest working

	var image_categories = [];
	image_categories[0] = healthy_tasty_stims
	image_categories[1] = healthy_untasty_stims
	image_categories[2] = unhealthy_tasty_stims
	image_categories[3] = unhealthy_untasty_stims

	// check to see if any category is empty or has only 1 item in it.

	for (var i = 0; i < image_categories.length; i++) {
		if (image_categories[i].length < 2) {
			image_categories[i] = stims
		}
	}

	// want a list of 'numPairings' pairings where each type of pairing is
	// equally represented

	// part1 and part2 represent the different possible combinations of pairings
	// from 4 categories
	var part1 = [ 0, 0, 0, 0, 1, 1, 1, 2, 2, 3 ]
	var part2 = [ 0, 1, 2, 3, 1, 2, 3, 2, 3, 3 ]

	for (var i = 0; i < part1.length; i++) {

		for (var j = 0; j < NUMPAIRINGS / part1.length; j++) {
			pairings_list.push(createPairing(image_categories[part1[i]],
					image_categories[part2[i]]))
		}
	}

	// randomize pairings_list
	pairings_list = jsPsych.randomization.shuffle(pairings_list)

	// radomize the left stim vs right stim

	for (var i = 0; i < pairings_list.length; i++) {
		var r = Math.random()
		if (r < 0.5) {
			swapFirstTwoElements(pairings_list[i])
		}
	}


}

var createPairing = function(a, b) {

	var pairing = [ 0, 0 ]
	while (pairing[0] === pairing[1]) {
		pairing = []
		pairing.push(a[Math.floor(Math.random() * (a.length))])
		pairing.push(b[Math.floor(Math.random() * (b.length))])
	}

	return pairing
}

var swapFirstTwoElements = function(list) {

	var temp = list[0];
	list[0] = list[1];
	list[1] = temp;
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = "center-block-text">'
			+ feedback_instruct_text + '</p></div>'
}
/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 // ms
var instructTimeThresh = 0 // /in seconds
var credit_var = true

// task specific variables
var healthy_responses = [ 'Very_Unhealthy', 'Unhealthy', 'Neutral', 'Healthy',
		'Very_Healthy' ]
var tasty_responses = [ 'Very_Untasty', 'Untasty', 'Neutral', 'Tasty',
		'Very_Tasty' ]
var decision_responses = [ 'Left_Stim', 'Right_Stim' ]

var health_response_area = '<div class = dd_response_div>'
		+ '<button class = dd_response_button id = Very_Unhealthy>Very Unhealthy</button>'
		+ '<button class = dd_response_button id = Unhealthy>Unhealthy</button>'
		+ '<button class = dd_response_button id = Neutral>Neutral</button>'
		+ '<button class = dd_response_button id = Healthy>Healthy</button>'
		+ '<button class = dd_response_button id = Very_Healthy>Very Healthy</button></div>'

var taste_response_area = '<div class = dd_response_div>'
		+ '<button class = dd_response_button id = Very_Untasty>Very Untasty</button>'
		+ '<button class = dd_response_button id = Untasty>Untasty</button>'
		+ '<button class = dd_response_button id = Neutral>Neutral</button>'
		+ '<button class = dd_response_button id = Tasty>Tasty</button>'
		+ '<button class = dd_response_button id = Very_Tasty>Very Tasty</button></div>'

// Higher value indicates choosing the food item over the neutral food item.
// var decision_response_area = '<div class = dd_response_div>'
// 		+ '<button class = dd_response_button id = Left_Stim>Left</button>'
// 		+ '<button class = dd_response_button id = Right_Stim>Right</button></div>'
var decision_response_area = '<div class = dd_choice_div>'
		+ '<button class = dd_image_button_left id = Left_Stim>Left</button>'
		+ '<button class = dd_image_button_right id = Right_Stim>Right</button></div>'



var base_path = 'dietary_decision/images_small/'
var stims = [ '100Grand.bmp', 'banana.bmp', 'blueberryyogart.bmp',
//		'brocollincauliflower.bmp', 'butterfinger.bmp', 'carrots.bmp',
//		'cellery.bmp', 'cherryicecream.bmp',
// 'ChipsAhoy.bmp', 'cookiencream.bmp', 'cookies.bmp', 'cranberries.bmp',
// 'Doritosranch.bmp', 'FamousAmos.bmp', 'ffraspsorbet.bmp',
// 'FlamingCheetos.bmp',
// 'frozenyogart.bmp', 'Ghiradelli.bmp', 'grannysmith.bmp', 'HoHo.bmp',
// 'icecreamsandwich.bmp', 'keeblerfudgestripes.bmp', 'keeblerrainbow.bmp',
// 'KitKat.bmp',
// 'laysclassic.bmp', 'Lindt.bmp', 'mixedyogart.bmp', 'MrsFields.bmp',
// 'orange.bmp',
// 'orangejello.bmp', 'Oreos.bmp', 'raisins.bmp', 'reddelicious.bmp',
// 'redgrapes.bmp', 'Reeses.bmp', 'RiceKrispyTreat.bmp', 'ruffles.bmp',
// 'sbcrackers.bmp', 'sbdietbar.bmp', 'slimfastC.bmp', 'slimfastV.bmp',
// 'specialKbar.bmp',
// 'strawberries.bmp', 'strussel.bmp', 'uToberlorone.bmp', 'uTwix.bmp',
// 'wheatcrisps.bmp',
// 'whitegrapes.bmp', 'wwbrownie.bmp', 'wwmuffin.bmp'
]
var images = []
for (var i = 0; i < stims.length; i++) {
	images.push(base_path + stims[i])
}
// preload images
jsPsych.pluginAPI.preloadImages(images)

var turkInfo = jsPsych.turk.turkInfo()
var current_trial = 0
var NUMPAIRINGS = 10
var health_stims = jsPsych.randomization.shuffle(stims)
var taste_stims = jsPsych.randomization.shuffle(stims)
var decision_stims = []
var pairings_list = []
var curr_pairing = []
var reference_stim = ''
var curr_stim = ''
var stim_ratings = {}
for (var s = 0; s < stims.length; s++) {
	stim_ratings[stims[s]] = {}
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type : 'attention-check',
	timing_response : 180000,
	response_ends_trial : true,
	timing_post_trial : 200
}

var attention_node = {
	timeline : [ attention_check_block ],
	conditional_function : function() {
		return run_attention_checks
	}
}

// Screen for worker ID

var worker_ID = {
	type : 'survey-text',
	questions : ['<p class = "center-block-text">Please enter your worker ID to continue.</p>'],

	data : {
		trial_id : "worker ID"

	},
	
}

// Set up post task questionnaire
var post_task_block = {
	type : 'survey-text',
	data : {
		trial_id : "post task questions"
	},
	questions : [
			'<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
			'<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>' ],
	rows : [ 15, 15 ],
	columns : [ 60, 60 ]
};

/* define static blocks */
var end_block = {
	type : 'poldrack-text',
	timing_response : 180000,
	data : {
		trial_id : 'end',
		exp_id : 'dietary_decision'
	},
	text : '<div class = centerbox><p class = "center-block-text">Thanks for completing this task!<br></p></div>',
	cont_key : [ 13 ],
	timing_post_trial : 0,
	on_finish : assessPerformance
};

var feedback_instruct_text = 'Welcome to the experiment. This task will take around 15 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
	type : 'poldrack-text',
	data : {
		trial_id : 'instruction'
	},
	cont_key : [ 13 ],
	text : getInstructFeedback,
	timing_post_trial : 0,
	timing_response : 180000
};
// / This ensures that the subject does not read through the instructions too
// quickly. If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type : 'poldrack-instructions',
	data : {
		trial_id : 'instruction'
	},
	pages : [ "<div class = centerbox><p class = 'block-text'>In this task you will be rating different food items based on their tastiness and healthiness. Respond before the food item leaves the screen. You have about 4 seconds for each choice.  The whole task should not take more than 10 minutes.</p></div>" ],
	allow_keys : false,
	show_clickable_nav : true,
// timing_post_trial: 1000
};

var instruction_node = {
	timeline : [ feedback_instruct_block, instructions_block ],
	/* This function defines stopping criteria */
	loop_function : function(data) {
		for (i = 0; i < data.length; i++) {
			if ((data[i].trial_type == 'poldrack-instructions')
					&& (data[i].rt != -1)) {
				rt = data[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		if (sumInstructTime <= instructTimeThresh * 1000) {
			feedback_instruct_text = 'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
	}
}

var start_health_block = {
	type : 'poldrack-text',
	timing_response : 180000,
	data : {
		trial_id : 'start_health'
	},
	text : '<div class = centerbox><p class = "center-block-text">In the next block of trials, rate the healthiness of each food item without regard for its taste. Press <strong>enter</strong> to begin.</p></div>',
	cont_key : [ 13 ],
	timing_post_trial : 500,
	on_finish : function() {
		current_trial = 0
	}
};

var start_taste_block = {
	type : 'poldrack-text',
	data : {
		trial_id : 'start_taste'
	},
	timing_response : 180000,
	text : '<div class = centerbox><p class = "center-block-text">In the next block of trials, rate the tastiness of each food item without regard for its healthiness. Press <strong>enter</strong> to begin.</p></div>',
	cont_key : [ 13 ],
	timing_post_trial : 500,
	on_finish : function() {
		current_trial = 0
	}
};

var setup_block = {
	type : 'call-function',
	data : {
		trial_id : 'setup test'
	},
	func : setUpTest,
	timing_post_trial : 0
}

var start_decision_block = {
	type : 'poldrack-text',
	timing_response : 180000,
	data : {
		trial_id : 'decision_text'
	},
	text : getDecisionText,
	cont_key : [ 13 ],
	timing_post_trial : 500,
	on_finish : function() {
		current_trial = 0
	}
};

var fixation_block = {
	type : 'poldrack-single-stim',
	// stimulus: '<div class = centerbox><div class =
	// "center-text">+</div></div>',
	stimulus : '<div class = centerbox><div class = "center-text">+</div></div>',
	is_html : true,
	timing_stim : 300,
	timing_response : 300,
	data : {
		trial_id : 'fixation'
	},
	choices : 'none',
	response_ends_trial : true,
	timing_post_trial : 1000
}

var health_block = {
	type : 'single-stim-button',
	// stimulus: getHealthStim,
	stimulus : getHealthStim,
	button_class : 'dd_response_button',
	data : {
		trial_id : 'stim',
		exp_stage : 'health_rating'
	},
	timing_stim : 4000,
	timing_response : 4000,
	response_ends_trial : true,
	timing_post_trial : 500,
	on_finish : function(data) {
		var numeric_rating = healthy_responses.indexOf(data.mouse_click) - 2
		if (data.mouse_click === -1) {
			numeric_rating = 'NaN'
		}
		jsPsych.data.addDataToLastTrial({
			'stim' : curr_stim.slice(0, -4),
			'coded_response' : numeric_rating,
			'trial_num' : current_trial
		})
		current_trial += 1
		stim_ratings[curr_stim].health = numeric_rating
	}
}

var taste_block = {
	type : 'single-stim-button',
	// stimulus: getTasteStim,
	stimulus : getTasteStim,
	button_class : 'dd_response_button',
	data : {
		trial_id : 'stim',
		exp_stage : 'taste_rating'
	},
	timing_stim : 4000,
	timing_response : 4000,
	response_ends_trial : true,
	timing_post_trial : 500,
	on_finish : function(data) {
		var numeric_rating = tasty_responses.indexOf(data.mouse_click) - 2
		if (data.mouse_click === -1) {
			numeric_rating = 'NaN'
		}
		jsPsych.data.addDataToLastTrial({
			'stim' : curr_stim.slice(0, -4),
			'coded_response' : numeric_rating,
			'trial_num' : current_trial
		})
		current_trial += 1
		stim_ratings[curr_stim].taste = numeric_rating
	}
}

var decision_block = {
	type : 'single-stim-button',
	stimulus : getDecisionStim,
	button_class : 'dd_choice_button',
	data : {
		trial_id : 'stim',
		exp_stage : 'decision'
	},
	timing_stim : 4000,
	timing_response : 4000,
	response_ends_trial : true,
	timing_post_trial : 500,
	on_finish : function(data) {
		var decision_rating = decision_responses.indexOf(data.mouse_click)
		var reference_rating = JSON.stringify(stim_ratings[reference_stim])
		var stim_rating = JSON.stringify(stim_ratings[curr_stim])
		jsPsych.data.addDataToLastTrial({
			'left_stim' : curr_pairing[0].slice(0, -4),
			'right_stim' : curr_pairing[1].slice(0, -4),
			'coded_response' : decision_rating,
			'trial_num' : current_trial
		})
		current_trial += 1
	}
}

/* create experiment definition array */
var dietary_decision_experiment = [];


dietary_decision_experiment.push(worker_ID);
dietary_decision_experiment.push(instruction_node);
if (Math.random() < 0.5) {
	dietary_decision_experiment.push(start_health_block);
	for (var i = 0; i < stims.length; i++) {
		dietary_decision_experiment.push(health_block);
	}
	dietary_decision_experiment.push(start_taste_block);
	for (var i = 0; i < stims.length; i++) {
		dietary_decision_experiment.push(taste_block);
	}
	dietary_decision_experiment.push(attention_node)
} else {
	dietary_decision_experiment.push(start_taste_block);
	for (var i = 0; i < stims.length; i++) {
		dietary_decision_experiment.push(taste_block);
	}
	dietary_decision_experiment.push(start_health_block);
	for (var i = 0; i < stims.length; i++) {
		dietary_decision_experiment.push(health_block);
	}
}
dietary_decision_experiment.push(setup_block);
dietary_decision_experiment.push(start_decision_block);
for (var i = 0; i < NUMPAIRINGS; i++) {
	dietary_decision_experiment.push(decision_block);
}
// dietary_decision_experiment.push(post_task_block)
dietary_decision_experiment.push(end_block);




