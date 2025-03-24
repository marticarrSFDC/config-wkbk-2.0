/**
 * @description Service provider to make Tooling API call from LWC
 **/
public with sharing class CW_ToolingApiService {
    /**
	 * @description Get requested metadata
     * @return JSON string of the metadata
	 **/
    @AuraEnabled(cacheable=false)
    public static String getMetadataCallout() {
        CW_ToolingApi tooling = new CW_ToolingApi();
        return JSON.serialize(tooling.describeGlobal());
    }
}