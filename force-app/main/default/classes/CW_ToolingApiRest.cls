/**
* @description Wrapper class for Tooling API REST requests
*/
public with sharing class CW_ToolingApiRest {
	/**
	 * @description Submits the REST HTTP GET request.
	 * @param relativeUrl The relative URL to append to the Tooling API base URL
	 * @return HttpResponse
	 * @throws ToolingAPIAuthorizationException if the remote site is not authorized.
	*/
	public static HttpResponse submitRestCall(String relativeUrl) {
		return submitRestCall(relativeUrl, 'GET');
	}

	/**
     * @description Submits the REST request using the given method.
	 * @param relativeUrl The relative URL to append to the Tooling API base URL
	 * @param method The HTTP method to use
     * @return HttpResponse
     * @throws ToolingAPIAuthorizationException if the remote site is not authorized.
     */
	public static HttpResponse submitRestCall(String relativeUrl, String method){
		return submitRestCall(relativeUrl, method, null);
	}

	/**
	 * @description Submits the REST request using the given method and data.
	 * @param relativeUrl The relative URL to append to the Tooling API base URL
	 * @param method The HTTP method to use
	 * @param data The data to send in the request body
     * @return HttpResponse
	 * @throws ToolingAPIAuthorizationException if the remote site is not authorized.
	 */
	public static HttpResponse submitRestCall(String relativeUrl, String method, Object data){
		HttpRequest queryReq = new HttpRequest();
		queryReq.setEndpoint('callout:Salesforce_Tooling_API' + relativeUrl);
		queryReq.setMethod('GET');
		queryReq.setHeader('Content-Type', 'application/json');
		queryReq.setTimeout(120000);
		queryReq = handleSerialize(queryReq, data);

		return handleSend(method, queryReq);
	}

	private static HttpRequest handleSerialize(HttpRequest queryReq, Object data) {
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
		return queryReq;
	}

	private static HttpResponse handleSend(String method, HttpRequest queryReq) {
		HttpResponse queryRes = null;
		Http h = new Http();
		try {
			queryRes = h.send(queryReq);
		} catch(System.CalloutException ce) {
			if (ce.getMessage().containsIgnoreCase('unauthorized endpoint')) {
				throw new ToolingAPIAuthorizationException(ce);
			} else {
				throw ce;
			}
		}
		return handleResponseStatus(method, queryRes);
	}

	private static HttpResponse handleResponseStatus(String method, HttpResponse queryRes) {
		if(queryRes.getStatusCode() != getSuccessCode(method)) {
			if(queryRes.getBody().length() > 0) {
				throw new ToolingAPIException((List<ErrorResponse>)JSON.deserialize(queryRes.getBody(), List<ErrorResponse>.class));
			} else {
				throw new ToolingAPIException('Unexpected HTTP Status ' + queryRes.getStatusCode());
			}
		}
		return queryRes;
	}

	private static Integer getSuccessCode(String method) {
		Integer successCode = 200;
		if(method.equals('POST')) {
			successCode = 201;
		} else if(method.equals('DELETE')) {
			successCode = 204;
		}
		return successCode;
	}

    /**
	 * @description Interface for serializing data to JSON
	 */
	private interface ISerialize {
		/**
		 * @description Serializes data to JSON
		 * @param generator The JSON generator to use
		 */
        void serialize(JSONGenerator generator);
    }

	/**
	* @description Exception class for Tooling API REST requests
	*/
	public class ToolingAPIException extends Exception {
		/**
		* @description Constructor override
		* @param errorResponses The error responses from the Tooling API
		*/
		public ToolingAPIException(List<ErrorResponse> errorResponses){
			this(errorResponses[0].errorCode + ' : ' + errorResponses[0].message);
		}
	}

	/**
	* @description Exception class for Tooling API REST requests
	*/
	public class ToolingAPIAuthorizationException extends Exception {}

    /**
	* @description Wrapper class for Tooling API errors
	*/
	public class ErrorResponse{
        public List<String> fields;
        public String errorCode;
        public String message;
    }
}