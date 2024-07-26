// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//WE will write the inerface of our ERC token.
//it can be done from our front end or ssmart contract
//Best to be done within the contract

interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external  returns (bool);

    function balanceOf(address account) external view returns (uint256);
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function totalSupply() external view returns (uint);
    function name() external view returns(string memory); 


}


contract ICOMarketplace{

    struct TokenDetails{
        address token;
        bool supported;
        uint256 price;
        address creator;
        string name;
        string symbol;
    }

    //Mapping 
    mapping (address => TokenDetails) public tokenDetails;
    address[] public allSupportedTokens;
    address public owner;

    //EVENTS

    event TokenRecieved(address indexed token, address indexed from, uint256 amount);
    event TokenTransferred(address indexed token, address indexed from, uint256 amount);
    event TokenWithdraw(address indexed token, address indexed from, uint256 amount);
    event TokenAdded(address indexed token, uint256 price, address indexed creator, string name, string symbol);

    //MODIFIERS
    modifier  supportedToken() {}


    modifier onlyOwner(){}

    modifier onlyCreator(){}

    receive() external payable {}

    constructor (){}

    //CONTRACT FUNCTIONS
    function createICOSale(address _token, uint _price){

    }

    //to control overflow and underflow we will 
    //make use of this math library

    function multiply (uint x, uint y) internal pure returns (uint256 z){}

    function buyToken(address _token, uint256 _amount) external payable supportedToken
    (address _token){}

    function getBalance (addresss _token ) external view returns (uint256){}

    function getSuppoortedTokens () external view returns(address[] memory){}

    function withdraw (address _token, uint256 _amount) external onlyCreator(_token) supportedToken(_token){}

    function getTokenDetails(address _token) external view returns(TokenDetails memory){}

    //get ico created by a simgle user
    function getTokenCreatedBy(address _creator) external view returns (TokenDetails[] memory){}

    //get entire ico created
    function getAllTokens() external view returns(TokenDetails[] memory){}

}