import { LimitsProcessor } from '../processors/limitsProcessor.js';

import getOrgLimits from "@salesforce/apex/CW_ToolingApiService.getOrgLimits";

const LIMITS_MOCK = require('./data/limits.json');

jest.mock(
	'@salesforce/apex/CW_ToolingApiService.getOrgLimits',
	() => ({
		__esModule: true,
		default: jest.fn()
	}),
	{ virtual: true }
);

describe('limit-processor', () => {
	afterEach(() => {
        jest.clearAllMocks();      // clears call history
        jest.resetAllMocks();      // resets .mockResolvedValue, .mockRejectedValue, etc.
    });
	
	it('buildTable - process successful responses', async () => {
		// Arrange
		const processor = new LimitsProcessor();
		getOrgLimits.mockResolvedValue(JSON.stringify(LIMITS_MOCK));
		
		// Act
		const table = await processor.buildTable();

		// Assert
		expect(getOrgLimits).toHaveBeenCalled();
		expect(table).not.toBeNull();
		expect(table.length).toBe(5);
		expect(table[0].length).toBe(4);
		expect(table[0]).toEqual(['Org Health', '', '', '']);
		expect(table[1]).toEqual(['Limit', '% Used', 'Remaining', 'Maximum']);
		expect(table[2]).toEqual(['ActiveScratchOrgs', .5, 5, 10]);
		expect(table[3]).toEqual(['AnalyticsExternalDataSizeMB', 0, 40960, 40960]);
		expect(table[4]).toEqual(['CdpAiInferenceApiMonthlyLimit', 0, 0, 0]);
	});

	it('buildTable - getOrgLimits failure', async () => {
		// Arrange
		const processor = new LimitsProcessor();
		getOrgLimits.mockRejectedValue('error');

		// Act
		let table = null;
		try {
			table = await processor.buildTable();
		} catch (e) {
			// Assert
			expect(getOrgLimits).toHaveBeenCalled();
			expect(table).toBeNull();
			expect(e.message).toBe('Error retrieving metadata: error');
		}
	});
});