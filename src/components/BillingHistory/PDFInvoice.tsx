import { Page, Text, View, Document, StyleSheet, Font, Svg, G, Path } from "@react-pdf/renderer"
import { FiatOrder } from "../../types/fiat"
import NostromoRegularBlack from "../../assets/fonts/nostromo-regular/NostromoRegular-Black.otf"

Font.register({
    family: "Nostromo Regular Black",
    src: NostromoRegularBlack,
})

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 40,
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 60,
    },
    invoiceStamp: {
        backgroundColor: "#000000",
        color: "#ffffff",
        fontFamily: "Nostromo Regular Black",
        fontSize: 16,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    section: {
        marginLeft: 40,
        marginRight: 40,
    },
    heading: {
        textTransform: "uppercase",
        fontFamily: "Nostromo Regular Black",
        fontSize: 14,
        color: "#000",
    },
    invoiceDetailsHeading: {
        width: 200,
    },
})

interface Props {
    order: FiatOrder
}

export const PDFInvoice = ({ order }: Props) => (
    <Document>
        <Page size="A4">
            <InvoiceHeader />
            <View style={styles.section}>
                <Text style={styles.heading}>Invoice Details</Text>
            </View>
        </Page>
    </Document>
)

const InvoiceHeader = () => (
    <View style={styles.header}>
        <SVGLogo />
        <Text style={styles.invoiceStamp}>Invoice</Text>
    </View>
)

const SVGLogo = () => (
    <Svg viewBox="0 0 163.076 19.072" width={200}>
        <G transform="translate(-73.148 -84.492)" fill={"#000000"}>
            <Path
                d="M9.387-51.929h12.52l2.582-2.582v-6.118l-2.582-2.582h-7.1l-.645-.645v-.981l.645-.645H24.1l.387-.387v-3.743L24.1-70H11.582L9-67.418V-61.3l2.582,2.582h7.1l.645.645v.981l-.645.645H9.387L9-56.06v3.743Z"
                transform="translate(64.148 154.993)"
            />
            <Path
                d="M26.167-70H21.779l-.387.387v12.52l-.645.645H14.808l-.645-.645v-12.52L13.776-70H9.387L9-69.613v15.1l2.582,2.582H23.973l2.582-2.582v-15.1Z"
                transform="translate(80.67 154.993)"
            />
            <Path
                d="M9-52.316l.387.387h4.389l.387-.387V-55.9h9.81l2.582-2.582v-8.932L23.973-70H9.387L9-69.613Zm5.163-8.106v-5.06h6.583l.645.645v3.769l-.645.645Z"
                transform="translate(99.257 154.993)"
            />
            <Path
                d="M9.387-51.929h4.389l.387-.387v-3.554h6.583l.645.645v2.909l.387.387h4.389l.387-.387v-3.012L24.607-58v-.155l1.947-2.565v-6.695L23.973-70H9.387L9-69.613v17.3Zm4.776-8.459v-5.094h6.583l.645.645v3.8l-.645.645Z"
                transform="translate(117.845 154.993)"
            />
            <Path
                d="M9.387-51.929H24.1l.387-.387V-56.06l-.387-.387H14.163v-2.22h7.822l.387-.387V-62.8l-.387-.387H14.163v-2.3H24.1l.387-.387v-3.743L24.1-70H9.387L9-69.613v17.3Z"
                transform="translate(136.432 154.993)"
            />
            <Path
                d="M20904.621-5248.932l-.387-.389v-9.319l-4.658,5.924h-.709l-4.7-5.924v9.319l-.389.389h-4.387l-.389-.389v-17.3l.389-.387h4.336l.439.284,4.729,6.443h.658l4.707-6.444.439-.284h4.311l.387.387v17.3l-.387.389Z"
                transform="translate(-20727.047 5351.995)"
                stroke="rgba(0,0,0,0)"
                strokeWidth={1}
            />
            <Path
                d="M9.387-51.929h4.389l.387-.387V-55.91h7.228v3.593l.387.387h4.389l.387-.387v-15.1L23.973-70H11.582L9-67.418v15.1Zm4.776-8.5v-4.41l.645-.645h5.938l.645.645v4.41Z"
                transform="translate(174.38 154.993)"
            />
            <Path
                d="M23.973-70H11.582L9-67.418v12.908l2.582,2.582H23.973l2.582-2.582v-3.795l-.387-.387H21.779l-.387.387v1.213l-.645.645H14.808l-.645-.645v-7.745l.645-.645h5.938l.645.645v1.213l.387.387h4.389l.387-.387v-3.795Z"
                transform="translate(192.968 154.993)"
            />
            <Path
                d="M20889.627-5248.97l-.627-.629v-2.55l4.209-5.388v-.9l-4.209-5.387v-2.535l.645-.645h3.424l3.416,4.373h.7l3.416-4.373h3.414l.654.654v2.526l-11.6,14.851Z"
                transform="translate(-20668.445 5351.995)"
            />
            <Path d="M4.435,6.482H0L5.065,0V5.852l-.63.629Z" transform="translate(231.16 96.564)" />
        </G>
    </Svg>
)
