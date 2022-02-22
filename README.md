### Single page app to watch the live stream with interactive overlay

[![Staging Deployment](https://github.com/ninja-syndicate/supremacy-stream-site/actions/workflows/deploy-staging.yml/badge.svg)](https://github.com/ninja-syndicate/supremacy-stream-site/actions/workflows/deploy-staging.yml)

[CD Docs](.github/workflows/README.md)

```
npm start
```

#### Environment:

```
export NINJA_NPM_TOKEN=[get from BitWarden]
export REACT_APP_PASSPORT_WEB=[passport web url]
export REACT_APP_GAME_SERVER_HOST=[game server address]
export REACT_APP_PASSPORT_SERVER_HOST=[passport server address]
export REACT_APP_LOG_API_CALLS=[whether to console log ws and rest api calls, true/false]
```
