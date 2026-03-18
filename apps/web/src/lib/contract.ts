import { MONDETO_PROXY, USDT_MAINNET, USDT_SEPOLIA } from '@/constants/map'

export { MONDETO_PROXY, USDT_MAINNET, USDT_SEPOLIA }

// Mondeto implementation ABI — extracted from Mondeto.sol
export const MONDETO_ABI = [
  // Views
  {
    inputs: [],
    name: 'config',
    outputs: [
      { name: 'width', type: 'uint16' },
      { name: 'height', type: 'uint16' },
      { name: 'halvingTime', type: 'uint256' },
      { name: '_initialPrice', type: 'uint256' },
      { name: '_minPrice', type: 'uint256' },
      { name: '_deployTimestamp', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'x', type: 'uint16' },
      { name: 'y', type: 'uint16' },
      { name: 'w', type: 'uint16' },
      { name: 'h', type: 'uint16' },
    ],
    name: 'getPixelBatch',
    outputs: [{ name: '', type: 'bytes' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'ids', type: 'uint256[]' }],
    name: 'selectionPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'x', type: 'uint16' },
      { name: 'y', type: 'uint16' },
      { name: 'w', type: 'uint16' },
      { name: 'h', type: 'uint16' },
    ],
    name: 'rectanglePrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'x', type: 'uint16' },
      { name: 'y', type: 'uint16' },
    ],
    name: 'priceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'x', type: 'uint16' },
      { name: 'y', type: 'uint16' },
    ],
    name: 'isLand',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'x', type: 'uint16' },
      { name: 'y', type: 'uint16' },
    ],
    name: 'pixelId',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'uint256' }],
    name: 'pixels',
    outputs: [
      { name: 'owner', type: 'address' },
      { name: 'saleCount', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'address' }],
    name: 'profiles',
    outputs: [
      { name: 'color', type: 'uint24' },
      { name: 'label', type: 'bytes' },
      { name: 'url', type: 'bytes' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentEpoch',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'WIDTH',
    outputs: [{ name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'HEIGHT',
    outputs: [{ name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initialPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'deployTimestamp',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions
  {
    inputs: [{ name: 'ids', type: 'uint256[]' }],
    name: 'buyPixels',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'color', type: 'uint24' },
      { name: 'label', type: 'string' },
      { name: 'url', type: 'string' },
    ],
    name: 'updateProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Errors
  { inputs: [{ name: 'id', type: 'uint256' }], name: 'NotLand', type: 'error' },
  { inputs: [{ name: 'id', type: 'uint256' }], name: 'InvalidPixelId', type: 'error' },
  { inputs: [], name: 'InvalidCoordinates', type: 'error' },
  { inputs: [], name: 'OutOfBounds', type: 'error' },
  { inputs: [], name: 'LabelTooLong', type: 'error' },
  { inputs: [], name: 'UrlTooLong', type: 'error' },
  { inputs: [], name: 'InvalidMaskLength', type: 'error' },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'buyer', type: 'address' },
      { indexed: false, name: 'ids', type: 'uint256[]' },
      { indexed: false, name: 'totalCost', type: 'uint256' },
    ],
    name: 'PixelsPurchased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: false, name: 'color', type: 'uint24' },
      { indexed: false, name: 'label', type: 'bytes' },
      { indexed: false, name: 'url', type: 'bytes' },
    ],
    name: 'ProfileUpdated',
    type: 'event',
  },
] as const

// Standard ERC20 ABI for approve + balanceOf
export const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
