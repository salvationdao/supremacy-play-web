import { CircularProgress, IconButton, Link, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import { ClipThing } from "../../../.."
import { SvgExternalLink, SvgSave } from "../../../../../assets"
import { PASSPORT_WEB } from "../../../../../constants"
import { useAuth } from "../../../../../containers"
import { useTheme } from "../../../../../containers/theme"
import { colors, fonts } from "../../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../../types"

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

    // Rename
    const renamingRef = useRef<HTMLInputElement>()
    const [editing, setEditing] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [newMechName, setNewMechName] = useState<string>(name || "")

    const renameMechHandler = useCallback(async () => {
        try {
            setSubmitting(true)
            renamingRef.current?.blur()
            await renameMech(newMechName)
        } finally {
            setSubmitting(false)
            setEditing(false)
        }
    }, [newMechName, renameMech])

    useEffect(() => {
        if (!editing) return
        setEditing(isSelected)
    }, [isSelected, editing])

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                position: "relative",
                px: "1rem",
                pt: ".7rem",
                pb: "1.2rem",
                width: "fit-content",
                maxWidth: "70%",
                background: isSelected
                    ? `linear-gradient(${theme.factionTheme.primary}FF 26%, ${theme.factionTheme.primary}BB)`
                    : theme.factionTheme.background,
                border: isSelected ? `${theme.factionTheme.primary} .3rem solid` : `${theme.factionTheme.primary}90 .2rem solid`,
                borderBottom: "none",
                zIndex: 9,
            }}
        >
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
                <Link href={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`} target="_blank" sx={{ display: "inline", mb: ".4rem", ml: "1rem" }}>
                    <SvgExternalLink
                        size="1.3rem"
                        sx={{ display: "inline", opacity: 0.7, ":hover": { opacity: 1 } }}
                        fill={isSelected ? theme.factionTheme.secondary : "#FFFFFF"}
                    />
                </Link>
            )}
            <ClipThing
                clipSize="9px"
                clipSlantSize="4px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".15rem",
                }}
                backgroundColor={theme.factionTheme.background}
                sx={{
                    position: "absolute",
                    left: "1.8rem",
                    bottom: 0,
                    transform: "translateY(calc(50% + .5rem))",
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    onClick={() => {
                        setEditing(true)
                        renamingRef.current?.focus()
                    }}
                    sx={{
                        px: "1.6rem",
                        py: ".4rem",
                        cursor: "text",
                        zIndex: 10,
                    }}
                >
                    <TextField
                        inputRef={renamingRef}
                        variant="standard"
                        sx={{
                            m: 0,
                            py: ".2rem",
                            position: "relative",
                            width: editing ? "23rem" : 0,
                            height: editing ? "unset" : 0,
                            "& .MuiInput-root": {
                                p: 0,
                                fontSize: "1.5rem",
                                color: "#FFFFFF",
                            },
                            "& .MuiInputBase-input": {
                                p: 0,
                                display: "inline",
                                wordBreak: "break-word",
                            },
                            ".MuiInputBase-input:focus": {
                                px: "1rem",
                                py: ".2rem",
                                fontSize: "1.7rem",
                                color: "#FFFFFF",
                                border: `#FFFFFF99 1.5px dashed`,
                                borderRadius: 0.5,
                                backgroundColor: "#FFFFFF12",
                            },
                        }}
                        spellCheck={false}
                        InputProps={{
                            disableUnderline: true,
                        }}
                        value={newMechName}
                        placeholder="Enter a name..."
                        onChange={(e) => setNewMechName(e.target.value)}
                        onFocus={() => renamingRef.current?.setSelectionRange(0, newMechName.length)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                renameMechHandler()
                            }
                        }}
                    />

                    {editing && !submitting && newMechName !== name && (
                        <IconButton size="small" sx={{ ml: ".5rem" }} onClick={renameMechHandler}>
                            <SvgSave size="1.2rem" />
                        </IconButton>
                    )}

                    {editing && submitting && <CircularProgress size="1.2rem" sx={{ ml: "1rem", color: "#FFFFFF" }} />}

                    {!editing && (
                        <Typography
                            sx={{
                                fontSize: "1.5rem",
                                color: !name ? colors.grey : "#FFFFFF",
                                fontWeight: "fontWeightBold",
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {name || "Unnamed"}
                        </Typography>
                    )}
                </Stack>
            </ClipThing>
        </Stack>
    )
}
