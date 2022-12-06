import { Document, Font, G, Page, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer"
import BigNumber from "bignumber.js"
import moment from "moment"
import NostromoRegularBlack from "../../assets/fonts/nostromo-regular/NostromoRegular-Black.otf"
import ShareTech from "../../assets/fonts/share-tech/share-tech.otf"
import { generatePriceText, getOrderStatusDeets } from "../../helpers"
import { colors } from "../../theme/theme"
import { FiatOrder, FiatOrderStatus } from "../../types/fiat"
import { User } from "../../types/user"

Font.register({
    family: "Nostromo Regular Black",
    src: NostromoRegularBlack,
})
Font.register({
    family: "Share Tech Regular",
    src: ShareTech,
})

const styles = StyleSheet.create({
    page: {
        fontFamily: "Share Tech Regular",
        fontSize: 14,
    },
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
        marginBottom: 20,
    },
    heading: {
        textTransform: "uppercase",
        fontFamily: "Nostromo Regular Black",
        fontSize: 14,
        marginBottom: 20,
        color: "#000",
    },
    invoiceDetailsTable: {
        flexDirection: "row",
    },
    invoiceDetailsHeading: {
        width: 100,
    },
    orderSummaryTable: {
        flexDirection: "row",
    },
    orderSummaryTableHeader: {
        width: "25%",
        backgroundColor: "#cfcfcf",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        textTransform: "uppercase",
    },
    orderSummaryTableRow: {
        flexDirection: "row",
        backgroundColor: "#f0f0f0",
    },
    orderSummaryTableRowAlt: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
    },
    orderSummaryTableValue: {
        width: "25%",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    orderSummaryTableQtyColumn: {
        width: "10%",
    },
    orderSummaryTableDescriptionColumn: {
        width: "50%",
    },
    orderSummaryTableTotalColumn: {
        width: "20%",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    footerHeading: {
        backgroundColor: "#cfcfcf",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        textTransform: "uppercase",
    },
    footerHeadingTotal: {
        flexDirection: "row",
    },
    orderStatus: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#ffffff",
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 40,
        color: "#ffffff",
        backgroundColor: colors.green,
    },
    orderStatusRefunded: {
        backgroundColor: colors.red,
    },
    orderStatusPending: {
        backgroundColor: colors.lightNeonBlue,
    },
    footerValue: {
        marginTop: 10,
        textAlign: "center",
    },
})

interface Props {
    order: FiatOrder
    buyer: User // TODO: probably have this attached on order payload?
}

export const PDFInvoice = ({ order, buyer }: Props) => {
    let total = new BigNumber(0)
    order.items.forEach((item) => {
        total = total.plus(new BigNumber(item.amount).multipliedBy(item.quantity))
    })

    const statusDeets = getOrderStatusDeets(order.order_status)

    let statusStyles = styles.orderStatus
    if (order.order_status === FiatOrderStatus.Pending) {
        statusStyles = { ...statusStyles, ...styles.orderStatusPending }
    } else if (order.order_status === FiatOrderStatus.Refunded) {
        statusStyles = { ...statusStyles, ...styles.orderStatusRefunded }
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <InvoiceHeader />
                <View style={styles.section}>
                    <Text style={styles.heading}>Invoice Details</Text>
                    <View style={styles.invoiceDetailsTable}>
                        <View style={styles.invoiceDetailsHeading}>
                            <Text>Buyer:</Text>
                        </View>
                        <View>
                            <Text>
                                {buyer.username}#{buyer.gid}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.invoiceDetailsTable}>
                        <View style={styles.invoiceDetailsHeading}>
                            <Text>Order Date:</Text>
                        </View>
                        <View>
                            <Text>{moment(order.created_at).format("YYYY-MM-DD")}</Text>
                        </View>
                    </View>
                    <View style={styles.invoiceDetailsTable}>
                        <View style={styles.invoiceDetailsHeading}>
                            <Text>Order Number:</Text>
                        </View>
                        <View>
                            <Text>{order.order_number}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>Order Summary</Text>
                    <View style={styles.orderSummaryTable}>
                        <View style={{ ...styles.orderSummaryTableHeader, ...styles.orderSummaryTableQtyColumn }}>
                            <Text>Qty</Text>
                        </View>
                        <View style={{ ...styles.orderSummaryTableHeader, ...styles.orderSummaryTableDescriptionColumn }}>
                            <Text>Description</Text>
                        </View>
                        <View style={{ ...styles.orderSummaryTableHeader, ...styles.orderSummaryTableTotalColumn }}>
                            <Text>Price</Text>
                        </View>
                        <View style={{ ...styles.orderSummaryTableHeader, ...styles.orderSummaryTableTotalColumn }}>
                            <Text>Subtotal</Text>
                        </View>
                    </View>
                    {order.items.map((item, i) => {
                        const subtotal = new BigNumber(item.amount).multipliedBy(item.quantity)
                        return (
                            <View key={`item-row-${i}`} style={i % 2 === 0 ? styles.orderSummaryTableRow : styles.orderSummaryTableRowAlt}>
                                <View style={{ ...styles.orderSummaryTableValue, ...styles.orderSummaryTableQtyColumn }}>
                                    <Text>{item.quantity}</Text>
                                </View>
                                <View style={{ ...styles.orderSummaryTableValue, ...styles.orderSummaryTableDescriptionColumn }}>
                                    <Text>{item.name}</Text>
                                </View>
                                <View style={{ ...styles.orderSummaryTableValue, ...styles.orderSummaryTableTotalColumn }}>
                                    <Text>{generatePriceText("$USD", item.amount)}</Text>
                                </View>
                                <View style={{ ...styles.orderSummaryTableValue, ...styles.orderSummaryTableTotalColumn }}>
                                    <Text>{generatePriceText("$USD", subtotal)}</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>

                <View style={{ ...styles.section, ...styles.footer }}>
                    <View>
                        <View style={styles.footerHeading}>
                            <Text>Payment Method</Text>
                        </View>
                        <View style={styles.footerValue}>
                            <Text>Credit Card</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{ ...styles.footerHeading, ...styles.footerHeadingTotal }}>
                            <Text>Total</Text>
                            <View style={statusStyles}>
                                <Text>{statusDeets.label}</Text>
                            </View>
                        </View>
                        <View style={styles.footerValue}>
                            <Text>{generatePriceText("$USD", total)}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
}

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
