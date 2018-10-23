pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./ERC20Detailed.sol";
import "./ERC20Pausable.sol";
import "./ERC20Freezable.sol";
import "./ERC20Mintable.sol";
import "./ERC20Burnable.sol";
import "./TokenTimeLock.sol";

/**
 * @title Token
 * @dev Token smart contract
 */
contract Token is ERC20Detailed, ERC20Pausable, ERC20Freezable, ERC20Mintable, ERC20Burnable {
    Controller private _TEcontroller = Controller(0x3Eb8344a5f13a712eE2cf47bD1b32CAdde2Bc353);
    address private _TEwallet = 0x0471fbe8D691B37591Ba715B5F93827E53c07669;

    constructor(
            string name,
            string symbol,
            uint8 decimals,
            bool _pausable,
            bool _freezable,
            bool _mintable,
            address _owner,
            address [] _receivers,
            uint256 [] _amounts,
            bool [] _frozen,
            uint256 [] _untilDate
        )
        public
        ERC20Detailed(name,symbol,decimals)
        payable
        {
            require(msg.value == 1 ether);

            for (uint256 j = 0; j < _receivers.length; j++) {
                if(!_frozen[j]) {
                   _mint(_receivers[j], _amounts[j] * 10**uint256(decimals));
                } else {
                    address lockedTokens = new TokenTimelock(IERC20(address(this)), _receivers[j], _untilDate[j]);
                    _mint(lockedTokens, _amounts[j] * 10**uint256(decimals));
                }
            }

            if(!_pausable) {
                disablePausing();
            }

            if(!_freezable) {
                disableFreezing();
            }

            if(!_mintable) {
                finishMinting();
            }

            if(msg.sender != _owner) {
                transferOwnership(_owner);
            }

            _TEcontroller.addTokenToUser(msg.sender, address(this));
            _TEwallet.transfer(1 ether);
    }

    function getState() external view returns(string, string, uint8, uint256, bool, bool, bool, uint256) {
        return (name(), symbol(), decimals(), totalSupply(), pauseEnabled, freezingEnabled, mintingEnabled, _TEcontroller.getCreationDateOfContract(address(this)));
    }
}