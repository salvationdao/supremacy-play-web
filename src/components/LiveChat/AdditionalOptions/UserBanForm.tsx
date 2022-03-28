import { Autocomplete, Box, CircularProgress, IconButton, Modal, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { ClipThing } from "../.."
import { SvgClose } from "../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { useDebounce } from "../../../hooks"
import { colors } from "../../../theme/theme"
import { UserData } from "../../../types/passport"

const testUser = {
    id: "string",
    username: "jayli3n",
    avatar_id: "string",
    faction_id: "string",
    faction: {
        id: "string",
        label: "string",
        logo_blob_id: "string",
        background_blob_id: "string",
        theme: {
            primary: "#C24242",
            secondary: "#FFFFFF",
            background: "#0D0404",
        },
        description: "string",
    },
}

const DropdownItem = ({ props, option }: { props: React.HTMLAttributes<HTMLLIElement>; option: UserData }) => (
    <Box component="li" {...props}>
        <Stack direction="row" spacing=".56rem" alignItems="center">
            <Box
                sx={{
                    mt: "-0.1rem !important",
                    width: "1.8rem",
                    height: "1.8rem",
                    flexShrink: 0,
                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${option.faction.logo_blob_id})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    backgroundColor: option.faction.theme.primary,
                    borderRadius: 0.8,
                    border: `${option.faction.theme.primary} 1px solid`,
                }}
            />
            <Typography>{option.username}</Typography>
        </Stack>
    </Box>
)

export const UserBanForm = ({ user, open, onClose }: { user?: UserData; open: boolean; onClose: () => void }) => {
    const [textField, setTextField] = useState("")
    const [search, setSearch] = useDebounce<string>("", 1000)

    const primaryColor = (user && user.faction.theme.primary) || colors.neonBlue

    useEffect(() => {
        console.log("SEND")
    }, [search])

    const isLoading = true

    const options: UserData[] = [testUser, testUser, testUser]

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "42rem",
                }}
            >
                <ClipThing
                    clipSize="10px"
                    border={{
                        isFancy: true,
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                    innerSx={{
                        position: "relative",
                        background: "none",
                    }}
                >
                    <Stack
                        spacing="1rem"
                        sx={{
                            px: "2rem",
                            pt: "1.8rem",
                            pb: ".8rem",
                            backgroundColor: (user && user.faction.theme.background) || colors.darkNavyBlue,
                        }}
                    >
                        <Typography sx={{ fontFamily: "Nostromo Regular Black" }}>REPORT A USER</Typography>

                        <Autocomplete
                            options={options}
                            loading={isLoading}
                            sx={{
                                ".MuiAutocomplete-endAdornment": {
                                    top: "calc(50% - 9px)",
                                },
                            }}
                            renderOption={(props, option) => <DropdownItem props={props} option={option} />}
                            getOptionLabel={(option) => option.username}
                            renderInput={(params) => (
                                <TextField
                                    value={textField}
                                    placeholder="Search for username..."
                                    onChange={(e) => {
                                        setTextField(e.currentTarget.value)
                                        setSearch(e.currentTarget.value)
                                    }}
                                    type="text"
                                    hiddenLabel
                                    sx={{
                                        borderRadius: 1,
                                        "& .MuiInputBase-root": {
                                            py: 0,
                                            backgroundColor: "#49494970",
                                            fontFamily: "Share Tech",
                                        },
                                        ".Mui-disabled": {
                                            WebkitTextFillColor: "unset",
                                            color: "#FFFFFF70",
                                        },
                                        ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: `${primaryColor} !important`,
                                        },
                                        input: {
                                            color: "#FFFFFF",
                                        },
                                    }}
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {isLoading ? <CircularProgress color="inherit" size="1.2rem" /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />

                        <Box></Box>
                    </Stack>

                    <IconButton
                        size="small"
                        onClick={onClose}
                        sx={{ position: "absolute", top: ".2rem", right: ".2rem" }}
                    >
                        <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
