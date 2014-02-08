package com.ebsmith.apply.model;


public class Application {

	private String jobId;
	private String name;
	private String justification;
	private String code;
	private String[] additionalLinks;

	public String getJobId() {
		return jobId;
	}
	
	public void setJobId(String jobId) {
		this.jobId = jobId;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getJustification() {
		return justification;
	}
	
	public void setJustification(String justification) {
		this.justification = justification;
	}
	
	public String getCode() {
		return code;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public String[] getAdditionalLinks() {
		return additionalLinks;
	}
	
	public void setAdditionalLinks(String[] additionalLinks) {
		this.additionalLinks = additionalLinks;
	} 
}
