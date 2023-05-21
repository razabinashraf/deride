pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./drdtoken.sol";
import "hardhat/console.sol";



contract Deride{
    // Stores the status of the user
    enum Status {INACTIVE, RIDER, DRIVER,ONRIDE}

    address public drdTokenAddress;
    
    event RiderDetailS( RiderInfo[] WaitingRiders);
    // event used to inform rider that he/she has been picked up
    event RiderPicked(uint riderNumber);
        // Used to store gegraphical coordinates of a user
    struct coordinates{
        int256 lat;
        int256 long;
    }

    struct RiderInfo {
    address riderAddress;
    coordinates pickupLocation;
    coordinates dropoffLocation;
    }
    // Struct used to store all information related to a user
    struct user{
        bool isUser;
        uint number;
        Status state;
        coordinates pickup;
        coordinates dropoff;
        coordinates DriverLocation;
    }
    // Maps user ethrium address to user struct
    mapping (address => user) public users;
    // List of user adress
    address [] public userList;

    uint public WaitingRidersCount = 0;
    
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

    function driveRequest(int256[] memory location) public{
        // Function used to update/add user details when user signs on to the application as driver
        
        if(users[msg.sender].isUser == false){
            userList.push(msg.sender);
            users[msg.sender] = user({
                isUser: true,
                number: userList.length-1,
                state: Status.DRIVER,
                pickup: coordinates({lat: 0, long: 0}),
                dropoff: coordinates({lat: 0, long: 0}),
                DriverLocation : coordinates({lat: location[0], long: location[1]})
                });
        }else{
            users[msg.sender].state = Status.DRIVER;
            users[msg.sender].DriverLocation= coordinates({lat: 0, long: 0});
        }
    }

    function rideRequest(uint cost,int256[] memory pick, int256[] memory drop) public {
        // Function used to update/add user details when user signs on to the application as rider
        DerideToken drd = DerideToken(drdTokenAddress);
        if(users[msg.sender].isUser == false){
            userList.push(msg.sender);
            users[msg.sender] = user({
                isUser: true,
                number: userList.length-1,
                state: Status.RIDER,
                pickup: coordinates({lat: pick[0], long: pick[1]}),
                dropoff: coordinates({lat: drop[0], long: drop[1]}),
                DriverLocation: coordinates({lat: 0, long: 0})
            
            });
        }else{
            users[msg.sender].state = Status.RIDER;
            users[msg.sender].pickup = coordinates({lat: pick[0], long: pick[1]});
            users[msg.sender].dropoff = coordinates({lat: drop[0], long: drop[1]});

        }
        WaitingRidersCount += 1;
        drd.transferFrom(msg.sender, address(this), cost);
    }

    // function showAllRequests(int256[] memory location) public {
    // // Returns list of waiting riders to a driver
    //     users[msg.sender].DriverLocation = coordinates({lat: location[0], long: location[1]});
    //     require(users[msg.sender].isUser == true, "Need to be a user to select rider");
    //     require(users[msg.sender].state == Status.DRIVER, "User needs to be in driver mode to pick rider");
    //     delete WaitingRiders;
    //     for (uint i=0; i<userList.length; i++) {
    //         if (users[userList[i]].state == Status.RIDER && isWithin10km(users[msg.sender].DriverLocation,users[userList[i]].pickup)==true){
    //             WaitingRiders.push(RiderInfo({
    //             riderAddress: userList[i],
    //             pickupLocation: users[userList[i]].pickup,
    //             dropoffLocation: users[userList[i]].dropoff
    //         }));
        
    //         }
    //     }
    // return WaitingRiders;
    // }

    function showAllRequests() public view returns (RiderInfo[] memory){
        // returns list of waiting riders to a driver
        
        require(users[msg.sender].isUser==true, "Need to be a user to select rider");
        require(users[msg.sender].state==Status.DRIVER, "User needs to be in driver mode to pick rider");
        uint length =  userList.length;
        console.log("length: %s", length);
        uint index = 0; 
        RiderInfo[] memory WaitingRiders = new RiderInfo[](WaitingRidersCount);
        for (uint i = 0; i < length; i++) {
            if (users[userList[i]].state == Status.RIDER && isWithin10km(users[msg.sender].DriverLocation,users[userList[i]].pickup)==true) {
                console.log("i: %s, index: %s",i,index);
                WaitingRiders[index].riderAddress = userList[i];
                WaitingRiders[index].pickupLocation = users[userList[i]].pickup;
                WaitingRiders[index].dropoffLocation = users[userList[i]].dropoff;
                index += 1;
            }
        }
        return WaitingRiders;
    }

    function isWithin10km(coordinates memory DriverLocation, coordinates memory pickup) public pure returns (bool) {
        int256 distance = calculateDistance(DriverLocation.lat, DriverLocation.long, pickup.lat, pickup.long);
        if (distance <= int256(10)) { // 10 km in meters
            return true;
        } else {
            return false;
        }
    }
    
    function calculateDistance(int256 lat1, int256 long1, int256 lat2, int256 long2) internal pure returns (int256) {
        uint256 latDiff = uint256(lat1 > lat2 ? lat1 - lat2 : lat2 - lat1);
        uint256 longDiff = uint256(long1 > long2 ? long1 - long2 : long2 - long1);
        uint256 latDiffSquared = SafeMath.mul(latDiff, latDiff);
        uint256 longDiffSquared = SafeMath.mul(longDiff, longDiff);
        uint256 distanceSquared = SafeMath.add(latDiffSquared, longDiffSquared);
        uint256 distance = Math.sqrt(distanceSquared);
        return int256(distance);
    }
    
    function acceptRequest(uint riderNumber) public{
        require(users[msg.sender].isUser==true, "Need to be a user to select rider");
        require(users[msg.sender].state==Status.DRIVER, "User needs to be in driver mode to pick rider");
        require(userList[riderNumber] != msg.sender, "Cannot pick yourself");
        require(users[userList[riderNumber]].state == Status.RIDER, "user being picked has to be a rider");
        
        users[msg.sender].state = Status.ONRIDE;
        users[userList[riderNumber]].state = Status.ONRIDE;

        WaitingRidersCount -= 1;

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
        WaitingRidersCount -= 1;
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