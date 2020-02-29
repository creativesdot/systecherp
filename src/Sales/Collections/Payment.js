/* eslint-disable prettier/prettier */
/* Payment Header Import */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';

import Icon from 'react-native-vector-icons/FontAwesome5'

/* Payment Body */
export default class Payment extends React.Component {
  render() {
    const items = [
      { name: 'Sales Receipt Register', nav: 'SalesReceiptRegister', icon: 'registered', code: '#2ecc71' },
      { name: 'Sales Receipt', nav: 'SalesReceipt', icon: 'receipt', code: '#2ecc71' },
    ];
    return (
      <FlatGrid
        itemDimension={130}
        items={items}
        style={styles.gridView}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
          onPress={() => this.props.navigation.navigate(item.nav)} 
          style={[styles.itemContainer, { backgroundColor: item.code }]}>
            <Icon name={item.icon} size={50} color={'#fff'} />
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    );
  }
}

/* Payment StyleSheet */
const styles = StyleSheet.create({
  gridView: {
    flex: 1,
    backgroundColor: "#F0FFFF",
  },
  itemContainer: {
    flex:1,
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