package com.ebsmith.apply.resource;

import java.io.IOException;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import com.ebsmith.apply.model.Application;
import com.ebsmith.apply.model.ResponseApplication;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.json.JSONConfiguration;


@Path("/apply")
public class ApplyResource {
	
	private static final String SPIDA_BASE_URL = "https://www.spidasoftware.com/apply";
	private static final String PATH_JOBS = "/jobs";
	private static final String PATH_APPLICATIONS = "/applications";
	
	@GET
	@Produces("application/json")
	@Path("/getJobs")
	public String getJobs() {
		return this.doRestServiceCall(PATH_JOBS);
	}
	
	@POST
	@Consumes("application/json")
	@Produces("application/json")
	@Path("/submitApplication")
	public ResponseApplication submitApplication(Application pApplication) {
		this.log("Entering submitApplication");
		ResponseApplication anApplication = this.doPostRestServiceCall(PATH_APPLICATIONS, pApplication);
		
		if (null == anApplication) {
			this.log("Returning null application.");
		}
		
		return anApplication;
	}
	
	@GET
	@Produces("application/json")
	@Path("/getApplication")
	public ResponseApplication getApplication(@QueryParam("applicationId") String pApplicationId) {
		String responseStr = this.doRestServiceCall(PATH_APPLICATIONS + "/" + pApplicationId);
		
		ObjectMapper aMap = new ObjectMapper();
		ResponseApplication anApplication = null;
		try {
			anApplication = aMap.readValue(responseStr, ResponseApplication.class);
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return anApplication;
	}

	private String doRestServiceCall(String pPath) {
		this.log("Calling spida rest service at path=" + pPath);
		String response = null;
		try {
			
			Client client = Client.create();
			WebResource resource = client.resource(SPIDA_BASE_URL + pPath);
			response = resource.accept(MediaType.APPLICATION_JSON).get(String.class);
			
		} catch (Exception ex) {
			this.log("Error during call to spida rest service. message=" + ex.getMessage());
			ex.printStackTrace();
		}
		
		return response;
	}
	
	private ResponseApplication doPostRestServiceCall(String pPath, Application pApplication) {
		this.log("Calling post spida rest service at path=" + pPath);
		ResponseApplication responseApp = null;
		try {
			
			ClientConfig clientConfig = new DefaultClientConfig();
			clientConfig.getFeatures().put(JSONConfiguration.FEATURE_POJO_MAPPING, Boolean.TRUE);
			Client client = Client.create(clientConfig);
			WebResource resource = client.resource(SPIDA_BASE_URL + pPath);
			ClientResponse clientResponse = resource.type(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON).post(ClientResponse.class, pApplication);
			responseApp = clientResponse.getEntity(ResponseApplication.class);

		} catch (Exception ex) {
			this.log("Error during call to spida rest service. message=" + ex.getMessage());
			ex.printStackTrace();
		}
		
		return responseApp;
	}
	
	private void log(String pMessage) {
		//TODO: remove System out println
		System.out.println("ApplyService: " + pMessage);
	}
}
