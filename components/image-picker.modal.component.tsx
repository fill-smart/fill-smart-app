import React from "react";
import { Modal, Text, StyleSheet, GestureResponderEvent, TouchableOpacity } from "react-native";
import THEME_COLORS from "../styles/theme.styles";
import styled from "styled-components/native";


const ModalPage = styled.View`
  flex: 1;
  background-color: 'rgba(72, 137, 255, 0.5)';
  justify-content: center;
`;

const ModalCard = styled.View`
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 10px;
  padding-top: 45px;
  padding-bottom: 45px;
  padding-left: 40px;
  padding-right: 40px;
  margin-left: 25px;
  margin-right: 25px;
  align-items: stretch;
`;

const ModalTitle = styled.Text`
  color: ${THEME_COLORS.FONT_NORMAL};
  font-family: LibreFranklin-Regular;
  font-size: 20px;
  margin-bottom: 40px;
`;

const ModalOption = styled.Text`
  color: ${THEME_COLORS.PRIMARY};
  font-family: LibreFranklin-Regular;
  font-size: 20px;
  margin-bottom: 20px;
`;

const CancelText = styled.Text`
  color: ${THEME_COLORS.PRIMARY};
  font-family: LibreFranklin-Regular;
  font-size: 20px;
  margin-top: 20px;
  text-align: right;
`;

const ImagePickerModal = (
    { 
        isModalVisible, 
        onOptionSelected,
        onClose 
    }:
    { 
        isModalVisible: boolean,
        onOptionSelected: (option: "camera" | "gallery") => void, 
        onClose: (event: GestureResponderEvent) => void 
    }) => {
    return (
        <Modal animationType="none" transparent={true} visible={isModalVisible}>
            <ModalPage>
                <ModalCard>
                    <ModalTitle>
                        <Text>Elija una opción:</Text>
                    </ModalTitle>
                    <TouchableOpacity onPress={() => {
                        onOptionSelected("gallery");
                    }}>
                        <ModalOption>
                            Seleccionar de la galería...
                        </ModalOption>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        onOptionSelected("camera");
                    }}>
                        <ModalOption>
                            Tomar foto...
                        </ModalOption>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose}>
                        <CancelText>
                            Cancelar
                        </CancelText>
                    </TouchableOpacity>
                </ModalCard>
            </ModalPage>
        </Modal>
    );
}

export default ImagePickerModal;