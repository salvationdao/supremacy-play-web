### Single page app to watch the live stream with interactive overlay

[![Staging Deployment](https://github.com/ninja-syndicate/supremacy-play-web/actions/workflows/deploy-staging.yml/badge.svg)](https://github.com/ninja-syndicate/supremacy-play-web/actions/workflows/deploy-staging.yml)

[CD Docs](.github/workflows/README.md)

## Common Components (templates)

```
<ClipThing
	clipSize="10px"
	border={{
		isFancy: true,
		borderColor: "#FF0000",
		borderThickness: ".3rem",
	}}
	corners={{
		topLeft: true,
		topRight: true,
		bottomLeft: true,
		bottomRight: true,
	}}
	opacity={0.7}
	backgroundColor="#333333"
	sx={{ height: "100%" }}
>
	<Stack sx={{ height: "100%" }}>
		CONTENT
	</Stack>
</ClipThing>


<FancyButton
	excludeCaret
	clipThingsProps={{
		clipSize: "9px",
		backgroundColor: "#333333",
		opacity: 1,
		border: { isFancy: true, borderColor: "#FF0000", borderThickness: "2px" },
		sx: { position: "relative" },
	}}
	sx={{ px: "1.6rem", py: ".6rem", color: "#FF0000" }}
	onClick={onClick}
>
	<Typography
		variant="caption"
		sx={{
			color: "#FF0000",
			fontFamily: fonts.nostromoBlack,
		}}
	>
		GO TO ASSET STORE
	</Typography>
</FancyButton>
```

## Dev Links

-   play-web: `https://play.supremacygame.io`
-   passport-web: `https://passport.xsyndev.io`

## New WS System Examples

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
		} catch (err) {
            const message = typeof err === "string" ? err : "Failed to get key card listings."
            newSnackbarMessage(message, "error")
            setLoadError(message)
            console.error(err)
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

## Environment:

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
