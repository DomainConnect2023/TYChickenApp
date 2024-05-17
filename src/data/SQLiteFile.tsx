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
            "originid INTEGER, name TEXT, type TEXT, picture TEXT, price INTEGER, quantity INTEGER)"
        )
    })
}

export async function selectData (originid:number): Promise<{checkLength: number, numberOfQuantity: number}> {
    return new Promise((resolve, reject) => {
        let sql = "SELECT SUM(quantity) as totalQuantity FROM Carts WHERE originid = ? GROUP BY originid";
        db.transaction((tx) => {
            tx.executeSql(sql, [originid], async (tx, resultSet) => {
                var checkLength = resultSet.rows.length;
                var numberOfQuantity;
                if(checkLength>0){
                    numberOfQuantity = resultSet.rows.item(0).totalQuantity;
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

    
export async function addData (setID:number , setName:string, setType:string, setPicture:any, setPrice:number, setQuantity:number) {
    let sql = "INSERT INTO Carts (originid, name, type, picture, price, quantity) VALUES (?, ?, ?, ?, ?, ?)";
    let params = [setID, setName, setType, "", setPrice, setQuantity];
    db.executeSql(sql, params, (result) => {
        // Snackbar.show({
        //     text: "Add to Cart successfully.",
        //     duration: Snackbar.LENGTH_SHORT,
        // });
        return "success";
    }, (error) => {
        console.log("Error", error);
        return "fail";
    });
}


export async function updateData (originid:number, setQuantity:number) {
    let sql = "UPDATE Carts SET quantity = ? WHERE originid = ?";
    let params = [setQuantity, originid];
    db.executeSql(sql, params, (result) => {
        return "success";
    }, (error) => {
        console.log("Error", error);
        return "fail";
    });
}


export async function deleteDB(originid:number) {
    let sql = "DELETE FROM Carts WHERE originid = ?";
    let params = [originid];
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

