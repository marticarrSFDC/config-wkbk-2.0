/**
* @description Wrapper class for the Tooling API
*/
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

	@TestVisible private String sessionId;

	/**
	 * @description Uses the current user's Session Id
	 **/
	public CW_ToolingApi() {
		this.sessionId = UserInfo.getSessionId();
		if(this.sessionId == null) {
			throw new CW_ToolingApiRest.ToolingAPIException('Unable to obtain Session Id');
		} 
	}

	/**
	 * @description Uses the given Session Id, useful when using the API in a batch context
	 * @param sessionId The Session Id to use
	 **/
	public CW_ToolingApi(String sessionId) {
		this.sessionId = sessionId;
	}

	/**
     * @description Describes all the sobjects via the tooling api.  This is the equivalent of calling //instance/api/tooling/sobjects via the Tooling REST API.
	 * @param query The SOQL query to execute
	 * @return CW_ToolingApiObjects DescribeGlobalResult
     * @throws ToolingAPIException if an an exception was encountered.
     */
    public String query(String query) {
        return submitRestCallAndDeserialize(CW_Constants.TOOLING_API_URI + '/query?q=' + query);
    }

	/**
     * @description Describes status of org limits via metadata api.  This is the equivalent of calling ///instance/services/v62.0/limits via the Tooling REST API.
	 * @return String responseBody
     * @throws ToolingAPIException if an an exception was encountered.
     */
    public String retrieveOrgLimits() {
        return submitRestCallAndDeserialize(CW_Constants.API_URI + '/limits');
    }

    /**
	 * @description Describes all the approval processes via the metadata api.  This is the equivalent of calling //instance/services/v62.0/process/approvals via the Tooling REST API.
	 * @return String responseBody
	 * @throws ToolingAPIException if an an exception was encountered.
	 */
	public String retrieveApprovalProcesses() {
        return submitRestCallAndDeserialize(CW_Constants.API_URI + '/process/approvals');
    }
	
	/**
     * @description Describes all the sobjects via the metadata api.  This is the equivalent of calling //instance/services/v62.0/sobjects via the Tooling REST API.
	 * @return String responseBody
     * @throws ToolingAPIException if an an exception was encountered.
     */
    public String retrieveSObjects() {
        return submitRestCallAndDeserialize(CW_Constants.API_URI + '/sobjects');
    }

	private String submitRestCallAndDeserialize(String relativeUrl){
		return submitRestCallAndDeserialize(relativeUrl, 'GET');
	}

	private String submitRestCallAndDeserialize(String relativeUrl, String method){
		return submitRestCallAndDeserialize(relativeUrl, method, null);
	}		

	private String submitRestCallAndDeserialize(String relativeUrl, String method, Object data) {
		HttpResponse response = CW_ToolingApiRest.submitRestCall(relativeUrl, method, data);
		return response.getBody();
	}
}