/* eslint-disable prettier/prettier */
/* Login Page header */
import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TextInput,
    Image,
    Dimensions,
    Button,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import logo from '../assets/image/Systech.png'
import md5 from 'md5';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });

/* Login Page Body */
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

export default class SplashScreen extends Component {
    constructor(props) {
        super(props)
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
                [],
                function (tx, res) {
                    console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS table_user', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS table_user(user_id VARCHAR(10), user_name VARCHAR(20))',
                            []
                        );
                    }
                }
            );
        });
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
                if (results.rows.length > 0) {
                    this.state = {
                        FlatListItems: [],
                    }
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    this.setState({
                        FlatListItems: temp,
                    });
                    //alert(this.state.FlatListItems[0].user_id)
                    setTimeout(() => {
                        this.props.navigation.replace('Home');
                    }, 2000)
                } else {
                    setTimeout(() => {
                        this.props.navigation.replace('Login');
                    }, 2000)
                }
            });
        });
    }
    render() {
        return (
            <LinearGradient colors={['#1abc9c', '#2ecc71']} style={styles.container} showsVerticalScrollIndicator={false}>
                <Image source={logo} style={styles.logo} />
            </LinearGradient>
        )
    }
}

/* Login StyleSheet */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        //width: 137,
        //height: 100,
        marginBottom: 30
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: WIDTH - 55,
        height: 45,
        margin: 10,
        elevation: 3
    },
    inputIcon: {
        padding: 10,
        margin: 5,
        alignItems: 'center'
    },
    butContainer: {
        marginTop: 10,
        width: WIDTH - 55,
        height: 45,
        backgroundColor: "#EF5350",
        justifyContent: "center",
        alignItems: "center",
        elevation: 3
    },
    text: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
    },
    copyRight: {
        color: "#000",
        textAlign: "center",
        fontSize: 12,
        marginTop: 15
    },
});