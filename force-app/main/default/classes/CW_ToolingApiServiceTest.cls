@isTest
private class CW_ToolingApiServiceTest {
    @IsTest
    static void getOrgLimitsCalloutTest() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new CW_ToolingApiServiceMock());
        String response = CW_ToolingApiService.getOrgLimits();
        Test.stopTest();

        System.assert(String.isNotBlank(response), 'The response should have value');
    }

    @IsTest
    static void getOrgLimitsCalloutNegativeTest() {
        CW_ToolingApiRest.ToolingAPIException ex;
        try {
            Test.startTest();
            Test.setMock(HttpCalloutMock.class, new CW_ToolingApiServiceMockNegative());
            CW_ToolingApiService.getOrgLimits();
            Test.stopTest();
            System.assert(false, 'Exception should have been thrown for an unsuccessful callout.');
        } catch(CW_ToolingApiRest.ToolingAPIException receivedEx) {
            ex = receivedEx;
        }
        
        System.Assert.isTrue(ex != null, 'A CW_ToolingApi.ToolingAPIException should have been thrown');
    }

    @IsTest
    static void getApprovalProcessesCalloutTest() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new CW_ToolingApiServiceMock());
        String response = CW_ToolingApiService.getApprovalProcesses();
        Test.stopTest();

        System.assert(String.isNotBlank(response), 'The response should have value');
    }

    @IsTest
    static void getApprovalProcessesCalloutNegativeTest() {
        CW_ToolingApiRest.ToolingAPIException ex;
        try {
            Test.startTest();
            Test.setMock(HttpCalloutMock.class, new CW_ToolingApiServiceMockNegative());
            CW_ToolingApiService.getApprovalProcesses();
            Test.stopTest();
            System.assert(false, 'Exception should have been thrown for an unsuccessful callout.');
        } catch(CW_ToolingApiRest.ToolingAPIException receivedEx) {
            ex = receivedEx;
        }
        
        System.Assert.isTrue(ex != null, 'A CW_ToolingApi.ToolingAPIException should have been thrown');
    }

    @IsTest
    static void getSObjectsCalloutTest() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new CW_ToolingApiServiceMock());
        String response = CW_ToolingApiService.getSObjects();
        Test.stopTest();

        System.assert(String.isNotBlank(response), 'The response should have value');
    }

    @IsTest
    static void getSObjectsCalloutNegativeTest() {
        CW_ToolingApiRest.ToolingAPIException ex;
        try {
            Test.startTest();
            Test.setMock(HttpCalloutMock.class, new CW_ToolingApiServiceMockNegative());
            CW_ToolingApiService.getSObjects();
            Test.stopTest();
            System.assert(false, 'Exception should have been thrown for an unsuccessful callout.');
        } catch(CW_ToolingApiRest.ToolingAPIException receivedEx) {
            ex = receivedEx;
        }
        
        System.Assert.isTrue(ex != null, 'A CW_ToolingApi.ToolingAPIException should have been thrown');
    }

    static void queryCalloutTest() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new CW_ToolingApiServiceMock());
        String response = CW_ToolingApiService.query('SELECT+DeploymentStatus,Description,ExternalSharingModel,InternalSharingModel,QualifiedApiName+FROM+EntityDefinition+WHERE+IsLayoutable=true');
        Test.stopTest();

        System.assert(String.isNotBlank(response), 'The response should have value');
    }

    @IsTest
    static void queryCalloutNegativeTest() {
        CW_ToolingApiRest.ToolingAPIException ex;
        try {
            Test.startTest();
            Test.setMock(HttpCalloutMock.class, new CW_ToolingApiServiceMockNegative());
            CW_ToolingApiService.query('SELECT+DeploymentStatus,Description,ExternalSharingModel,InternalSharingModel,QualifiedApiName+FROM+EntityDefinition+WHERE+IsLayoutable=true');
            Test.stopTest();
            System.assert(false, 'Exception should have been thrown for an unsuccessful callout.');
        } catch(CW_ToolingApiRest.ToolingAPIException receivedEx) {
            ex = receivedEx;
        }

        System.assertEquals('error', ex.getMessage(), 'Exception message should match the error message in the mock response.');
    }

    /**
     * @description Mock class for the Tooling API service
     */
    private class CW_ToolingApiServiceMock implements HttpCalloutMock {
        /**
         * @description Responds to the HTTP request
         * @param request The HTTP request that is sent to the Tooling API
         * @return HTTPResponse The HTTP response for the Tooling API request
         */
        public HttpResponse respond(HttpRequest request) {
            HttpResponse response = new HttpResponse();
            response.setHeader('Content-Type', 'application/json');
            response.setBody('{"response":"success"}');
            response.setStatusCode(200);
            return response;
        }
    }

    /**
     * @description Mock class for the Tooling API service
     */
    private class CW_ToolingApiServiceMockNegative implements HttpCalloutMock {
        /**
         * @description Responds to the HTTP request
         * @param request The HTTP request that is sent to the Tooling API
         * @return HTTPResponse The HTTP response for the Tooling API request
         */
        public HttpResponse respond(HttpRequest request) {
            HttpResponse response = new HttpResponse();
            response.setHeader('Content-Type', 'application/json');
            response.setBody('{"errorCode":"ERROR_MESSAGE","message":"error"}]');
            response.setStatusCode(500);
            return response;
        }
    }
}