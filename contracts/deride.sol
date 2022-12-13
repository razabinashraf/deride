pragma solidity 0.8.17;

contract Deride{
    // Stores the status of the user
    enum Status {INACTIVE, RIDER, DRIVER,ONRIDE}

    event RiderDetails(uint riderNumber);
    // event used to inform rider that he/she has been picked up
    event RiderPicked(uint riderNumber); 
    // Struct used to store all information related to a user
    struct user{
        bool isUser;
        uint number;
        Status state;
    }

    // Maps user ethrium address to user struct
    mapping (address => user) public users;
    // List of user adress
    address [] public userList;

    
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

    function rideRequest() public {
        // Function used to update/add user details when user signs on to the application as rider
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
    }

    function showAllRequests() public{
        // returns list of waiting riders to a driver
        require(users[msg.sender].isUser==true, "Need to be a user to select rider");
        require(users[msg.sender].state==Status.DRIVER, "User needs to be in driver mode to pick rider");
        for (uint i=0; i<userList.length; i++) {
            if (users[userList[i]].state == Status.RIDER){
                emit RiderDetails(users[userList[i]].number);
            }
        }
    }

    function acceptRequest(uint riderNumber) public{
        // pairs rider and driver and informs rider of driver arrival time
        require(users[msg.sender].isUser==true, "Need to be a user to select rider");
        require(users[msg.sender].state==Status.DRIVER, "User needs to be in driver mode to pick rider");
        require(userList[riderNumber] != msg.sender, "Cannot pick yourself");
        require(users[userList[riderNumber]].state == Status.RIDER, "user being picked has to be a rider");
        
        users[msg.sender].state = Status.ONRIDE;
        users[userList[riderNumber]].state == Status.ONRIDE;

        emit RiderPicked(riderNumber);
    }

    function markRideCompleted(uint riderNumber) public {
        require(users[msg.sender].isUser==true, "Need to be a user first");
        require(users[msg.sender].state==Status.ONRIDE,"Driver needs to be on ride first");
        require(users[userList[riderNumber]].state == Status.ONRIDE, "Rider should be on ride first");

        users[msg.sender].state = Status.INACTIVE;
        users[userList[riderNumber]].state == Status.INACTIVE;
    }
}