import React, { Component } from "react";
import CanvasERC721 from "./contracts/CanvasERC721.json";
import getWeb3 from "./getWeb3";

import "./App.css";

import toUTF8Array from "./toUTF8Array.js";



class CanvasToken {
  constructor(id, dnaImmutable, netKey, name, dnaMutable0, dnaMutable1, owner)
  {
    console.log("REGISTERING TOKEN");
    console.log(name);
    console.log(dnaImmutable);
    console.log(owner);
    this.id = id;
    this.name = name;
    this.netKey = netKey;
    this.dnaImmutable = dnaImmutable;
    this.dnaMutable0 = dnaMutable0;
    this.dnaMutable1 = dnaMutable1;
    this.owner = owner;
  }

  toString() {
    return ("IMMUTE:" + this.dnaImmutable.toString() + " NK:" + this.netKey.toString() + " NAME: " + this.name.toString() + " MUT0: " + this.dnaMutable0.toString()
    + " MUT1: " + this.dnaMutable1.toString() + "   OWNER: " + this.owner.toString());
  }
}

class CanvasContractOwner extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      web3: props.web3,
      contractDataLoaded: false,
      contractInstance: null,
      tokenArray: [],
      checkDnaValue: "",
      dnaIsAvail: false,


      netKeyValue: "",
      nameValue: "",
      mutable0Value: "",
      mutable1Value: "",

    };

    this.handleDnaTestChange = this.handleDnaTestChange.bind(this);
    this.handleDnaTestSubmit = this.handleDnaTestSubmit.bind(this);

    //console.log(this.handleNetKeyChange);
    this.handleNetKeyChange = this.handleNetKeyChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMutable0Change = this.handleMutable0Change.bind(this);
    this.handleMutable1Change = this.handleMutable1Change.bind(this);
    
  }

  async handleDnaTestChange(event){
    console.log(event.target.value);
    const value = event.target.value;
    const numValue = parseInt(value);
    if(isNaN(numValue) || numValue < 1){
      this.setState({checkDnaValue: value, dnaIsAvail: false});
      return;
    }
    console.log(numValue);
    const isAvail = !(await this.state.contractInstance.methods.dnaImmutableExists(numValue).call());
    console.log(isAvail);
    if(isAvail === true){
      this.setState({checkDnaValue: value, dnaIsAvail: true});
    } else {
      this.setState({checkDnaValue: value, dnaIsAvail: false});  
    }

  }

  async handleNetKeyChange(event){
    event.preventDefault();
    this.setState({netKeyValue: event.target.value});
  }
  async handleNameChange(event){
    event.preventDefault();
    this.setState({nameValue: event.target.value});
  }
  async handleMutable0Change(event){
    event.preventDefault();
    this.setState({mutable0Value: event.target.value});
  }
  async handleMutable1Change(event){
    event.preventDefault();
    this.setState({mutable1Value: event.target.value});
  }

  async handleDnaTestSubmit(event){
    event.preventDefault();
    
    if(!this.state.dnaIsAvail) {
      alert(`Cannot Mint, DNA Immutable is not Unique.`);
      return;
    }
    const dnaValue = parseInt(this.state.checkDnaValue);
    const netKeyValue = parseInt(this.state.netKeyValue);
    const nameValue = parseInt(this.state.nameValue);
    const mutable0Value = parseInt(this.state.mutable0Value);
    const mutable1Value = parseInt(this.state.mutable1Value);
    if(isNaN(netKeyValue) || isNaN(nameValue) || isNaN(mutable0Value) || isNaN(mutable1Value)){
      alert(`Invalid Entry in some field`);
      return;
    }
    const accounts = await this.state.web3.eth.getAccounts();
    console.log(accounts);
    const newTokenId = await this.state.contractInstance.methods
      .mint(dnaValue, netKeyValue, nameValue, mutable0Value, mutable1Value)
      .send({from: accounts[0]});
    alert(`Minting, refresh after your confirmation`);
  }

  render() {
    if(!this.state.contractDataLoaded){
      return (<h1>Contract Data Not Loaded</h1>);
    }
    else{
      const existingTokens = this.state.tokenArray;
      const listTokens = existingTokens.map((token) =>
        <li key={token.id}>
          {token.toString()}
        </li>
      );

      console.log(listTokens);
      return (
        <>
          <ul>{listTokens}</ul>
          <label>IMMUTABLE, NETKEY, NAME, MUTABLE0, MUTABLE1</label>
          <form onSubmit={this.handleDnaTestSubmit}>
            <label>
              CHECK IMMUTABLE AVAIL:
              <input type="text" value={this.state.checkDnaValue} onChange={this.handleDnaTestChange}/>  
            </label><br/>
            <label>
              NETKEY:
              <input type="text" value={this.state.netKeyValue} onChange={this.handleNetKeyChange}/>
            </label><br/>
            <label> 
              NAME:
              <input type="text" value={this.state.nameValue} onChange={this.handleNameChange}/>
            </label><br/>
            <label>
              MUTABLE0:
              <input type="text" value={this.state.mutable0Value} onChange={this.handleMutable0Change}/>
            </label><br/>
            <label>
              MUTABLE1:
              <input type="text" value={this.state.mutable1Value} onChange={this.handleMutable1Change}/>
            </label><br/>
            <input type="submit" value="MINT" />
          </form>
          {
          (() => {
            if(this.state.dnaIsAvail){
              return(<p>DNA IS AVAILABLE</p>);
            } else {
              return(<p>DNA IS UNAVAILABLE</p>);
            }
          })()
          }
        </>
      );
    }
  }
  
  componentDidMount = async () => {
    const web3 = this.state.web3;
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = CanvasERC721.networks[networkId];
    const contractInstance = new web3.eth.Contract(
      CanvasERC721.abi,
      deployedNetwork && deployedNetwork.address,
    );
    console.log("CONTRACT INSTANCE");
    console.log(contractInstance);
    //test if contract name is correct and working
    const nameOfContract = await contractInstance.methods.name().call();
    if(nameOfContract === "Canvas"){
      console.log("GOT CORRECT CONTRACT: Canvas");
      
    }
    else {
      console.log("ERROR: FAILED TO FETCH Canvas CONTRACT");
      return;
    }
    var i = 0;
    const totalSupply = await contractInstance.methods.totalSupply().call();
    var tokenArray = [];
    while(i < totalSupply && i < 20){
      const tokenId = await contractInstance.methods.tokenByIndex(i).call();
      console.log("TOKENID:");
      console.log(tokenId);

      const canvasInfo = await contractInstance.methods.getCanvasInfo(tokenId).call();
      console.log("CANVASINFO:");
      console.log(canvasInfo);

      //const rawInfo = await contractInstance.methods.canvasData(tokenId).call();
      //console.log("RAW:");
      //console.log(rawInfo);

      //const dna = await contractInstance.methods.getDna(tokenId).call();
      const owner = await contractInstance.methods.ownerOf(tokenId).call();
      const newToken = new CanvasToken(tokenId, canvasInfo[0], canvasInfo[1], canvasInfo[2], canvasInfo[3], canvasInfo[4], owner);
      tokenArray.push(newToken);
      i++;
    }

    this.setState({
      contractDataLoaded: true, 
      contractInstance: contractInstance,
      tokenArray: tokenArray,
    });
  }

 

}

class App extends Component {
  constructor(provider){
    super();
    this.state = { 
      provider: provider, 
      web3: null, 
      accounts: null, 
      canvasContract: null, 
      totalSupply: null
    };
  }
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log("NETWORK ID:");
      console.log(networkId);     

      const deployedNetworkCanvas = CanvasERC721.networks[networkId];

      const instanceCanvas = new web3.eth.Contract(
        CanvasERC721.abi,
        deployedNetworkCanvas && (deployedNetworkCanvas.address),
      );
      console.log(instanceCanvas.defaultAccount);
      console.log(instanceCanvas.methods.totalSupply());
      const nameOfContract = await instanceCanvas.methods.name().call();
      console.log(nameOfContract);
      const totalSupply = await instanceCanvas.methods.totalSupply().call();
      console.log(totalSupply);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, canvasContract: instanceCanvas, totalSupply}, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    //const { accounts, contract, storageValue } = this.state;
    
    //const targetValue = 5;
    //if(storageValue == targetValue){
    //  console.log("NOT SETTING STORAGE VALUE, ALREADY SET");
    //  return;
    //}

    // Stores a given value, 5 by default.
    //await contract.methods.set(targetValue).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    //const response = await contract.methods.get().call();

    // Update state with the result.
    //this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    
    
    //return (
    //  <div className="App">
    //    <h1>Good to Go!</h1>
    //    <p>Your Truffle Box is installed and ready.</p>
    //    <h2>Smart Contract Example</h2>
    //    <p>
    //      If your contracts compiled and migrated successfully, below will show
    //      a stored value of 5 (by default).
    //    </p>
    //    <p>
    //      Try changing the value stored on <strong>line 40</strong> of App.js.
    //    </p>
    //    <div>The stored value is: {this.state.storageValue}</div>
    //    <div>The total supply is: {this.state.totalSupply}</div>
    //    <CanvasContractOwner web3={this.state.web3}/>
    //  </div>
    //);
    return (
      <div className="App">
        <h1>Canvas ERC721</h1>
        <div>The total supply is: {this.state.totalSupply}</div>
        <div>The first twenty coins are as follows.</div>
        <CanvasContractOwner web3={this.state.web3}/>
      </div>
    );
  }
}

export default App;
