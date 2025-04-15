@isTest
private class CW_ToolingApiRestTest {
 
    @IsTest
    static void submitRestCallGivenISerializeDataReturnsSuccess() {
        // ARRANGE
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());

        String relativeUrl = '/relative/url';
        String method = 'GET';
        Object data = new ISerializeData();

        // ACT
        HttpResponse response = CW_ToolingApiRest.submitRestCall(relativeUrl, method, data);

        // ASSERT
        System.assertEquals(200, response.getStatusCode(), 'Status code should be 200 for a successful callout.');
        System.assertEquals('{"success": true}', response.getBody(), 'Response body should match the expected JSON string.');
    }

    @IsTest
    static void submitRestCallGivenDataReturnsSuccess() {
        // ARRANGE
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());

        String relativeUrl = '/relative/url';
        String method = 'GET';
        Object data = new TestData();

        // ACT
        HttpResponse response = CW_ToolingApiRest.submitRestCall(relativeUrl, method, data);

        // ASSERT
        System.assertEquals(200, response.getStatusCode(), 'Status code should be 200 for a successful callout.');
        System.assertEquals('{"success": true}', response.getBody(), 'Response body should match the expected JSON string.');
    }

    @IsTest
    static void submitRestCallGivenCalloutErrorThrowsException() {
        // ARRANGE
        Test.setMock(HttpCalloutMock.class, new ToolingApiMockError());

        String relativeUrl = '/relative/url';
        String method = 'GET';
        Object data = new TestData();

        // ACT
        try {
            CW_ToolingApiRest.submitRestCall(relativeUrl, method, data);
            System.assert(false, 'Expected an exception');
        } catch (Exception e) {
            // ASSERT
            System.assertEquals('Invalid query', e.getMessage(), 'Exception message should match the error message in the mock response.');
        }
    }

    /**
     * @description Test data class for unit tests
     */
    class ISerializeData implements CW_ToolingApiRest.ISerialize {
        /**
         * @description Serializes the data to JSON format
         * @param jsonGen The JSON generator to use for serialization
         */
        public void serialize(JSONGenerator jsonGen) {
            jsonGen.writeStringField('key', 'value');
        }
    }

    /**
     * @description Test data class for unit tests
     */
    class TestData {}

    /**
     * @description Mock HTTP response generator for the unit tests
     */ 
    class ToolingApiMock implements HttpCalloutMock {
        /**
         * @description Responds to the HTTP request
         * @param request The HTTP request that is sent to the Tooling API
         * @return HTTPResponse The HTTP response for the Tooling API request
         */
        public HttpResponse respond(HttpRequest request) {
            HttpResponse response = new HttpResponse();
            response.setHeader('Content-Type', 'application/json');
            response.setBody('{"success": true}');
            response.setStatusCode(200);
            return response;
        }
    }

    /**
     * @description Mock class for the Tooling API service
     */
    class ToolingApiMockError implements HttpCalloutMock {
        /**
         * @description Responds to the HTTP request
         * @param request The HTTP request that is sent to the Tooling API
         * @return HTTPResponse The HTTP response for the Tooling API request
         */
        public HttpResponse respond(HttpRequest request) {
            HttpResponse response = new HttpResponse();
            response.setHeader('Content-Type', 'application/json');
            response.setBody('{"errorCode":"BAD_REQUEST","message":"Invalid query"}');
            response.setStatusCode(401);
            return response;
        }
    }
}