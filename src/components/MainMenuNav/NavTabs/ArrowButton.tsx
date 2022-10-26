import { Stack, Typography } from "@mui/material"
import { KeyboardKey } from "../../Common/KeyboardKey"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { TAB_HEIGHT } from "./NavTabs"

export const ArrowButton = ({ keyboardKey, onClick, isLeft, isRight }: { keyboardKey: string; onClick: () => void; isLeft?: boolean; isRight?: boolean }) => {
    return (
        <NiceButton sx={{ height: `${TAB_HEIGHT}rem`, border: "none" }} onClick={onClick} background={{ color: ["#FFFFFF20"] }}>
            <Stack direction="row" alignItems="center" spacing=".4rem">
                {isLeft && <Typography>◄</Typography>}
                <KeyboardKey variant="body2" label={keyboardKey} />
                {isRight && <Typography>►</Typography>}
            </Stack>
        </NiceButton>
    )
}
