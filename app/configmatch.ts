export const CONTRACT_ADDRESS = '0x6b541e26B2104507E243d1F6c8ead4645a983E79';

export const SAPPHIRE_TESTNET = {
  chainId: '0x5aff',
  networkParams: {
    chainId: '23295',
    chainName: 'Oasis Sapphire Testnet',
    nativeCurrency: {
      name: 'TEST',
      symbol: 'TEST',
      decimals: 18,
    },
    rpcUrls: ['https://testnet.sapphire.oasis.io'],
    blockExplorerUrls: ['https://testnet.explorer.sapphire.oasis.dev'],
  }
};

export const ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "person1",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "person2",
          "type": "address"
        }
      ],
      "name": "InfoRevealed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "username",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "interest",
          "type": "string"
        }
      ],
      "name": "NewInterest",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "username",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "beautyMetric",
          "type": "uint8"
        }
      ],
      "name": "NewProfile",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "person1",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "person2",
          "type": "address"
        }
      ],
      "name": "PrivateMatch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "username",
          "type": "string"
        }
      ],
      "name": "ProfileDeactivated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "username",
          "type": "string"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "age",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "bio",
              "type": "string"
            }
          ],
          "internalType": "struct PrivateDating.PersonalInfo",
          "name": "personal",
          "type": "tuple"
        },
        {
          "internalType": "string[]",
          "name": "interests",
          "type": "string[]"
        }
      ],
      "name": "createProfile",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deactivateProfile",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "startIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "count",
          "type": "uint256"
        }
      ],
      "name": "getActiveProfiles",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "usernames",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "username",
          "type": "string"
        }
      ],
      "name": "getPersonalInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "age",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "bio",
              "type": "string"
            }
          ],
          "internalType": "struct PrivateDating.PersonalInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        }
      ],
      "name": "getProfileByAddress",
      "outputs": [
        {
          "internalType": "string",
          "name": "username",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "username",
          "type": "string"
        }
      ],
      "name": "getPublicProfileInfo",
      "outputs": [
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "beautyMetric",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "wealthMetric",
          "type": "uint256"
        },
        {
          "internalType": "string[]",
          "name": "interests",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalProfiles",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getUserMatches",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "matches",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "liker",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        }
      ],
      "name": "hasLiked",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "person1",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "person2",
          "type": "address"
        }
      ],
      "name": "isMatch",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "username",
          "type": "string"
        }
      ],
      "name": "isUsernameTaken",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "targetUsername",
          "type": "string"
        }
      ],
      "name": "likeProfile",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "reactivateProfile",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "matchedPerson",
          "type": "address"
        }
      ],
      "name": "revealPersonalInfo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalProfiles",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "targetUsername",
          "type": "string"
        }
      ],
      "name": "unlikeProfile",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "usernameExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];