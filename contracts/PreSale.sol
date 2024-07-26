// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//WE will write the inerface of our ERC token.
//it can be done from our front end or ssmart contract
//Best to be done within the contract

interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function symbol() external view returns (string memory);

    function name() external view returns (string memory);

    function totalSupply() external view returns (uint);
}

contract ICOMarketplace {
    struct TokenDetails {
        address token;
        bool supported;
        uint256 price;
        address creator;
        string name;
        string symbol;
    }

    //Mapping
    mapping(address => TokenDetails) public tokenDetails;
    address[] public allSupportedTokens;
    address public owner;

    //EVENTS

    event TokenRecieved(
        address indexed token,
        address indexed from,
        uint256 amount
    );
    event TokenTransferred(
        address indexed token,
        address indexed from,
        uint256 amount
    );
    event TokenWithdraw(
        address indexed token,
        address indexed from,
        uint256 amount
    );
    event TokenAdded(
        address indexed token,
        uint256 price,
        address indexed creator,
        string name,
        string symbol
    );

    //MODIFIERS
    modifier supportedToken(address _token) {
        require(tokenDetails[_token].supported, "Token not supported");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyCreator(address _token) {
        require(
            msg.sender == tokenDetails[_token].creator,
            "Caller is not the creator"
        );
        _;
    }

    //sstopping the contract from receiving ether directly
    receive() external payable {
        revert("contract does not accept Ether Directly");
    }

    constructor() {
        owner = msg.sender;
    }

    //CONTRACT FUNCTIONS
    function createICOSale(address _token, uint _price) external {
        //to be able to have access and make use of the ERC20 token interfact function,
        //we will have to pass the token address to the created interface
        IERC20 token = IERC20(_token);
        //get from the ERC20 interface functions the name and symbol
        string memory tokenName = token.name();
        string memory tokenSymbol = token.symbol();

        tokenDetails[_token] = TokenDetails({
            token: _token,
            supported: true,
            price: _price,
            creator: msg.sender,
            name: tokenName,
            symbol: tokenSymbol
        });

        allSupportedTokens.push(_token);
        emit TokenAdded(_token, _price, msg.sender, tokenName, tokenSymbol);
    }

    //to control overflow and underflow we will
    //make use of this math library

    function multiply(uint x, uint y) internal pure returns (uint256 z) {
        // //to control overflow and underflow for mutiplication of two or more variables we will
        //make use of this math library and the code is below
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyToken(
        address _token,
        uint256 _amount
    ) external payable supportedToken(_token) supportedToken(_token) {
        //check if amount to buy is not zero

        require(_amount > 0, "Amount must be greater than 0");

        TokenDetails memory details = tokenDetails[_token];
        uint256 totalCost = multiply(details.price, _amount);
        //check if user has enough balance
        require(msg.value == totalCost, "Incorrect Ether amount sent");

        //TRANSFER THE PAYMENT TO THE TOKEN CREATOR
        //we will use the call method
        (bool sent, ) = details.creator.call{value: msg.value}("");

        require(sent, "Failed to transer Ether to token Creator")
    }

    function getBalance(address _token) external view returns (uint256) {}

    function getSuppoortedTokens() external view returns (address[] memory) {}

    function withdraw(
        address _token,
        uint256 _amount
    ) external onlyCreator(_token) supportedToken(_token) {}

    function getTokenDetails(
        address _token
    ) external view returns (TokenDetails memory) {}

    //get ico created by a simgle user
    function getTokenCreatedBy(
        address _creator
    ) external view returns (TokenDetails[] memory) {}

    //get entire ico created
    function getAllTokens() external view returns (TokenDetails[] memory) {}
}
