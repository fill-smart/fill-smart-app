import React from "react";
import { Modal, Text, StyleSheet, GestureResponderEvent } from "react-native";
import Button from './button.component';
import THEME_COLORS from "../styles/theme.styles";
import styled from "styled-components/native";
import TransferNotificationIcon from "../assets/icons/ic_transfer_litres_notification.svg";


const ModalPage = styled.View`
  flex: 1;
  background-color: 'rgba(72, 137, 255, 0.5)';
  justify-content: center;
`;

const ModalCard = styled.View`
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 10px;
  padding-top: 48px;
  padding-bottom: 45px;
  padding-left: 40px;
  padding-right: 40px;
  margin-left: 25px;
  margin-right: 25px;
  align-items: stretch;
`;

const ModalSeparator = styled.View`
  background-color: ${THEME_COLORS.FONT_LIGHT};
  height: 1px;
  margin-bottom: 28px;
  width: 100%;
`;

const ModalText = styled.Text`
  color: ${THEME_COLORS.FONT_NORMAL};
  font-family: LibreFranklin-Regular;
  font-size: 18px;
  align-self: center;
  text-align: center;
  margin-bottom: 34px;
`;

const styles = StyleSheet.create({
    icon: {
        alignSelf: 'center',
        marginBottom: 30,
    }
});

const TransferNotificationModal = ({isModalVisible, onClose, data} : 
    {isModalVisible: boolean,
    onClose: (event: GestureResponderEvent) => void,
    data: {name: string, amount: number, wallet: string}}) => {
    return (
        <Modal animationType="none" transparent={true} visible={isModalVisible}>
            <ModalPage>
                <ModalCard>
                    <TransferNotificationIcon style={styles.icon} width={95.02} height={100.3} />
                    <ModalSeparator />
                    <ModalText>
                        <Text>Has recibido una transferencia de {data.name}: {"\n"}{"\n"}</Text>
                        <Text>{data.amount} lt de {data.wallet}</Text>
                    </ModalText>
                    <Button label="Aceptar" onPress={onClose} />
                </ModalCard>
            </ModalPage>
        </Modal>
    );
}

export default TransferNotificationModal;