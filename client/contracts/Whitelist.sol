pragma solidity ^0.4.24;

import "./RBAC.sol";
import "./Ownable.sol";

/**
 * @title Whitelist
 * @dev The Whitelist contract has a whitelist of addresses, and provides basic authorization control functions.
 * This simplifies the implementation of "user permissions".
 */
contract Whitelist is RBAC, Ownable {

    // Name of the whitelisted role.
    string private constant ROLE_WHITELISTED = "whitelist";

    /**
     * @dev Determine if an account is whitelisted.
     * @return true if the account is whitelisted, false otherwise.
     */
    function isWhitelisted(address _operator)
    public
    view
    returns(bool) {
        return hasRole(_operator, ROLE_WHITELISTED);
    }

    /**
     * @dev add an address to the whitelist
     * @param _operator address
     * @return true if the address was added to the whitelist, false if the address was already in the whitelist
     */
    function addAddressToWhitelist(address _operator)
    public
    onlyOwner {
        _addRole(_operator, ROLE_WHITELISTED);
    }

    /**
     * @dev remove an address from the whitelist
     * @param _operator address
     * @return true if the address was removed from the whitelist,
     * false if the address wasn't in the whitelist in the first place
     */
    function removeAddressFromWhitelist(address _operator)
    public
    onlyOwner {
        _removeRole(_operator, ROLE_WHITELISTED);
    }

}