import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, Pressable, TouchableWithoutFeedback } from 'react-native';
import { css } from '../theme/CSS';
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from '../theme/theme';

const CustomDialog = ({ visible, onClose, DoneFunction }: {visible: any, onClose: any, DoneFunction: any}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleConfirm = () => {
    DoneFunction();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tick to add on</Text>
            {/* <Text style={styles.modalMessage}>Any need to add on?</Text> */}

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={handleCheckboxChange}
            >
              <Text style={{color: "black", marginHorizontal: 10}}>加冰块</Text>
              <View style={styles.checkbox}>
                {isChecked && <View style={styles.checkboxInner} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={handleCheckboxChange}
            >
              <Text style={{color: "black", marginHorizontal: 10}}>去骨</Text>
              <View style={styles.checkbox}>
                {isChecked && <View style={styles.checkboxInner} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.checkboxContainer, {marginBottom: 20}]}
              onPress={handleCheckboxChange}
            >
              <Text style={{color: "black", marginHorizontal: 10}}>去皮</Text>
              <View style={styles.checkbox}>
                {isChecked && <View style={styles.checkboxInner} />}
              </View>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <Pressable style={[styles.button, {backgroundColor: COLORS.secondaryLightGreyHex}]} onPress={async () => {
                  onClose();
              }}>
                  <Text style={css.CheckOutText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.button,]} onPress={async () => {
                  handleConfirm();
              }}>
                  <Text style={css.CheckOutText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.primaryWhiteHex,
    padding: SPACING.space_32,
    borderRadius: BORDERRADIUS.radius_15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: FONTSIZE.size_18,
    fontWeight: 'bold',
    marginBottom: SPACING.space_10,
    color: COLORS.primaryBlackHex,
  },
  modalMessage: {
    marginBottom: SPACING.space_5,
    textAlign: 'center',
    color: COLORS.primaryBlackHex,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.space_5,
  },
  checkbox: {
    width: SPACING.space_20,
    height: SPACING.space_20,
    borderWidth: 1,
    borderColor: COLORS.primaryBlackHex,
    marginRight: SPACING.space_10,
    justifyContent: 'center',
    alignItems: 'center',
    color: COLORS.primaryBlackHex,
  },
  checkboxInner: {
    width: SPACING.space_10,
    height: SPACING.space_10,
    backgroundColor: COLORS.primaryBlackHex,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: COLORS.primaryRedHex, 
    paddingHorizontal: SPACING.space_15,
    paddingVertical: SPACING.space_10,
    marginHorizontal: SPACING.space_5,
    borderRadius: BORDERRADIUS.radius_10,
    elevation: SPACING.space_10,
  },
  buttonText: {
    fontSize: FONTSIZE.size_16,
    fontWeight: 'bold',
  },
});

export default CustomDialog;
