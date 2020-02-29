/* eslint-disable prettier/prettier */
/* Prospect Header Imports */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ToastAndroid, Keyboard, Dimensions, ActivityIndicator, TextInput, FlatList, BackHandler } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons'; //Icons
import Autocomplete from 'react-native-autocomplete-input';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import { Fab } from 'native-base';
import Modal, { ModalContent } from 'react-native-modals';
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;




/* Prospect Body */
export default class AddCustPros extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state
        const title = navigation.getParam('type');
        const visibility = navigation.getParam('visibility');
        if (visibility) {
            return {
                headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: '#2196F3',
                },
                headerTitle: 'View ' + title,
            }
        } else {
            return {
                headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: '#2196F3',
                },
                headerTitle: 'Add ' + title,
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            cust_name: 'Select City',
            cust_id: '',
            con_person: '',
            mobile: '',
            email: '',
            city_id: '',
            city_name: '',
            country_id: '',
            state_id: '',
            address: '',
            cityslist: [],
            query: 'Select City',
            filtereddata: [],
            empid: '',
            loading: true,
            isModalVisible: false,
            filter: "",
        };
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
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

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    SetCityDetails = (city, city_id, state_id) => {
        this.setState(
            {
                query: city,
                isModalVisible: false,
                city_id: city_id,
                state_id: state_id,
            });
    }

    componentDidMount() {
        fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/city_name", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(responseText => {
                this.setState({
                    cityslist: responseText.data,
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
            
    }

    handleBackPress = () => {
        this.setState({ isModalVisible: false})
                return true;
      };

    searchText = (e) => {
        let text = e.toLowerCase()
        let citys = this.state.cityslist
        let filteredName = citys.filter((item) => {
            return item.city_name.toLowerCase().match(text)
        })
        if (!text || text === '') {
            this.setState({
                filtereddata: [],
            })
        } else if (!Array.isArray(filteredName) && !filteredName.length) {
            // set no data flag to true so as to render flatlist conditionally
        } else if (Array.isArray(filteredName)) {
            this.setState({
                filtereddata: filteredName,
            })
        }
    }

    SetCityDetails1 = (cityname, city_id, state_id) => {
        Keyboard.dismiss();
        this.setState(
            {
                query: cityname,
                filtereddata: [],
                city_id: city_id,
                state_id: state_id,
            });
    }

    render() {
        const { query } = this.state;
        const { navigation } = this.props;
        const visibility = navigation.getParam('visibility');
        const details = navigation.getParam('details');
        const items = this.state.cityslist;
        const { filter } = this.state;
        const lowercasedFilter = filter.toLowerCase();
        const filteredData = items.filter(item => {
            return Object.keys(item).some(key =>
                item[key].toString().toLowerCase().includes(lowercasedFilter)
            );
        });
        if (!visibility) {
            return (
                <View style={styles.container}>
                    <Container>
                        <Content showsVerticalScrollIndicator={false}>
                            <Form>
                                <Item stackedLabel>
                                    <Label>Customer Name</Label>
                                    <Input onChangeText={(cust_name) => this.setState({ cust_name })} />
                                </Item>
                                <Item stackedLabel>
                                    <Label>Contact Person</Label>
                                    <Input onChangeText={(con_person) => this.setState({ con_person })} />
                                </Item>
                                <Item stackedLabel>
                                    <Label>Mobile</Label>
                                    <Input keyboardType={'numeric'} onChangeText={(mobile) => this.setState({ mobile })} />
                                </Item>
                                <Item stackedLabel>
                                    <Label>Email</Label>
                                    <Input onChangeText={(email) => this.setState({ email })} />
                                </Item>
                                <Item stackedLabel>
                                    <Label>Address</Label>
                                    <Input onChangeText={(address) => this.setState({ address })} />
                                </Item>
                                <Item stackedLabel last>
                                    <Label>City</Label>
                                    <TouchableOpacity onPress={this.toggleModal} style={{alignSelf:'flex-start', paddingTop:10}}>
                                    <Text>{this.state.query}</Text>
                                </TouchableOpacity>
                                </Item>
                            </Form>
                            <Modal 
                            visible={this.state.isModalVisible} 
                            onBackButtonPress={() => this.setState({ isModalVisible: false })}
                            deviceWidth={deviceWidth}
                            deviceHeight={deviceHeight}>

                            <ModalContent style={{paddingTop:0, paddingHorizontal:0}}>
                                <View style={styles.modalContainer}>
                                    <View style={{justifyContent:'space-between', flexDirection: 'row', backgroundColor: '#2196F3', padding:10}}>
                                        <Text style={{color:'#fff'}}>Select City</Text>
                                        <TouchableOpacity onPress={() => this.setState({ isModalVisible: false })}>
                                        <Icon name="close" size={25} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{paddingHorizontal:10, paddingTop: 10}}>
                                        <TextInput
                                            style={styles.citySearch}
                                            placeholder='Search City'
                                            onChangeText={(filter) => this.setState({ filter })}
                                            value={this.state.filter}
                                        />
                                        <FlatList
                                            data={filteredData}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) =>
                                                <TouchableOpacity onPress={() => this.SetCityDetails(item.city_name,item.city_id,item.state_id)} style={styles.textContainer}>
                                                    <Text>{item.city_name}</Text>
                                                </TouchableOpacity> 
                                            }
                                        />
                                    </View>
                                </View>
                            </ModalContent>
                        
                        </Modal>
                        </Content>
                    </Container>
                    <Fab
                        direction="up"
                        containerStyle={{}}
                        style={{ backgroundColor: '#2196F3' }}
                        position="bottomRight"
                        onPress={() => { this.Submit() }}>
                        <Icon name="check" size={25} color="#ffff" />
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
        } else {
            return (
                <View style={styles.container}>
                    <Container>
                        <Content showsVerticalScrollIndicator={false}>
                            <Form>
                                <Item stackedLabel>
                                    <Label>Customer Name</Label>
                                    <Input disabled value={details.customerName} />
                                </Item>
                                <Item stackedLabel>
                                    <Label>Contact Person</Label>
                                    <Input disabled value={details.contactPerson} />
                                </Item>
                                <Item stackedLabel>
                                    <Label>Mobile</Label>
                                    <Input disabled value={details.custMobileNo} />
                                </Item>
                                <Item stackedLabel>
                                    <Label>Email</Label>
                                    <Input disabled value={details.email} />
                                </Item>
                                <Item stackedLabel>
                                    <Label>Address</Label>
                                    <Input disabled value={details.address} />
                                </Item>
                                <Item stackedLabel last>
                                    <Label>City</Label>
                                    <Input disabled value={details.custCity} />
                                </Item>
                            </Form>
                        </Content>
                    </Container>
                </View>
            );
        }

    }

    Submit = () => {
        const { navigation } = this.props;
        const type = navigation.getParam('type');
        if (this.state.cust_name != '') {
            if (this.state.con_person != '') {
                if (this.state.mobile != '') {
                    if (this.state.email != '') {
                        if (this.state.address != '') {
                            if (this.state.query != '') {
                                this.setState({
                                    loading: true,
                                });
                                var params = JSON.stringify({
                                    remarks: this.state.cust_name,
                                    type: type,
                                    status: 'add',
                                    name: this.state.cust_name,
                                    mobile: this.state.mobile,
                                    email: this.state.email,
                                    person: this.state.con_person,
                                    address: this.state.address,
                                    cust_name: this.state.query,
                                    user_id: this.state.empid,
                                    city_id: this.state.city_id,
                                    state_id: this.state.state_id,
                                });
                                this.Call_api(params, type)
                            } else {
                                ToastAndroid.showWithGravityAndOffset(
                                    "Please enter city",
                                    ToastAndroid.LONG,
                                    ToastAndroid.BOTTOM,
                                    25,
                                    50
                                );
                            }
                        } else {
                            ToastAndroid.showWithGravityAndOffset(
                                "Please enter address",
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                                25,
                                50
                            );
                        }
                    } else {
                        ToastAndroid.showWithGravityAndOffset(
                            "Please enter email",
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );
                    }
                } else {
                    ToastAndroid.showWithGravityAndOffset(
                        "Please enter mobile no",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }
            } else {
                ToastAndroid.showWithGravityAndOffset(
                    "Please enter contact person",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
            }
        } else {
            ToastAndroid.showWithGravityAndOffset(
                "Please enter the customer name",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
    }

    Call_api = (params, type) => {
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
                        type + " added successfully",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                    this.props.navigation.state.params.CustAndPros.onRefresh();
                    this.props.navigation.goBack();
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
    fabButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2196F3',
        position: 'absolute',
        bottom: 10,
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    autoCom: {
        width: WIDTH - 20
    },
    itemContainer: {
        borderBottomWidth: 1,
        padding: 10,
        borderColor: '#ccc'
    },
    modalContainer: {
        width: deviceWidth - 80, 
        height: deviceHeight - 400,
    },
    citySearch: {
        height: 40, 
        borderColor: '#ccc', 
        borderWidth: 1
    },
    textContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        paddingVertical: 10,
        paddingHorizontal: 5
    }
});