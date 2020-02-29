/* eslint-disable prettier/prettier */
/* Prospect Header Imports */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, FlatList, Text, Button, ToastAndroid, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'; //Icons
import { Fab, Item, Container, Input } from 'native-base';
import Modal, { ModalContent } from 'react-native-modals';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Ionicons';



/* Prospect Body */
export default class CustAndPros extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state
        const title = navigation.getParam('type');
        return {
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: '#2196F3',
            },
            headerTitle: title,
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            isactive: false,
            empid: '',
            loading: true,
            filter: "",
        };
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                }
                this.setState({
                    empid: results.rows.item(0).user_id,
                });
                //let a = this.state.FlatListItems[0].user_name;
                //alert(a)
            });
        });
    }

    componentDidMount() {
        this.searchRandomUser()
    }

    onRefresh() {
        this.setState({ isFetching: true }, function () { this.searchRandomUser() });
    }

    searchRandomUser = async () => {
        const { FlatListItems } = this.state;
        const { user_id } = this.state;
        const { navigation } = this.props;
        const type = navigation.getParam('type');
        var params = JSON.stringify({
            type: type,
        });
        fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/presalecustomer", {
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
    }

    sortAscDescending = () => {
        const { dataSource } = this.state;
        dataSource.sort((a, b) => a - b).reverse()
        this.setState({ dataSource })
        this.setState({ reverse: 'asc' })
    }

    render() {
        const { navigation } = this.props;
        const type = navigation.getParam('type');
        const visibility = navigation.getParam('visibility');
        const items = this.state.dataSource;
        const { filter } = this.state;
        const lowercasedFilter = filter.toLowerCase();
        const filteredData = items.filter(item => {
            return Object.keys(item).some(key =>
                item[key].toString().toLowerCase().includes(lowercasedFilter)
            );
        });
        return (
            <View style={styles.container}>
                <View searchBar rounded style={{ elevation: 5, paddingHorizontal: 20, backgroundColor: '#2196F3' }}>
                    <Item>
                        <Icons name="ios-search" size={25} color={'#fff'} />
                        <Input placeholder="Search" placeholderTextColor="#fff" style={{ color: '#fff', marginLeft: 10 }} value={this.state.filter} onChangeText={(filter) => this.setState({ filter })} />
                        <TouchableOpacity onPress={() => this.sortAscDescending()}>
                            <Icon1 name="sort" size={25} color={'#fff'} />
                        </TouchableOpacity>
                    </Item>
                </View>
                <FlatList
                    data={filteredData}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) =>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('AddCustPros', { details: item, visibility: true, type: type })}>
                            <View style={styles.listContainer}>
                                <View style={styles.colOne}>
                                    <Text style={styles.title}>Name</Text>
                                    <Text>{item.customerName}</Text>
                                </View>
                                <View style={styles.colOne}>
                                    <Text style={styles.title}>Mobile</Text>
                                    <Text>{item.custMobileNo}</Text>
                                </View>
                                {visibility ?
                                    <TouchableOpacity onPress={() => { this.Call_api(item.cust_id) }}>
                                        <View style={styles.btnContainer}>
                                            <Text style={styles.button}>Move</Text>
                                        </View>
                                    </TouchableOpacity>
                                    : null}
                            </View>
                        </TouchableOpacity>
                    }
                />
                <Fab
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#2196F3' }}
                    position="bottomRight"
                    onPress={() => { this.props.navigation.navigate('AddCustPros', { type: type, CustAndPros: this, visibility: false }) }}>
                    <Icon name="adduser" size={25} color="#ffff" />
                </Fab>
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
            </View>
        );
    }

    Call_api = (cust_id) => {
        var params = JSON.stringify({
            cust_id: cust_id,
            user_id: this.state.empid,
            status: 'update'
        });
        fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/addupdatecustomer", {
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
                    ToastAndroid.showWithGravityAndOffset(
                        "Prospect moved successfully",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                    this.onRefresh()
                }
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    loading: false
                });
            });
    }
}

/* Prospect StyleSheet */
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listContainer: {
        flex: 1,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: '#edebeb',
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between'
    },
    button: {
        color: '#fff',
    },
    title: {
        fontWeight: '700'
    },
    colOne: {
        flex: 2
    },
    btnContainer: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 30
    },
    fabButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2196F3',
        bottom: 10,
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    }
});