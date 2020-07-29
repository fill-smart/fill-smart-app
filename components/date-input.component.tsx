import React, { useCallback, useMemo, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import styled from 'styled-components/native';
import THEME_COLORS from '../styles/theme.styles';
import { TouchableOpacity } from 'react-native';

import moment from 'moment';


const SvgView = styled.View`
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

const DateInput = ({
  value,
  format,
  label,
  placeholder,
  colors,
  ref,
  onSubmitEditing,
  onChange,
}: {
  value?: Date;
  format: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  colors?: {
    label?: string;
    text?: string;
    border?: string;
  };
  ref?: any
  onSubmitEditing?: () => void,
  onChange: (value: Date) => void
}) => {

  const [show, setShow] = useState(false);

  const onDialogClose = (_: any, date?: Date) => {
    setShow(false);
    if (date) {
      onChange(date);
      onSubmitEditing ? onSubmitEditing() : null;
    }

  }

  // const svgView = icon ? (
  //   <SvgView onTouchStart={onIconPress}>
  //     <TouchableOpacity >{icon}</TouchableOpacity >
  //   </SvgView>
  // ) : null;
  const labelElement = label ? (
    <Text
      style={{
        color: colors?.label ? colors.label : THEME_COLORS.PRIMARY,
      }}>
      {label}
    </Text>
  ) : null;
  return (
    <React.Fragment>
      <TouchableOpacity onPress={() => { console.log("tapped!"); setShow(true); }}>
        <React.Fragment>
          <TextInput
            editable={false}
            ref={ref}
            placeholder={placeholder}
            style={{
              borderColor: colors?.border
                ? colors.border
                : THEME_COLORS.PRIMARY,
            }}
            value={value !== undefined ? moment(value).format(format): undefined}>
          </TextInput>
          {labelElement}
          {/* {svgView} */}
        </React.Fragment>
      </TouchableOpacity>
      {show && <DateTimePicker
        testID="dateTimePicker"
        value={new Date()}
        mode={'date'}
        display="calendar"
        onChange={onDialogClose}
      />
      }
    </React.Fragment>
  );
};

export default DateInput;
