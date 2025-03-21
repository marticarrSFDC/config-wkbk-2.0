@IsTest
public class CW_ToolingApiTest {
    @IsTest
    static void constructor_setUserSessionId() {
        // ACT
        Test.startTest();
        CW_ToolingApi toolingApi = new CW_ToolingApi();
        Test.stopTest();

        // ASSERT
        System.assertEquals(UserInfo.getSessionId(), toolingApi.sessionId, 'Should set sessionId to current user\'s context.');
	}

	@IsTest
    static void constructor_givenSessionId_setSame() {
        // ACT
        Test.startTest();
        CW_ToolingApi toolingApi = new CW_ToolingApi('SESSION_ID');
        Test.stopTest();

        // ASSERT
        System.assertEquals('SESSION_ID', toolingApi.sessionId, 'Should set sessionId to given value.');
    }

    @IsTest
    static void describeGlobal_givenSuccessfulCallout_returnDescribeGlobalResult() {
        // ARRANGE
        Test.setMock(HttpCalloutMock.class, new ToolingApiMock());
        CW_ToolingApi toolingApi = new CW_ToolingApi();

        // ACT
        Test.startTest();
        CW_ToolingApiObjects.DescribeGlobalResult describeGlobalResult = toolingApi.describeGlobal();
        Test.stopTest();

        // ASSERT
        System.assertNotEquals(null, describeGlobalResult, 'Response should not be null for a successful callout.');
    }

    @IsTest
    static void describeGlobal_givenUnsuccessfulCallout_throwException() {
        // ARRANGE
        Test.setMock(HttpCalloutMock.class, new ToolingApiMockError());
        CW_ToolingApi toolingApi = new CW_ToolingApi();

        // ACT
        try {
            Test.startTest();
            CW_ToolingApiObjects.DescribeGlobalResult describeGlobalResult = toolingApi.describeGlobal();
            Test.stopTest();
            System.assert(false, 'Exception should have been thrown for an unsuccessful callout.');
        } catch (CW_ToolingApiRest.ToolingAPIException e) {
            // ASSERT
            System.assertEquals('ERROR_MESSAGE : Something went wrong', e.getMessage(), 'Exception message should match the error message in the mock response.');
        }
    }

    private class ToolingApiMock implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            Map<String, Object> resBody = new Map<String, Object>();
            if((req.getEndpoint()).contains('/sobjects')) {
                resBody.put('response_x', new CW_ToolingApiObjects.DescribeGlobalResult());
			}
            res.setStatusCode(200);
            res.setHeader('Content-Type', 'application/json');
            res.setBody(JSON.serialize(resBody));
            return res;
        }
    }

    private class ToolingApiMockError implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            // Create a dummy error response
            HttpResponse res = new HttpResponse();
            res.setStatusCode(400);
            res.setHeader('Content-Type', 'application/json');
            res.setBody('[{"errorCode":"ERROR_MESSAGE", "message":"Something went wrong"}]');
            return res;
        }
    }
}