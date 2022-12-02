### Single page app to watch the live stream with interactive overlay

[![Staging Deployment](https://github.com/ninja-syndicate/supremacy-play-web/actions/workflows/deploy-staging.yml/badge.svg)](https://github.com/ninja-syndicate/supremacy-play-web/actions/workflows/deploy-staging.yml)

[CD Docs](.github/workflows/README.md)

## Dev Links

-   play-web: `https://play.supremacygame.io`
-   passport-web: `https://passport.xsyndev.io`

## New WS System Examples

-   replace the `xxxxxxxxx` with the ws URI
-   replace `YYY` with the corresponding hook of your need, see `src/hooks/useGameServer.ts`

#### Fetching:

```ts
const { send } = useGameServerCommandsYYY("xxxxxxxxx")

useEffect(() => {
    ;(async () => {
        try {
            setIsLoading(true)
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
        } finally {
            setIsLoading(true)
        }
    })()
}, [send])
```

#### Subscription:

If the payload is used directly:

```ts
const payload = useGameServerSubscriptionYYY<RESPONSE_TYPE>({
    URI: "/xxxxxxxxx",
    key: GameServerKeys.SomeKey,
})
```

If there's logic to do with the payload:

```ts
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

#### PixiJS Template:

```ts
import React, { useEffect, useState } from "react"
import { useMiniMapPixi } from "../../../../../containers"

export const PixiComponent = React.memo(function PixiComponent() {
    const { pixiMainItems } = useMiniMapPixi()
    const [xxxxxxxxxxxx, setYYYYYYYYYYY] = useState<PixiObject>()

    // Initial setup
    useEffect(() => {
        if (!pixiMainItems) return
        const xxxxxxxxxxxx = new PixiObject("#FFFFFF")
        // pixiMainItems.app.stage.addChild(xxxxxxxxxxxx.root)
        pixiMainItems.viewport.addChild(xxxxxxxxxxxx.root)
        setYYYYYYYYYYY((prev) => {
            prev?.destroy()
            return xxxxxxxxxxxx
        })
    }, [pixiMainItems])

    // Cleanup
    useEffect(() => {
        return () => xxxxxxxxxxxx?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [xxxxxxxxxxxx])

    // Update something when state changes
    useEffect(() => {
        if (!xxxxxxxxxxxx) return

        xxxxxxxxxxxx.updateColor(color)
    }, [color, xxxxxxxxxxxx])

    return null
})

import * as PIXI from "pixi.js"

export class PixiObject {
    root: PIXI.Container<PIXI.DisplayObject>
    private graphics: PIXI.Graphics
    private color: string
    private animationFrame: number | undefined

    constructor(color: string) {
        this.color = color

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = pixiViewportZIndexes.xxxxxx
        this.root.sortableChildren = true

        this.graphics = new PIXI.Graphics()

        // Add everything to container
        this.root.addChild(this.graphics)

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy()
    }

    render() {
        const step = () => {
            // Perform something every render
            this.animationFrame = requestAnimationFrame(step)
        }
        this.animationFrame = requestAnimationFrame(step)
    }
}
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
