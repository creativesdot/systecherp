/* eslint-disable prettier/prettier */
/* Homepage Header Import */
import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, Button } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

  componentDidMount() {
    const { FlatListItems } = this.state;
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
          name: 'Home',
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
            console.error(error);
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
            onPress={() => this.props.navigation.navigate(item.nav, {module_name: item.name})}
            style={[styles.itemContainer, { backgroundColor: item.code }]}>
            <Icon name={item.icon} size={50} color={'#fff'} />
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    );
  }
}

/* const items = [
  { name: 'Dar', nav: 'DarHome', icon: 'handshake', code: '#2ecc71' },
  { name: 'Enquiry', nav: 'Enquiry', icon: 'user-clock', code: '#2ecc71' },
  { name: 'Sales Request', nav: 'SalesRequest', icon: 'registered', code: '#2ecc71' },
  { name: 'Stock Report', nav: 'StockReport', icon: 'file-excel', code: '#2ecc71' },
  { name: 'Payment Collection', nav: 'Payment', icon: 'rupee-sign', code: '#2ecc71' },
]; */

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