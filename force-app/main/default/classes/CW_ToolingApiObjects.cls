public with sharing class CW_ToolingApiObjects {
    public class DescribeGlobalResult {
        public String encoding;
        public Integer maxBatchSize;
        public DescribeGlobalSObjectResult[] sobjects;
    }

	public class DescribeGlobalSObjectResult {
		public Boolean activateable;
		public Boolean createable;
		public Boolean custom;
		public Boolean customSetting;
		public Boolean deletable;
		public Boolean deprecatedAndHidden;
		public Boolean feedEnabled;
		public String  keyPrefix;
		public String  label;
		public String  labelPlural;
		public Boolean layoutable;
		public Boolean mergeable;
		public String  name;
		public Boolean queryable;
		public Boolean replicateable;
		public Boolean retrieveable;
		public Boolean searchable;
		public Boolean triggerable;
		public Boolean undeletable;
		public Boolean updateable;
	}
}