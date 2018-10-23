pragma solidity ^0.4.18;

import "./ERC20.sol";
import "./Ownable.sol";

/**
 * @title ERC20Mintable
 * @dev ERC20 minting logic
 */
contract ERC20Mintable is ERC20, Ownable {
  event MintingFinished();

  bool public mintingEnabled = true;

  modifier onlyBeforeMintingFinished() {
    require(mintingEnabled);
    _;
  }

  /**
   * @return true if the minting is finished.
   */
  function mintingEnabled() public view returns(bool) {
    return mintingEnabled;
  }

  /**
   * @dev Function to mint tokens
   * @param to The address that will receive the minted tokens.
   * @param amount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
  function mint(
    address to,
    uint256 amount
  )
    public
    onlyOwner
    onlyBeforeMintingFinished
    returns (bool)
  {
    _mint(to, amount);
    return true;
  }

  /**
   * @dev Function to stop minting new tokens.
   * @return True if the operation was successful.
   */
  function finishMinting()
    public
    onlyOwner
    onlyBeforeMintingFinished
    returns (bool)
  {
    mintingEnabled = false;
    emit MintingFinished();
    return true;
  }
}