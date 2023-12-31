# Title

Use next js

# Status

We have made the decision to test switching our app to Next.js.

Update 2023-12-31 :  
Holding off on trying this out as the PWA plugins are not mature/popular for the latest version of NextJS (14).  
[Comparison of plugins](https://npmtrends.com/@ducanh2912/next-pwa-vs-next-offline-vs-next-pwa) Maybe there will be some official comments from Vercel/NextJS on PWA?

# Context

Our app currently relies heavily on offline functionality, with 80% of the features being offline and 20% online. The codebase has become bulky, and we are managing a significant number of states to connect components and handle features.

# Decision

The decision is to transition to Next.js as our framework for building the app.

# Rationale

1. **Server-Side Rendering (SSR):** Next.js provides built-in support for SSR, improving initial page load times and enhancing SEO by delivering fully rendered pages to the client.

2. **Automatic Code Splitting:** Next.js enables automatic code splitting, allowing for optimized loading of only the necessary code chunks, leading to faster page loads.

3. **Simple API Routes:** Next.js simplifies API routing with a straightforward and intuitive system, making it easier to handle server-side logic and data fetching.

4. **File-Based Routing:** Next.js follows a file-based routing system, reducing the need for complex route configurations. Each component file in the "pages" directory becomes a route, streamlining the development process.

5. **Automatic Prefetching:** The framework automatically prefetches linked pages during navigation, improving user experience by preloading necessary resources in the background.

6. **Enhanced Development Experience:** Next.js provides a great development experience with features like hot module replacement (HMR), allowing developers to see changes in real-time without a full page refresh.

7. **Built-in CSS Support:** Next.js has built-in support for styling solutions, making it easy to handle CSS-in-JS, Sass, and other styling methodologies without additional configurations.

8. **Static Site Generation (SSG):** In addition to SSR, Next.js supports static site generation, allowing the pre-rendering of pages at build time, which is beneficial for content-heavy websites.

9. **Optimized Performance:** With features like automatic code splitting, server-side rendering, and optimized asset loading, Next.js contributes to a performant web application with improved speed and responsiveness.

10. **Community and Ecosystem:** Next.js benefits from the larger React ecosystem while providing additional features and conventions, fostering a robust and growing community around the framework.

# Consequences

1. **Learning Curve:** Team members will need to familiarize themselves with Next.js, which may pose a short-term challenge.
2. **Migration Effort:** Migrating from our current codebase to Next.js will require careful planning and execution to avoid disruptions in the app's functionality.

3. **Dependencies:** We need to review and update dependencies to ensure compatibility with Next.js.

# Alternatives considered

Explain the (dis)advantages:

- Adding NextJS might not be worth the benefits - as this is a framework that is focused on Server-Client apps - not offline-first apps. Of all the 'benefits' listed in the rationale I'mn not sure how many apply to a PWA - as everything is done on the client... unless the client side can be split in a client-client and a client-server; so a server 'inside' the client.
- Dependence / coupling with Vercel

# Metadata

#### Relevant issues/links

/

#### Proposed on

2023-12-25

#### Accepted on

2023-12-25

#### Updated on

2023-12-31
