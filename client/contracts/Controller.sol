pragma solidity ^0.4.24;

/**
 * @title Controller
 * @dev Owners and contract info stores here
 */
contract Controller {
    struct User {
        address[] tokens;
        address[] crowdsales;
    }
    
    mapping(address => uint256) private contractInfo;
    mapping(address => User) private usersInfo;

    event TokenAdded(address Creator, address Contract, uint256 Timestamp);
    event CrowdsaneAdded(address Creator, address Contract, uint256 Timestamp);
    
    function addTokenToUser(address _user, address _contract) external returns (bool) {
        require(_user != address(0));
        require(_contract != address(0));
        
        usersInfo[_user].tokens.push(_contract);
        contractInfo[_contract] = block.timestamp;

        emit TokenAdded(_user, _contract, block.timestamp);

        return true;
    }
    
    function addCrowdsaleToUser(address _user, address _contract) external returns (bool) {
        require(_user != address(0));
        require(_contract != address(0));
        
        usersInfo[_user].crowdsales.push(_contract);
        contractInfo[_contract] = block.timestamp;

        emit CrowdsaneAdded(_user, _contract, block.timestamp);

        return true;
    }
    
    function getCreationDateOfContract(address _contract) external view returns (uint256) {
        return contractInfo[_contract];
    }
    
    function getUserTokens(address _recipient) external view returns (address[]) {
        return usersInfo[_recipient].tokens;
    }
    
    function getUserCrowdsales(address _recipient) external view returns (address[]) {
        return usersInfo[_recipient].crowdsales;
    }
    
}