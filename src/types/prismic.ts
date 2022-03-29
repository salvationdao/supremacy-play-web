import { ImageFieldImage, PrismicDocument, RichTextField, TitleField } from "@prismicio/types"

export enum PrismicSliceType {
    HeaderContent = "header_content",
    MultiContent = "multi_content",
}

interface PrismicSectionItem {
    section_content_body: RichTextField
    section_content_image: ImageFieldImage
    section_content_subheader: RichTextField
    section_content_subsubheader: RichTextField
    section_content_title: RichTextField
    section_image_link: {
        link_type: string
        url: string
    }
}

interface PrismicPrimaryItem {
    section_content: RichTextField
    section_header: RichTextField
    section_title: TitleField
}

export interface PrismicHowToPlay extends PrismicDocument {
    data: {
        body: {
            items: PrismicSectionItem[]
            primary: PrismicPrimaryItem
            slice_label: string
            slice_type: string
        }[]
    }
}
