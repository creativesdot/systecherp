/* eslint-disable prettier/prettier */
/* Prospect Header Imports */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, ToastAndroid, Keyboard, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons'; //Icons
import Autocomplete from 'react-native-autocomplete-input';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import { Fab } from 'native-base';
import Modal, { ModalContent } from 'react-native-modals';
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')



const API = 'https://swapi.co/api';
/* Prospect Body */
export default class AddCustPros extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state
        const title = navigation.getParam('type');
        return {
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: '#2196F3',
            },
            headerTitle: 'Add ' + title,
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            cust_name: '',
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
            query: '',
            filtereddata: [],
            empid: ''
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
        fetch("http://103.219.207.115:8091/MMS/rest/api/latest/android/city_name", {
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

    SetCityDetails = (cityname, city_id, state_id) => {
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
        const filteredcitys = this.state.filtereddata;
        return (
            <SafeAreaView style={styles.container}>
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
                                <ScrollView keyboardShouldPersistTaps={"always"}>
                                    <Autocomplete
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        data={filteredcitys}
                                        style={styles.autoCom}
                                        defaultValue={query}
                                        onChangeText={(text) => this.searchText(text)}
                                        placeholder="Enter the city name"
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => this.SetCityDetails(item.city_name, item.city_id, item.state_id)}>
                                                <Text style={styles.itemContainer}>
                                                    {item.city_name}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </ScrollView>
                            </Item>
                        </Form>
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
            </SafeAreaView>
        );
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
        fetch("http://103.219.207.115:8091/MMS/rest/api/latest/android/addupdatecustomer", {
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
        borderColor: '#b9b9b9',
        padding: 10
    }
});