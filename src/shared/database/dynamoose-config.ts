import 'dotenv/config';
import * as dynamoose from 'dynamoose';

const ddb = new dynamoose.aws.ddb.DynamoDB({
  region: 'us-east-1',
});

if (process.env.STAGE == 'local') {
  dynamoose.aws.ddb.local();
} else {
  dynamoose.aws.ddb.set(ddb);
}

export default dynamoose;
