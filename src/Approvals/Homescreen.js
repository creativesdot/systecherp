/* eslint-disable prettier/prettier */
/* Homepage Header Import */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';

import Icon from 'react-native-vector-icons/Entypo'
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });

/* HomeScreen Body */
export default class Homescreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: [],
      loading: true,
      FlatListItems: []
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    const module_name = navigation.getParam('module_name');
    return {
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: '#2196F3',
      },
      headerTitle: module_name,
    }
  }

  componentDidMount() {
    const { FlatListItems } = this.state;
    const { navigation } = this.props;
    const module_name = navigation.getParam('module_name');
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,
          isFetching: false
        });
        var params = JSON.stringify({
          user_id: this.state.FlatListItems[0].user_id,
          name: module_name,
        });
        fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/usersprivilege", {
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
              loading: false,
            });
          })
          .catch((error) => {
            //console.error(error);
            ToastAndroid.showWithGravityAndOffset(
              "Please check your internet connection",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
          );
          });
      });
    });
  }
  render() {
    const items = this.state.dataSource;
    return (
      <FlatGrid
        itemDimension={130}
        items={items}
        style={styles.gridView}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate(item.nav,{type: item.name, visibility: item.type})}
            style={[styles.itemContainer, { backgroundColor: item.code }]}>
            <Icon name={item.icon} size={50} color={'#fff'} />
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    );
  }
}

/* HomeScreen StyleSheet */
const styles = StyleSheet.create({
  gridView: {
    flex: 1,
    backgroundColor: "#F0FFFF",
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 5,
    height: 150,
    elevation: 5,
    paddingHorizontal: 15
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    textTransform: "uppercase",
    marginTop: 10,
    fontFamily: 'sans-serif-condensed',
    textAlign: "center"
  },
});