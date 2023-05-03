pragma solidity ^0.8.17;
import "./drdtoken.sol";
import "hardhat/console.sol";

contract Deride{
    // Stores the status of the user
    enum Status {INACTIVE, RIDER, DRIVER,ONRIDE}

    address private drdTokenAddress;

    event RiderDetails(address[] WaitingRiders);
    // event used to inform rider that he/she has been picked up
    event RiderPicked(uint riderNumber); 
    // Struct used to store all information related to a user
    struct user{
        bool isUser;
        uint number;
        Status state;
    }
    address[] WaitingRiders;
    // Maps user ethrium address to user struct
    mapping (address => user) public users;
    // List of user adress
    address [] public userList;
    
    function transferDRD(address to,uint amount)
        public
    {
        DerideToken drd = DerideToken(drdTokenAddress);
        drd.transfer(to, amount);
    }
    
    function setDRDtokenAddress(address DRDContractAddress)
        external
    {
        require(
            DRDContractAddress != address(0),
            "Invalid Contract Address"
        );
        drdTokenAddress = DRDContractAddress;
    }

    function driveRequest() public{
        // Function used to update/add user details when user signs on to the application as driver
        
        if(users[msg.sender].isUser == false){
            userList.push(msg.sender);
            users[msg.sender] = user({
                isUser: true,
                number: userList.length-1,
                state: Status.DRIVER
            });
        }else{
            users[msg.sender].state = Status.DRIVER;
        }
    }

    function rideRequest(uint cost) public {
        // Function used to update/add user details when user signs on to the application as rider
        DerideToken drd = DerideToken(drdTokenAddress);
        if(users[msg.sender].isUser == false){
            userList.push(msg.sender);
            users[msg.sender] = user({
                isUser: true,
                number: userList.length-1,
                state: Status.RIDER
            });
        }else{
            users[msg.sender].state = Status.RIDER;
        }
        drd.transferFrom(msg.sender, address(this), cost);
    }

    function showAllRequests() public{
        // returns list of waiting riders to a driver
        require(users[msg.sender].isUser==true, "Need to be a user to select rider");
        require(users[msg.sender].state==Status.DRIVER, "User needs to be in driver mode to pick rider");
        delete WaitingRiders;
        for (uint i=0; i<userList.length; i++) {
            if (users[userList[i]].state == Status.RIDER){
                WaitingRiders.push(userList[i]);
            }
        }
        emit RiderDetails(WaitingRiders);
    }

    function acceptRequest(uint riderNumber) public{
        require(users[msg.sender].isUser==true, "Need to be a user to select rider");
        require(users[msg.sender].state==Status.DRIVER, "User needs to be in driver mode to pick rider");
        require(userList[riderNumber] != msg.sender, "Cannot pick yourself");
        require(users[userList[riderNumber]].state == Status.RIDER, "user being picked has to be a rider");
        
        users[msg.sender].state = Status.ONRIDE;
        users[userList[riderNumber]].state = Status.ONRIDE;

        emit RiderPicked(riderNumber);
    }

    function markRideCompleted(uint riderNumber, uint cost) public {
        require(users[msg.sender].isUser==true, "Need to be a user first");
        require(users[msg.sender].state==Status.ONRIDE,"Driver needs to be on ride first");
        require(users[userList[riderNumber]].state == Status.ONRIDE, "Rider should be on ride first");

        //transfer 85% of travel cost to the driver
        transferDRD(msg.sender,cost*85/100);
        users[msg.sender].state = Status.INACTIVE;
        users[userList[riderNumber]].state == Status.INACTIVE;
    }

    function cancelRideRequest(uint cost) public {
        require(users[msg.sender].state==Status.RIDER, "User need to request a drive before cancelling");
        users[msg.sender].state = Status.INACTIVE;

        //Transferring only 95% of travel cost back to user as penalty.
        transferDRD(msg.sender, cost*95/100);
    }

    function setState(uint user_id,uint _state) public {
        if (_state == 0)
            users[userList[user_id]].state = Status.INACTIVE;
        if (_state == 1)
            users[userList[user_id]].state = Status.RIDER;
        if (_state == 2)
            users[userList[user_id]].state = Status.DRIVER;
        if (_state == 3)
            users[userList[user_id]].state = Status.ONRIDE;
        
    }

    function distributeTokens() external payable{
        DerideToken drd = DerideToken(drdTokenAddress);
        uint256 totalAmount = drd.balanceOf(address(this));
        uint256 totalSupply = drd.totalSupply(); // Get the total supply of the ERC20 token
        uint256 balance; // Declare a variable to hold the balance of each holder
        console.log("total supply: %s, total amount: %s", totalSupply, totalAmount);
        

        for (uint256 i = 0; i < userList.length; i++) {
            address holder = userList[i]; // Get the address of each holder
            balance = drd.balanceOf(holder); // Get the balance of each holder
            uint256 amountToSend = (balance * totalAmount)/ totalSupply; // Calculate the amount of tokens each holder should receive
            console.log("balnce*amount: %s,  balance/supply: %s", balance * totalAmount, balance/totalSupply);
            console.log("Holder: %s, Balance: %s, Amount: %s", holder, balance,amountToSend);
            drd.transfer(holder, amountToSend);
        }
    }
}