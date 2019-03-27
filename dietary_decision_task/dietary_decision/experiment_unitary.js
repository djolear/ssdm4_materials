/* ************************************ */
/* Define helper functions */
/* ************************************ */

function check_consent (){
  if ($('#consent_checkbox').is(':checked')) {
    return true;
  } else {
    alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
    return false;
  } return false;
}

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
	curr_stim = decision_stims.shift()
	var stim = base_path + curr_stim
	return '<div class = dd_centerbox><p class = "center-block-text">Do you want to EAT this food?</p></div>' + 
	'<div class = dd_stimBox><img class = dd_Stim src = ' + stim
			+ ' </img></div>' + decision_response_area
}

// var getDecisionStim = function() {
// 	curr_stim = decision_stims.shift()

// 	curr_pairing = pairings_list.shift();

// 	var left_stim = base_path + curr_pairing[0]
// 	var right_stim = base_path + curr_pairing[1]
// 	return '<div class = dd_centerbox><p class = "block-text">Do you want to EAT this food?</p></div>' +
// 	"<div class ='left center-content'><img src = " + left_stim
// 			+ ' </img></div>'
// 			+ "<div class ='right center-content'><img src = " + right_stim
// 			+ ' </img></div>' + decision_response_area
// }

var getDecisionText = function() {
	return '<div class = dd_centerbox><p class = "block-text">In the next block of trials you will choose whether or not to eat various foods.  In each trial,  you will see one foods.  Only use the neutral key if absolutely necessary.</p><p class = block-text>Take these decisions seriously. Imagine that at the end of the experiment you had to eat the food you chose in a randomly chosen trial.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>'

}

var getConsentText = function() {
	return '<div id="consent"> <p> <div align="left">' + 
  
  '<b>DESCRIPTION:</b> You are invited to participate in a research study on emotion and dietary decision-making. The overall purpose of the research is to learn more about the subjective qualities of emotion and your food preferences.  In this study you may be asked to complete questionnaires. You may also be asked to solve various types of problems and make decisions about foods or other financial options.</p>' +

  '<b>TIME INVOLVEMENT:</b>  Your participation will take approximately 30 minutes.</p>' +

  '<b>RISKS AND BENEFITS:</b>  We will do everything possible to maintain confidentiality and your name will not be associated with any of the data that you provide. Beyond any intrinsic satisfaction you feel in part of this research, there are no other benefits for you in participating. We cannot and do not guarantee or promise that you will receive any benefits from this study.</p>' +

  '<b>PAYMENTS:</b>  You will receive payment as instructed in the general instructions of the study for your participation.</p>' +

  '<b> PARTICIPANT RIGHTS: </b> :  If you have read this form and have decided to participate in this project, please understand your participation is voluntary and you have the right to withdraw your consent or discontinue participation at any time without penalty.  You have the right to refuse to answer particular questions. Your individual privacy will be maintained in all published and written data resulting from the study. </p>' +

  '<b>CONTACT INFORMATION:</b> Questions, Concerns, or Complaints: If you have any questions, concerns, or complaints about this research study, its procedures, risks and benefits, or alternative courses of treatment, you should ask the Protocol Director. You may contact Daniel O’Leary anytime at djolear@stanford.edu. </p>' +

  '<b> INDEPENDENT CONTACT:</b>  If you are not satisfied with the manner in which this study is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a research study subject, please contact the Stanford Institutional Review Board (IRB) to speak to an informed individual who is independent of the research team at (650)-723-2480 or toll free at 1-866-680-2906.  You can also write to the Stanford IRB, Stanford University, 3000 El Camino Real, Five Palo Alto Square, 4th Floor, Palo Alto, CA 94306. </p>'

  'Please print a copy of this page for your records. </p>'

  '<p class = block-text>Press <strong>enter</strong> if you agree to participate in this study. Otherwise, close this page.</p>'

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


// var consent = {
//       type:'external-html',
//       url: "external_page.html",
//       cont_btn: "start",
//       check_fn: check_consent
//   };

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.65
var sumInstructTime = 0 // ms
var instructTimeThresh = 0 // /in seconds
var credit_var = true

// task specific variables
var healthy_responses = [ 'Very_Unhealthy', 'Unhealthy', 'Neutral', 'Healthy',
		'Very_Healthy' ]
var tasty_responses = [ 'Very_Untasty', 'Untasty', 'Neutral', 'Tasty',
		'Very_Tasty' ]
var decision_responses = [ 'Strong_No', 'No', 'Neutral', 'Yes', 'Strong_Yes' ]

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
var decision_response_area = '<div class = dd_response_div>'
		+ '<button class = dd_response_button id = Strong_No>Strong No</button>'
		+ '<button class = dd_response_button id = No>No</button>'
		+ '<button class = dd_response_button id = Neutral>Neutral</button>'
		+ '<button class = dd_response_button id = Yes>Yes</button>'
		+ '<button class = dd_response_button id = Strong_Yes>Strong Yes</button></div>'

var base_path = 'dietary_decision/images/'
var stims = [ '100Grand.bmp', 'banana.bmp', 'blueberryyogart.bmp',
		'brocollincauliflower.bmp', 'butterfinger.bmp', 'carrots.bmp',
		'cellery.bmp', 'cherryicecream.bmp',
'ChipsAhoy.bmp', 'cookiencream.bmp', 'cookies.bmp', 'cranberries.bmp',
'Doritosranch.bmp', 'FamousAmos.bmp', 'ffraspsorbet.bmp',
'FlamingCheetos.bmp',
'frozenyogart.bmp', 'Ghiradelli.bmp', 'grannysmith.bmp', 'HoHo.bmp',
'icecreamsandwich.bmp', 'keeblerfudgestripes.bmp', 'keeblerrainbow.bmp',
'KitKat.bmp',
'laysclassic.bmp', 'Lindt.bmp', 'mixedyogart.bmp', 'MrsFields.bmp',
'orange.bmp',
'orangejello.bmp', 'Oreos.bmp', 'raisins.bmp', 'reddelicious.bmp',
'redgrapes.bmp', 'Reeses.bmp', 'RiceKrispyTreat.bmp', 'ruffles.bmp',
'sbcrackers.bmp', 'sbdietbar.bmp', 'slimfastC.bmp', 'slimfastV.bmp',
'specialKbar.bmp',
'strawberries.bmp', 'strussel.bmp', 'uToberlorone.bmp', 'uTwix.bmp',
'wheatcrisps.bmp',
'whitegrapes.bmp', 'wwbrownie.bmp', 'wwmuffin.bmp'
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
var decision_stims = jsPsych.randomization.shuffle(stims)
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

var consent = {
	type : 'poldrack-text',
	timing_response : 180000,
	data : {
		trial_id : 'consent_text'
	},
	text : getConsentText,
	cont_key : [ 13 ],
	timing_post_trial : 500,
};


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
	text : '<div class = centerbox><p class = "center-block-text">Thanks for completing this task!<br>Please press ENTER to continue</p></div>',
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
		trial_id : 'setup_test'
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
  type: 'single-stim-button',
  stimulus: getDecisionStim,
  button_class: 'dd_response_button',
  data: {
    trial_id: 'stim',
    exp_stage: 'decision'
  },
  timing_stim: 4000,
  timing_response: 4000,
  response_ends_trial: true,
  timing_post_trial: 500,
  on_finish: function(data) {
    var decision_rating = decision_responses.indexOf(data.mouse_click) - 2
    var reference_rating = JSON.stringify(stim_ratings[reference_stim])
    var stim_rating = JSON.stringify(stim_ratings[curr_stim])
    jsPsych.data.addDataToLastTrial({
      'stim': curr_stim.slice(0, -4),
      'reference': reference_stim.slice(0, -4),
      'stim_rating': stim_rating,
      'reference_rating': reference_rating,
      'coded_response': decision_rating,
      'trial_num': current_trial
    })
    current_trial += 1
  }
}

/* create experiment definition array */
var dietary_decision_experiment = [];

dietary_decision_experiment.push(consent);
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
	dietary_decision_experiment.push(attention_node);
} else {
	dietary_decision_experiment.push(start_taste_block);
	for (var i = 0; i < stims.length; i++) {
		dietary_decision_experiment.push(taste_block);
	}
	dietary_decision_experiment.push(start_health_block);
	for (var i = 0; i < stims.length; i++) {
		dietary_decision_experiment.push(health_block);
	}
	dietary_decision_experiment.push(attention_node);
}
//dietary_decision_experiment.push(setup_block);
dietary_decision_experiment.push(start_decision_block);
for (var i = 0; i < stims.length; i++) {
  dietary_decision_experiment.push(decision_block);
}
dietary_decision_experiment.push(post_task_block)
dietary_decision_experiment.push(end_block);




