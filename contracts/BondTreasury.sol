// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-0.8/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-0.8/access/Ownable.sol";
import "hardhat/console.sol";

interface IOracle {
    function update() external;
    function consult(address _token, uint256 _amountIn) external view returns (uint144 amountOut);
    function twap(address _token, uint256 _amountIn) external view returns (uint144 _amountOut);
}

interface IUniswapV2Pair {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function PERMIT_TYPEHASH() external pure returns (bytes32);
    function nonces(address owner) external view returns (uint);

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function MINIMUM_LIQUIDITY() external pure returns (uint);
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function kLast() external view returns (uint);

    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function skim(address to) external;
    function sync() external;

    function initialize(address, address) external;
}

contract BondTreasury is Ownable {

    struct Asset {
        bool isAdded;
        uint256 multiplier;
        address oracle;
        bool isLP;
        address pair;
    }

    IERC20 public WFTM = IERC20(0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83);
    IERC20 public Tomb;
    IOracle public TombOracle;

    mapping (address => Asset) assets;

    uint256 public bondThreshold = 20 * 1e4;
    uint256 public bondFactor = 1 * 1e6;

    uint256 public constant DENOMINATOR = 1e6;

    /*
     * ---------
     * MODIFIERS
     * ---------
     */
    
    // Only allow a function to be called with a bondable asset

    modifier onlyAsset(address token) {
        require(assets[token].isAdded, "BondTreasury: token is not a bondable asset");
        _;
    }

    /*
     * --------------------
     * RESTRICTED FUNCTIONS
     * --------------------
     */
    
    // Set bonding parameters of token
    
    function setAsset(
        address token,
        bool isAdded,
        uint256 multiplier,
        address oracle,
        bool isLP,
        address pair
    ) external onlyOwner {
        assets[token].isAdded = isAdded;
        assets[token].multiplier = multiplier;
        assets[token].oracle = oracle;
        assets[token].isLP = isLP;
        assets[token].pair = pair;
    }

    /*
     * --------------
     * VIEW FUNCTIONS
     * --------------
     */

    // Calculate Tomb return of bonding amount of token

    function getTombReturn(address token, uint256 amount) public view onlyAsset(token) returns (uint256) {
        uint256 tokenPrice = getTokenPrice(token);
        uint256 bondPremium = getBondPremium();
        return amount * tokenPrice * (bondPremium + DENOMINATOR) / DENOMINATOR;
    }

    // Calculate premium for bonds based on bonding curve

    function getBondPremium() public view returns (uint256) {
        uint256 tombPrice = 150 * 1e18 / 100;//getTombPrice();
        if (tombPrice < 1e18) return 0;

        uint256 tombPremium = tombPrice * DENOMINATOR / 1e18 - DENOMINATOR;
        if (tombPremium < bondThreshold) return 0;
        return (tombPremium - bondThreshold) * bondFactor / DENOMINATOR;
    }

    // Get TOMB price from Oracle

    function getTombPrice() public view returns (uint256) {
        return TombOracle.consult(address(Tomb), 1e18);
    }

    // Get token price from Oracle

    function getTokenPrice(address token) public view onlyAsset(token) returns (uint256) {
        Asset memory asset = assets[token];
        uint256 tokenPrice = IOracle(asset.oracle).consult(token, 1e18);
        if (!asset.isLP) return tokenPrice;

        IUniswapV2Pair Pair = IUniswapV2Pair(asset.pair);
        uint256 totalPairSupply = Pair.totalSupply();
        address token0 = Pair.token0();
        (uint256 reserve0, uint256 reserve1,) = Pair.getReserves();

        if (token0 == token) {
            return tokenPrice * reserve0 * 1e18 / totalPairSupply +
                   reserve1 * 1e18 / totalPairSupply;
        } else {
            return tokenPrice * reserve1 * 1e18 / totalPairSupply +
                   reserve0 * 1e18 / totalPairSupply;
        }
    }

}