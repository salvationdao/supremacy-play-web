import { MechDetails } from "../../../../types"

export const MechImage = ({ mechDetails }: { mechDetails?: MechDetails }) => {
    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined

    const avatarUrl = skin?.avatar_url // avatar
    const imageUrl = skin?.image_url // poster for card_animation_url
    const largeImageUrl = skin?.large_image_url // poster for animation_url
    const animationUrl = skin?.animation_url // big one
    const cardAnimationUrl = skin?.card_animation_url // smaller one, transparent bg

    return null
}
