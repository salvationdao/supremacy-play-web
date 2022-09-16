import * as PIXI from "pixi.js"

// export class PixiMechAbility {
//     container: PIXI.Container
//     private trackRect: PIXI.Graphics
//     private barRect: PIXI.Graphics
//     private color: string
//     private percent: number
//     private width: number
//     private height: number

//     constructor(width: number, height: number, color: string, initialPercent = 80) {
//         this.container = new PIXI.Container()
//         this.trackRect = new PIXI.Graphics()
//         this.barRect = new PIXI.Graphics()
//         this.color = color
//         this.percent = clamp(0, initialPercent, 100)
//         this.width = width
//         this.height = height

//         this.trackRect.zIndex = 0
//         this.barRect.zIndex = 1

//         this.container.sortableChildren = true
//         this.container.addChild(this.trackRect)
//         this.container.addChild(this.barRect)

//         this.render()
//     }

//     updateColor(color: string) {
//         this.color = color
//     }

//     updatePercent(percent: number) {
//         this.percent = clamp(0, percent, 100)
//         this.render()
//     }

//     updatePosition(x: number, y: number) {
//         this.container.position.set(x, y)
//     }

//     updateDimension(width: number, height: number) {
//         this.width = width
//         this.height = height
//         this.render()
//     }

//     private render() {
//         this.trackRect.clear()
//         this.trackRect.beginFill(HEXToVBColor("#000000"), 0.65)
//         this.trackRect.drawRoundedRect(0, 0, this.width, this.height, 0.5)
//         this.trackRect.endFill

//         this.barRect.clear()
//         this.barRect.beginFill(HEXToVBColor(this.color))
//         this.barRect.drawRoundedRect(0, 0, (this.percent * this.width) / 100, this.height, 0.5)
//         this.barRect.endFill
//     }
// }

export {}

// export const MechAbility = ({ hash, participantID, ability, index }: { hash: string; participantID: number; ability: GameAbility; index: number }) => {
//     const { id, colour, image_url, label } = ability
//     const { currentArenaID } = useArena()
//     const { send } = useGameServerCommandsFaction("/faction_commander")
//     const [remainSeconds, setRemainSeconds] = useState(30)
//     const ready = useMemo(() => remainSeconds === 0, [remainSeconds])
//     const { addToHotkeyRecord } = useHotkey()

//     useGameServerSubscriptionFaction<number | undefined>(
//         {
//             URI: `/arena/${currentArenaID}/mech/${participantID}/abilities/${id}/cool_down_seconds`,
//             key: GameServerKeys.SubMechAbilityCoolDown,
//             ready: !!currentArenaID && !!participantID,
//         },
//         (payload) => {
//             if (payload === undefined) return
//             setRemainSeconds(payload)
//         },
//     )

//     useInterval(() => {
//         setRemainSeconds((rs) => {
//             if (rs === 0) {
//                 return 0
//             }
//             return rs - 1
//         })
//     }, 1000)

//     const onTrigger = useCallback(async () => {
//         if (!currentArenaID) return
//         try {
//             await send<boolean, { arena_id: string; mech_hash: string; game_ability_id: string }>(GameServerKeys.TriggerWarMachineAbility, {
//                 arena_id: currentArenaID,
//                 mech_hash: hash,
//                 game_ability_id: id,
//             })
//         } catch (e) {
//             console.error(e)
//         }
//     }, [hash, id, send, currentArenaID])

//     useEffect(() => {
//         addToHotkeyRecord(RecordType.MiniMap, MECH_ABILITY_KEY[index], onTrigger)
//     }, [onTrigger, addToHotkeyRecord, index])

//     return (
//         <Stack
//             direction="row"
//             alignItems="center"
//             spacing=".4rem"
//             sx={{
//                 position: "relative",
//                 height: "3rem",
//                 width: "100%",
//                 opacity: ready ? 1 : 0.6,
//             }}
//         >
//             {/* Image */}
//             <Box
//                 sx={{
//                     flexShrink: 0,
//                     width: "3rem",
//                     height: "100%",
//                     cursor: "pointer",
//                     background: `url(${image_url})`,
//                     backgroundRepeat: "no-repeat",
//                     backgroundPosition: "center",
//                     backgroundSize: "cover",
//                     border: `${colour} 1.5px solid`,
//                     pointerEvents: "all",
//                     ":hover": ready ? { borderWidth: "3px", transform: "scale(1.04)" } : undefined,
//                 }}
//                 onClick={ready ? onTrigger : undefined}
//             />

//             <Stack direction={"row"} sx={{ flex: 1 }} justifyContent={"space-between"} alignItems={"center"}>
//                 <Typography
//                     variant="body2"
//                     sx={{
//                         pt: ".4rem",
//                         lineHeight: 1,
//                         fontWeight: "fontWeightBold",
//                         display: "-webkit-box",
//                         overflow: "hidden",
//                         overflowWrap: "anywhere",
//                         textOverflow: "ellipsis",
//                         WebkitLineClamp: 1, // change to max number of lines
//                         WebkitBoxOrient: "vertical",
//                     }}
//                 >
//                     {ready ? label : remainSeconds > 300 ? "∞" : `${remainSeconds}s`}
//                 </Typography>

//                 {ready && (
//                     <Typography variant="body2" sx={{ color: colors.neonBlue }}>
//                         <i>
//                             <strong>[{MECH_ABILITY_KEY[index]}]</strong>
//                         </i>
//                     </Typography>
//                 )}
//             </Stack>
//         </Stack>
//     )
// }
