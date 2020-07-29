import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import WithdrawalWhiteIcon from '../../assets/icons/ic_topup_white.svg';
import THEME_COLORS from '../../styles/theme.styles';
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
    titleContainer: {
        marginLeft: 10,
        marginRight: 10,
    },
    title: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 16,
        color: THEME_COLORS.FONT_NORMAL,
    },
    valueContainer: {
        alignItems: "flex-end",
        alignSelf: "center",
    },
    value: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 16,
        color: THEME_COLORS.DANGER,
    },
});

const IconRender = () => {
    return (
        <View style={[styles.iconBox, { backgroundColor: THEME_COLORS.SUCCESS }]}>
            <WithdrawalWhiteIcon width={17.45} height={20.45}/>
        </View>
    )
};

const OperationValueLabel = ({ value }: { value: number }) => {
    const formattedValue = "-$" + value.toLocaleString("es-ar", {
        maximumFractionDigits: 0,
    });
    return (
        <Text style={styles.value}>{formattedValue}</Text>
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

const LocationRow = ({ gasStation }: { gasStation: string}) => {
    return ( gasStation ?
        <React.Fragment>
            <View style={styles.row}>
                <Text style={styles.rowText}>Estación</Text>
                <Text style={styles.rowText}>{gasStation}</Text>
            </View>
        </React.Fragment>
    : null);
};

const AccountTypeRow = ({ accountType }: { accountType: string | null}) => {
    return ( accountType ?
        <React.Fragment>
            <View style={styles.row}>
                <Text style={styles.rowText}>Cuenta seleccionada</Text>
                <Text style={styles.rowText}>{accountType}</Text>
            </View>
        </React.Fragment>
    : null);
};

const Separator = () => {
    return (
        <View style={{ backgroundColor: THEME_COLORS.LINES, width: "100%", height: 1 }} />
    );
};

const WithdrawalConfirmCard = ({ gasStation, amount, stamp, accountType }: { gasStation: string, amount: number, stamp: Date, accountType: string | null }) => {
    return (
        <View style={styles.detailContainer}>
            <View style={styles.firstRow}>
                <View style={styles.iconTitleContainer}>
                    <IconRender/>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Retirar fondos</Text>
                    </View>
                </View>
                <View style={styles.valueContainer}>
                    <OperationValueLabel value={amount}/>
                </View>
            </View>
            <Separator/>
            <DateRow stamp={stamp}/>
            <TimeRow stamp={stamp}/>
            <LocationRow gasStation={gasStation}/>
            <AccountTypeRow accountType={accountType}/>
        </View>
    );
};

export default WithdrawalConfirmCard;