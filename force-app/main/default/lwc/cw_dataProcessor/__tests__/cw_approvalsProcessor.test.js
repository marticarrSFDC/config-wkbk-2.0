import { ApprovalsProcessor } from '../processors/approvalsProcessor.js';

import getApprovalProcesses from "@salesforce/apex/CW_ToolingApiService.getApprovalProcesses";

const APPROVALS_MOCK = require('./data/approvals.json');

jest.mock(
	'@salesforce/apex/CW_ToolingApiService.getApprovalProcesses',
	() => ({
		__esModule: true,
		default: jest.fn()
	}),
	{ virtual: true }
);

describe('approvals-processor', () => {
	afterEach(() => {
        jest.clearAllMocks();      // clears call history
        jest.resetAllMocks();      // resets .mockResolvedValue, .mockRejectedValue, etc.
    });

	it('constructor', () => {
        const processor = new ApprovalsProcessor();
        expect(processor).toBeInstanceOf(ApprovalsProcessor);
		expect(processor.HEADER_1).toEqual(['Approval Processes', '', '', '']);
		expect(processor.HEADER_2).toEqual(['Object Name', 'Name', 'Order', 'Description']);
    });
	
	it('buildTable - process successful responses', async () => {
		// Arrange
		const processor = new ApprovalsProcessor();
		getApprovalProcesses.mockResolvedValue(JSON.stringify(APPROVALS_MOCK));
		
		// Act
		const table = await processor.buildTable();

		// Assert
		expect(getApprovalProcesses).toHaveBeenCalled();
		expect(table).not.toBeNull();
		expect(table.length).toBe(5);
		expect(table[0].length).toBe(4);
		expect(table[0]).toEqual(['Approval Processes', '', '', '']);
		expect(table[1]).toEqual(['Object Name', 'Name', 'Order', 'Description']);
		expect(table[2]).toEqual(['Knowledge__kav', 'Knowledge Approval', 1, 'What: Approval Process for Knowledge Articles.']);
		expect(table[3]).toEqual(['cgcloud__User_Document__c', 'Daily Report Approval Direct', 1, null]);
		expect(table[4]).toEqual(['cgcloud__User_Document__c', 'User Document Approval', 2, null]);
	});

	it('buildTable - getApprovalProcesses failure', async () => {
		// Arrange
		const processor = new ApprovalsProcessor();
		getApprovalProcesses.mockRejectedValue('error');

		// Act
		let table = null;
		try {
			table = await processor.buildTable();
		} catch (e) {
			// Assert
			expect(getApprovalProcesses).toHaveBeenCalled();
			expect(table).toBeNull();
			expect(e.message).toBe('Error retrieving metadata: error');
		}
	});
});