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
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import logo from '../assets/image/Systech.png'
import md5 from 'md5';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import { Container } from 'native-base'; // NativeBase

/* Login Page Body */
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
import Modal, { ModalContent } from 'react-native-modals';

export default class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      usernametext: '',
      passwordtext: '',
      dataSource: [],
      FlatListItems: [],
      loading: false
    }
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
        if (results.rows.length > 0) {
          db.transaction(function (txn) {
            txn.executeSql(
              "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
              [],
              function (tx, res) {
                console.log('item:', res.rows.length);
                txn.executeSql('DROP TABLE IF EXISTS table_user', []);
                txn.executeSql(
                  'CREATE TABLE IF NOT EXISTS table_user(user_id VARCHAR(10), user_name VARCHAR(20))',
                  []
                );
              }
            );
          });
        }
      });
    });
  }

  render() {
    return (
      <Container>
      <LinearGradient colors={['#1abc9c', '#2ecc71']} style={styles.container} showsVerticalScrollIndicator={false}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.inputContainer}>
          <Icon style={styles.inputIcon} name="ios-person" size={25} color={'#D3D3D3'} />
          <TextInput
            style={{ flex: 1 }}
            placeholder={'Username'}
            placeholderTextColor={'#607D8B'}
            underlineColorAndroid='transparent'
            returnKeyType={"next"}
            onSubmitEditing={() => { this.secondTextInput.focus(); }}
            onChangeText={(usernametext) => this.setState({ usernametext })}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons style={styles.inputIcon} name="enhanced-encryption" size={25} color={'#D3D3D3'} />
          <TextInput
            ref={(input) => { this.secondTextInput = input; }}
            style={{ flex: 1 }}
            secureTextEntry={true}
            placeholder={'Password'}
            placeholderTextColor={'#607D8B'}
            underlineColorAndroid='transparent'
            returnKeyType={"done"}
            onChangeText={(passwordtext) => this.setState({ passwordtext })}
            onSubmitEditing={(event) => { this.loginClickListener(event) }}
          />
        </View>

        <TouchableOpacity style={styles.butContainer} onPress={this.loginClickListener}>
          <Text style={styles.text}>LOGIN</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.copyRight}>Copyright 2019 Systech Infovations Pvt Ltd</Text>
        </View>
      </LinearGradient>
      <Modal
          visible={this.state.loading}
        >
          <ModalContent>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Text>Please wait...</Text>
              <ActivityIndicator size="small" />
            </View>
          </ModalContent>
        </Modal>
      </Container>
    )
  }

  loginClickListener = () => {
    const { usernametext } = this.state;
    const { passwordtext } = this.state;
    if (this.state.usernametext != '') {
      if (this.state.passwordtext != '') {
        this.setState({
          loading: true,
        });
        var params = JSON.stringify({
          username: this.state.usernametext,
          password: md5(this.state.passwordtext),
        });
        console.log(this.state.usernametext);
        fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/userlogin", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: params,
        })
          .then(response => response.json())
          .then(responseText => {
            this.setState({
              dataSource: responseText.data,
              loading: false
            });
            let a = this.state.dataSource[0].success;
            let userid = this.state.dataSource[0].user_id;
            let user_name = this.state.dataSource[0].user_name;
            if (a === '1') {
              db.transaction(function (txn) {
                txn.executeSql(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
                  [],
                  function (tx, res) {
                    console.log('item:', res.rows.length);
                    txn.executeSql('DROP TABLE IF EXISTS table_user', []);
                    txn.executeSql(
                      'CREATE TABLE IF NOT EXISTS table_user(user_id VARCHAR(10), user_name VARCHAR(20))',
                      []
                    );

                  }
                );
              });

              db.transaction(function (tx) {
                tx.executeSql(
                  'INSERT INTO table_user (user_id, user_name) VALUES (?,?)',
                  [userid, user_name],
                  (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                      ToastAndroid.showWithGravityAndOffset(
                        "Login Successfully",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                      );
                    } else {
                      alert('Insert Failed');
                    }
                  }
                );
              });
              this.props.navigation.replace("Home")
            } else {
              ToastAndroid.showWithGravityAndOffset(
                "Invalid username or password",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        ToastAndroid.showWithGravityAndOffset(
          "Please Enter Password",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Please Enter User name",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
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