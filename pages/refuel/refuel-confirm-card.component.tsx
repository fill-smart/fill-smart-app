import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PumpWhiteIcon from '../../assets/icons/ic_pump_white.svg';
import THEME_COLORS from '../../styles/theme.styles';
import { LastPumpOperationRecord } from '../../hooks/use-pump-last-operation.hook';
import { WalletRecord } from '../../hooks/use-wallets';
import moment from 'moment';


const styles = StyleSheet.create({
    detailContainer: {
        backgroundColor: THEME_COLORS.WHITE,
        borderRadius: 10,
        elevation: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 40,
        fontFamily: "LibreFranklin-Regular",
        fontSize: 12,
    },
    firstRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10
    },
    rowText: {
        color: THEME_COLORS.FONT_NORMAL,
    },
    iconBox: {
        borderRadius: 10,
        height: 35,
        width: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    iconTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    titleSubtitleContainer: {
        marginLeft: 10,
        marginRight: 10,
    },
    title: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 16,
        color: THEME_COLORS.FONT_NORMAL,
    },
    leftSubtitle: {
        fontFamily: "LibreFranklin-Thin",
        fontSize: 14,
        color: THEME_COLORS.FONT_NORMAL,
    },
    rightSubtitle: {
        fontFamily: "LibreFranklin-Thin",
        fontSize: 14,
        color: THEME_COLORS.FONT_NORMAL,
    },
    valueContainer: {
        alignItems: "flex-end",
        alignSelf: "flex-start",
    },
    value: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 16,
    },
});

const IconRender = () => {
    return (
        <View style={[styles.iconBox, { backgroundColor: THEME_COLORS.WARNING }]}>
            <PumpWhiteIcon width={21.43} height={15.77} />
        </View>
    )
};

const RefuelTypeLabel = ({ refuelType }: { refuelType: string }) => {
    return (<Text style={styles.title}>{refuelType}</Text>)
};

const OperationName = () => {
    return (<Text style={styles.leftSubtitle}>{"Carga"}</Text>);
};

const OperationValueLabel = ({ value }: { value: number }) => {
    const formattedValue = value.toLocaleString("es-ar", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
    }) + " lt";
    return (
        <Text style={[styles.value, { color: THEME_COLORS.FONT_REGULAR }]}>{formattedValue}</Text>
    )
};

const TotalRow = ({ total }: { total: number }) => {
    return (
        <React.Fragment>
            <View style={styles.row}>
                <Text style={styles.rowText}>Total</Text>
                <Text style={styles.rowText}>${total.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                })}
                </Text>
            </View>
            <Separator />
        </React.Fragment>
    );
};

const PaymentMethodRow = ({ paymentMethod }: { paymentMethod: string }) => {
    return (
        <React.Fragment>
            <View style={styles.row}>
                <Text style={styles.rowText}>Método de pago</Text>
                <Text style={styles.rowText}>{paymentMethod}</Text>
            </View>
            <Separator />
        </React.Fragment>
    );
};

const DateRow = ({ stamp }: { stamp: Date }) => {
    const formatteStamp = moment(stamp).format("DD/MM/YYYY");
    return (
        <React.Fragment>
            <View style={styles.row}>
                <Text style={styles.rowText}>Fecha</Text>
                <Text style={styles.rowText}>{formatteStamp}</Text>
            </View>
            <Separator />
        </React.Fragment>
    );
};

const TimeRow = ({ stamp }: { stamp: Date }) => {
    const formatteStamp = moment(stamp).format("kk:mm");
    return (
        <React.Fragment>
            <View style={styles.row}>
                <Text style={styles.rowText}>Hora</Text>
                <Text style={styles.rowText}>{formatteStamp}</Text>
            </View>
            <Separator />
        </React.Fragment>
    );
};

const LocationRow = ({ gasStation, pump }: { gasStation: string, pump: string }) => {
    return (
        <React.Fragment>
            <View style={styles.row}>
                <Text style={styles.rowText}>Estación {gasStation}</Text>
                <Text style={styles.rowText}>Surtidor {pump}</Text>
            </View>
        </React.Fragment>
    );
};

const Separator = () => {
    return (
        <View style={{ backgroundColor: THEME_COLORS.LINES, width: "100%", height: 1 }} />
    );
};

const RefuelConfirmCard = ({ operation, wallet }: { operation: LastPumpOperationRecord, wallet: WalletRecord }) => {
    return (
        <View style={styles.detailContainer}>
            <View style={styles.firstRow}>
                <View style={styles.iconTitleContainer}>
                    <IconRender />
                    <View style={styles.titleSubtitleContainer}>
                        <RefuelTypeLabel refuelType={operation.lastExternalOperation?.fuelType.name} />
                        <OperationName />
                    </View>
                </View>
                <View style={styles.valueContainer}>
                    <OperationValueLabel value={operation.lastExternalOperation?.litres} />
                </View>
            </View>
            <Separator />
            <TotalRow total={operation.lastExternalOperation?.litres * operation.lastExternalOperation?.fuelType.currentPrice.price} />
            <PaymentMethodRow paymentMethod={wallet.fuelType.name} />
            <DateRow stamp={operation.lastExternalOperation?.stamp} />
            <TimeRow stamp={operation.lastExternalOperation?.stamp} />
            <LocationRow gasStation={operation.gasStation.name} pump={operation.externalId} />
        </View>
    );
};

export default RefuelConfirmCard;