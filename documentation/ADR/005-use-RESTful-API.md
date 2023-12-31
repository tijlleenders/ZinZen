# Use REST for backend integration

## Status

Accepted

## Context

Client needs to send/get messages from a cloud queue.

## Decision

Use RESTful API interface between clients and the cloud queue.

## Rationale

- Cheaper
- Simpler

## Consequences

- None; we already use RESTful API

## Alternatives considered

- Updates can have more latency. This is OK as the app is not for realtime chat - but asynchronous coordination on activities that do not require chatty interfacing to settle.

## Metadata

## Relevant issues/links

/

#### Proposed on

2023-12-31

#### Accepted on

2023-12-31
