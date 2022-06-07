// import { AbilityCardProps } from "./SaleAbilityCard"

// const activateModalWidth = 400

// export const PlayerAbilityCard = () => {
//     return <></>
//     // Purchasing
//     // const [showPurchaseModal, toggleShowActivateModal] = useToggle(false)
//     //
//     // const playerAbility = useGameServerSubscriptionUser<PlayerAbility>({
//     //     URI: `${abilityID}/xxxxxxxxx`,
//     //     key: GameServerKeys.PlayerAbilitySubscribe,
//     // })
//     //
//     // let abilityTypeIcon = <SvgQuestionMark />
//     // let abilityTypeDescription = "Miscellaneous ability type."
//     // switch (playerAbility?.location_select_type) {
//     //     case "GLOBAL":
//     //         abilityTypeDescription = "This ability will affect all units on the map."
//     //         abilityTypeIcon = <SvgGlobal />
//     //         break
//     //     case "LOCATION_SELECT":
//     //         abilityTypeDescription = "This ability will target a specific location on the map."
//     //         abilityTypeIcon = <SvgTarget />
//     //         break
//     //     case "MECH_SELECT":
//     //         abilityTypeDescription = "This ability will target a specific mech on the map."
//     //         abilityTypeIcon = <SvgMicrochip />
//     // }
//     //
//     // if (!playerAbility) {
//     //     return <Box>Loading...</Box>
//     // }
//     //
//     // return (
//     //     <>
//     //         <TooltipHelper text={playerAbility.description}>
//     //             <ButtonBase
//     //                 {...props}
//     //                 onClick={() => toggleShowActivateModal(true)}
//     //                 sx={{
//     //                     display: "block",
//     //                     textAlign: "left",
//     //                     backgroundColor: colors.navy,
//     //                     ":hover img": {
//     //                         filter: "grayscale(0)",
//     //                         transform: "scale(1.2)",
//     //                     },
//     //                 }}
//     //             >
//     //                 <Box
//     //                     sx={{
//     //                         padding: ".3rem",
//     //                     }}
//     //                 >
//     //                     <Box
//     //                         sx={{
//     //                             overflow: "hidden",
//     //                             position: "relative",
//     //                             width: "100%",
//     //                             paddingTop: "100%", // 1:1 width-height ratio
//     //                         }}
//     //                     >
//     //                         <Box
//     //                             sx={{
//     //                                 zIndex: 1,
//     //                                 position: "absolute",
//     //                                 top: ".2rem",
//     //                                 right: ".2rem",
//     //                             }}
//     //                         >
//     //                             {abilityTypeIcon}
//     //                         </Box>
//     //                         <Box
//     //                             component="img"
//     //                             src={playerAbility.image_url}
//     //                             alt={`Thumbnail image for ${playerAbility.label}`}
//     //                             sx={{
//     //                                 position: "absolute",
//     //                                 top: 0,
//     //                                 left: 0,
//     //                                 width: "100%",
//     //                                 height: "100%",
//     //                                 objectFit: "cover",
//     //                                 transformOrigin: "center",
//     //                                 transition: "transform .1s ease-out",
//     //                             }}
//     //                         />
//     //                     </Box>
//     //                 </Box>
//     //                 <Box
//     //                     sx={{
//     //                         padding: ".2rem",
//     //                     }}
//     //                 >
//     //                     <Typography
//     //                         variant="caption"
//     //                         sx={{
//     //                             overflowX: "hidden",
//     //                             width: "100%",
//     //                             whiteSpace: "nowrap",
//     //                             textDecoration: "ellipsis",
//     //                         }}
//     //                     >
//     //                         {playerAbility.label}
//     //                     </Typography>
//     //                 </Box>
//     //             </ButtonBase>
//     //         </TooltipHelper>
//     //
//     //         <Modal open={showPurchaseModal} onClose={() => toggleShowActivateModal(false)} closeAfterTransition>
//     //             <Fade in={showPurchaseModal}>
//     //                 <Box
//     //                     sx={{
//     //                         position: "absolute",
//     //                         top: `50%`,
//     //                         left: `50%`,
//     //                         transform: "translate(-50%, -50%)",
//     //                         width: "100%",
//     //                         maxWidth: activateModalWidth,
//     //                         outline: "none",
//     //                     }}
//     //                 >
//     //                     <ClipThing
//     //                         clipSlantSize="8px"
//     //                         border={{
//     //                             borderColor: playerAbility.colour,
//     //                             borderThickness: ".3rem",
//     //                         }}
//     //                         backgroundColor={colors.darkNavy}
//     //                         sx={{ position: "relative" }}
//     //                     >
//     //                         <IconButton size="small" onClick={() => toggleShowActivateModal(false)} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
//     //                             <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
//     //                         </IconButton>
//     //                         <Box sx={{ px: "2rem", py: "1.5rem" }}>
//     //                             <Typography
//     //                                 variant="h5"
//     //                                 sx={{
//     //                                     marginBottom: ".5rem",
//     //                                     fontFamily: fonts.nostromoBold,
//     //                                     textTransform: "uppercase",
//     //                                 }}
//     //                             >
//     //                                 Activate {playerAbility.label || "Ability"}
//     //                             </Typography>
//     //                             <Stack direction="row" spacing="1rem">
//     //                                 <ClipThing sx={{ flexShrink: 0 }} backgroundColor={colors.darkNavy}>
//     //                                     <Box
//     //                                         sx={{
//     //                                             position: "relative",
//     //                                             height: "60px",
//     //                                             width: "60px",
//     //                                             background: `center center`,
//     //                                             backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, .8) 20%, rgba(255, 255, 255, 0.0)), url(${playerAbility.image_url})`,
//     //                                             backgroundSize: "cover",
//     //                                         }}
//     //                                     >
//     //                                         <TooltipHelper text={abilityTypeDescription} placement="top-start">
//     //                                             <Box
//     //                                                 sx={{
//     //                                                     zIndex: 1,
//     //                                                     position: "absolute",
//     //                                                     bottom: ".2rem",
//     //                                                     right: ".2rem",
//     //                                                 }}
//     //                                             >
//     //                                                 {abilityTypeIcon}
//     //                                             </Box>
//     //                                         </TooltipHelper>
//     //                                     </Box>
//     //                                 </ClipThing>
//     //                                 <Box
//     //                                     sx={{
//     //                                         alignSelf: "stretch",
//     //                                         display: "flex",
//     //                                         flexDirection: "column",
//     //                                         justifyContent: "space-between",
//     //                                     }}
//     //                                 >
//     //                                     <Typography>{playerAbility.description}</Typography>
//     //                                 </Box>
//     //                             </Stack>
//     //                             <LoadingButton
//     //                                 variant="contained"
//     //                                 size="small"
//     //                                 sx={{
//     //                                     width: "100%",
//     //                                     minWidth: 0,
//     //                                     mt: "1rem",
//     //                                     mb: ".5rem",
//     //                                     px: ".8rem",
//     //                                     py: ".6rem",
//     //                                     fontWeight: "fontWeightBold",
//     //                                     color: colors.offWhite,
//     //                                     lineHeight: 1,
//     //                                     textTransform: "uppercase",
//     //                                     backgroundColor: colors.green,
//     //                                     border: `${colors.green} 1px solid`,
//     //                                     borderRadius: 0.3,
//     //                                     ":hover": {
//     //                                         backgroundColor: `${colors.green}90`,
//     //                                     },
//     //                                 }}
//     //                                 onClick={() => toggleShowActivateModal(false)}
//     //                             >
//     //                                 <Typography variant="body2">Activate Ability</Typography>
//     //                             </LoadingButton>
//     //                         </Box>
//     //                     </ClipThing>
//     //                 </Box>
//     //             </Fade>
//     //         </Modal>
//     //     </>
//     // )
// }

export {}
