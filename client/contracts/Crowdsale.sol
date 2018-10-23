pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./SafeERC20.sol";
import "./Whitelist.sol";
import "./IController.sol";
import "./Token.sol";

/**
 * @title Crowdsale
 * @dev Crowdsale is a base contract for managing a token crowdsale,
 * allowing investors to purchase tokens with ether. This contract implements
 * such functionality in its most fundamental form and can be extended to provide additional
 * functionality and/or custom behavior.
 * The external interface represents the basic interface for purchasing tokens, and conform
 * the base architecture for crowdsales. They are *not* intended to be modified / overridden.
 * The internal interface conforms the extensible and modifiable surface of crowdsales. Override
 * the methods to add functionality. Consider using 'super' where appropriate to concatenate
 * behavior.
 */
contract Crowdsale is Whitelist {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  // The token being sold
  IERC20 private _token;

  IController private _TEcontroller = IController(0x3Eb8344a5f13a712eE2cf47bD1b32CAdde2Bc353);
  address private _TEwallet = 0x0471fbe8D691B37591Ba715B5F93827E53c07669;

  address private _wallet;
  uint256 private _rate;
  bool private _whitelisting;
  bool private _burnUnsoldTokens;

  bool private _fixDates;
  uint256 private _startDate = 0;
  uint256 private _finishDate = 0;
  uint256 private _tokensAmont = 0;

  uint256 private _minLimit = 0;
  uint256 private _maxLimit = 0;

  uint256 private _weiRaised;
  uint256 private _tokensSold;
  uint256 private _buyersAmount;

  struct Stage {
      uint256 rate;
      uint256 tokensAmount;
      uint256 startDate;
      uint256 finishDate;
  }

  Stage[] private stages;

  /**
   * Event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param beneficiary who got the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokensPurchased(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

  /**
   * Constructor
   */
  constructor(IERC20 token, address wallet, bool whitelisting, bool burnUnsoldTokens) public {
    _token = token;
    _wallet = wallet;
    _whitelisting = whitelisting;
    _burnUnsoldTokens = burnUnsoldTokens;

    _TEcontroller.addCrowdsaleToUser(msg.sender, address(this));
  }

  // If user wants one stage for all
  function setValues(uint256 rate, uint256 tokensAmount, uint256 minLimit, uint256 maxLimit, uint256 startDate, uint256 finishDate) external onlyOwner {
    _fixDates = true;

    _rate = rate;
    _tokensAmont = tokensAmount;
    _startDate = startDate;
    _finishDate = finishDate;
    _minLimit = minLimit;
    _maxLimit = maxLimit;
  }

  // If user wants many stages
  function setStages(uint256 [] rates, uint256 [] tokensAmount, uint256 [] startDates, uint256 [] finishDates) external onlyOwner {
    _fixDates = false;

    uint256 i = 0;
    for (i = 0; i < rates.length; i++) {
      Stage memory stage = Stage(rates[i], tokensAmount[i], startDates[i], finishDates[i]);
      stages.push(stage);
    }
  }


  // -----------------------------------------
  // Crowdsale getters
  // -----------------------------------------

  function getState() external view returns(address, uint256, uint256, uint256, uint256 ,bool, bool, bool) {
    return (
        _wallet,
        _weiRaised,
        _tokensSold,
        _buyersAmount,
        _TEcontroller.getCreationDateOfContract(address(this)),
        _whitelisting,
        _burnUnsoldTokens,
        _fixDates
    );
  }

  function getSingleStageInfo() external view returns(uint256, uint256, uint256, uint256, uint256, uint256) {
    return (
        _rate,
        availableTokens(),
        _startDate,
        _finishDate,
        _minLimit,
        _maxLimit
    );
  }

  function getMultistageInfo() external view returns (uint256, uint256, uint256, uint256) {
    uint256 i;
    while(i < stages.length) {
      if(stages[i].startDate < block.timestamp && stages[i].finishDate > block.timestamp) {
          return (stages[i].rate, stages[i].tokensAmount, stages[i].startDate, stages[i].finishDate);
      }
      i++;
    }

  }

  function getStagesLength() external view returns(uint256) {
      return stages.length;
  }


  // -----------------------------------------
  // Crowdsale external interface
  // -----------------------------------------

  /**
   * @dev fallback function ***DO NOT OVERRIDE***
   */
  function () external payable {
    buyTokens(msg.sender);
  }

  /**
   * @dev low level token purchase ***DO NOT OVERRIDE***
   * @param beneficiary Address performing the token purchase
   */
  function buyTokens(address beneficiary) public payable {
    uint256 weiAmount = msg.value;
    _preValidatePurchase(beneficiary, weiAmount);

    uint256 tokens = 0;

    if(!_fixDates) {
        Stage storage stage = _returnStage();
        tokens = _getTokenAmount(weiAmount, stage.rate);
        require(stage.tokensAmount.sub(tokens) >= 0);

        stage.tokensAmount = stage.tokensAmount.sub(tokens);
    } else {
        tokens = _getTokenAmount(weiAmount, _rate);
        _minMaxValidation(tokens);
    }

    // update state
    _weiRaised = _weiRaised.add(weiAmount);
    _tokensSold = _tokensSold.add(tokens);

    _processPurchase(beneficiary, tokens);
    emit TokensPurchased(
      msg.sender,
      beneficiary,
      weiAmount,
      tokens
    );

    _forwardFunds();
  }

  // -----------------------------------------
  // Internal interface (extensible)
  // -----------------------------------------

  /**
   * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use `super` in contracts that inherit from Crowdsale to extend their validations.
   * Example from CappedCrowdsale.sol's _preValidatePurchase method:
   *   super._preValidatePurchase(beneficiary, weiAmount);
   *   require(weiRaised().add(weiAmount) <= cap);
   * @param beneficiary Address performing the token purchase
   * @param weiAmount Value in wei involved in the purchase
   */
  function _preValidatePurchase( address beneficiary, uint256 weiAmount ) internal view {
    require(beneficiary != address(0));
    require(weiAmount != 0);
    if(_whitelisting) {
        checkRole(beneficiary, "whitelist"); // if whitelisted
    }
  }

  /**
   * @dev Checking tokens amount for min max limits
   * @param tokensAmount Amount of tokens
   */
  function _minMaxValidation( uint256 tokensAmount ) internal view {
    require(tokensAmount.mul(1 ether) >= _minLimit);
    require(tokensAmount.mul(1 ether) < _maxLimit);
  }

  /**
   * @dev Detect stage by date
   */
  function _returnStage() internal view returns (Stage storage) {
      uint256 i;
      bool isOpen = false;

      for (i = 0; i < stages.length; i++) {
          if(stages[i].startDate < block.timestamp && stages[i].finishDate > block.timestamp) {
              Stage storage stage = stages[i];
              isOpen = true;
          }
      }

      require(isOpen);
      return stage;
  }

  /**
   * @dev Executed when a purchase has been validated and is ready to be executed. Not necessarily emits/sends tokens.
   * @param beneficiary Address receiving the tokens
   * @param tokenAmount Number of tokens to be purchased
   */
  function _processPurchase(address beneficiary, uint256 tokenAmount) internal {
    _deliverTokens(beneficiary, tokenAmount);
  }

  /**
   * @dev Source of tokens. Override this method to modify the way in which the crowdsale ultimately gets and sends its tokens.
   * @param beneficiary Address performing the token purchase
   * @param tokenAmount Number of tokens to be emitted
   */
  function _deliverTokens(address beneficiary, uint256 tokenAmount) internal {
    if(_token.balanceOf(beneficiary) == 0) _buyersAmount = _buyersAmount.add(1);
    _token.safeTransfer(beneficiary, tokenAmount);
  }

  /**
   * @dev Override to extend the way in which ether is converted to tokens.
   * @param weiAmount Value in wei to be converted into tokens
   * @return rate of tokens that can be purchased with the specified _weiAmount
   */
  function _getTokenAmount(uint256 weiAmount, uint256 rate) internal pure returns (uint256) {
    return weiAmount.mul(rate);
  }

  /**
   * @dev Calculating fee for service
   */
  function _getFee(uint256 amount) internal pure returns (uint256) {
      return amount.mul(396).div(10000); // 3.96% from each incoming transaction
  }

  /**
   * @dev Determines how ETH is stored/forwarded on purchases.
   */
  function _forwardFunds() internal {
     uint256 fee = _getFee(msg.value);

    _TEwallet.transfer(fee);
    _wallet.transfer(msg.value.sub(fee));
  }

  // -----------------------------------------
  // Externall methods
  // -----------------------------------------

  /**
   * @return burn all unsold tokens from contract
   */
  function burnUnsold() public onlyOwner {
    require(_burnUnsoldTokens);

    uint256 currentBalance = _token.balanceOf(address(this));
    _token.burn(currentBalance);
  }

  function addToWhiteList(address beneficiary) public onlyOwner {
      require(_whitelisting);
      super.addAddressToWhitelist(beneficiary);
  }

  // -----------------------------------------
  // Crowdsale getters
  // -----------------------------------------

  /**
   * @return the token being sold.
   */
  function token() public view returns(IERC20) {
    return _token;
  }

  /**
   * @return the address where funds are collected.
   */
  function wallet() public view returns(address) {
    return _wallet;
  }

  /**
   * @return the number of token units a buyer gets per wei.
   */
  function rate() public view returns(uint256) {
    return _rate;
  }

  /**
   * @return the number available tokens in this address
   */
  function availableTokens() public view returns(uint256) {
    return _token.balanceOf(address(this));
  }

  /**
   * @return the mount of wei raised.
   */
  function weiRaised() public view returns (uint256) {
    return _weiRaised;
  }

  /**
   * @return the amount of sold tokens
   */
  function tokensSold() public view returns (uint256) {
      return _tokensSold;
  }

}
