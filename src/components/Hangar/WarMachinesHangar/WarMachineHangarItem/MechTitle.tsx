import { Box, Link, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgEdit, SvgExternalLink } from "../../../../assets"
import { PASSPORT_WEB } from "../../../../constants"
import { useAuth } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"
import { FancyButton } from "../../../Common/FancyButton"

export const MechTitle = ({
    mech,
    mechDetails,
    isSelected,
    renameMech,
}: {
    renameMech: (name: string) => Promise<void>
    mech: MechBasic
    mechDetails?: MechDetails
    isSelected: boolean
}) => {
    const { userID, user } = useAuth()
    const theme = useTheme()
    const label = mechDetails?.label
    const name = mechDetails?.name
    const hash = mech.hash || mechDetails?.hash

    const [editing, setEditing] = useState(false)
    const [newMechName, setNewMechName] = useState<string>(name || "")

    const renameMechHandler = async () => {
        await renameMech(newMechName)
        setEditing(false)
    }

    useEffect(() => {
        if (!editing) return
        setEditing(isSelected)
    }, [isSelected])

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
                    <Box display="flex">
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

                        {userID && hash && (
                            <Box mt="2px">
                                <span>
                                    <Link
                                        href={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`}
                                        target="_blank"
                                        sx={{ display: "inline", ml: ".7rem" }}
                                    >
                                        <SvgExternalLink
                                            size="1.2rem"
                                            sx={{ display: "inline", opacity: 0.7, ":hover": { opacity: 1 } }}
                                            fill={isSelected ? theme.factionTheme.secondary : "#FFFFFF"}
                                        />
                                    </Link>
                                </span>
                            </Box>
                        )}
                    </Box>

                    <div onClick={() => setEditing(true)} style={{ display: "flex", cursor: "pointer" }}>
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
                                fontSize: "9px",
                            }}
                        >
                            {name || "name"}
                        </Typography>

                        <span>
                            <SvgEdit
                                size="1.2rem"
                                sx={{ ml: "5px", display: "inline", opacity: 0.7, ":hover": { opacity: 1 } }}
                                fill={isSelected ? theme.factionTheme.secondary : "#FFFFFF"}
                            />
                        </span>
                    </div>
                </Stack>
            )}

            {editing && (
                <Box display="flex">
                    <TextField
                        value={newMechName}
                        focused
                        placeholder="Name"
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
                            ".Mui-focused .MuiOutlinedInput-notchedOutline": {},
                            input: {
                                color: "#000",
                                fontFamily: fonts.nostromoBlack,
                            },
                        }}
                    />
                    <Box display="flex" flexDirection="column">
                        <FancyButton
                            excludeCaret
                            clipThingsProps={{
                                clipSize: "8px",
                                sx: { position: "relative", minWidth: "10rem" },
                            }}
                            sx={{ px: "1.3rem", py: ".3rem" }}
                            onClick={renameMechHandler}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#000",
                                    fontFamily: fonts.nostromoBold,
                                }}
                            >
                                Save
                            </Typography>
                        </FancyButton>

                        <FancyButton
                            excludeCaret
                            clipThingsProps={{
                                clipSize: "8px",
                                sx: { position: "relative", minWidth: "10rem" },
                            }}
                            sx={{ px: "1.3rem", py: ".3rem" }}
                            onClick={() => setEditing(false)}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#000",
                                    fontFamily: fonts.nostromoBold,
                                }}
                            >
                                Cancel
                            </Typography>
                        </FancyButton>
                    </Box>
                </Box>
            )}
        </Stack>
    )
}
