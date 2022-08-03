import { Stack, TableCell, TableRow, Typography } from "@mui/material"
import { SystemMessageDisplayable } from "../Messages"

export interface MessageItemProps {
    message: SystemMessageDisplayable
    selected: boolean
    onSelect: () => void
}

export const MessageItem = ({ message, selected, onSelect }: MessageItemProps) => {
    const selectedOrNotRead = !message.read_at || selected

    return (
        <TableRow
            onClick={() => onSelect()}
            sx={{
                "&:nth-of-type(odd)": { backgroundColor: "#FFFFFF10" },
                ".MuiTableCell-root": {
                    p: ".8rem 1rem",
                    opacity: selectedOrNotRead ? 1 : 0.5,
                    "*": { fontWeight: selectedOrNotRead ? "fontWeightBold" : "unset" },
                },
                "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "#FFFFFF26",
                    border: "#FFFFFF38 solid 1px",
                },
            }}
        >
            <TableCell align="left" sx={{ width: "18rem", borderBottom: "none" }}>
                <Stack spacing="1rem" direction="row" alignItems="center">
                    {message.icon}
                    <Typography
                        sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            width: "100%",
                            maxWidth: "100px",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1, // change to max number of lines
                            WebkitBoxOrient: "vertical",
                            textAlign: "left",
                            textTransform: "none",
                        }}
                    >
                        {message.sender.username}
                    </Typography>
                </Stack>
            </TableCell>

            <TableCell align="left" sx={{ width: "15rem", borderBottom: "none" }}>
                <Typography
                    sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        width: "100%",
                        maxWidth: "100px",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1, // change to max number of lines
                        WebkitBoxOrient: "vertical",
                        textAlign: "left",
                    }}
                >
                    {message.title}
                </Typography>
            </TableCell>

            <TableCell align="left" sx={{ borderBottom: "none" }}>
                <Typography
                    sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1, // change to max number of lines
                        WebkitBoxOrient: "vertical",
                        textAlign: "left",
                        textTransform: "none",
                    }}
                >
                    {message.message}
                </Typography>
            </TableCell>

            <TableCell align="left" sx={{ width: "8rem", borderBottom: "none" }}>
                <Typography>
                    {message.sent_at.getHours()}:{`${message.sent_at.getMinutes() < 10 ? "0" : ""}${message.sent_at.getMinutes()}`}
                </Typography>
            </TableCell>
        </TableRow>
    )
}
