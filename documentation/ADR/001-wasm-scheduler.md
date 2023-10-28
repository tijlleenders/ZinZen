# Title

Stateless WASM scheduler using Rust

# Status

Accepted

# Context

1. The scheduler is a component that is not tightly coupled to the frontend. You could, for example, re-use the scheduler function with a different frontend - or even CLI.
2. Javascript is not able to deliver the required performance for the scheduling algorithm.
3. A stateful scheduler model is more complex to reason about.

# Decision

The scheduler is a stateless function that is implemented by a WASM module.  
This enforces a clean API separation and contract - and enables different frontends that can all use the same decoupled scheduler component.

# Consequences

1. We maintain the scheduler component in a separate repo, so that the issues/language/dev/code/... concerns are decoupled.
2. Whenever there is a new scheduler version we need to do integration testing.  
   Right now this is done by manually calling a script in the ZinZen repo: [update_artifact_script/update_artifacts.sh](https://github.com/tijlleenders/ZinZen/blob/83757b5ffc220ed7677b2eb89461406d6ca5baf2/update_artifact_script/update_artifacts.sh) - which then creates a PR.
3. We need a formal contract to bind the two components, and to figure out where the issue is when the final product has an issue. Issue [#722](https://github.com/tijlleenders/ZinZen/issues/722) fixes the schema - and the `input.json` and `expected.json` files in [this scheduler directory](https://github.com/tijlleenders/ZinZen-scheduler/tree/7c31343c1da3b891dcb903260764f8fe0fc18ab4/tests/jsons/stable) document the behavior.

# Alternatives considered

Keep the scheduler integrated with the TypeScript repo and try to optimize it.  
There was a also version written in C was attempted at some point - but it was hard to understand and requires experience and caution to develop for. Using WASM (with Rust) is judged a more future-proof way of getting the maximal performance, as well as a bit of built-in footgun protection.

# Metadata

#### Relevant issues/links

Schema contract : Issue [#722](https://github.com/tijlleenders/ZinZen/issues/722) fixes the schema.  
Behavior 'contract': The `input.json` and `expected.json` files in [this scheduler directory](https://github.com/tijlleenders/ZinZen-scheduler/tree/7c31343c1da3b891dcb903260764f8fe0fc18ab4/tests/jsons/stable) document the behavior.

#### Proposed on

[2021-11-04](https://blog.zinzen.me/2021/11/04/App-update.html)

#### Accepted on

2021-11-04
