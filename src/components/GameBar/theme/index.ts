import { createTheme } from "@mui/material/styles"
import { red } from "@mui/material/colors"
import "./global.css"

export const colors = {
    text: "#FFFFFF",
    offWhite: "#F8F8F8",
    red: "#C24242",
    green: "#2BA172",
    yellow: "#FFE200",
    orange: "#E04F00",
    textBlue: "#D4FFFF",

    neonBlue: "#2BE9FD",
    darkNeonBlue: "#176969",
    darkerNeonBlue: "#073339",
    darkestNeonBlue: "#050c12",
    darkNavy: "#101019",

    white: "#FFFFFF",
    grey: "#89898d",
    navy: "#28283f",
    darkGrey: "#494949",
    darkerGrey: "#383838",
    darkGreyBlue: "#101019",
    darkNavyBlue: "#070719",

    globalChat: "#1A6044",
    assetsBanner: "#4E1A61",
}

export const factionColors = {
    redMountainRed: "#C52A1F",
    darkRedMountainRed: "#2c141a",
    darkerRedMountainRed: "#241015",

    bostonBlue: "#428EC1",
    darkBostonBlue: "#30678c",
    darkerBostonBlue: "#275473",

    zaibatsuWhite: "#FFFFFF",
}

const theme = createTheme({
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
        primary: {
            main: colors.neonBlue,
        },
        secondary: {
            main: colors.darkerNeonBlue,
        },
        success: {
            main: colors.green,
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
        htmlFontSize: 19,
        h1: {
            fontFamily: ["Nostromo Regular Black", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        },
        h2: {
            fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        },
        h3: {
            fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        },
        h4: {
            fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        },
        h5: {
            fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        },
        h6: {
            fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        },
        body1: {
            fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        },
        body2: {
            fontSize: "0.9rem",
            fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        },
        subtitle1: {
            fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
            textAlign: "center",
        },
        subtitle2: {
            fontSize: "0.8rem",
            fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        },
        caption: {
            fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        },
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: false,
            },
            styleOverrides: {
                root: {
                    fontFamily: "Nostromo Regular Bold",
                    transition: "all .1s",
                    ":hover": {
                        opacity: 0.76,
                    },
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableRipple: false,
            },
            styleOverrides: {
                root: {
                    fontFamily: "Nostromo Regular Bold",
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
        MuiTextField: {
            styleOverrides: {
                root: {
                    fontFamily: "Share Tech",
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
    },
})

const themes = [theme]

export default themes
