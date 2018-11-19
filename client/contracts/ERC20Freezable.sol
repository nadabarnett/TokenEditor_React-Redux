pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./Ownable.sol";

/**
 * @title ERC20Freezable
 */
contract ERC20Freezable is ERC20, Ownable {
    mapping (address => bool) public frozenAccounts;
    bool public freezingEnabled = true;

    event FreezingDisabled();
    event FrozenFunds(address target, bool frozen);

    modifier ifFreezingEnabled() {
        require(freezingEnabled);
        _;
    }

    // @dev Limit token transfer if _sender is frozen.
    modifier canTransfer(address _sender, address _receiver) {
        require(!frozenAccounts[_sender]);
        require(!frozenAccounts[_receiver]);
        _;
    }

    function freezeAccount(address target) public onlyOwner ifFreezingEnabled {
        frozenAccounts[target] = true;
        emit FrozenFunds(target, true);
    }

    function unFreezeAccount(address target) public onlyOwner ifFreezingEnabled {
        frozenAccounts[target] = false;
        emit FrozenFunds(target, false);
    }

    function frozen(address _target) constant public returns (bool){
        return frozenAccounts[_target];
    }

    function transfer(address _to, uint256 _value) public canTransfer(msg.sender, _to) returns (bool success) {
        // Call StandardToken.transfer()
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public canTransfer(_from, _to) returns (bool success) {
        // Call StandardToken.transferForm()
        return super.transferFrom(_from, _to, _value);
    }

    function disableFreezing() public onlyOwner {
      freezingEnabled = false;
      emit FreezingDisabled();
  }
}