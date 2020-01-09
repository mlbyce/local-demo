const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  const db = new AWS.DynamoDB.DocumentClient();
  let promiseArray = [];

  for (let i = 0; i < 10; i++) {
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: `X${i}X`,
        title: `Item #${i}#`,
        content: 'Some Bogus Content',
        funk: 'Funk Data'
      },
      ConditionExpression: 'attribute_not_exists(id)',
      ReturnConsumedCapacity: 'TOTAL'
    };
    const p = db.put(params)
      .promise()
      .then(() => {
        console.log(`Writing item ${i} to the DB`);
      })
      .catch((error) => {
        console.log('Some Badness');
        console.log(error.message);
      });

    promiseArray.push(p);
  }

  try {
    await Promise.all(promiseArray);
    console.log('Real Success');
  }
  catch (error) {
    console.log(error);
  }

  return "Success";
};
