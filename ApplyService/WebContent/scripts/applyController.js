/**
 *
 */
var URLs = {jobs: "/ApplyService/rest/apply/getJobs", submitApplication: "/ApplyService/rest/apply/submitApplication"};

function getJobs() {

	$.getJSON(URLs.jobs, function(data) {
		$.each(data, function(key, jobItem) {
			var qNewRow = $("<tr><td></td><td></td><td></td></tr>");
			qNewRow.find("td").first().append(jobItem.position);
			qNewRow.find("td").first().next().append(jobItem.description);
			var qButton = setupButton(jobItem._id, jobItem.position);
			qNewRow.find("td").last().append(qButton);
			$("#jobTable").append(qNewRow);
		});
	});
}

function setupButton(pId, pPosition) {
	var qButton = $("<button>");
	qButton.append("apply");
	qButton.on("click", null, {id: pId, position: pPosition}, handleApplyClick);
	return qButton;
}

function handleApplyClick(event) {
	var jobId=event.data.id;
	var jobPosition=event.data.position;

	$("#openPositionsDiv").slideUp(null, function(){
		$("#applicationDiv").fadeIn();
	});

	$("#jobIdFormField").val(jobId);

	$("#applicationDiv").find("h3").html("application for " + jobPosition);
}

function handleCancelClick(event) {
	$("#applicationDiv").fadeOut(null, function() {
		$("#openPositionsDiv").slideDown();
	});

	$("#applicationForm")[0].reset();
}

function handleSubmitClick() {
	var anApplication = new Object();

	var qForm = $("#applicationForm");
	anApplication.name = qForm.find("[name|='name']").val();
	anApplication.justification = qForm.find("[name|='justification']").val();
	anApplication.code = qForm.find("[name|='code']").val();
	anApplication.jobId = qForm.find("[name|='jobId']").val();
	anApplication.additionalLinks = qForm.find("[name|='additionalLinks']").val().split(",");

	submitApplication(anApplication);
}

function submitApplication(pApplication) {
	$.ajax({
		type: "POST",
		url: URLs.submitApplication,
		dataType: "json",
		data: JSON.stringify(pApplication),
		headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	    },
		success: function(data) {
			showMessageDiv("Application submitted! (" + data._id + ")");
		},
		failure: function() {
			showMessageDiv("Error occured. You may need to try again.");
		}
	});
}

function showMessageDiv(message) {
	$("#messageDiv").find("h3").html(message);
	$("#applicationDiv").fadeOut(null, function() {
		$("#messageDiv").fadeIn();
	});
}

$(function() {
	$("#messageDiv").hide();
	getJobs();

	$("#cancelButton").on("click", handleCancelClick);
	$("#submitButton").on("click", handleSubmitClick);
	$("#backLink").on("click", function(){location.reload()});
});