# snow-actions/nostr

Send EVENT to Nostr.

## Usage

```yml
steps:
  - uses: snow-actions/nostr@v1.0.0
    with:
      relay: ${{ vars.NOSTR_RELAY }}
      private-key: ${{ secrets.NOSTR_PRIVATE_KEY }}
      content: |
        Text message
```

## Inputs

See [action.yml](action.yml)

| Name | Description | Default | Required |
| - | - | - | - |
| `relay` | Relay URL `wss://...` | - | yes |
| `private-key` | Private key hex | - | yes |
| `content` | Content | - | yes |

## Supported

### Runners

- `ubuntu-*`
- `windows-*`
- `macos-*`
- `self-hosted`

### Events

- Any

## Dependencies

- Node.js 16
- [@actions/core](https://www.npmjs.com/package/@actions/core)
- [@noble/secp256k1](https://www.npmjs.com/package/@noble/secp256k1)
- [ws](https://www.npmjs.com/package/ws)

## Contributing

Welcome.
