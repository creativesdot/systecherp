/* eslint-disable prettier/prettier */
/* PurchaseOrder header */
import React, { Component } from 'react';
import { Item, Button, Text, Card, CardItem, Body } from 'native-base';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Ionicons';

import { FlatGrid } from 'react-native-super-grid';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import Modal, { ModalContent } from 'react-native-modals';
import { Container, Input } from 'native-base'; // NativeBase
/* PurchaseOrder body */
const { width: WIDTH } = Dimensions.get('window')
const sizes = { sm: 100, md: 50, lg: 33.333, xl: 25 }

export default class Payment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      dataSource1: {},
      loading: true,
      isFetching: false,
      FlatListItems: [],
      user_id: '',
      apistatus: 'Waiting For Approval',
      visibility: true,
      filter: "",
      searchvisible: false,
      count: 0,
      reverse: 'dec',
      reject: false,
      approved: false
    }
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: '#2196F3',
      },
      headerTitle: 'Payment',
    }
  }



  componentDidMount() {
    const { navigation } = this.props;
    const getapistatus = navigation.getParam('apistatus');
    if (getapistatus == 'Waiting For Approval') {
      this.setState({ apistatus: getapistatus, visibility: true, reject: false, approved: false });
    } else if(getapistatus == 'Rejected'){
      this.setState({ apistatus: getapistatus, visibility: false, reject: true, approved: false });
    } else{
      this.setState({ apistatus: getapistatus, visibility: false, reject: false, approved: true });
    }
    this.searchRandomUser()
  }

  onRefresh() {
    this.setState({ isFetching: true }, function () { this.searchRandomUser() });
  }

  onValueChange1(itemValue, itemIndex) {
    if (itemValue == 'Waiting For Approval') {
      this.setState({ apistatus: itemValue, visibility: true });
    } else {
      this.setState({ apistatus: itemValue, visibility: false });
    }
    this.searchRandomUser()
  }

  searchRandomUser = async () => {
    const { FlatListItems } = this.state;
    const { user_id } = this.state;
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,
        });
        var params = JSON.stringify({
          id: this.state.FlatListItems[0].user_id,
          type: "Payment",
          status: this.state.apistatus
        });
        fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/purchaseregister", {
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
              isFetching: false
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

  ListEmptyView = () => {
    return (
      <View style={styles.MainContainer}>
        <Text style={{ textAlign: 'center', fontSize: 20 }}> Data Not Available</Text>
      </View>

    );
  }

  sortAscDescending = () => {
    const { dataSource } = this.state;
    dataSource.sort((a, b) => a - b).reverse()
    this.setState({ dataSource })
    this.setState({ reverse: 'asc' })
  }
  render() {
    const { loading } = this.state;
    const items = this.state.dataSource;
    const screenWidth = Math.round(Dimensions.get('window').width);
    const { FlatListItems } = this.state;
    const { filter } = this.state;
    const lowercasedFilter = filter.toLowerCase();
    const filteredData = items.filter(item => {
      return Object.keys(item).some(key =>
        item[key].toString().toLowerCase().includes(lowercasedFilter)
      );
    });
    //alert(screenWidth)
    return (
      <Container>
        <View style={styles.container}>
          <View searchBar rounded style={{ elevation: 5, paddingHorizontal: 20, backgroundColor: '#2196F3' }}>
            <Item>
              <Icons name="ios-search" size={25} color={'#fff'} />
              <Input placeholder="Search" placeholderTextColor="#fff" style={{ color: '#fff', marginLeft: 10 }} value={this.state.filter} onChangeText={(filter) => this.setState({ filter })} />
              <TouchableOpacity onPress={() => this.sortAscDescending()}>
                <Icon name="sort" size={25} color={'#fff'} />
              </TouchableOpacity>
            </Item>
          </View>
          <FlatGrid
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            itemDimension={270}
            items={filteredData}
            style={styles.container}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity activeOpacity={.7} onPress={() => this.props.navigation.navigate('PaymentEdit', {
                details: item, Payment: this, user_id: FlatListItems[0].user_id, visibility: this.state.visibility, reject: this.state.reject, approved: this.state.approved
              })}>
                <Card>
                  <CardItem header style={styles.CardHeader}>
                    <Text style={styles.Title}>S.No : <Text style={styles.SupplierData}>{index + 1}</Text> </Text>
                    <Text style={styles.Title}>Date : <Text style={styles.SupplierData}>{item.date}</Text></Text>
                    {this.state.visibility ?
                      <Text style={styles.Title}>Age : <Text style={styles.SupplierData}>{item.age}</Text></Text>
                      : null}
                  </CardItem>
                  <CardItem>
                    <Body>
                      <View style={styles.Transaction}>
                        <Text style={styles.Title}>Transaction : </Text>
                        <Text style={styles.TransactionData}>{item.transno}</Text>
                      </View>
                      <View style={styles.Supplier}>
                        <Text style={styles.Title}>Supplier : </Text>
                        <Text style={styles.SupplierData}>{item.custname}</Text>
                      </View>
                    </Body>
                  </CardItem>
                  <CardItem footer>
                    {this.state.visibility ?
                      <View style={{ flexDirection: "row" }}>
                        <Button rounded small success style={styles.But} onPress={() => { this.approveClickListener(item.transno, "approve") }}>
                          <Text style={styles.ButText}>Approve</Text>
                        </Button>
                        <Button rounded small danger style={styles.But} onPress={() => { this.approveClickListener(item.transno, "reject") }}>
                          <Text style={styles.ButText}>Reject</Text>
                        </Button>
                      </View>
                      : null}
                    {/* <Button rounded small primary>
                      <Text style={styles.ButText} onPress={() => { this.props.navigation.navigate('ItemDetails', { id: item.transno, type: "Indent" }) }}>Item Details</Text>
                    </Button> */}
                  </CardItem>
                </Card>
              </TouchableOpacity>
            )}
          //ListEmptyComponent={this.ListEmptyView}
          />
        </View>
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
    );
  }

  approveClickListener = (transaction_id, status_approve) => {
    const { comments } = this.state;
    const { FlatListItems } = this.state;
    this.setState({
      loading: true,
    });
    var params = JSON.stringify({
      comments: this.state.comments,
      id: transaction_id,
      type: "Payment",
      user_id: FlatListItems[0].user_id,
      status: status_approve
    });
    //alert(params);
    fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/payment_approval", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: params,
    })
      .then(response => response.json())
      .then(responseText => {
        this.setState({
          dataSource1: responseText,
          loading: false
        });
        let a = this.state.dataSource1.success;
        //alert(a)
        if (a === '1') {
          this.deleteItemById(transaction_id)
          if (status_approve === "approve") {
            ToastAndroid.showWithGravityAndOffset(
              "Approved Successfully",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              "Rejected Successfully",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          }
        }
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
  }

  deleteItemById = id => {
    const filteredData = this.state.dataSource.filter(item => item.transno !== id);
    this.setState({ dataSource: filteredData });
  }


}

/* PurchaseOrder StyleSheet */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCDCDC"
  },
  But: {
    marginRight: 10
  },
  CardHeader: {
    justifyContent: "space-between"
  },
  ButText: {
    fontSize: 10,
    textTransform: "capitalize"
  },
  Title: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: 'sans-serif-thin',
  },
  SupplierData: {
    fontSize: 15,
    color: "#2196F3",
    fontWeight: "700",
    fontFamily: 'sans-serif-condensed',
  },
  Transaction: {
    flexDirection: "row"
  },
  Supplier: {
    flexDirection: "column"
  },
  TransactionData: {
    fontSize: 15,
    color: "#2196F3",
    fontWeight: "700",
    fontFamily: 'sans-serif-condensed',
  },
  MainContainer: {
    padding: 10,
    marginTop: Dimensions.get('window').height / 2,
    height: 40,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});