import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import THEME_COLORS from '../../styles/theme.styles';
import ArrowDownIcon from '../../assets/icons/ic_arrow_simple_down.svg';
import ArrowDownWhiteIcon from '../../assets/icons/ic_arrow_down_white.svg';
import ArrowUpIcon from '../../assets/icons/ic_arrow_simple_up.svg';
import PumpGrayIcon from '../../assets/icons/ic_pump_gray.svg';
import PumpWhiteIcon from '../../assets/icons/ic_pump_normal_white.svg';
import useFuelTypesWithCurrentPrice, {
  FuelTypeWithCurrentPriceRecord,
} from '../../hooks/use-fuel-types-with-current-price.hook';

let modalTopMargin: number;

const styles = StyleSheet.create({
  dropdown: {
    elevation: 2,
    borderRadius: 5,
    backgroundColor: THEME_COLORS.WHITE,
  },
  dropDownContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: THEME_COLORS.WHITE,
  },
  dropDownContainerSelected: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: THEME_COLORS.PRIMARY,
  },
  dropDownContainerOpen: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: THEME_COLORS.LINES,
  },
  dropdownTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontFamily: 'LibreFranklin-Thin',
    fontSize: 14,
    color: THEME_COLORS.FONT_REGULAR,
  },
  dropdownTextSelected: {
    fontFamily: 'LibreFranklin-Medium',
    fontSize: 16,
    color: THEME_COLORS.WHITE,
    alignSelf: 'center',
  },
  dropdownSelectedLitresText: {
    fontFamily: 'LibreFranklin-Medium',
    fontSize: 18,
    color: THEME_COLORS.WHITE,
    marginRight: 20,
  },
  //OPTION ITEMS STYLE
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 50,
    backgroundColor: THEME_COLORS.BACKGROUND_DARK,
  },
  dropdownOptionText: {
    fontFamily: 'LibreFranklin-Thin',
    fontSize: 16,
    color: THEME_COLORS.FONT_REGULAR,
  },
  dropdownOptionValue: {
    fontFamily: 'LibreFranklin-Light',
    fontSize: 18,
    color: THEME_COLORS.FONT_REGULAR,
  },
  dropDownOptionSeparator: {
    borderStyle: 'solid',
    borderColor: THEME_COLORS.LINES,
    borderWidth: 1,
  },
  OptionItems: {
    position: 'absolute',
    height: 500,
    width: 500,
  },
});

const OptionItems = ({
  data,
  show,
  toggle,
  overlayColor,
  topMargin,
}: {
  data: FuelTypeWithCurrentPriceRecord[];
  show: boolean;
  toggle: any;
  overlayColor?: string;
  topMargin: number;
}) => {
  return (
    <Modal animationType="none" transparent={true} visible={show}>
      <View
        style={{
          flex: 1,
          backgroundColor: overlayColor + '80' ?? 'rgba(72, 137, 255, 0.5)',
        }}>
        <View
          style={[
            styles.dropdown,
            {
              opacity: 1,
              backgroundColor: THEME_COLORS.BACKGROUND_DARK,
              marginLeft: 25,
              marginRight: 25,
              marginTop: topMargin,
              elevation: 2,
              borderRadius: 5,
            },
          ]}>
          <TouchableWithoutFeedback onPress={() => toggle()}>
            <View style={styles.dropDownContainerOpen}>
              <View style={styles.dropdownTextContainer}>
                <Text style={styles.dropdownText}>{'Tipo de combustible'}</Text>
              </View>
              <ArrowUpIcon />
            </View>
          </TouchableWithoutFeedback>

          {data?.map((item, index) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => toggle(item)}
                key={index}>
                <View style={{padding: 5}}>
                  <View style={styles.dropdownOption}>
                    <PumpGrayIcon />
                    <View style={{flex: 1, paddingLeft: 12}}>
                      <Text style={styles.dropdownOptionText}>{item.name}</Text>
                    </View>
                    <Text style={styles.dropdownOptionValue}>
                      ${item.currentPrice.price.toLocaleString("es-ar", {maximumFractionDigits: 2})}
                    </Text>
                  </View>
                  <View style={styles.dropDownOptionSeparator} />
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

const Options = ({
  showOptions,
  setOptionSelected,
  data,
  overlayColor,
}: {
  showOptions: boolean;
  setOptionSelected: (option: any) => void;
  data: FuelTypeWithCurrentPriceRecord[];
  overlayColor?: string;
}) =>
  showOptions ? (
    <OptionItems
      overlayColor={overlayColor}
      topMargin={modalTopMargin}
      data={data}
      show={showOptions}
      toggle={(item: FuelTypeWithCurrentPriceRecord) => setOptionSelected(item)}
    />
  ) : null;

const PumpIcon = ({
  selectedOption,
}: {
  selectedOption: FuelTypeWithCurrentPriceRecord | null;
}) =>
  selectedOption ? (
    <View pointerEvents="none">
      <PumpWhiteIcon style={{marginRight: 12}} />
    </View>
  ) : null;

const ArrowIcon = ({
  selectedOption,
}: {
  selectedOption: FuelTypeWithCurrentPriceRecord | null;
}) =>
  selectedOption ? (
    <View pointerEvents="none">
      <ArrowDownWhiteIcon />
    </View>
  ) : (
    <View pointerEvents="none">
      <ArrowDownIcon />
    </View>
  );

const SelectedLitresText = ({
  showSelectedLitres,
  selectedOption,
}: {
  selectedOption: FuelTypeWithCurrentPriceRecord | null;
  showSelectedLitres: boolean;
}) =>
  selectedOption && showSelectedLitres ? (
    <Text style={styles.dropdownSelectedLitresText}>
      ${selectedOption.currentPrice.price.toLocaleString("es-ar", {maximumFractionDigits: 2})}
    </Text>
  ) : null;

const PurchaseDropdown = ({
  overlayColor,
  placeholder,
  showSelectedLitres = true,
  isOpen,
  onItemSelected,
}: {
  overlayColor?: string;
  placeholder?: string;
  showSelectedLitres?: boolean;
  isOpen?: boolean;
  onItemSelected: (e: FuelTypeWithCurrentPriceRecord) => void;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [
    selectedOption,
    setSelectedOption,
  ] = useState<FuelTypeWithCurrentPriceRecord | null>(null);
  const {fuelTypes, loading} = useFuelTypesWithCurrentPrice();

  let styleContainer = !showOptions
  ? selectedOption
    ? [styles.dropDownContainer, {backgroundColor: overlayColor}]
    : styles.dropDownContainer
  : styles.dropDownContainerOpen;

  let styleText = selectedOption
  ? styles.dropdownTextSelected
  : styles.dropdownText;

  useEffect(() => {
    if (isOpen){
      onDropDownOpened(80);
    }
  }, [isOpen]);

  const setOptionSelected = (item: FuelTypeWithCurrentPriceRecord) => {
    if (item){
      setSelectedOption(item);
      onItemSelected(item);
    }
    setShowOptions(prevState => !prevState);
  };

  const onDropDownOpened = (y: any) => {
    modalTopMargin = y;
    setShowOptions(prevState => !prevState);
  };

  if (loading) {
    <ActivityIndicator />;
  }

  return (
    <View style={styles.dropdown}>
      <TouchableWithoutFeedback
        onPress={e => fuelTypes ?
          onDropDownOpened(e.nativeEvent.pageY - e.nativeEvent.locationY) : null
        }>
        <View style={styleContainer}>
          <PumpIcon selectedOption={selectedOption} />
          <View style={styles.dropdownTextContainer} pointerEvents="none">
            <Text style={styleText}>
              {selectedOption?.name ?? placeholder ?? 'Tipo de combustible'}
            </Text>
            <SelectedLitresText
              showSelectedLitres={showSelectedLitres}
              selectedOption={selectedOption}
            />
          </View>
          <ArrowIcon selectedOption={selectedOption} />
        </View>
      </TouchableWithoutFeedback>

      <Options
        showOptions={showOptions}
        data={fuelTypes!}
        setOptionSelected={e => setOptionSelected(e)}
        overlayColor={overlayColor}
      />
    </View>
  );
};

export default PurchaseDropdown;
