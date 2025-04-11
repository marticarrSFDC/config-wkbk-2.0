public with sharing class CW_GoogleSheetsService {
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