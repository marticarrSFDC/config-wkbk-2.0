@IsTest
public class CW_ToolingApiTest {
    @IsTest
    static void constructorSetUserSessionId() {
        // ACT
        Test.startTest();
        CW_ToolingApi toolingApi = new CW_ToolingApi();
        Test.stopTest();

        // ASSERT
        System.assertEquals(UserInfo.getSessionId(), toolingApi.sessionId, 'Should set sessionId to current user\'s context.');
	}

	@IsTest
    static void constructorGivenSessionIdSetsSame() {
        // ACT
        Test.startTest();
        CW_ToolingApi toolingApi = new CW_ToolingApi('SESSION_ID');
        Test.stopTest();

        // ASSERT
        System.assertEquals('SESSION_ID', toolingApi.sessionId, 'Should set sessionId to given value.');
    }

    @IsTest
    static void retrieveSObjectsGivenSuccessfulCalloutReturnsResponseBody() {
        // ARRANGE
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        CW_ToolingApi toolingApi = new CW_ToolingApi();

        // ACT
        Test.startTest();
        String result = toolingApi.retrieveSObjects();
        Test.stopTest();

        // ASSERT
        System.assertNotEquals(null, result, 'Response should not be null for a successful callout.');
    }

    @IsTest
    static void retrieveSObjectsGivenUnsuccessfulCalloutThrowsException() {
        // ARRANGE
        Test.setMock(HttpCalloutMock.class, new ToolingApiMockError());
        CW_ToolingApi toolingApi = new CW_ToolingApi();

        // ACT
        try {
            Test.startTest();
            toolingApi.retrieveSObjects();
            Test.stopTest();
            System.assert(false, 'Exception should have been thrown for an unsuccessful callout.');
        } catch (CW_ToolingApiRest.ToolingAPIException e) {
            // ASSERT
            System.assertEquals('Something went wrong', e.getMessage(), 'Exception message should match the error message in the mock response.');
        }
    }

    @IsTest
    static void retrieveOrgLimitsGivenSuccessfulCalloutReturnsResponseBody() {
        // ARRANGE
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        CW_ToolingApi toolingApi = new CW_ToolingApi();

        // ACT
        Test.startTest();
        String result = toolingApi.retrieveOrgLimits();
        Test.stopTest();

        // ASSERT
        System.assertNotEquals(null, result, 'Response should not be null for a successful callout.');
    }

    @IsTest
    static void retrieveOrgLimitsGivenUnsuccessfulCalloutThrowsException() {
        // ARRANGE
        Test.setMock(HttpCalloutMock.class, new ToolingApiMockError());
        CW_ToolingApi toolingApi = new CW_ToolingApi();

        // ACT
        try {
            Test.startTest();
            toolingApi.retrieveOrgLimits();
            Test.stopTest();
            System.assert(false, 'Exception should have been thrown for an unsuccessful callout.');
        } catch (CW_ToolingApiRest.ToolingAPIException e) {
            // ASSERT
            System.assertEquals('Something went wrong', e.getMessage(), 'Exception message should match the error message in the mock response.');
        }
    }

    @IsTest
    static void queryGivenSuccessfulCalloutReturnsResponseBody() {
        // ARRANGE
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        CW_ToolingApi toolingApi = new CW_ToolingApi();

        // ACT
        Test.startTest();
        String result = toolingApi.query('SELECT+DeploymentStatus,Description,ExternalSharingModel,InternalSharingModel,QualifiedApiName+FROM+EntityDefinition+WHERE+IsLayoutable=true');
        Test.stopTest();

        // ASSERT
        System.assertNotEquals(null, result, 'Response should not be null for a successful callout.');
    }

    @IsTest
    static void queryGivenUnsuccessfulCalloutThrowsException() {
        // ARRANGE
        Test.setMock(HttpCalloutMock.class, new ToolingApiMockError());
        CW_ToolingApi toolingApi = new CW_ToolingApi();

        // ACT
        try {
            Test.startTest();
            toolingApi.query('SELECT+DeploymentStatus,Description,ExternalSharingModel,InternalSharingModel,QualifiedApiName+FROM+EntityDefinition+WHERE+IsLayoutable=true');
            Test.stopTest();
            System.assert(false, 'Exception should have been thrown for an unsuccessful callout.');
        } catch (CW_ToolingApiRest.ToolingAPIException e) {
            // ASSERT
            System.assertEquals('Something went wrong', e.getMessage(), 'Exception message should match the error message in the mock response.');
        }
    }

    // Test data for the unit tests
    private class TestData implements CW_ToolingApiRest.ISerialize {
        /**
         * @description Serializes the object to JSON format
         * @param jsonGen The JSON generator used for serialization
         */
        public void serialize(JSONGenerator jsonGen) {
            jsonGen.writeStringField('key', 'value');
        }
    }

    private class InvalidData {
        // No implementation needed for this invalid data
    }

    /**
     * @description Mock class for the Tooling API service
     */
    private class ToolingApiMock implements HttpCalloutMock {
        /**
         * @description Responds to the HTTP request
         * @param req The HTTP request that is sent to the Tooling API
         * @return HTTPResponse The HTTP response for the Tooling API request
         */
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            Map<String, Object> resBody = new Map<String, Object>();
            resBody.put('response_x', 'response');
            res.setStatusCode(200);
            res.setHeader('Content-Type', 'application/json');
            res.setBody(JSON.serialize(resBody));
            return res;
        }
    }

    /**
     * @description Mock class for the Tooling API service
     */
    private class ToolingApiMockError implements HttpCalloutMock {
        /**
         * @description Responds to the HTTP request
         * @param req The HTTP request that is sent to the Tooling API
         * @return HTTPResponse The HTTP response for the Tooling API request
         */
        public HTTPResponse respond(HTTPRequest req) {
            // Create a dummy error response
            HttpResponse res = new HttpResponse();
            res.setStatusCode(400);
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"errorCode":"ERROR_MESSAGE", "message":"Something went wrong"}');
            return res;
        }
    }
}