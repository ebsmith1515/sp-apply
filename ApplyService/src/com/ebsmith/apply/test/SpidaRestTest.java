package com.ebsmith.apply.test;

import org.junit.Assert;
import org.junit.Test;

import com.ebsmith.apply.model.Application;
import com.ebsmith.apply.model.ResponseApplication;
import com.ebsmith.apply.resource.ApplyResource;

public class SpidaRestTest {

	@Test
	public void testGetJobs() {
		ApplyResource aResource = new ApplyResource();
		String jobsJson = aResource.getJobs();
		Assert.assertNotNull(jobsJson);
		Assert.assertTrue(jobsJson.length() > 0);
	}
	
	@Test
	public void testSubmitAndGetApplication() {
		ApplyResource aResource = new ApplyResource();
		Application anApplication = new Application();
		anApplication.setJobId("5258454d3c32a9e7b1000001");
		anApplication.setCode("test54321");
		anApplication.setJustification("test");
		anApplication.setName("testName");
		anApplication.setAdditionalLinks(new String[0]);
		ResponseApplication responseFromSubmit = aResource.submitApplication(anApplication);
		Assert.assertNotNull(responseFromSubmit);
		Assert.assertEquals(responseFromSubmit.getJobId(), "5258454d3c32a9e7b1000001");
		Assert.assertEquals(responseFromSubmit.getCode(), "test54321");
		Assert.assertEquals(responseFromSubmit.getName(), "testName");
		
		Application responseFromGet = aResource.getApplication(responseFromSubmit.get_id());
		Assert.assertNotNull(responseFromGet);
		Assert.assertEquals(responseFromGet.getJobId(), responseFromSubmit.getJobId());
		Assert.assertEquals(responseFromGet.getName(), responseFromSubmit.getName());
	}

}
