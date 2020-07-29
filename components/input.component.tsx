import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components/native';
import THEME_COLORS from '../styles/theme.styles';
import { TouchableOpacity, KeyboardTypeOptions } from 'react-native';

const SvgTouchable = styled.TouchableOpacity`
  position: absolute;
  right: 13px;
  padding: 13px;
  top: 7px;
  right: 7px;
`;

const TextInput = styled.TextInput`  
  border: 1.5px solid;
  border-radius: 5px;
  font-size: 14px;
  font-family: 'LibreFranklin-Regular';
  padding: 15px;
  color: ${THEME_COLORS.FONT_REGULAR};  
  height: 51px;
`;

const Text = styled.Text`
  font-size: 12px;
  font-family: 'LibreFranklin-Regular';
  background-color: white;
  position: absolute;
  top: -11px;
  padding: 0px 3px;
  left: 14px;
  z-index: 99;
`;

const Input = React.forwardRef((
  {
    text,
    defaultValue,
    label,
    placeholder,
    colors,
    icon,
    secureTextEntry,
    onChangeText,
    onIconPress,
    keyboardType,
    editable = true,
    autoCapitalize,
    blurOnSubmit,
    onSubmitEditing,
    returnKeyType,
    multiline,
    numberOfLines,
    style,
  }: {
    text?: string;
    defaultValue?: string;
    label?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    colors?: {
      label?: string;
      text?: string;
      border?: string;
    };
    icon?: any;
    onChangeText?: (e: string) => void;
    onIconPress?: () => void;
    keyboardType?: KeyboardTypeOptions,
    editable?: boolean,
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
    blurOnSubmit?: boolean,
    onSubmitEditing?: () => void,
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send',
    multiline?: boolean,
    numberOfLines?: number,
    style?: any
  },
  ref: any
) => {
  const svgTouchable = icon ? (
    <SvgTouchable onPress={onIconPress}>
      {icon}
    </SvgTouchable>
  ) : null;
  const labelElement = label ? (
    <Text
      style={{
        color: !editable ? THEME_COLORS.DISABLED : (colors?.label ? colors.label : THEME_COLORS.PRIMARY),
      }}>
      {label}
    </Text>
  ) : null;
  return (
    <React.Fragment>
      <TextInput
        returnKeyType={returnKeyType}
        blurOnSubmit={blurOnSubmit}
        onSubmitEditing={onSubmitEditing}
        autoCapitalize={autoCapitalize}
        editable={editable !== undefined ? editable : true}
        ref={ref}
        keyboardType={keyboardType}
        placeholder={placeholder}
        style={{
          borderColor: !editable ? THEME_COLORS.DISABLED : (colors?.border ? colors.border : THEME_COLORS.PRIMARY),
          color: !editable ? THEME_COLORS.DISABLED : colors ? colors.text : THEME_COLORS.FONT_REGULAR, ...style
        }}
        onChangeText={onChangeText ? onChangeText : undefined}
        secureTextEntry={secureTextEntry}
        defaultValue={defaultValue}
        value={text}
        multiline={multiline ? multiline : false}
        textAlignVertical={multiline ? 'top' : undefined}
        numberOfLines={numberOfLines ? numberOfLines : undefined}>

      </TextInput>
      {labelElement}
      {svgTouchable}
    </React.Fragment>
  );
}
);

export default Input;



