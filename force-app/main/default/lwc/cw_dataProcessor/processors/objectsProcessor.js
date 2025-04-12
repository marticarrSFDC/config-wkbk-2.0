import getSObjects from "@salesforce/apex/CW_ToolingApiService.getSObjects";
import query from "@salesforce/apex/CW_ToolingApiService.query";

const ENTITY_QUERY = 'SELECT+DeploymentStatus,Description,ExternalSharingModel,InternalSharingModel,QualifiedApiName+FROM+EntityDefinition+WHERE+IsLayoutable=true';
const HEADER_1 = ['', '', '', '', '', 'Organization-Wide Defaults', '', '', ''];
const HEADER_2 = ['Object Label', 'API Name', 'Type', 'Key Prefix', 'In Use?', 'Internal', 'External', 'Description', 'Deployment Status'];

class ObjectsProcessor {
	_formatObjectType(sobject) {
		if(sobject.customSetting) {
			return 'Custom Setting';
		} else if (sobject.custom) {
			return 'Custom';
		}
		return 'Standard';
	}
	
	_processSObjectData(metadata) {
		const sobjects = JSON.parse(metadata).sobjects;
	
		let data = new Map();
		sobjects.forEach((sobject) => {
			if(sobject.layoutable) {
				const apiName = sobject.name;
				data.set(apiName, {
					label: sobject.label,
					type: this._formatObjectType(sobject),
					keyPrefix: sobject.keyPrefix
				});
			}
		});
		return data;
	}
	
	_processEntityData(metadata) {
		const entities = JSON.parse(metadata).records;
	
		let data = new Map();
		entities.forEach((entity) => {
			const apiName = entity.QualifiedApiName;
			data.set(apiName, {
				deploymentStatus: entity.DeploymentStatus, 
				description: entity.Description, 
				externalSharingModel: entity.ExternalSharingModel, 
				internalSharingModel: entity.InternalSharingModel
			});
		});
		return data;
	}

	_populateAllObjectSheet() {
			return Promise.allSettled([getSObjects(), query({query: ENTITY_QUERY})])
				.then(results => {
					const [sobjects, entities] = results;
					if (sobjects.status === 'fulfilled' && entities.status === 'fulfilled') {
						return {
							sobjectMetadata: sobjects.value, 
							entityMetadata: entities.value
						};
					}
					
					throw new Error('Error retrieving metadata: ' + (sobjects.reason || entities.reason));
				});
		}
	
	
	async buildTable() {
		const metadata = await this._populateAllObjectSheet();
		const sobjects = this._processSObjectData(metadata.sobjectMetadata);
		const entities = this._processEntityData(metadata.entityMetadata);
		const apiNames = Array.from(sobjects.keys());
		apiNames.sort();
	
		let data = [HEADER_1, HEADER_2];
		apiNames.forEach((apiName) => {
			const sobject = sobjects.get(apiName);
			const entity = entities.get(apiName);
			const objectLabel = sobject.label;
			const type = sobject.type;
			const keyPrefix = sobject.keyPrefix;
			const inUse = '';
			const internal = entity.internalSharingModel;
			const external = entity.externalSharingModel;
			const description = entity.description || '';
			const deploymentStatus = entity.deploymentStatus || '';
			data.push([objectLabel, apiName, type, keyPrefix, inUse, internal, external, description, deploymentStatus]);
		});
		return data;
	}
}

export {
	ObjectsProcessor
}