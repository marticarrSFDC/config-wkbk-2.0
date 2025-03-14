public with sharing class CW_ToolingApi {
	/**
	 * Copyright (c) 2013, Apex Tooling API
	 * All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without modification,
	 *   are permitted provided that the following conditions are met:
	 *
	 * - Redistributions of source code must retain the above copyright notice,
	 *	  this list of conditions and the following disclaimer.
	 * - Redistributions in binary form must reproduce the above copyright notice,
	 *	  this list of conditions and the following disclaimer in the documentation
	 *	  and/or other materials provided with the distribution.
	 * - Neither the name of the Apex Tooling API, inc nor the names of its contributors
	 *	  may be used to endorse or promote products derived from this software without
	 *	  specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
	 *  THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
	 *  OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
	 *  OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
	 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	**/


    // The API version used relates to the types and structures defined here
    private static final String TOOLING_API_URI = '/services/data/v62.0/tooling';

	// Session Id can be resovled automatically depending on constructor used
	@TestVisible private String sessionId;

	public CW_ToolingApi() {
		this.sessionId = UserInfo.getSessionId();
		if(this.sessionId == null) {
			throw new ToolingAPIException('Unable to obtain Session Id');
		} 
	}

	/**
	 * Uses the given Session Id, useful when using the API in a batch context
	 **/
	public CW_ToolingApi(String sessionId) {
		this.sessionId = sessionId;
	}

	    /**
     * Describes all the sobjects via the tooling api.  This is the equivalent of
     * calling //instance/api/tooling/sobjects via the Tooling REST API.
     * @return a ToolingAPI DescribeGlobalResult
     * @throws ToolingAPIException if an an exception was encountered.
     */
    public DescribeGlobalResult describeGlobal() {
        return (DescribeGlobalResult)submitRestCallAndDeserialize('/sobjects', DescribeGlobalResult.class);
    }

	//
	// Private helper methods go here
	//

	/*
	 * Static helper method for the "happy path" of JSON deserialization.
	 * This method should be used for the public methods when the generic JSON deserialize method
	 * may be used. Sends a HTTP GET request.
	 */
	private Object submitRestCallAndDeserialize(String relativeUrl, Type classType){
		return submitRestCallAndDeserialize(relativeUrl, classType, 'GET');
	}

	/*
	 * Static helper method for the "happy path" of JSON deserialization.
	 * This method should be used for the public methods when the generic JSON deserialize method
	 * may be used. Sends a HTTP requested based on method parameter.
	 */
	private Object submitRestCallAndDeserialize(String relativeUrl, Type classType, String method){
		return submitRestCallAndDeserialize(relativeUrl, classType, method, null);
	}		

	/*
	 * Static helper method for the "happy path" of JSON deserialization.
	 * This method should be used for the public methods when the generic JSON deserialize method
	 * may be used. Sends a HTTP requested based on method parameter and data.
	 */
	private Object submitRestCallAndDeserialize(String relativeUrl, Type classType, String method, Object data){
		HttpResponse response = submitRestCall(relativeUrl, method, data);
		String responseBody = response.getBody();
		if(responseBody != null && responseBody.length() > 0) {
			return JSON.deserialize(responseBody,classType);
		}
		return null;
	}

	/**
	 * Helper method for submitting the REST HTTP GET request.
	 * @throws ToolingAPIAuthorizationException if the remote site is not authorized.
	*/
	private HttpResponse submitRestCall(String relativeUrl) {
		return submitRestCall(relativeUrl, 'GET');
	}

	/**
	 * Helper method for submitting the REST request using the given method.
	 * @throws ToolingAPIAuthorizationException if the remote site is not authorized.
	 */
	private HttpResponse submitRestCall(String relativeUrl, String method){
		return submitRestCall(relativeUrl, method, null);
	}

	/**
	 * Helper method for submitting the REST request using the given method and data.
	 * @throws ToolingAPIAuthorizationException if the remote site is not authorized.
	 */
	private HttpResponse submitRestCall(String relativeUrl, String method, Object data){
		Http h = new Http();
		HttpRequest queryReq = new HttpRequest();
		queryReq.setEndpoint('callout:Salesforce_Tooling_API' + TOOLING_API_URI + relativeUrl);
		queryReq.setMethod('GET');
		queryReq.setHeader('Content-Type', 'application/json');
		queryReq.setTimeout(120000);
		if(data != null) {
			if(data instanceof ISerialize) {
				ISerialize dataToserialize = (ISerialize) data;
				JSONGenerator jsonGen = JSON.createGenerator(false);
				jsonGen.writeStartObject();
				dataToserialize.serialize(jsonGen);
				jsonGen.writeEndObject();
				queryReq.setBody(jsonGen.getAsString());
			} else {
				// Standard JSON serializer emits null values, 
				// which are generally not tolerated by Tooling API
				queryReq.setBody(JSON.serialize(data));
			}
		}

		HttpResponse queryRes = null;
		try {
			queryRes = h.send(queryReq);
		} catch(System.CalloutException ce) {
			if (ce.getMessage().containsIgnoreCase('unauthorized endpoint')) {
				throw new ToolingAPIAuthorizationException(ce);
			} else {
				throw ce;
			}
		}

		Integer successCode = 200;
		if(method.equals('POST')) {
			successCode = 201;
		} else if(method.equals('DELETE')) {
			successCode = 204;
		}
		if(queryRes.getStatusCode() != successCode) {
			if(queryRes.getBody().length() > 0) {
				throw new ToolingAPIException((List<ErrorResponse>)JSON.deserialize(queryRes.getBody(), List<ErrorResponse>.class));
			} else {
				throw new ToolingAPIException('Unexpected HTTP Status ' + queryRes.getStatusCode());
			}
		}  
		return queryRes;
	}

	public class ToolingAPIException extends Exception {
		public ToolingAPIException(List<ErrorResponse> errorResponses){
			this(errorResponses[0].errorCode + ' : ' + errorResponses[0].message);
		}
	}

	public class ToolingAPIAuthorizationException extends Exception {}

    public class ErrorResponse{
        public List<String> fields;
        public String errorCode;
        public String message;
    }

    // Interface used to implement custom serialization on SObject based types
    private interface ISerialize {
        void serialize(JSONGenerator generator);
    }

	public class DescribeGlobalResult {
        public String encoding;
        public Integer maxBatchSize;
        public DescribeGlobalSObjectResult[] sobjects;
    }

	public class DescribeGlobalSObjectResult {
		public Boolean activateable;
		public Boolean createable;
		public Boolean custom;
		public Boolean customSetting;
		public Boolean deletable;
		public Boolean deprecatedAndHidden;
		public Boolean feedEnabled;
		public String  keyPrefix;
		public String  label;
		public String  labelPlural;
		public Boolean layoutable;
		public Boolean mergeable;
		public String  name;
		public Boolean queryable;
		public Boolean replicateable;
		public Boolean retrieveable;
		public Boolean searchable;
		public Boolean triggerable;
		public Boolean undeletable;
		public Boolean updateable;
	}
}