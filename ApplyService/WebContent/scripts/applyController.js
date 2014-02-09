/**
 *
 */
var URLs = {
	jobs: "/ApplyService/rest/apply/getJobs",
	submitApplication: "/ApplyService/rest/apply/submitApplication"
};

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

	$("#applicationForm")[0].reset();

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

function handleBackToAppClick(event) {
	$("#messageDiv").fadeOut(null, function(){
		$("#applicationDiv").fadeIn();
	});
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

function validateApplication(pApplication) {
	var message = "";

	if (isStrNullOrBlank(pApplication.name)) {
		message += "<br>name is required";
	}

	if (isStrNullOrBlank(pApplication.justification)) {
		message += "<br>justification is required";
	}

	if (isStrNullOrBlank(pApplication.code)) {
		message += "<br>code is required";
	}

	if (isStrNullOrBlank(pApplication.jobId)) {
		message += "<br>could not identify job for application. please try again.";
	}

	if ("" != message) {
		showMessageDiv("we could not submit your application for the following reasons:<br>" + message);
	}
	return "" == message;
}

function isStrNullOrBlank(pString) {
	return (null == pString) || ("" == pString);
}

function submitApplication(pApplication) {
	if (validateApplication(pApplication)) {
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
				if (null == data) {
					showMessageDiv("error occured. you may need to try again.");
				} else if (null == data._id) {
					showMessageDiv("error occured. you may need to try again.");
				} else if (data._id == "") {
					showMessageDiv("error occured. you may need to try again.");
				} else {
					showMessageDiv("application submitted! (" + data._id + ")");
					$("#backToApplicationLink").hide();
				}
			},
			failure: function() {
				showMessageDiv("error occured. you may need to try again.");
			}
		});
	}
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
	$("#backLink").on("click", function(){location.reload();});
	$("#backToApplicationLink").on("click", handleBackToAppClick);
});