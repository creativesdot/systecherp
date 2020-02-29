/* eslint-disable prettier/prettier */
/* Darhome Header Import */
import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, Button } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';

import Icon from 'react-native-vector-icons/FontAwesome5'

/* Darhome Body */
export default class Darhome extends React.Component {
  render() {
    const items = [
      { name: 'Dar', nav: 'Dar', icon: 'handshake', code: '#2ecc71' },
      { name: 'Dar Register', nav: 'DarReg', icon: 'user-clock', code: '#2ecc71' },
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

/* Darhome StyleSheet */
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