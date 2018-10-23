
interface IController {
    function addTokenToUser(address _user, address _contract) external returns (bool);
    function addCrowdsaleToUser(address _user, address _contract) external returns (bool);
    function getCreationDateOfContract(address _contract) external view returns (uint256);
    function getUserTokens(address _recipient) external view returns (address[]);
    function getUserCrowdsales(address _recipient) external view returns (address[]);
}