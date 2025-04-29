/**
 * @description Service provider to make Tooling API call from LWC
 **/
public with sharing class CW_ToolingApiService {
    /**
	 * @description Get org limits metadata
     * @return JSON string of the metadata
	 **/
    @AuraEnabled(cacheable=false)
    public static String getOrgLimits() {
        CW_ToolingApi tooling = new CW_ToolingApi();
        return tooling.retrieveOrgLimits();
    }
    
    /**
	 * @description Get sobject metadata
     * @return JSON string of the metadata
	 **/
    @AuraEnabled(cacheable=false)
    public static String getSObjects() {
        CW_ToolingApi tooling = new CW_ToolingApi();
        return tooling.retrieveSObjects();
    }

    /**
	 * @description Query Tooling API metadata
     * @param query The SOQL query to execute
     * @return JSON string of the query result
	 **/
    @AuraEnabled(cacheable=false)
    public static String query(String query) {
        CW_ToolingApi tooling = new CW_ToolingApi();
        return tooling.query(query);
    }
}