# Put this into individual component repositories
name: Publish version
on:
  # just for EXAMPLE
  workflow_dispatch:
  # just for EXAMPLE

jobs:
  publish:
    name: Publish awesome artifact
    runs-on: ubuntu-latest
    steps:
      # MOCK - example build step
      - id: 'build_artifact'
        run: |
          echo "::set-output name=name::improved-rotary-phone"
          echo "::set-output name=version::3.4.5"
      # MOCK - example build step

      # place this action LAST
      - uses: Drill4J/vee-table@0.0.0
        with:
          # leave everything "as-is"
          github-access-token: ${{ secrets.VEE_TABLE_TOKEN }}
          action-type: 'add-version'
          ledger-repo-url: 'https://github.com/Drill4J/vee-ledger'
          ledger-repo-owner: 'Drill4J'
          ledger-repo-name: 'vee-ledger'
          version-component-id: ${{ github.event.repository.name }}
          # leave everything "as-is"

          # steps.build_artifact is your step, where new version tag is created
          version-tag: ${{ steps.build_artifact.outputs.version }} # Pass new version tag
