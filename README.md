# snow-actions/nostr

Send EVENT to Nostr.

## Usage

```yml
steps:
  - uses: snow-actions/nostr@v1.3.0
    with:
      relays: |
        ${{ vars.NOSTR_RELAY_1 }}
        ${{ vars.NOSTR_RELAY_2 }}
      private-key: ${{ secrets.NOSTR_PRIVATE_KEY }}
      content: |
        Text message
    id: publish
  - run: echo "${event}"
    env:
      event: ${{ steps.publish.outputs.event }}
```

## Inputs

See [action.yml](action.yml)

| Name | Description | Default | Required |
| - | - | - | - |
| `relays` | Relay URLs `wss://...` (separated by `\n`) | - | yes |
| `private-key` | Private key (nsec or hex) | - | yes |
| `content` | Content | - | yes |

## Outputs

See [action.yml](action.yml)

| Name | Description |
| - | - |
| `event` | Published event |

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
- See [package.json](package.json)

## Contributing

Welcome.
