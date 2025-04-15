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
        System.assertEquals(200, response.getStatusCode());
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
        System.assertEquals(200, response.getStatusCode());
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
            System.assertEquals('Bad Request: Invalid query', e.getMessage(), 'Exception message should match the error message in the mock response.');
        }
    }

    /**
     * @description Test data class for unit tests
     */
    class ISerializeData implements CW_ToolingApiRest.ISerialize {
        public void serialize(JSONGenerator jsonGen) {
            jsonGen.writeStringField('key', 'value');
        }
    }

    /**
     * @description Test data class for unit tests
     */
    class TestData {
        // No implementation needed for this invalid data
    }

    /**
     * @description Mock HTTP response generator for the unit tests
     */ 
    class ToolingApiMock implements HttpCalloutMock {
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
        public HttpResponse respond(HttpRequest request) {
            HttpResponse response = new HttpResponse();
            response.setHeader('Content-Type', 'application/json');
            response.setBody('{"message":"Bad Request: Invalid query"}');
            response.setStatusCode(401);
            return response;
        }
    }
}