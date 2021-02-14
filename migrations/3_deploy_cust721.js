var CanvasERC721 = artifacts.require("./CanvasERC721.sol");

module.exports = function(deployer) {
  deployer.deploy(CanvasERC721);
};
