pragma solidity >=0.8.1;

import "../contract-utils/token/ERC721/ERC721Burnable.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721Burnable.sol";

contract CanvasERC721 is ERC721Burnable {
	//int/uint sighned unsighn integers of various sizes
	//in steps of 8 from int8 to int256
	uint16[] public dnaImmutable;

	mapping(uint16 => bool) public dnaImmutableExists;

	mapping(uint => uint256) public idToName;//Name is 32 byte char array
	mapping(uint => uint256) public idToDnaMutable;

	constructor() public ERC721("Canvas", "CNV") {
		dnaImmutable.push(0);//Skip over the 0 index
		//idToName[0] = 0x4e756C6C2043616e766173000000000000000000000000000000000000000000;
		//idToDnaMutable[0] = 0x4e756C6C2043616e766173000000000000000000000000000000000000000000;
	}

	function mint(uint16 _dnaImmutable, uint256 _dnaMutable, uint256 _name) public payable returns (uint){
		//require unique base dna
		require(!dnaImmutableExists[_dnaImmutable]);
		dnaImmutableExists[_dnaImmutable] = true;
		//get new id
		uint _id = dnaImmutable.length;
		dnaImmutable.push(_dnaImmutable);
		//push name
		idToName[_id] = _name;
		idToDnaMutable[_id] = _dnaMutable;
		// canvas track it
		_safeMint(msg.sender, _id);
		return _id;
	}

	function getDna(uint _id) public view returns (uint16, uint256) {
		return (dnaImmutable[_id], idToDnaMutable[_id]);
	}

	function setDnaMutable(uint _id, uint256 _dnaMutable) public {
		require(_isApprovedOrOwner(_msgSender(), _id), "setDnaMutable: caller is not owner nor approved");
        idToDnaMutable[_id] = _dnaMutable;
	}

	function setName(uint _id, uint256 _name) public {
		require(_isApprovedOrOwner(_msgSender(), _id), "setName: caller is not owner nor approved");
        idToName[_id] = _name;
	} 

}