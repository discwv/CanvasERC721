from web3 import Web3

import json
from loadABI import abi


def generateImage(info):
    print(info)
    key = info[0]
    network = info[1]
    vector0 = info[3]
    vector1 = info[4]




# Fill in your infura API key here
ganache_url = "HTTP://192.168.0.29:8545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

print(web3.isConnected())

print(web3.eth.blockNumber)

# Fill in your account here
balance = web3.eth.getBalance("0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1")
print(web3.fromWei(balance, "ether"))


#######################################################################################

##from web3 import Web3

# Fill in your infura API key here
#infura_url = "https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY_GOES_HERE"
##web3 = Web3(Web3.HTTPProvider(infura_url))

# OMG Address


# OMG ABI
address = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550'

contract = web3.eth.contract(address=address, abi=abi)

totalSupply = contract.functions.totalSupply().call()
print(totalSupply)
print(contract.functions.name().call())
print(contract.functions.symbol().call())
for index in range(totalSupply):
    info = contract.functions.getCanvasInfo(index+1).call()
    generateImage(info)







#balance = contract.functions.balanceOf('0xd26114cd6EE289AccF82350c8d8487fedB8A0C07').call()
#print(web3.fromWei(balance, 'ether'))
