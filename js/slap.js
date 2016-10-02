// Set some variables
var beeTypes = {
		Queen  : {health : 100, hitDamage:7, needed: 3},
		Worker : {health : 75, hitDamage: 12, needed: 5},
		Drone  : {health : 50, hitDamage: 18, needed : 7}
	},
	bees = [],
	newBee;



// The basic bee 
function Bee(type, health, hitDamage) {
    this.type = type;
    this.health = health;
    this.hitDamage = hitDamage;
    this.status = "alive";
    this.doDamage = function() {
    	this.health -= this.hitDamage;
    	if (this.health <= 0 ){
    		this.status = "dead";
    	}
    };
}



// Set up new bees
function newBees(){
	// Push each bee into array
	$.each( beeTypes, function(index) {
		for (var i = 0; i < this.needed; i++) {
			newBee = new Bee (index, this.health, this.hitDamage);
			bees.push(newBee);
		}
	});
}



// Output bees to page
function outPutHtml(bees){
	var html = "";
	for (var i = 0; i < bees.length; i++) {		
		html += "<tr><td>"+bees[i].type+"</td><td>"+bees[i].health+"</td><td>"+bees[i].status+"</td></tr>"
	}
	$("#js-bees tbody").empty().append(html);
}



// Slap the bee
function slapThatBee(beeToSlap) {

	// Check if all the Queens are dead
	// To do - Check against number of queens in array rather than hard coded number
	//       - Remove bee from array when dead so it's not slapped again
	if (checkQueens() !== 3){
		var currentBee = bees[beeToSlap];
		if (currentBee.status === "alive"){
			currentBee.doDamage();
			statusUpdate(currentBee);
			$("#js-dead-bee-msg").addClass('hide');
		}else{
			$("#js-dead-bee-msg").removeClass('hide');
		}
	}else{
		// If all the queens are dead, so are the rest
		for (var i = 0; i < bees.length; i++) {	
			bees[i].status = "dead";
		}
		$("#js-dead-bee-msg").removeClass("hide").text("They all dead");
		$("#js-btn-hit").attr("disabled", true);
	}
	outPutHtml(bees);
}



// Check for dead Queens
function checkQueens(){
	var deadQueens = 0;
	for (var i = 0; i < bees.length; i++) {
		if(bees[i].type === "Queen" && bees[i].status === "dead" ){
			deadQueens ++;
		}
	}
	return deadQueens;
}



// Feedback which bee was just slapped
function statusUpdate(slappedBee){
	$("#js-status #type").text(slappedBee.type);
	$("#js-status #health-lost").text(slappedBee.hitDamage);
	$("#js-status #health-remaining").text(slappedBee.health);
	$("#js-status").removeClass("hide");
}



$(document).ready(function($) {

	//set up new bees
	newBees();

	//output html
	outPutHtml(bees);

	// Hit button
	$( "#js-btn-hit" ).on( "click", function() {
		// Choose a bee at randon from the array to slap
		slapThatBee(Math.floor(Math.random()*bees.length));
	});

	$( "#js-btn-reset" ).on( "click", function() {
		bees = []; // empty bees array
		newBees(); // new bees please
		outPutHtml(bees);
		$("#js-status, #js-dead-bee-msg").addClass("hide");
		$("#js-btn-hit").attr("disabled", false);
	});

});