"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const docClient = new AWS.DynamoDB.DocumentClient();

/**
|--------------------------------------------------
| CREATE ITEM - simple primary key (only hash key)
|--------------------------------------------------
*/
module.exports.create = async event => {
  const body = JSON.parse(event.body);
  try {
    const response = await docClient
      .put({
        TableName: "test",
        Item: {
          id: body.id,
          title: body.title,
          ...body
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
| CREATE ITEM - combined primary key (hash and sort key)
|--------------------------------------------------
*/
module.exports.create2 = async event => {
  const body = JSON.parse(event.body);
  try {
    const response = await docClient
      .put({
        TableName: "test_2",
        Item: {
          user_id: body.user_id,
          timestamp: body.timestamp,
          cat: body.cat,
          views: body.views
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
| CREATE ITEM WITH CONDITION EXPRESSION (id !== '321')
|--------------------------------------------------
*/
module.exports.createConditionExpression = async event => {
  const body = JSON.parse(event.body);
  try {
    const response = await docClient
      .put({
        TableName: "test",
        Item: {
          id: body.id,
          title: body.title
        },
        ConditionExpression: "#id <> :id",
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: { ":id": "321" }
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
| UPDATES ONLY THE PART IN UpdateExpression
|--------------------------------------------------
*/
module.exports.update = async event => {
  const body = JSON.parse(event.body);
  try {
    const response = await docClient
      .update({
        TableName: "test",
        Key: {
          id: body.id
        },
        UpdateExpression: "set #t = :t",
        ExpressionAttributeNames: { "#t": "title" },
        ExpressionAttributeValues: { ":t": "NEW TITLE" }
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
| UPDATE ATOMIC COUNTER (:incr :decr +1 -5 etc)
|--------------------------------------------------
*/
module.exports.updateAtomicCounter = async event => {
  const body = JSON.parse(event.body);
  try {
    const response = await docClient
      .update({
        TableName: "test",
        Key: {
          id: body.id
        },
        UpdateExpression: "set #v = #v + :incr",
        ExpressionAttributeNames: { "#v": "views" },
        ExpressionAttributeValues: { ":incr": 1 }
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
| EASY DELETE BY KEY
|--------------------------------------------------
*/
module.exports.delete = async event => {
  const body = JSON.parse(event.body);
  try {
    const response = await docClient
      .delete({
        TableName: "test",
        Key: {
          id: body.id
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
