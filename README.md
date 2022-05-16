### Single page app to watch the live stream with interactive overlay

[![Staging Deployment](https://github.com/ninja-syndicate/supremacy-play-web/actions/workflows/deploy-staging.yml/badge.svg)](https://github.com/ninja-syndicate/supremacy-play-web/actions/workflows/deploy-staging.yml)

[CD Docs](.github/workflows/README.md)

```
npm start
play-web: https://play.supremacygame.io
passport-web: https://passport.xsyndev.io
```

### New WS System Examples

-   replace the `xxxxxxxxx` with the ws URI
-   replace `YYY` with the corresponding hook of your need, see `src/hooks/useGameServer.ts`

#### Fetching:

```
const { send } = useGameServerCommandsYYY("xxxxxxxxx")

useEffect(() => {
	;(async () => {
		try {
			const resp = await send<RESPONSE_TYPE>(GameServerKeys.XXXXXX, {
				payload: something,
			})

			if (!resp) return
			setFactionsData(resp)
		} catch (e) {
			console.error(e)
		}
	})()
}, [send])
```

#### Subscription:

If the payload is used directly:

```
const payload = useGameServerSubscriptionYYY<RESPONSE_TYPE>({
	URI: "/xxxxxxxxx",
	key: GameServerKeys.SomeKey,
})
```

If there's logic to do with the payload:

```
useGameServerSubscriptionYYY<RESPONSE_TYPE>(
	{
		URI: "/xxxxxxxxx",
		key: GameServerKeys.SomeKey,
	},
	(payload) => {
		if (!payload) return
		setState(payload)
	},
)

```

### Environment:

```
export NINJA_NPM_TOKEN=[get from BitWarden, string]
export REACT_APP_TOKEN_SALE_PAGE=[token sale page, string]
export REACT_APP_SUPREMACY_PAGE=[supremacy home page, string]
export REACT_APP_PASSPORT_WEB=[passport web url including protocol, string]
export REACT_APP_GAME_SERVER_HOST=[game server address excluding protocol, string]
export REACT_APP_PASSPORT_SERVER_HOST=[passport server address excluding protocol, string]
export REACT_APP_LOG_API_CALLS=[whether to console log ws and rest api calls, true/false]
export REACT_APP_PRISMIC_ACCESS_TOKEN=[prismic access token, string]
```
