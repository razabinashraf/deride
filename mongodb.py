import requests
import json
url = "https://data.mongodb-api.com/app/data-wzgqf/endpoint/data/v1/action/findOne"

payload = json.dumps({
    "collection": "user_details",
    "database": "deride",
    "dataSource": "Cluster0",
    "filter": {
      "name":"raza"
    }
})
headers = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
  'api-key': '', 
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
