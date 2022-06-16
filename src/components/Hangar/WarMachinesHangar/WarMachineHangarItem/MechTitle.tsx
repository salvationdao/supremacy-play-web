import { Link, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { SvgExternalLink } from "../../../../assets"
import { PASSPORT_WEB } from "../../../../constants"
import { useAuth } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"
import { FancyButton } from "../../../Common/FancyButton"

export const MechTitle = ({
    mech,
    mechDetails,
    isSelected,
    setSelectedMechDetails,
}: {
    mech: MechBasic
    setSelectedMechDetails: React.Dispatch<React.SetStateAction<MechDetails | undefined>>
    mechDetails?: MechDetails
    isSelected: boolean
}) => {
    const { userID, user } = useAuth()
    const theme = useTheme()
    const { label, name } = mech
    const hash = mech.hash || mechDetails?.hash

    const { send } = useGameServerCommandsUser("/user_commander")

    const [editing, setEditing] = useState(false)
    const [newMechName, setNewMechName] = useState<string>(name)

    const renameMech = async () => {
        console.log(mechDetails)

        try {
            console.log("hello")

            const resp = await send<string>(GameServerKeys.MechRename, {
                mech_id: mech.id,
                new_name: newMechName,
            })

            console.log("res", resp)

            if (!resp || !mechDetails) return
            // setSelectedMechDetails({... mechDetails})
        } catch (e) {
            console.error(e)
        }
        setEditing(false)

        console.log("after")
    }

    // console.log("name", mechDetails.name)

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                position: "absolute",
                top: 0,
                left: "1rem",
                transform: "translateY(-40%)",
                px: "1rem",
                py: ".2rem",
                maxWidth: "70%",
                overflow: "visible",
                background: isSelected
                    ? `linear-gradient(${theme.factionTheme.primary}FF 26%, ${theme.factionTheme.primary}BB)`
                    : theme.factionTheme.background,
                border: isSelected ? `${theme.factionTheme.primary} .3rem solid` : `${theme.factionTheme.primary}90 .2rem solid`,
                zIndex: 9,
            }}
        >
            {!editing && (
                <Stack>
                    <Typography
                        sx={{
                            color: isSelected ? theme.factionTheme.secondary : "#FFFFFF",
                            fontFamily: fonts.nostromoBlack,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {label}
                    </Typography>

                    <div onClick={() => setEditing(true)}>
                        <Typography
                            sx={{
                                color: isSelected ? theme.factionTheme.secondary : "#FFFFFF",
                                fontFamily: fonts.nostromoBlack,
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {name || "name"}
                        </Typography>
                    </div>
                </Stack>
            )}

            {editing && (
                <div>
                    <TextField
                        value={newMechName}
                        placeholder="Search for username..."
                        onChange={(e) => {
                            setNewMechName(e.currentTarget.value)
                        }}
                        type="text"
                        hiddenLabel
                        sx={{
                            borderRadius: 1,
                            "& .MuiInputBase-root": {
                                py: 0,
                                fontFamily: fonts.shareTech,
                            },
                            ".Mui-disabled": {
                                WebkitTextFillColor: "unset",
                            },
                            ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                // borderColor: `${primaryColor} !important`,
                            },
                            input: {
                                color: "#000",
                            },
                        }}
                    />

                    <FancyButton
                        // disabled={!onClick || disabled}
                        excludeCaret
                        clipThingsProps={{
                            clipSize: "8px",
                            // backgroundColor: thembackgroundColor,
                            // border: { isFancy, borderColor: primaryColor, borderThickness: "1.5px" },
                            sx: { position: "relative", minWidth: "10rem" },
                        }}
                        sx={{ px: "1.3rem", py: ".3rem" }}
                        onClick={renameMech}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                // color: secondaryColor || "#FFFFFF",
                                fontFamily: fonts.nostromoBold,
                            }}
                        >
                            Save
                        </Typography>
                    </FancyButton>
                </div>
            )}

            {!editing && userID && hash && (
                <span>
                    <Link href={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`} target="_blank" sx={{ display: "inline", ml: ".7rem" }}>
                        <SvgExternalLink
                            size="1.2rem"
                            sx={{ display: "inline", opacity: 0.7, ":hover": { opacity: 1 } }}
                            fill={isSelected ? theme.factionTheme.secondary : "#FFFFFF"}
                        />
                    </Link>
                </span>
            )}
        </Stack>
    )
}
