public with sharing class CW_ToolingApiRest {
    public static final String TOOLING_API_URI = '/services/data/v62.0/tooling';
    /**
	 * Submits the REST HTTP GET request.
	 * @throws ToolingAPIAuthorizationException if the remote site is not authorized.
	*/
	public static HttpResponse submitRestCall(String relativeUrl) {
		return submitRestCall(relativeUrl, 'GET');
	}

	/**
	 * Submits the REST request using the given method.
	 * @throws ToolingAPIAuthorizationException if the remote site is not authorized.
	 */
	public static HttpResponse submitRestCall(String relativeUrl, String method){
		return submitRestCall(relativeUrl, method, null);
	}

	/**
	 * Submits the REST request using the given method and data.
	 * @throws ToolingAPIAuthorizationException if the remote site is not authorized.
	 */
	public static HttpResponse submitRestCall(String relativeUrl, String method, Object data){
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

    /**
	 * Interface used to implement custom serialization on SObject based types
	 */
    private interface ISerialize {
        void serialize(JSONGenerator generator);
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
}