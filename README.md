# PointsRecord

Craft version for open source communities to record the contributors's monthly detail contribution on-chain.


## V0.0.1

- Login with AirAccount, please follow this demo to create account and login with AirAccount:https://github.com/AAStarCommunity/Cos72/blob/main/src/tutorial/AirAccount.tsx
- Set your nick name, default is your AirAccount address, save it to the record contract.
- Enter a new monthly record:
- Add a new detail item: a item with 4 fields:
  - Date and time(auto filled with today's date and time)
  - Contribution Type: code, design, doc, operation, other.
  - Contribution Detail: post some links or other credentials
  - Contribution Hours: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
- You can add multiple items in one time in a form.
- View all records: list with pagination by 10 records per page.
- View your records: list with pagination by 10 records per page.
- There will be a button to generate a summary of your contribution in the last month.
- We will create a new contract to store the records on Optimism Sepolia.