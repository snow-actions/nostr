# snow-actions/nostr

Send EVENT to Nostr.

## Usage

```yml
steps:
  - uses: snow-actions/nostr@v2.0.0
    with:
      relays: ${{ vars.NOSTR_RELAYS }}
      private-key: ${{ secrets.NOSTR_PRIVATE_KEY }}
      content: |
        Text message
    id: publish
  - run: echo "${event}"
    env:
      event: ${{ steps.publish.outputs.event }}
```

Other examples are [`test.yml`](.github/workflows/test.yml).

## Inputs

See [action.yml](action.yml)

| Name          | Description                                | Default | Required |
| ------------- | ------------------------------------------ | ------- | -------- |
| `relays`      | Relay URLs `wss://...` (separated by `\n`) | -       | yes      |
| `private-key` | Private key (nsec or hex)                  | -       | yes      |
| `content`     | Content                                    | `''`    | no       |
| `kind`        | Kind                                       | `1`     | no       |
| `tags`        | Tags (YAML or JSON)                        | `[]`    | no       |

## Outputs

See [action.yml](action.yml)

| Name    | Description     |
| ------- | --------------- |
| `event` | Published event |

## Supported

### Runners

- `ubuntu-*`
- `windows-*`
- `macos-*`
- `self-hosted`
  - GitHub Actions Runner v2.327.0 or later
  - ARM32 and macOS 13.4 or earlier are not supported

### Events

- Any

## Dependencies

- Node.js v24
- See [package.json](package.json)

## Contributing

Welcome.
