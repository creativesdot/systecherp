/* eslint-disable prettier/prettier */
/* Purchase Header Imports */
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';

import Icon from 'react-native-vector-icons/FontAwesome5'
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import Modal, { ModalContent } from 'react-native-modals';
import { Container } from 'native-base'; // NativeBase

/* Purchase Body */
export default class Purchase extends React.Component {
  static navigationOptions = {
    title: 'Purchase',
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: '#2196F3',
    },
  };
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
          isFetching: false,
        });
        var params = JSON.stringify({
          user_id: this.state.FlatListItems[0].user_id,
          name: 'Purchase',
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
      <Container style={{backgroundColor: "#DCDCDC"}}>
      <FlatGrid
        itemDimension={270}
        items={items}
        style={styles.gridView}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.itemContainer}>
            <View style={{flexDirection:'row'}}>
              <View style={{flex:1, alignItems: 'center', paddingVertical: 15}}>
                  <Icon name={item.icon} size={50} color={'#404040'} />
                  <Text style={styles.itemName}>{item.name}</Text>
              </View>
              <View style={{flexDirection:'column', alignItems:'flex-end'}}>
                <TouchableOpacity style={{paddingVertical:10, paddingHorizontal:15, backgroundColor:'#49bd78', borderTopRightRadius:10, width: 105 }} onPress={() => this.props.navigation.navigate(item.nav,{apistatus: 'Approved'})}>
                    <Text>Approved</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{paddingVertical:10, paddingHorizontal:15, backgroundColor:'#ec3c3d', width: 105}} onPress={() => this.props.navigation.navigate(item.nav,{apistatus: 'Rejected'})}>
                    <Text>Rejected</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{paddingVertical:10, paddingHorizontal:15, backgroundColor:'#f7aa34', borderBottomRightRadius:10, width: 105}} onPress={() => this.props.navigation.navigate(item.nav,{apistatus: 'Waiting For Approval'})}>
                    <Text>To Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal
      visible={this.state.loading}
    >
      <ModalContent>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Text>Please wait...</Text>
          <ActivityIndicator size="small" />
        </View>
      </ModalContent>
    </Modal></Container>
    );
  }
}

/* Purchase StyleSheet */
const styles = StyleSheet.create({
  gridView: {
    //marginTop: 5,
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#fff'
  },
  itemName: {
    fontSize: 16,
    color: '#404040',
    fontWeight: '700',
    textTransform: "uppercase",
    marginTop: 10,
    fontFamily: 'sans-serif-condensed',
    textAlign: "center"
  },
});