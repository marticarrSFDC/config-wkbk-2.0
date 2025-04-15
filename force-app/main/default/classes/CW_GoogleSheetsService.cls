/**
 * @description Service class for Google Sheets landing page
**/
public with sharing class CW_GoogleSheetsService {
    /**
	 * @description Create a new Google Spreadsheet
     * @param jsonString The JSON string to use for the request body
	 * @return The response from the Google Sheets API
     * @throws CalloutException if the callout fails
	 **/
    @AuraEnabled(cacheable=false)
    public static String createGoogleSpreadsheet(String jsonString) {
        return createSpreadsheetCallout(jsonString);
    }
    
    static String createSpreadsheetCallout(String jsonString) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Google_Sheets_API/v4/spreadsheets/');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setBody(jsonString);

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else {
            throw new CalloutException('Failed to create Google Sheet. Response: ' + res.getBody());
        }
    }

    /**
	 * @description Uses the given Session Id, useful when using the API in a batch context
     * @param spreadsheetId The Spreadsheet Id to use
     * @param sheetName The name of the sheet to update
     * @param jsonString The JSON string to use for the request body
     * @return The response from the Google Sheets API
     * @throws CalloutException if the callout fails
	 **/
    @AuraEnabled(cacheable=false)
    public static String populateSheetCallout(String spreadsheetId, String sheetName, String jsonString) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Google_Sheets_API/v4/spreadsheets/' + spreadsheetId + ':batchUpdate');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setBody(jsonString);

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else {
            throw new CalloutException('Failed to update Google Sheet. Response: ' + res.getBody());
        }
    }
}