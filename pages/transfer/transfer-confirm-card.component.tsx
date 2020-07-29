import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import TransferWhiteIcon from '../../assets/icons/ic_transfer_litres_white.svg';
import THEME_COLORS from '../../styles/theme.styles';
import moment from 'moment';
import { ICustomerModel } from '../../models/customer.model';


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
        alignItems: "flex-start",
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
    valueContainer: {
        alignSelf: "flex-start",
    },
    value: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 16,
        color: THEME_COLORS.DANGER,
    },
});

const IconRender = () => {
    return (
        <View style={[styles.iconBox, { backgroundColor: THEME_COLORS.TRANSFER_LITRES }]}>
            <TransferWhiteIcon width={20.32} height={21.52}/>
        </View>
    )
};

const OperationValueLabel = ({ value }: { value: number }) => {
    const formattedValue = value.toLocaleString("es-ar", {
        maximumFractionDigits: 0,
    }) + " lt";
    return (
        <Text style={styles.value}>-{formattedValue}</Text>
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

const TargetCustomerRow = ({ selectedCustomer }: { selectedCustomer: Pick<ICustomerModel, "id" | "firstName" | "lastName" | "documentNumber">}) => {
    return (
        <React.Fragment>
            <View style={styles.row}>
                <Text style={styles.rowText}>Transferir a</Text>
                <Text style={styles.rowText}>{selectedCustomer.firstName + ' ' + selectedCustomer.lastName}</Text>
            </View>
        </React.Fragment>
    );
};

const Separator = () => {
    return (
        <View style={{ backgroundColor: THEME_COLORS.LINES, width: "100%", height: 1 }} />
    );
};

const TransferConfirmCard = ({ selectedCustomer, amount, stamp, walletName }: 
    { selectedCustomer: Pick<ICustomerModel, "id" | "firstName" | "lastName" | "documentNumber">, amount: number, stamp: Date, walletName: string }) => {
    return (
        <View style={styles.detailContainer}>
            <View style={styles.firstRow}>
                <View style={styles.iconTitleContainer}>
                    <IconRender/>
                    <View style={styles.titleSubtitleContainer}>
                        <Text style={styles.title}>{walletName}</Text>
                        <Text style={styles.leftSubtitle}>Transferir litros</Text>
                    </View>
                </View>
                <View style={styles.valueContainer}>
                    <OperationValueLabel value={amount}/>
                </View>
            </View>
            <Separator/>
            <DateRow stamp={stamp}/>
            <TimeRow stamp={stamp}/>
            <TargetCustomerRow selectedCustomer={selectedCustomer}/>
        </View>
    );
};

export default TransferConfirmCard;