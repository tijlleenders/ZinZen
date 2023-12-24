# 002 Location of computation

# Accepted

# Context

ZinZen® is a distributed system of individuals exchanging information asynchronously.  
There is some logic involved:

- who needs to be notified of what/when/how?
- what needs to be done with incoming notifications?

Should this logic be done on people's devices - or partly offloaded to the intermediate message queueing infrastructure? In other words: should the 'cloud' be smart?

# Decision

The 'cloud' between devices should be as dumb as possible.  
Anything that can be done on the device, should be done on the device.

# Rationale

- The better we mimick the domain as it is in real life - the less accidental complexity we'll introduce.
- Less computation in the cloud makes it easier for ZinZen® to be used without any subscription - or at least lower the costs as much as possible.
- Less chance of being manipulated through selective information distribution in a non-transparent cloud. You can still be selective in what you want to receive, but the control is in your hands, visible on your device.
- Better privacy. A dumb pipe can be end-to-end encrypted for private messages.
- Better portability. The central point of trust might become an issue, for a number of reasons (cost, privacy, etc). The simpler the central infra is - the easier it is to replace it with a different architecture or provider.

# Consequences

More logic in/on device inboxes and outboxes.

# Alternatives considered

Make an more intelligent central routing point. That would be simpler to upgrade (single deployment target). That is the only benefit as far as I can see now.

# Metadata

#### Relevant issues/links

/

#### Proposed on

2023-12-24

#### Accepted on

2023-12-24
