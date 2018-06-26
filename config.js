// ADD THIS PART TO YOUR CODE
var config = {}

config.endpoint = "https://lucas-cosmos-db.documents.azure.com:443/";
config.primaryKey = "VloIqoMckfrFoa8AtWfjgRrmRGLm9I8Bt9MUgDeI1ldbBWrn20XBn9IhwhMY0wBcAZhkaX6ihmAcEJ42Lxuzsw==";

// ADD THIS PART TO YOUR CODE
config.database = {
    "id": "Tasks"
};

config.collection = {
    "id": "Items"
};

config.documents = {
    "Andersen": {
        "id": "Anderson.1",
        "lastName": "Andersen",
        "parents": [{
            "firstName": "Thomas"
        }, {
                "firstName": "Mary Kay"
            }],
        "children": [{
            "firstName": "Henriette Thaulow",
            "gender": "female",
            "grade": 5,
            "pets": [{
                "givenName": "Fluffy"
            }]
        }],
        "address": {
            "state": "WA",
            "county": "King",
            "city": "Seattle"
        }
    },
    "Wakefield": {
        "id": "Wakefield.7",
        "parents": [{
            "familyName": "Wakefield",
            "firstName": "Robin"
        }, {
                "familyName": "Miller",
                "firstName": "Ben"
            }],
        "children": [{
            "familyName": "Merriam",
            "firstName": "Jesse",
            "gender": "female",
            "grade": 8,
            "pets": [{
                "givenName": "Goofy"
            }, {
                    "givenName": "Shadow"
                }]
        }, {
                "familyName": "Miller",
                "firstName": "Lisa",
                "gender": "female",
                "grade": 1
            }],
        "address": {
            "state": "NY",
            "county": "Manhattan",
            "city": "NY"
        },
        "isRegistered": false
    }
};

// ADD THIS PART TO YOUR CODE
module.exports = config;