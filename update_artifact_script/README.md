Run the `update_artifacts.sh` script to update `ZinZen` with the latest version of the wasm build from the `ZinZen-scheduler` repo. If there is a new version available, this script will retrieve it and create a PR on the `ZinZen` repo to add the new build (i.e. a PR to update the `pkg` directory).

## How to run the script

From your local clone of the `ZinZen` repo, navigate to the `update_artifact_script` directory, and run `./update_artifacts.sh` from the command line.

## Prerequisites

- Run on Ubuntu (any Debian based distro should work but only tested on Ubuntu).
- You should be using SSH authentication on the repo, not https (otherwise it will pause asking for credentials)
- You should have Github CLI installed
- Before running the script, you must have the GITHUB_TOKEN environmental variable set with a token that has `repo` scope. You can set the environment variable by running `export GITHUB_TOKEN={Your github token}`