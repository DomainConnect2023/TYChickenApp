import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, Pressable, TouchableWithoutFeedback } from 'react-native';
import { css } from '../theme/CSS';
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from '../theme/theme';
import { TextInput } from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import { db } from '../data/SQLiteFile';
import { CartItem } from './Objects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import LoadingAnimation from './LoadingAnimation';

const CustomDialog = ({ visible, onClose, DoneFunction }: {visible: any, onClose: any, DoneFunction: any}) => { 
  const [numofIce, setNumofIce] = useState<number>(0);
  const [numofHati, setNumofHati] = useState<number>(0);
  const [numofPedal, setNumofPedal] = useState<number>(0);
  const [processData, setProcessData] = useState(false);

  const handleConfirm = async () => {
    setProcessData(true);
    const now = new Date();
    now.setTime(now.getTime()+8*60*60*1000);
    // const todayDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString()}`;
    const userCode = await AsyncStorage.getItem('UserID') ?? "";
    const IPaddress = await AsyncStorage.getItem('IPAddress') ?? "";
    try {
      let sql = "SELECT * FROM Carts";
      db.transaction((tx) => {
          tx.executeSql(sql, [], async (tx, resultSet) => {
              var length = resultSet.rows.length;
              let setRemark;
              let Is_Add_On;
              let finalTotal = 0;
              let savedata = [];
              for (var i = 0; i < length; i++) {
                  finalTotal = finalTotal + (resultSet.rows.item(i).price*resultSet.rows.item(i).quantity);
                  if(resultSet.rows.item(i).remark!=""){
                    setRemark = resultSet.rows.item(i).category+", "+resultSet.rows.item(i).remark;
                  }else{
                    setRemark = resultSet.rows.item(i).category;
                  }

                  const newData = {
                      ProductName: resultSet.rows.item(i).originid,
                      Quantity: resultSet.rows.item(i).quantity,
                      Price: resultSet.rows.item(i).price,
                      Unit: resultSet.rows.item(i).unit,
                      Remarks: setRemark,
                  };
                  savedata.push(newData);
              }

              if(numofHati==0 || numofIce==0 || numofPedal==0){
                Is_Add_On=false;
              }else{
                Is_Add_On=true;
              }

              try {
                await RNFetchBlob.config({ trusty: true }).fetch("POST","https://"+IPaddress+"/api/SubmitCart", 
                { "Content-Type": "application/json" },
                JSON.stringify({
                    "CartList": savedata,
                    "Debtor": userCode,
                    "Is_Add_On": Is_Add_On,
                    "Ais": numofIce,
                    "Pedal": numofPedal,
                    "Hati": numofHati,
                    "OrderTime": now
                })).then(async (res) => {
                    if(res.json().isSuccess==true){
                      DoneFunction();
                      setProcessData(false);
                    }else{
                      setProcessData(false);
                      Snackbar.show({
                        text: res.json().message,
                        duration: Snackbar.LENGTH_LONG
                      });
                    }

                }).catch(err => {
                  setProcessData(false);
                  console.log("Error2: "+err.message);
                  Snackbar.show({
                      text: err.message,
                      duration: Snackbar.LENGTH_LONG
                  });
                })
              }catch(e){
                setProcessData(false);
                console.log("Error1: "+e);
              }
          }, (error) => {
            setProcessData(false);
            console.log("List error", error);
          });
      });

    }catch (error: any) {
      setProcessData(false);
      Snackbar.show({
          text: error.message,
          duration: Snackbar.LENGTH_SHORT,
      });
    }
    // DoneFunction();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {processData==true ? (
        <View style={{alignSelf:"center",}}>
          <LoadingAnimation />
        </View>
      ): (
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tick to add on</Text>
            {/* <Text style={styles.modalMessage}>Any need to add on?</Text> */}

            <View style={styles.selectionContainer}>
              <Text style={{color: "black", marginHorizontal: 10}}>Ice</Text>
              <Pressable
              style={css.miniPlusButton}
              onPress={async () => {
                if(numofIce>0){
                  setNumofIce(numofIce-1);
                }
              }}>
                <Text style={css.buttonText}>-</Text>
              </Pressable>
              <Text style={[css.buttonText, {marginHorizontal: 10}]}>{numofIce}</Text>
              <Pressable
              style={css.miniPlusButton}
              onPress={async () => {
                if(numofIce<7){
                  setNumofIce(numofIce+1);
                }else{
                  Snackbar.show({
                    text: "Max order quantity is 7.",
                    duration: Snackbar.LENGTH_SHORT,
                  });
                }
              }}>
                <Text style={css.buttonText}>+</Text>
              </Pressable>
            </View>

            <View style={styles.selectionContainer}>
              <Text style={{color: "black", marginHorizontal: 10}}>Hati</Text>
              <Pressable
              style={css.miniPlusButton}
              onPress={async () => {}}>
                <Text style={css.buttonText}>-</Text>
              </Pressable>
              <Text style={[css.buttonText, {marginHorizontal: 10}]}>{numofHati}</Text>
              <Pressable
              style={css.miniPlusButton}
              onPress={async () => {}}>
                <Text style={css.buttonText}>+</Text>
              </Pressable>
            </View>

            <View style={styles.selectionContainer}>
              <Text style={{color: "black", marginHorizontal: 10}}>Pedal</Text>
                <Pressable
                style={css.miniPlusButton}
                onPress={async () => {}}>
                  <Text style={css.buttonText}>-</Text>
                </Pressable>
                <Text style={[css.buttonText, {marginHorizontal: 10}]}>{numofPedal}</Text>
                <Pressable
                style={css.miniPlusButton}
                onPress={async () => {}}>
                  <Text style={css.buttonText}>+</Text>
                </Pressable>
            </View>

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
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
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
  selectionContainer: {
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
