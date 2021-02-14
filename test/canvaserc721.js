const CanvasERC721 = artifacts.require("./CanvasERC721.sol");

contract("CanvasERC721", accounts => {
  it("deployed successfully", async() => {
  	contract = await CanvasERC721.deployed()
  	address = contract.address
  	console.log(address)
  	assert.notEqual(address, "")
  });
  it("...should have .", async () => {
    //const simpleStorageInstance = await CanvasERC721.deployed();

    // Set value of 89
    //await simpleStorageInstance.set(89, { from: accounts[0] });

    // Get stored value
    //const storedData = await simpleStorageInstance.get.call();

    //assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
