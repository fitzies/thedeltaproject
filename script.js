const serverUrl = "https://a689sqcc8ri9.usemoralis.com:2053/server";
const appId = "qb70WJTeplfhHVFTxAQu5Kj4hhEx1D4mfNP2sOFS";
Moralis.start({ serverUrl, appId });


let currentUser;
let timestamp;

let login = async () => {
    let user = Moralis.User.current();
    if (!user) {
        user = await Moralis.authenticate({
            signingMessage: "Log into the delta project",
        }).then(async (user) => {
            currentUser = user;
            await Moralis.enableWeb3();
            currentUser.get("ethAddress");
        }).catch((error) => {
            console.log(error);
        });
    }
    console.log(user)
    setVariables()
}

let logout = async () => {
    await Moralis.User.logOut();
    currentUser = null;
}

let setVariables = async () => {
    let balance = await Moralis.Web3API.account.getNativeBalance({chain: "bsc"});
    balance = (((balance.balance) * 10e-19).toString()).substring(0,5)
    document.getElementById('wallet-value').innerText = balance + " BNB"

    let contractBalance = await getContractBalance()
    document.getElementById('contract-value').innerText = contractBalance.toString() + " BNB"
}

window.onload = async () => {
    setTimeout(async () => {
        if(!currentUser) {
            login()
            await Moralis.enableWeb3()
            if (Math.floor(Date.now() / 1000) - timestamp >= 86400) {
                updateWithdrawableAmount()
            }
        }
    }, 3000)
}

let updateWithdrawableAmount = async () => {
    let options = {
        contractAddress: "0x4A100a584e9bB1A2226b1fDFc693fBf72A3EE47b",
        functionName: "updateWithdrawable",
        abi : [{
            "inputs": [],
            "name": "updateWithdrawable",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }]
    }

    await Moralis.executeFunction(options)
}

let getWithdrawableAmount = async () => {
    let options = {
        contractAddress: "0x4A100a584e9bB1A2226b1fDFc693fBf72A3EE47b",
        functionName: "getWithdrawableAmount",
        abi: [{
            "inputs": [],
            "name": "getWithdrawableAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }]
    }

    if (isNaN(await parseInt(Moralis.executeFunction(options)._hex, 16))) {
        return 0
    } 
    return value
}

let getContractBalance = async () => {
    let options = {
        contractAddress: "0x4A100a584e9bB1A2226b1fDFc693fBf72A3EE47b",
        functionName: "getContractBalance",
        abi: [{
            "inputs": [],
            "name": "getContractBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }]
    }

    if (isNaN(await parseInt(Moralis.executeFunction(options)._hex, 16))) {
        return 0
    } 
    return value
}

let deposit = async () => {
    let value = document.getElementById('depost').value

    if (value > await Moralis.Web3API.account.getNativeBalance({chain: "bsc"})) {
        alert("Insufficient balance")
        return
    }

    let options = {
        contractAddress: "0x4A100a584e9bB1A2226b1fDFc693fBf72A3EE47b",
        functionName: "deposit",
        abi: [{
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }],
        msgValue: Moralis.Units.ETH(value)
    }

    if(!timestamp) {
        timestamp = Math.floor(Date.now() / 1000)
    }

    await Moralis.executeFunction(options)
    
}

let withdraw = async () => {
    let amount = await getWithdrawableAmount()
    if(amount <= 0) {
        alert("You do not have a withdrawal balance")
        return
    }

    let options = {
        contractAddress: "0x4A100a584e9bB1A2226b1fDFc693fBf72A3EE47b",
        functionName: "withdraw",
        abi: [{
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        params: {
            amount: Moralis.Units.ETH(0.1)
        }
    }

    await Moralis.executeFunction(options)
}

let redeposit = async () => {
    let amount = await getWithdrawableAmount()
    if(amount <= 0) {
        alert("You do not have a withdrawal balance")
        return
    }
    
    let options = {
        contractAddress: "0x4A100a584e9bB1A2226b1fDFc693fBf72A3EE47b",
        functionName: "redeposit",
        abi: [{
            "inputs": [],
            "name": "redeposit",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }]
    }

    await Moralis.executeFunction(options)
}