import React from "react";
import { Modal, Text, StyleSheet, GestureResponderEvent } from "react-native";
import Button from './button.component';
import THEME_COLORS from "../styles/theme.styles";
import styled from "styled-components/native";
import TimerIcon from "../assets/icons/ic_timer_clock.svg";

const ModalPage = styled.View`
  flex: 1;
  background-color: 'rgba(72, 137, 255, 0.5)';
  justify-content: center;
`;

const ModalCard = styled.View`
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 10px;
  padding-top: 70px;
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
  margin-bottom: 38px;
  width: 100%;
`;

const ModalText = styled.Text`
  color: ${THEME_COLORS.FONT_NORMAL};
  font-family: LibreFranklin-Regular;
  font-size: 18px;
  align-self: center;
  text-align: center;
  margin-bottom: 45px;
`;

const styles = StyleSheet.create({
    icon: {
        alignSelf: 'center',
        marginBottom: 36,
    }
});

const OperationTimeExceededModal = ({ isModalVisible, onClose }:
    { isModalVisible: boolean, onClose: (event: GestureResponderEvent) => void }) => {
    return (
        <Modal animationType="none" transparent={true} visible={isModalVisible}>
            <ModalPage>
                <ModalCard>
                    <TimerIcon style={styles.icon} width={157.95} height={77.17} />
                    <ModalSeparator />
                    <ModalText>
                        <Text>Parece que la operación esta demorando demasiado tiempo.</Text>
                    </ModalText>
                    <Button label="Actualizar" onPress={onClose} />
                </ModalCard>
            </ModalPage>
        </Modal>
    );
}

export default OperationTimeExceededModal;