
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'hrushka',
  applicationName: 'covidsource',
  appUid: 'jqF5fBPkt5FQNmMybf',
  orgUid: 'xFpZQYxKYnn10L7Jq9',
  deploymentUid: '770618a9-166a-43a7-a060-196d1ae0e816',
  serviceName: 'covidsource',
  shouldLogMeta: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '3.6.6',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'covidsource-dev-ingest_nyt_county', timeout: 30 };

try {
  const userHandler = require('./handler_data.js');
  module.exports.handler = serverlessSDK.handler(userHandler.ingest_nyt_county, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}