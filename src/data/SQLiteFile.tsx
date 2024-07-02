import { Alert } from "react-native";
import SQLite from 'react-native-sqlite-storage';
import Snackbar from "react-native-snackbar";

export const db = SQLite.openDatabase({
    name: 'Carts.db', 
    location: 'default'
},() => {},
    error => { console.log(error) }
);


export async function createTable() {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS "+
            "Carts (id INTEGER PRIMARY KEY AUTOINCREMENT, "+
            "originid TEXT, name TEXT, category TEXT, unit TEXT, picture TEXT, price INTEGER, quantity INTEGER, remark TEXT)"
        )
    })
}

    // originid: productcode
    // name: product name (菜园母鸡)
    // category: 切4片，切9片
    // unit：kg, box
    // picture： product照片
    // price： 当下的价格
    // quantity：数量
    // remark：remark

export async function selectData (setID:string, setCatogory:string): Promise<{checkLength: number, numberOfQuantity: number}> {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM Carts WHERE originid = ? AND category = ?";
        db.transaction((tx) => {
            tx.executeSql(sql, [setID, setCatogory], async (tx, resultSet) => {
                var checkLength = resultSet.rows.length;
                var numberOfQuantity;
                if(checkLength>0){
                    numberOfQuantity = resultSet.rows.item(0).quantity;
                    resolve({ checkLength, numberOfQuantity });
                }else{
                    numberOfQuantity = 0;
                    resolve({ checkLength, numberOfQuantity });
                }
            }, (error) => {
                reject(error);
            })
        });
    });
}
    
export async function addData (setID:string, setName:string, setCatogory:string, setUnit:string, setPicture:any, setPrice:number, setQuantity:number, setRemark:string) {
    let sql = "INSERT INTO Carts (originid, name, category, unit, picture, price, quantity, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    let params = [setID, setName, setCatogory, setUnit, "", setPrice, setQuantity, setRemark];
    db.executeSql(sql, params, (result) => {
        Snackbar.show({
            text: "Add to Cart successfully.",
            duration: Snackbar.LENGTH_SHORT,
        });
        return "success";
    }, (error) => {
        console.log("Error", error);
        return "fail";
    });
}


export async function updateData (setCode:string, setCategory:string, setQuantity:number) {
    let sql = "UPDATE Carts SET quantity = ? WHERE originid = ? AND category = ?";
    let params = [setQuantity, setCode, setCategory];
    db.executeSql(sql, params, (result) => {
        return "success";
    }, (error) => {
        console.log("Error", error);
        return "fail";
    });
}


export async function deleteDB(setCode:string, setCategory:string) {
    let sql = "DELETE FROM Carts WHERE originid = ? AND category = ?";
    let params = [setCode, setCategory];
    db.executeSql(sql, params, (resultSet) => {
        return Alert.alert("Delete Successfully");
    }, (error) => {
        console.log("Delete user error", error);
    })
};


export async function deleteAllData() { 
    // This is delete all row
    db.transaction((tx) => {
        tx.executeSql('DELETE FROM Carts;', [], (txObj, resultSet) => {
            console.log('All data cleared successfully.');
            // Snackbar.show({
            //     text: "All data cleared successfully.",
            //     duration: Snackbar.LENGTH_SHORT,
            // });
        }, (error) => {
            console.log('Error while clearing data:', error);
        });
    });
};

