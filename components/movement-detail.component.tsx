import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import OperationType, { OperationStyles } from '../models/operation-type.enum';
import THEME_COLORS from '../styles/theme.styles';
import { IOperation } from '../hooks/use-operations';
import { DateUtils } from '@silentium-apps/fill-smart-common';
import moment from 'moment';
import useParameters from '../hooks/use-parameters.hook';
import Loader from './loader.component';
import { SecurityContext } from '../contexts/security.context';


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
        flex: 1
    },
    titleSubtitleContainer: {
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
    },
    title: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 16,
        color: THEME_COLORS.FONT_NORMAL,
        flex: 1
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
    pendingBadge: {
        borderStyle: "solid",
        borderColor: THEME_COLORS.WARNING_STRONG,
        borderRadius: 10,
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        width: 100,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
    },
    paddingBadgeText: {
        color: THEME_COLORS.WARNING_STRONG,
        fontFamily: "LibreFranklin-Light",
        fontSize: 12,
    },
});

const MovementDetailSeparator = () => {
    return (
        <View style={{ backgroundColor: THEME_COLORS.LINES, width: "100%", height: 1 }} />
    );
};

const MovementDetail = ({
    item
}: {
    item: IOperation
}) => {
    const [state] = useContext(SecurityContext);
    const { gracePeriod, exchangeGracePeriod, loading } = useParameters();
    const type = item.operationTypeId;
    const title = item.operationTypeName === "Canje de Combustible" ? item.exchangeSourceFuelType + " a " + item.fuelTypeName : item.fuelTypeName;
    const leftSubtitle = item.operationTypeName;
    const date = DateUtils.format(item.stamp, "DD/MM/YYYY");
    const time = DateUtils.format(item.stamp, "hh:mm");
    const litres = item.litres;
    const location = item.gasStationName ?? undefined;
    const sublocation = item.pumpExternalId ? "Surtidor " + item.pumpExternalId : undefined;
    const total = litres * item.fuelPrice;
    const targetCustomer = item.targetCustomerFirstName + ' ' + item.targetCustomerLastName;
    const sourceCustomer = item.customerFirstName + ' ' + item.customerLastName;
    const operation = type.toString() === OperationType.Refuel ? item.pumpExternalId.toString().padStart(4, "0") + "-" + item.id.toString().padStart(8, "0") : item.id.toString().padStart(8, "0");
    const availabilityDate = type.toString() === OperationType.Purchase ? moment(item.stamp).add(gracePeriod, "days")
        : type.toString() === OperationType.Exchange ? moment(item.stamp).add(exchangeGracePeriod, "days") : undefined;
    const isPending = item.transferWithdrawalAuthorized === null && item.operationTypeName === "Retiro de Fondos";

    const PendingBadgeRender = () => {
        if (isPending) {
            return (
                <View style={styles.pendingBadge}>
                    <Text style={styles.paddingBadgeText}>Pendiente</Text>
                </View>
            )
        };
        return null;
    };

    const TotalRow = () => {
        if (type.toString() === OperationType.Withdrawal || type.toString() === OperationType.PaymentInStore || type.toString() === OperationType.Transfer) {
            return null;
        }
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
                <MovementDetailSeparator />
            </React.Fragment>
        );
    };

    const DateRow = () => {
        return (
            <React.Fragment>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Fecha</Text>
                    <Text style={styles.rowText}>{date}</Text>
                </View>
                <MovementDetailSeparator />
            </React.Fragment>
        );
    };

    const TimeRow = () => {
        return (
            <React.Fragment>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Hora</Text>
                    <Text style={styles.rowText}>{time}</Text>
                </View>
                {(location || operation) ? (<MovementDetailSeparator />) : null}
            </React.Fragment>
        );
    };

    const TransferCustomerRow = () => {
        return ( type.toString() === OperationType.Transfer ?
            state?.user?.id == item.userId ?
            <React.Fragment>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Transferido a</Text>
                    <Text style={styles.rowText}>{targetCustomer}</Text>
                </View>
                <MovementDetailSeparator />
            </React.Fragment>
            :
            <React.Fragment>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Recibido de</Text>
                    <Text style={styles.rowText}>{sourceCustomer}</Text>
                </View>
                <MovementDetailSeparator />
            </React.Fragment>
        : null);
    };

    const LocationRow = () => {
        if (type.toString() === OperationType.Purchase || type.toString() === OperationType.Exchange || type.toString() === OperationType.Transfer) {
            return null;
        };
        return (
            <React.Fragment>
                {type.toString() === OperationType.Refuel ?
                    <View style={styles.row}>
                        <Text style={styles.rowText}>{location}</Text>
                        <Text style={styles.rowText}>{sublocation}</Text>
                    </View>
                    :
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Estación</Text>
                        <Text style={styles.rowText}>{location}</Text>
                    </View>
                }
                {operation ? (<MovementDetailSeparator />) : null}
            </React.Fragment>
        );
    };

    const OperationRow = () => {
        return (
            <React.Fragment>
                <View style={styles.row}>
                    <Text style={[styles.rowText, { color: THEME_COLORS.PRIMARY }]}>Operación</Text>
                    <Text style={[styles.rowText, { color: THEME_COLORS.PRIMARY }]}>{operation}</Text>
                </View>
                {availabilityDate ? (<MovementDetailSeparator />) : null}
            </React.Fragment>
        );
    };

    const AvailabilityDateRow = () => {
        if ((type.toString() === OperationType.Purchase || type.toString() === OperationType.Exchange) && moment().isBefore(availabilityDate)) {
            return (
                <React.Fragment>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Disponible el</Text>
                        <Text style={styles.rowText}>{availabilityDate?.format("DD/MM/YYYY")}</Text>
                    </View>
                </React.Fragment>
            );
        }
        return null;
    };

    const IconRender = () => {
        const backgroundColor = OperationStyles.get(type.toString())?.iconBackgroundColor;
        const icon = OperationStyles.get(type.toString())?.iconComponent;
        return (
            <View style={[styles.iconBox, { backgroundColor: backgroundColor }]}>
                {icon}
            </View>
        )
    };

    const TitleLabel = () => {
        return (<Text style={styles.title} numberOfLines={1}>{title}</Text>)
    };

    const LeftSubtitleLabel = () => {
        return (<Text style={styles.leftSubtitle}>{leftSubtitle}</Text>);
    };

    const ValueLabel = () => {
        const textColor = OperationStyles.get(type.toString())?.fontColor;
        let formattedValue = "";
        switch (item.operationTypeId.toString()) {
            case OperationType.Refuel:
                formattedValue = litres.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                }) + " lt";
                break;
            case OperationType.Purchase:
                formattedValue = "+" + litres.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                }) + " lt";
                break;
            case OperationType.Exchange:
                formattedValue = "+" + litres.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                }) + " lt";
                break;
            case OperationType.Withdrawal:
                formattedValue = "-$" + total.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                });
                break;
            case OperationType.PaymentInStore:
                formattedValue = "-$" + total.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                });
                break;
            case OperationType.Transfer:
                formattedValue = state?.user?.id == item.userId ?
                "-" + litres.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                }) + " lt"
                :
                "+" + litres.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                }) + " lt";
                break;
            default:
                break;
        }
        return (
            <Text style={[styles.value, { color: state?.user?.id == item.userId ? textColor : THEME_COLORS.SUCCESS }]}>{formattedValue}</Text>
        )
    };

    if (loading) {
        return <Loader />
    }

    return (
        <View style={styles.detailContainer}>
            <View style={styles.firstRow}>
                <View style={styles.iconTitleContainer}>
                    <IconRender />
                    <View style={styles.titleSubtitleContainer}>
                        <TitleLabel />
                        <LeftSubtitleLabel />
                    </View>
                    <PendingBadgeRender/>
                </View>
                <View style={styles.valueContainer}>
                    <ValueLabel />
                </View>
            </View>
            <MovementDetailSeparator />
            <TotalRow />
            <DateRow />
            <TimeRow />
            <TransferCustomerRow />
            <LocationRow />
            <OperationRow />
            <AvailabilityDateRow />
        </View>
    );
};

export default MovementDetail;