pragma solidity >=0.8.1;

import "../contract-utils/token/ERC721/ERC721Burnable.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721Burnable.sol";

contract CanvasERC721 is ERC721Burnable {
	
	struct CanvasDatum {
        uint256 immut_netKey_name;
        uint256 mutable_0;
		uint256 mutable_1;
	}
	
	//int/uint sighned unsighn integers of various sizes
	//in steps of 8 from int8 to int256
	CanvasDatum[] public canvasData;

	mapping(uint64 => bool) public dnaImmutableExists;

	constructor() public ERC721("Canvas", "CNV") {

		canvasData.push(CanvasDatum(
			//                v NetKey
			//   IMMUT DNA   | |                 Name String
			0x0000000000000000000000000000000000000000000000000000000000000000,
			//                           MUTABLE
			0x0000000000000000000000000000000000000000000000000000000000000000,
			//                           MUTABLE
			0x0000000000000000000000000000000000000000000000000000000000000000));//Skip over the 0 index
	}

	function mint(uint64 _dnaImmutable, uint8 _netKey, uint184 _name, uint256 _dnaMutable_0, uint256 _dnaMutable_1) public payable returns (uint256){
		//require uniqueness
		require(!dnaImmutableExists[_dnaImmutable]);
		dnaImmutableExists[_dnaImmutable] = true;
		//get new id
		uint256 _id = canvasData.length;
		
		canvasData.push(CanvasDatum(
			(uint256(_dnaImmutable) << 192) | (uint256(_netKey) << 184) | (uint256(_name)),
			_dnaMutable_0,
			_dnaMutable_1
		));
		
		_safeMint(msg.sender, _id);
		return _id;
	}

	function getCanvasInfo(uint _id) public view returns (uint64, uint8, uint184, uint256, uint256) {
		return (
			uint64(canvasData[_id].immut_netKey_name >> 192), 
			uint8(canvasData[_id].immut_netKey_name >> 184), 
			uint184(canvasData[_id].immut_netKey_name), 
			canvasData[_id].mutable_0, 
			canvasData[_id].mutable_1);
	}

	function setDnaMutable(uint _id, uint256 _dnaMutable_0, uint256 _dnaMutable_1) public {
		require(_isApprovedOrOwner(_msgSender(), _id), "setDnaMutable: caller is not owner nor approved");

        canvasData[_id].mutable_0 = _dnaMutable_0;
        canvasData[_id].mutable_1 = _dnaMutable_1;
	}

	function setNetKeyAndName(uint _id, uint8 _netKey, uint184 _name) public {
		require(_isApprovedOrOwner(_msgSender(), _id), "setName: caller is not owner nor approved");
        uint64 immut = uint64(canvasData[_id].immut_netKey_name >> 192);
		canvasData[_id].immut_netKey_name = (uint256(immut) << 192) | (uint256(_netKey) << 184) | (uint256(_name));
	} 

}