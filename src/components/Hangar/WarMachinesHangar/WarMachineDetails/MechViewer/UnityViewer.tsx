import { Box, Fade, LinearProgress, Typography } from "@mui/material"
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { Unity, useUnityContext } from "react-unity-webgl"
import { DEVELOPMENT_BUILD_NUM, DEV_ONLY, WEBGL_BASE_URL } from "../../../../../constants"
import { useTheme } from "../../../../../containers/theme"
import { pulseEffect } from "../../../../../theme/keyframes"
import { colors, fonts } from "../../../../../theme/theme"
import { ClipThing } from "../../../../Common/ClipThing"
import { LoadoutMechSkin, LoadoutPowerCore, LoadoutWeapon } from "../MechLoadout/MechLoadout"
import { MechViewer3DProps } from "./MechViewer3D"

export type UnityHandle = {
    handleUnload: () => Promise<void>
    handleWeaponUpdate: (wu: LoadoutWeapon) => void
    handlePowerCoreUpdate: (pcu: LoadoutPowerCore) => void
    handleMechSkinUpdate: (msu: LoadoutMechSkin) => void
}

export interface HangarSilo {
    faction: string
    silos?: SiloType[]
}

export interface SiloObject {
    type: string
    ownership_id?: string
    static_id?: string
    skin?: SiloSkin
}

export interface SiloType extends SiloObject {
    accessories?: SiloObject[]
    can_open_on?: Date
}

export interface SiloSkin {
    type: string
    static_id?: string
    ownership_id?: string
}

let baseUrl = WEBGL_BASE_URL
if (DEV_ONLY) {
    baseUrl += `build-${DEVELOPMENT_BUILD_NUM}/`
    // baseUrl += `staging/`
} else {
    baseUrl += process.env.REACT_APP_ENVIRONMENT + "/"
}

export interface UnityParams {
    unityRef: React.ForwardedRef<UnityHandle>
    orbitControlsRef: React.RefObject<HTMLElement>
    onUnlock: () => void
    onReady: () => void
}

export const UnityViewer = ({ mechDetailsWithMaps, unity }: MechViewer3DProps) => {
    const theme = useTheme()
    const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded, loadingProgression, unload } = useUnityContext({
        loaderUrl: `${baseUrl}WebGL.loader.js`,
        dataUrl: `${baseUrl}/WebGL.data.br`,
        frameworkUrl: `${baseUrl}/WebGL.framework.js.br`,
        codeUrl: `${baseUrl}/WebGL.wasm.br`,
        streamingAssetsUrl: `${baseUrl}/StreamingAssets`,
    })
    const sent = useRef(false)
    const ready = useRef(false)
    const [siloReady, setSiloReady] = useState(false)
    const [progress, setProgress] = useState(0)
    const [showLoader, setShowLoader] = useState(true)
    const [isPendingChange, setIsPendingChange] = useState(false)
    const [showClickToLoadOverlay, setShowClickToLoadOverlay] = useState(true)

    // todo: unload unity viewer when this bug is fixed https://react-unity-webgl.dev/docs/api/unload

    useImperativeHandle(unity.unityRef, () => ({
        handleUnload: () => {
            if (showClickToLoadOverlay || !isLoaded || !siloReady)
                return new Promise((resolve) => {
                    resolve()
                })
            return unload()
        },
        handleWeaponUpdate: (wu: LoadoutWeapon) => {
            const weapon = wu.weapon
            if (wu.unequip) {
                console.log("cleared", wu.slot_number)
                sendMessage("SceneContext", "ClearSelectedSlots", `[${wu.slot_number}]`)
            } else if (weapon) {
                const obj = {
                    type: "weapon",
                    ownership_id: weapon.id,
                    static_id: weapon.blueprint_id,
                    skin: weapon.weapon_skin
                        ? {
                              type: "skin",
                              static_id: weapon.weapon_skin.blueprint_id,
                          }
                        : undefined,
                } as SiloObject
                if (wu.inherit_skin && mechDetailsWithMaps.chassis_skin?.blueprint_weapon_skin_id) {
                    obj.skin = {
                        type: "skin",
                        static_id: mechDetailsWithMaps.chassis_skin.blueprint_weapon_skin_id,
                    }
                }
                console.info(obj)
                sendMessage("SceneContext", "SetSlotIndexToChange", wu.slot_number)
                sendMessage("SceneContext", "ChangeSlotValue", JSON.stringify(obj))
            }
            setIsPendingChange(true)
        },
        handlePowerCoreUpdate: (pcu: LoadoutPowerCore) => {
            if (!pcu.power_core) return
            const powerCore = pcu.power_core
            const obj = {
                type: "power_core",
                ownership_id: powerCore.owner_id,
                static_id: powerCore.blueprint_id,
            } as SiloObject
            setIsPendingChange(true)
            console.log(obj)
        },
        handleMechSkinUpdate: (msu: LoadoutMechSkin) => {
            if (!msu.mech_skin) return
            const obj = {
                type: "skin",
                ownership_id: msu.mech_skin_id,
                static_id: msu.mech_skin.blueprint_id,
            } as SiloObject
            sendMessage("SceneContext", "ChangeMechSkin", JSON.stringify(obj))
            setIsPendingChange(true)
        },
    }))

    // Check if hangar is ready, finished loading, user has clicked etc.
    const isEverythingReady = useMemo(
        () => !showClickToLoadOverlay && isLoaded && siloReady && progress === 100,
        [isLoaded, progress, showClickToLoadOverlay, siloReady],
    )
    useEffect(() => {
        if (!isEverythingReady || ready.current) return
        unity.onReady()
        ready.current = true
    }, [isEverythingReady, unity])

    // Update progress based on unity
    useEffect(() => {
        if (progress === 100 || showClickToLoadOverlay) return
        setProgress((loadingProgression * 100) / 1.25)
    }, [loadingProgression, progress, showClickToLoadOverlay])

    useEffect(() => {
        const handleMouseClick = () => {
            setShowClickToLoadOverlay(false)
        }
        window.addEventListener("click", handleMouseClick)
        return () => window.removeEventListener("click", handleMouseClick)
    }, [])

    useEffect(() => {
        const onSiloReady = () => setSiloReady(true)
        addEventListener("SiloReady", onSiloReady)
        return () => removeEventListener("SiloReady", onSiloReady)
    }, [addEventListener, removeEventListener])

    useEffect(() => {
        const onFittingRoomLoaded = () => {
            setProgress(100)
            setTimeout(() => setShowLoader(false), 1000)
        }
        addEventListener("FittingRoomLoaded", onFittingRoomLoaded)
        return () => removeEventListener("FittingRoomLoaded", onFittingRoomLoaded)
    }, [addEventListener, removeEventListener])

    useEffect(() => {
        let t: NodeJS.Timeout | null = null
        const onSlotLoaded = () => {
            t = setTimeout(() => {
                console.log("slot unlocked")
                unity.onUnlock()
                setIsPendingChange(false)
            }, 500)
        }
        addEventListener("SlotLoaded", onSlotLoaded)
        return () => {
            if (t) clearTimeout(t)
            removeEventListener("SlotLoaded", onSlotLoaded)
        }
    }, [addEventListener, removeEventListener, unity])

    const isMouseDown = useRef(false)
    useEffect(() => {
        if (!isEverythingReady || !unity.orbitControlsRef.current) return

        const handleMouseUp = (event: MouseEvent) => {
            if (event.button == 0 && isMouseDown.current) {
                isMouseDown.current = false
                sendMessage("FittingRoomPlayer", "OnMouseClick")
            }
        }
        const handleMouseDown = (event: MouseEvent) => {
            if (event.button == 0) {
                isMouseDown.current = !isMouseDown.current
                sendMessage("FittingRoomPlayer", "OnMouseClick")
            }
        }
        const handleMouseWheel = (event: WheelEvent) => {
            sendMessage("FittingRoomPlayer", "OnZoomChange", event.deltaY / -100)
        }

        const orbitDiv = unity.orbitControlsRef.current
        orbitDiv.addEventListener("mouseup", handleMouseUp)
        orbitDiv.addEventListener("mousedown", handleMouseDown)
        orbitDiv.addEventListener("wheel", handleMouseWheel)

        return () => {
            orbitDiv.removeEventListener("mouseup", handleMouseUp)
            orbitDiv.removeEventListener("mousedown", handleMouseDown)
            orbitDiv.removeEventListener("wheel", handleMouseWheel)
        }
    }, [isEverythingReady, sendMessage, unity.orbitControlsRef])

    useEffect(() => {
        if (showClickToLoadOverlay || !isLoaded || !siloReady || sent.current) return

        const accessories: SiloObject[] = []
        for (let i = 0; i < mechDetailsWithMaps.weapon_hardpoints; i++) {
            accessories.push({
                type: "weapon",
            })
        }
        if (mechDetailsWithMaps.weapons) {
            mechDetailsWithMaps.weapons.forEach((w) => {
                if (w.slot_number == null) return
                accessories[w.slot_number] = {
                    type: "weapon",
                    ownership_id: w.id,
                    static_id: w.blueprint_id,
                    skin: w.weapon_skin
                        ? {
                              type: "skin",
                              static_id: w.weapon_skin.blueprint_id,
                          }
                        : undefined,
                }
                if (w.inherit_skin && mechDetailsWithMaps.chassis_skin?.blueprint_weapon_skin_id) {
                    accessories[w.slot_number].skin = {
                        type: "skin",
                        static_id: mechDetailsWithMaps.chassis_skin.blueprint_weapon_skin_id,
                    }
                }
            })
        }
        // for (let i = 0; i < mechDetailsWithMaps.utility_slots; i++) {
        //     accessories.push({
        //         type: "utility",
        //         ownership_id: "",
        //         static_id: "",
        //     })
        // }
        // if (mechDetailsWithMaps.utility) {
        //     mechDetailsWithMaps.utility.forEach((u) => {
        //         if (u.slot_number == null) return

        //         accessories[mechDetailsWithMaps.weapon_hardpoints + u.slot_number] = {
        //             type: "utility",
        //             ownership_id: u.id,
        //             static_id: u.blueprint_id,
        //         }
        //     })
        // }
        accessories.push({
            type: "power_core",
        })
        if (mechDetailsWithMaps.power_core) {
            accessories[accessories.length - 1] = {
                type: "power_core",
                ownership_id: mechDetailsWithMaps.power_core.id,
                static_id: mechDetailsWithMaps.power_core.blueprint_id,
            }
        }

        const mech: SiloType = {
            type: "mech",
            ownership_id: mechDetailsWithMaps.id,
            static_id: mechDetailsWithMaps.blueprint_id,
            skin: mechDetailsWithMaps.chassis_skin
                ? {
                      type: "skin",
                      ownership_id: mechDetailsWithMaps.chassis_skin.owner_id,
                      static_id: mechDetailsWithMaps.chassis_skin.blueprint_id,
                  }
                : undefined,
            accessories,
        }
        console.info(mech)
        const inventory: HangarSilo = {
            faction: mechDetailsWithMaps.faction_id,
        }
        sendMessage("ProjectContext(Clone)", "GetPlayerInventoryFromPage", JSON.stringify(inventory))
        sendMessage("ProjectContext(Clone)", "FittingRoom", JSON.stringify(mech))
        sent.current = true
    }, [
        sendMessage,
        isLoaded,
        siloReady,
        mechDetailsWithMaps.weapons,
        mechDetailsWithMaps.power_core,
        mechDetailsWithMaps.faction_id,
        mechDetailsWithMaps.owner_id,
        mechDetailsWithMaps.blueprint_id,
        mechDetailsWithMaps.chassis_skin,
        mechDetailsWithMaps.weapon_hardpoints,
        mechDetailsWithMaps.utility,
        mechDetailsWithMaps.utility_slots,
        mechDetailsWithMaps.id,
        showClickToLoadOverlay,
    ])

    const renderProgress = useCallback(() => {
        return (
            <LinearProgress
                sx={{
                    height: "9px",
                    backgroundColor: `${colors.gold}15`,
                    ".MuiLinearProgress-bar": { backgroundColor: colors.gold },
                }}
                variant="determinate"
                value={progress}
            />
        )
    }, [progress])

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                width: "100%",
            }}
        >
            <Unity
                unityProvider={unityProvider}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
            <Fade in={showLoader} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.factionTheme.background,
                    }}
                >
                    <ClipThing
                        border={{
                            borderColor: theme.factionTheme.primary,
                        }}
                        corners={{
                            topLeft: true,
                            bottomRight: true,
                        }}
                        backgroundColor={theme.factionTheme.background}
                        sx={{
                            padding: "1rem",
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                                fontSize: "3rem",
                                animation: `${pulseEffect} 2s infinite`,
                            }}
                        >
                            Loading Mech…
                        </Typography>
                        {renderProgress()}
                    </ClipThing>
                </Box>
            </Fade>
            {showClickToLoadOverlay && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.factionTheme.background,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            fontSize: "3rem",
                            textTransform: "uppercase",
                            color: "white",
                        }}
                    >
                        Click here to load 3D viewer
                    </Typography>
                </Box>
            )}

            <Fade in={isPendingChange} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        position: "absolute",
                        left: "5rem",
                        bottom: "5rem",
                        pointerEvents: "none",
                    }}
                >
                    <ClipThing
                        border={{
                            borderColor: theme.factionTheme.primary,
                        }}
                        corners={{
                            topLeft: true,
                            bottomRight: true,
                        }}
                        backgroundColor={theme.factionTheme.background}
                        sx={{
                            animation: `${pulseEffect} 3s infinite`,
                            padding: "1rem",
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: fonts.nostromoBlack,
                                fontSize: "3rem",
                            }}
                        >
                            Modifications In Progress
                        </Typography>
                    </ClipThing>
                </Box>
            </Fade>
        </Box>
    )
}
