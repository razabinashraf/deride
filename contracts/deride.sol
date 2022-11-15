pragma solidity 0.8.17;

contract Deride{
    // Stores the status of the user
    enum Status {INACTIVE, RIDER, DRIVER}
    
    // Used to store gegraphical coordinates of a user
    struct coordinates{
        int256 lat;
        int256 long;
    }
    
    // Struct used to store all information related to a user
    struct user{
        bool isUser;
        uint number;
        Status state;
        address currPairing;
        coordinates pickup;
        coordinates dropoff;
        uint arrivalTime;
        bool driverArrived;
        bool inProgress;
    }

    // Maps user ethrium address to user struct
    mapping (address => user) public users;
    // List of user adress
    uint256 public user_count= 0;

    
    function driveRequest() public{
        // Function used to update/add user details when user signs on to the application as driver
        if(users[msg.sender].isUser == false){
            user_count++ ;
            users[msg.sender] = user({
                isUser: true,
                number: user_count,
                state: Status.DRIVER,
                currPairing: address(0),
                pickup: coordinates({lat: 0, long: 0}),
                dropoff: coordinates({lat: 0, long: 0}),
                arrivalTime: 0,
                driverArrived: true,
                inProgress: false
            });
        }else{
            users[msg.sender].state = Status.DRIVER;
            users[msg.sender].currPairing = address(0);
            users[msg.sender].pickup = coordinates({lat: 0, long: 0});
            users[msg.sender].dropoff = coordinates({lat: 0, long: 0});
            users[msg.sender].arrivalTime = 0;
            users[msg.sender].driverArrived = true;
            users[msg.sender].inProgress = false;
        }
    }

    function rideRequest(int256[] memory pick, int256[] memory drop, uint tripCost) public {
        // Function used to update/add user details when user signs on to the application as rider
        // tripCost: Estimate cost of entire trip
        if(users[msg.sender].isUser == false){
            user_count++ ;
            users[msg.sender] = user({
                isUser: true,
                number: user_count,
                state: Status.RIDER,
                currPairing: address(0),
                pickup: coordinates({lat: pick[0], long: pick[1]}),
                dropoff: coordinates({lat: drop[0], long: drop[1]}),
                arrivalTime: 0,
                driverArrived: false,
                inProgress: false
            });
        }else{
            users[msg.sender].state = Status.RIDER;
            users[msg.sender].currPairing = address(0);
            users[msg.sender].pickup = coordinates({lat: pick[0], long: pick[1]});
            users[msg.sender].dropoff = coordinates({lat: drop[0], long: drop[1]});
            users[msg.sender].arrivalTime = 0;
            users[msg.sender].driverArrived = false;
            users[msg.sender].inProgress = false;
        }
    }
}