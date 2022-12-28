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
  'api-key': '10jdhq5Q6ii3QpeioTLBAk3uSdYBpzkwHiqpuIdF2YeW323dThHOPrTBXdZLRcOu', 
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
