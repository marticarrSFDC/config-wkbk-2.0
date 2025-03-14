public with sharing class CW_ToolingApiService {
    @AuraEnabled(cacheable=false)
    public static String getMetadataCallout() {
        CW_ToolingApi tooling = new CW_ToolingApi();
        return JSON.serialize(tooling.describeGlobal());
    }
}