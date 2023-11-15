### Check out the app online: [stable version](https://ZinZen.me) or [latest version](https://zinzen.vercel.app/)

[stable version](https://ZinZen.me) : ![prod-build](https://codebuild.eu-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiTVhIQm9DQzB0ZDNUVGJnemRuZVVwNUdnMHZQS1ZodGpzV3dydFl5NFowbUNIOHhpT2dpZi9ESWt0Qktyd2pwNXNZdkZTQ3JkS1F0emVtMHk2QnFiU2o0PSIsIml2UGFyYW1ldGVyU3BlYyI6ImcvTUtUOEtjbGYxQXptZ0QiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)

...or run a pure local copy:

```
git clone https://github.com/tijlleenders/ZinZen.git
cd ZinZen
npm install
npm run dev
```

To run the development server with hosting accessible on a mobile device, use:

```
npm run dev -- --host
```

## Frameworks used

UI : ~~react-bootstrap~~ antd  
Testing : Cypress  
CI/CD : GithubActions and Vercel  
Internationalization : i18next  
Progressive Web App : workbox  
Animations : just CSS

## Architectural decisions

If an important architectural decision is made, it is best practice to document it as an ADR (Architectural Decision Record).
This way there is always a reference of what architectural decisions are already made. You can find them in [the ADR folder](../ADR).
