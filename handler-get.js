"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const docClient = new AWS.DynamoDB.DocumentClient();

/**
|--------------------------------------------------
| GET ITEM BY HASH KEY
|--------------------------------------------------
*/
module.exports.get = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
    const response = await docClient
      .get({
        TableName: "test",
        Key: {
          id: id
        }
      })
      .promise();
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, response })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, err })
    };
  }
};

/**
|--------------------------------------------------
| GET ITEM BY HASH KEY AND PROJECTION EXPRESSION (only these attr will be returned)
|--------------------------------------------------
*/
module.exports.getProjectionExpression = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
    const response = await docClient
      .get({
        TableName: "test",
        Key: {
          id: id
        },
        ProjectionExpression: "#v",
        ExpressionAttributeNames: {
          "#v": "views"
        }
      })
      .promise();
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, response })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, err })
    };
  }
};

/**
|--------------------------------------------------
| SIMPLE QUERY BY KEY CONDITION EXPRESSION (primary key)
|--------------------------------------------------
*/
module.exports.query = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const response = await docClient
      .query({
        TableName: "test_2",
        KeyConditionExpression: "user_id = :id",
        // ExpressionAttributeNames: {
        //   "#uid": "user_id"
        // },
        ExpressionAttributeValues: {
          ":id": "AA"
        }
      })
      .promise();
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, response })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, err })
    };
  }
};

/**
|--------------------------------------------------
| SIMPLE QUERY BY GSI (name-index : String) - IT NEEDS EXPRESSION
|--------------------------------------------------
*/
module.exports.queryGSI = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const gsi = event.pathParameters.gsi;
  //   const body = JSON.parse(event.body);

  try {
    const response = await docClient
      .query({
        TableName: "test",
        IndexName: "name-index",
        KeyConditionExpression: "#n = :n",
        ExpressionAttributeNames: {
          "#n": "name"
        },
        ExpressionAttributeValues: {
          ":n": gsi
        }
      })
      .promise();
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, response })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, err })
    };
  }
};

/**
|--------------------------------------------------
| SCAN OPERATION WITH FILTER EXPRESSION
|--------------------------------------------------
*/
module.exports.scan = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const response = await docClient
      .scan({
        TableName: "test_2",
        FilterExpression: "cat = :cat",
        // ExpressionAttributeNames: {
        //   "#n": "name"
        // },
        ExpressionAttributeValues: {
          ":cat": "abc"
        }
      })
      .promise();
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, response })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, err })
    };
  }
};

/**
|--------------------------------------------------
| SCAN OPERATION WITH LIMIT AND PAGINATION (ExclusiveStartKey)
|--------------------------------------------------
*/
module.exports.scanWithLimit = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const response = await docClient
      .scan({
        TableName: "test_2",
        Limit: 5,
        ExclusiveStartKey: {
          user_id: "AA",
          timestamp: 1234569
        }
      })
      .promise();
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, response })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, err })
    };
  }
};
