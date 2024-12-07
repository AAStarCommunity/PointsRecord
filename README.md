# PointsRecord

Craft version for open source communities to record the contributors's monthly detail contribution on-chain.

## Project Structure

```
points-record/
├── contracts/           # Smart contract files
│   ├── src/            # Contract source files
│   │   └── PointsRecord.sol  # Main contract
│   ├── test/           # Contract test files
│   ├── script/         # Deployment scripts
│   └── foundry.toml    # Foundry configuration
├── src/                # Frontend application
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   ├── config/         # Configuration files
│   └── types/          # TypeScript type definitions
└── ...
```

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

## Deploy
points-record/contracts [ ./deploy.sh
[⠢] Compiling...
[⠃] Compiling 2 files with Solc 0.8.19
[⠊] Solc 0.8.19 finished in 3.64s
Compiler run successful!
Traces:
  [785829] DeployPointsRecord::run()
    ├─ [0] VM::startBroadcast()
    │   └─ ← [Return] 
    ├─ [749579] → new PointsRecord@0xf7833c6e5160ab6468E6CDa4672f638B4a59Cc53
    │   └─ ← [Return] 3744 bytes of code
    ├─ [0] VM::stopBroadcast()
    │   └─ ← [Return] 
    └─ ← [Return] PointsRecord: [0xf7833c6e5160ab6468E6CDa4672f638B4a59Cc53]


Script ran successfully.

== Return ==
0: contract PointsRecord 0xf7833c6e5160ab6468E6CDa4672f638B4a59Cc53

## Setting up 1 EVM.
==========================
Simulated On-chain Traces:

  [749579] → new PointsRecord@0xf7833c6e5160ab6468E6CDa4672f638B4a59Cc53
    └─ ← [Return] 3744 bytes of code


==========================

Chain 11155420

Estimated gas price: 0.000050756 gwei

Estimated total gas used for script: 1120115

Estimated amount required: 0.00000005685255694 ETH

==========================

##### optimism-sepolia
✅  [Success]Hash: 0xe5f1ee28ce758e4afc715f7974780b79eb81983865c41938cd5a7cde53dae0e8
Contract Address: 0xf7833c6e5160ab6468E6CDa4672f638B4a59Cc53
Block: 20889138
Paid: 0.000000000651568428 ETH (861863 gas * 0.000000756 gwei)

✅ Sequence #1 on optimism-sepolia | Total Paid: 0.000000000651568428 ETH (861863 gas * avg 0.000000756 gwei)
                                                

==========================

ONCHAIN EXECUTION COMPLETE & SUCCESSFUL.

## TODO
Start verification for (1) contracts
Start verifying contract `0xf7833c6e5160ab6468E6CDa4672f638B4a59Cc53` deployed on optimism-sepolia

Submitting verification for [src/PointsRecord.sol:PointsRecord] 0xf7833c6e5160ab6468E6CDa4672f638B4a59Cc53.
Encountered an error verifying this contract:
Response: `NOTOK`
Details: `Invalid API Key (#err3)`
points-record/contracts [                        main * ] 9:15 PM

### Verfiy individually

./verify.sh     main * ] 9:20 PM
Start verifying contract `0xf7833c6e5160ab6468E6CDa4672f638B4a59Cc53` deployed on optimism-sepolia

Submitting verification for [src/PointsRecord.sol:PointsRecord] 0xf7833c6e5160ab6468E6CDa4672f638B4a59Cc53.
Encountered an error verifying this contract:
Response: `NOTOK`
Details: `Invalid API Key (#err3)`

## run one time
https://sepolia-optimism.etherscan.io/address/0xf7833c6e5160ab6468E6CDa4672f638B4a59Cc53#code

![](https://raw.githubusercontent.com/jhfnetboy/MarkDownImg/main/img/202412072222653.png)
