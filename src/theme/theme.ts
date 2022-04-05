import { red } from "@mui/material/colors"
import { createTheme, FactionTheme } from "@mui/material/styles"
import "./global.css"

// had to keep the declare in this file for it to work
declare module "@mui/material/styles" {
    interface Theme {
        factionTheme: FactionTheme
    }

    interface ThemeOptions {
        factionTheme?: FactionTheme
    }

    export interface FactionTheme {
        primary: string
        secondary: string
        background: string
    }
    // allow configuration using `createTheme`
    interface FactionThemeOptions {
        primary?: string
        secondary?: string
        background?: string
    }
}

export const colors = {
    text: "#FFFFFF",
    offWhite: "#D4FFFF",
    red: "#C24242",
    green: "#2BA172",
    yellow: "#FFE200",
    orange: "#E04F00",
    gold: "#FFC400",
    blue: "#0074D9",

    neonBlue: "#00FFFF",
    darkNeonBlue: "#176969",
    darkerNeonBlue: "#073339",
    darkNavyBlue: "#070719",
    navy: "#28283f",
    darkNavy: "#101019",
    darkerNavy: "#08080C",

    health: "#BFF600",
    shield: "#00F7F7",
    warMachineSkillBar: "#3F3A99",

    lightGrey: "#aeaeb3",
    grey: "#89898d",
    battleQueueBanner: "#C24242",
    darkestNeonBlue: "#050c12",

    globalChat: "#1A6044",
    assetsBanner: "#4E1A61",

    rarity: {
        MEGA: "#e84234",
        COLOSSAL: "#b43328",
        RARE: "#4d90fa",
        LEGENDARY: "#fabd4d",
        ELITE_LEGENDARY: "#ffcc4e",
        ULTRA_RARE: "#4e57ff",
        EXOTIC: "#824dff",
        GUARDIAN: "#4dcfff",
        MYTHIC: "#a1e6ff",
        DEUS_EX: "#fffa4e",
        TITAN: "#5eff75",
    },
}

const factionTheme: FactionTheme = {
    primary: "#00FFFF",
    secondary: "#00FFFF",
    background: "#050c12",
}

export const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    palette: {
        mode: "dark",
        secondary: {
            main: colors.darkerNeonBlue,
        },
        success: {
            main: colors.yellow,
        },
        error: {
            main: red.A400,
        },
        background: {
            default: "#FFFFFF",
        },
        text: {
            primary: colors.text,
            secondary: colors.offWhite,
        },
    },
    typography: {
        htmlFontSize: 16,
        h1: {
            fontFamily: ["Nostromo Regular Black", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: "8.084780622rem",
        },
        h2: {
            fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: "5.052083333rem",
        },
        h3: {
            fontFamily: ["Share Tech", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: "4.043314286rem",
        },
        h4: {
            fontFamily: ["Share Tech", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: "2.862925974rem",
        },
        h5: {
            fontFamily: ["Share Tech", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: "2.02035rem",
        },
        h6: {
            fontFamily: ["Share Tech", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: "1.683625rem",
        },
        body1: {
            fontFamily: ["Share Tech", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: "1.346866667rem",
        },
        body2: {
            fontFamily: ["Share Tech", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: "1.18013rem",
        },
        subtitle1: {
            fontFamily: ["Share Tech", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: "1.011878919rem",
            textAlign: "center",
        },
        subtitle2: {
            fontFamily: ["Share Tech", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: "1.011878919rem",
        },
        caption: {
            fontFamily: ["Share Tech", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
            fontSize: "1.011878919rem",
        },
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: false,
            },
            styleOverrides: {
                root: {
                    fontSize: "1.18013rem",
                    transition: "all .1s",
                    ":hover": {
                        opacity: 0.76,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: "1.18013rem",
                },
            },
        },
        MuiTypography: {
            defaultProps: {
                color: "text.primary",
            },
            styleOverrides: {
                root: {
                    userSelect: "none",
                },
                caption: {
                    display: "block",
                },
            },
        },
        MuiDialog: {
            defaultProps: {
                disablePortal: false,
            },
        },
        MuiPopover: {
            defaultProps: {
                disablePortal: false,
            },
        },
        MuiLink: {
            defaultProps: {
                underline: "none",
                color: "text.primary",
            },
            styleOverrides: {
                root: {
                    display: "inline-flex",
                    alignItems: "center",
                    transition: "all .1s",
                    "& *": {
                        transition: "all .1s",
                    },
                    ":hover, :hover > *": {
                        color: "#136ED6",
                    },
                },
            },
        },
        MuiSkeleton: {
            defaultProps: {
                animation: "wave",
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {
                    marginTop: "17px",
                    ".MuiPagination-ul": {
                        justifyContent: "center",
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontFamily: "Nostromo Regular Black",
                    color: "white",
                },
            },
        },
    },
    factionTheme,
})
