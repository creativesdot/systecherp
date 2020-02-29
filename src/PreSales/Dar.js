/* eslint-disable prettier/prettier */
/* Prospect Header Imports */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Dimensions, ToastAndroid, Platform, PermissionsAndroid, ActivityIndicator, Keyboard, TextInput, FlatList, BackHandler } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text, Picker, Fab } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; //Icons
import Icon1 from 'react-native-vector-icons/MaterialIcons'; //Icons
var { height, width } = Dimensions.get('window'); //Get Width and Height
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
const API = 'http://106.51.49.166:8090/MMS/rest/api/latest/android/customer';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import Autocomplete from 'react-native-autocomplete-input';
import Modal, { ModalContent } from 'react-native-modals';
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;



/* Prospect Body */
export default class Dar extends React.Component {
    static navigationOptions = {
        title: 'DAR',
        headerTintColor: "#fff",
        headerStyle: {
            backgroundColor: '#2196F3',
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            typeofCall: [],
            language: '',
            modeofCall: [],
            modeofTravel: [],
            division: [],
            priority: [{ "priority_name": "Low" }, { "priority_name": "Medium" }, { "priority_name": "High" }],
            stage: [],
            activity: [],
            calltype_name: '',
            calltype_id: '',
            mode_name: '',
            mode_id: '',
            stage_name: '',
            stage_id: '',
            travel_name: '',
            travel_id: '',
            activity_name: '',
            activity_id: '',
            priority_name: 'Low',
            onsitestatus: false,
            lat: "0.0",
            lang: "0.0",
            km: '',
            customerslist: [],
            query: 'Select Customer',
            filtereddata: [],
            fromDate: '',
            toDate: '',
            selectdate: '',
            fromTime: '',
            toTime: '',
            selectTime: '',
            mobileno: '',
            description: '',
            remarks: '',
            salesperson: '',
            empid: '',
            qty: undefined,
            revenue: undefined,
            reffer: '',
            division_view: false,
            dataSource: {},
            division_name: '',
            division_id: '',
            cust_id: '',
            custdata: {},
            leadno: '--',
            cust_response: {},
            processType: "insert",
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
                    user_name: results.rows.item(0).user_name,
                    empid: results.rows.item(0).user_id,
                });
                //let a = this.state.FlatListItems[0].user_name;
                //alert(a)
                fetch(`${API}`)
                    .then(res => res.json())
                    .then(json => {
                        this.setState({ customerslist: json });
                        //setting the data in the films state
                    });
                this.SpinnersApi()
            });
        });
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    SetCustomerDetails = (customer, mobile, cust_id) => {
        this.setState(
            {
                query: customer,
                isModalVisible: false,
                mobileno: mobile,
                cust_id: cust_id,
                custdata: {},
                leadno: '',
                processType: "insert",
            });
    }

    handleBackPress = () => {
        this.setState({ isModalVisible: false })
        return true;
    };



    searchText = (e) => {
        let text = e.toLowerCase()
        let customers = this.state.customerslist
        let filteredName = customers.filter((item) => {
            return item.customerName.toLowerCase().match(text)
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

    componentDidMount = () => {
        var that = this;
        //Checking for the permission just after component loaded
        if (Platform.OS === 'ios') {
            this.callLocation(that);
        } else {
            async function requestLocationPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                        'title': 'Location Access Required',
                        'message': 'This App needs to Access your location'
                    }
                    )
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        //To Check, If Permission is granted
                        that.callLocation(that);
                    } else {
                        alert("Permission Denied");
                    }
                } catch (err) {
                    alert("err", err);
                    console.warn(err)
                }
            }
            requestLocationPermission();
        }
    }
    callLocation(that) {
        //alert("callLocation Called");
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                const currentLongitude = JSON.stringify(position.coords.longitude);
                //getting the Longitude from the location json
                const currentLatitude = JSON.stringify(position.coords.latitude);
                //getting the Latitude from the location json
                that.setState({ lat: currentLongitude });
                //Setting state Longitude to re re-render the Longitude Text
                that.setState({ lang: currentLatitude });
                //Setting state Latitude to re re-render the Longitude Text
            },
            (error) => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
            //Will give you the location on location change
            console.log(position);
            const currentLongitude = JSON.stringify(position.coords.longitude);
            //getting the Longitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);
            //getting the Latitude from the location json
            that.setState({ lat: currentLongitude });
            //Setting state Longitude to re re-render the Longitude Text
            that.setState({ lang: currentLatitude });
            //Setting state Latitude to re re-render the Longitude Text
        });
    }

    componentWillUnmount = () => {
        Geolocation.clearWatch(this.watchID);
    }

    setDate = (event, date) => {
        date = date || this.state.date;
        if (this.state.selectdate == "from") {
            this.setState({
                show: Platform.OS === 'ios' ? true : false,
                date,
                fromDate: moment(date).format('DD-MM-YYYY'),
            });
        } else if (this.state.selectdate == "to") {
            this.setState({
                show: Platform.OS === 'ios' ? true : false,
                date,
                toDate: moment(date).format('DD-MM-YYYY'),

            });
        } else if (this.state.selectdate == "fromtime") {
            this.setState({
                show: Platform.OS === 'ios' ? true : false,
                date,
                fromTime: moment(date).format('h:mm')
            });
        } else if (this.state.selectdate == "totime") {
            this.setState({
                show: Platform.OS === 'ios' ? true : false,
                date,
                toTime: moment(date).format('h:mm')
            });
        }
    }

    show = mode => {
        this.setState({
            show: true,
            mode,
        });
    }

    datepicker = (dateselecting) => {
        this.setState({
            selectdate: dateselecting
        });
        this.show('date');
    }

    timepicker = (timeselecting) => {
        this.setState({
            selectdate: timeselecting
        });
        this.show('time');
    }

    typeofCall(value, id) {
        this.setState({
            calltype_name: value,
            calltype_id: id
        });
        if (this.state.cust_id != '') {
            if (value == 'Follow Up') {
                this.Leadsearchapi()
            }
        }
    }

    modeofTravel(value) {
        this.setState({
            modeofTravel: value
        });
    }

    priority(value) {
        this.setState({
            priority: value
        });
    }

    stage(value) {
        this.setState({
            stage: value
        });
    }

    activity(value) {
        this.setState({
            activity: value
        });
    }

    customer_click(customerName, custMobileNo, cust_id) {
        Keyboard.dismiss();
        this.setState(
            {
                query: customerName,
                filtereddata: [],
                mobileno: custMobileNo,
                cust_id: cust_id,
                custdata: {},
                leadno: '',
                processType: "insert",
            });
        if (this.state.cust_id != '') {
            if (this.state.calltype_name == 'Follow Up') {
                this.Leadsearchapi()
            }
        }
    }

    modeofcall(itemValue, itemIndex) {
        this.setState({ mode_name: itemValue });
        if (itemValue === 'Onsite') {
            this.setState({
                onsitestatus: !this.state.status
            });
        } else {
            this.setState({
                onsitestatus: false,
                travel: "offsite",
                km: "0",
            });
        }
    }

    Leadsearchapi() {
        var params = JSON.stringify({
            user_id: this.state.empid,
            cust_id: this.state.cust_id,
        });
        fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/customerdarsearch", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: params,
        })
            .then(response => response.json())
            .then(responseText => {
                this.setState({
                    cust_response: responseText,
                    custdata: responseText.data,
                    loading: false,
                });
                if (this.state.cust_response.success == '1') {
                    this.setState({
                        custdata: responseText.data,
                        leadno: this.state.custdata.lead_no,
                        activity_name: this.state.custdata.activity,
                        fromTime: this.state.custdata.fromtime,
                        toTime: this.state.custdata.totime,
                        division_name: this.state.custdata.division,
                        km: this.state.custdata.distance,
                        mode_name: this.state.custdata.mode,
                        revenue: this.state.custdata.revenue,
                        stage_name: this.state.custdata.stage,
                        qty: this.state.custdata.qty,
                        //calltype_name: this.state.custdata.calltype,
                        //travel_name: this.state.custdata.travel,
                        priority_name: this.state.custdata.priority,
                        processType: "update",
                    });
                } else {
                    this.setState({
                        custdata: {},
                        leadno: '',
                        fromTime: '',
                        toTime: '',
                        description: '',
                        km: '',
                        mode_name: '',
                        revenue: '',
                        qty: '',
                        processType: "insert",
                    });
                }
                //alert(JSON.stringify(this.state.km+" "+this.state.qty+" "+this.state.revenue))
            })
            .catch((error) => {
                console.error(error);
                /* ToastAndroid.showWithGravityAndOffset(
                    "Please check your internet connection",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                ); */
            });
    }

    SpinnersApi() {
        var params = JSON.stringify({
            user_id: this.state.empid,
        });
        fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/darspinners", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: params,
        })
            .then(response => response.json())
            .then(responseText => {
                this.setState({
                    dataSource: responseText,
                    loading: false,
                });
                if (this.state.dataSource.calltypemaster.length > 0) {
                    this.setState({
                        typeofCall: this.state.dataSource.calltypemaster,
                    })
                }
                if (this.state.dataSource.modeofcall.length > 0) {
                    this.setState({
                        modeofCall: this.state.dataSource.modeofcall,
                    })
                }
                if (this.state.dataSource.stage.length > 0) {
                    this.setState({
                        stage: this.state.dataSource.stage,
                    })
                }
                if (this.state.dataSource.activity.length > 0) {
                    this.setState({
                        activity: this.state.dataSource.activity,
                    })
                }
                if (this.state.dataSource.travel.length > 0) {
                    this.setState({
                        modeofTravel: this.state.dataSource.travel,
                        travel_name: this.state.dataSource.travel[0].travel_name
                    })
                }
                if (this.state.dataSource.division.length > 0) {
                    this.setState({
                        division: this.state.dataSource.division,
                    })
                }
                //alert(JSON.stringify(this.state.dataSource))
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


    render() {
        const { show, date, mode } = this.state;
        const { FlatListItems } = this.state;
        const { query } = this.state;
        const items = this.state.customerslist;
        const { filter } = this.state;
        const lowercasedFilter = filter.toLowerCase();
        const filteredData = items.filter(item => {
            return Object.keys(item).some(key =>
                item[key].toString().toLowerCase().includes(lowercasedFilter)
            );
        });
        return (
            <View style={styles.container}>
                <Container>
                    <Content showsVerticalScrollIndicator={false}>
                        <Form>
                            <Item stackedLabel>
                                <Label>Customer</Label>
                                <TouchableOpacity onPress={this.toggleModal} style={{ alignSelf: 'flex-start', paddingTop: 10 }}>
                                    <Text>{this.state.query}</Text>
                                </TouchableOpacity>
                            </Item>
                            <Item stackedLabel>
                                <Label>Mobile No</Label>
                                <Input onChangeText={(mobileno) => this.setState({ mobileno })}
                                    keyboardType={'numeric'}
                                    value={this.state.mobileno}
                                />
                            </Item>
                            <Item>
                                <Label style={styles.FontSize}>From Time : </Label>
                                <Input value={this.state.fromTime} />
                                <Icon style={styles.iconContainer, styles.IconSize} active name='calendar-clock' onPress={() => this.timepicker("fromtime")} />
                            </Item>
                            <Item>
                                <Label style={styles.FontSize}>To Time : </Label>
                                <Input value={this.state.toTime} />
                                <Icon style={styles.iconContainer, styles.IconSize} active name='calendar-clock' onPress={() => this.timepicker("totime")} />
                            </Item>
                            <Item Picker>
                                <Label>Type of Call :</Label>
                                <Picker
                                    selectedValue={this.state.calltype_name}
                                    onValueChange={(itemValue, itemIndex) => this.typeofCall(itemValue, this.state.typeofCall[itemIndex].calltype_id)} >
                                    {this.state.typeofCall.map((item, key) => (
                                        <Picker.Item label={item.calltype_name} value={item.calltype_name} key={key} />)
                                    )}
                                </Picker>
                            </Item>
                            <Item Picker>
                                <Label>Mode of Call :</Label>
                                <Picker
                                    selectedValue={this.state.mode_name}
                                    onValueChange={(itemValue, itemIndex) => this.modeofcall(itemValue, itemIndex)} >
                                    {this.state.modeofCall.map((item, key) => (
                                        <Picker.Item label={item.mode_name} value={item.mode_name} key={key} />)
                                    )}
                                </Picker>
                            </Item>
                            {this.state.onsitestatus ? <View>
                                <Item Picker>
                                    <Label>Mode of Travel :</Label>
                                    <Picker
                                        selectedValue={this.state.travel_name}
                                        onValueChange={(itemValue, itemIndex) => this.setState({ travel_name: itemValue, travel_id: this.state.modeofTravel[itemIndex].travel_id })} >
                                        {this.state.modeofTravel.map((item, key) => (
                                            <Picker.Item label={item.travel_name} value={item.travel_name} key={key} />)
                                        )}
                                    </Picker>
                                </Item>

                                <Item stackedLabel>
                                    <Label>Distance(KM)</Label>
                                    <Input onChangeText={(km) => this.setState({ km })}
                                        keyboardType={'numeric'}>{this.state.km}</Input>
                                </Item>
                            </View>
                                : null}
                            <Item stackedLabel>
                                <Label>Referred by</Label>
                                <Input onChangeText={(reffer) => this.setState({ reffer })}></Input>
                            </Item>
                            <Item stackedLabel>
                                <Label>Sales person</Label>
                                <Input disabled
                                    value={this.state.user_name}></Input>
                            </Item>
                            <Item stackedLabel>
                                <Label>Lead No</Label>
                                <Input value={this.state.leadno} />
                            </Item>
                            <Item stackedLabel>
                                <Label>Lead Description</Label>
                                <Input multiline onChangeText={(description) => this.setState({ description })} />
                            </Item>
                            <Item Picker>
                                <Label>Priority :</Label>
                                <Picker
                                    selectedValue={this.state.priority_name}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ priority_name: itemValue })} >
                                    {this.state.priority.map((item, key) => (
                                        <Picker.Item label={item.priority_name} value={item.priority_name} key={key} />)
                                    )}
                                </Picker>
                            </Item>
                            <Item stackedLabel>
                                <Label>Qty</Label>
                                <Input
                                    keyboardType={'numeric'}
                                    onChangeText={(qty) => this.setState({ qty })}>{this.state.qty}</Input>
                            </Item>
                            <Item stackedLabel>
                                <Label>Revenue</Label>
                                <Input
                                    keyboardType={'numeric'}
                                    onChangeText={(revenue) => this.setState({ revenue })}>{this.state.revenue}</Input>

                            </Item>
                            {this.state.dataSource.division_view ?
                                <View>
                                    <Item Picker>
                                        <Label>Division :</Label>
                                        <Picker
                                            selectedValue={this.state.calltype_name}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ division_name: itemValue, division_id: this.state.division[itemIndex].division_id })} >
                                            {this.state.division.map((item, key) => (
                                                <Picker.Item label={item.division_name} value={item.division_name} key={key} />)
                                            )}
                                        </Picker>
                                    </Item>
                                </View>
                                : null}
                            <Item>
                                <Label>Expepted Closing :</Label>
                                <Input value={this.state.fromDate} />
                                <Icon style={styles.iconContainer, styles.IconSize} active name='calendar-clock' onPress={() => this.datepicker("from")} />
                            </Item>
                            <Item Picker>
                                <Label>Stage :</Label>
                                <Picker
                                    selectedValue={this.state.stage_name}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ stage_name: itemValue, stage_id: this.state.stage[itemIndex].stage_id })} >
                                    {this.state.stage.map((item, key) => (
                                        <Picker.Item label={item.stage_name} value={item.stage_name} key={key} />)
                                    )}
                                </Picker>
                            </Item>
                            <Item Picker>
                                <Label>Activity :</Label>
                                <Picker
                                    selectedValue={this.state.activity_name}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ activity_name: itemValue, activity_id: this.state.activity[itemIndex].activity_id })} >
                                    {this.state.activity.map((item, key) => (
                                        <Picker.Item label={item.activity_name} value={item.activity_name} key={key} />)
                                    )}
                                </Picker>
                            </Item>
                            <Item stackedLabel>
                                <Label>Remarks</Label>
                                <Input multiline onChangeText={(remarks) => this.setState({ remarks })} />
                            </Item>
                            {/* Calender View */}
                            {show && <DateTimePicker value={new Date()}
                                mode={mode}
                                is24Hour={true}
                                display="spinner"
                                onChange={this.setDate} />
                            }
                        </Form>
                        <Modal
                            visible={this.state.isModalVisible}
                            onBackdropPress={() => this.setState({ isModalVisible: false })}
                            deviceWidth={deviceWidth}
                            deviceHeight={deviceHeight}>

                            <ModalContent style={{ paddingTop: 0, paddingHorizontal: 0 }}>
                                <View style={styles.modalContainer}>
                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', backgroundColor: '#2196F3', padding: 10 }}>
                                        <Text style={{ color: '#fff' }}>Select Customer</Text>
                                        <TouchableOpacity onPress={() => this.setState({ isModalVisible: false })}>
                                            <Icon1 name="close" size={25} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{paddingHorizontal:10, paddingTop: 10}}>
                                    <TextInput
                                        style={styles.citySearch}
                                        placeholder='Search Customer'
                                        onChangeText={(filter) => this.setState({ filter })}
                                        value={this.state.filter}
                                    />
                                    <FlatList
                                        data={filteredData}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item }) =>
                                            <TouchableOpacity onPress={() => this.SetCustomerDetails(item.customerName, item.custMobileNo, item.cust_id)} style={styles.textContainer}>
                                                <Text>{item.customerName}</Text>
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
                    onPress={() => { this.submitdar() }}>
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
    }

    submitdar = () => {
        if (this.state.query != "") {
            if (this.state.fromTime != '') {
                if (this.state.toTime != '') {
                    if (this.state.description != '') {
                        if (this.state.fromDate != '') {
                            this.setState({
                                loading: true,
                            });
                            var params = '';
                            var params = JSON.stringify({
                                "activity": this.state.activity_name,
                                "appointmentDate": this.state.toDate,
                                "closeingDate": this.state.fromDate,
                                "custName": this.state.query,
                                "distanceKm": this.state.km,
                                "empId": this.state.empid,
                                "fromTime": this.state.fromTime,
                                "googleMapAddress": "Office Address",
                                "laititude": this.state.lat,
                                "leadDec": this.state.description,
                                "leadNo": this.state.leadno,
                                "longtitude": this.state.lang,
                                "mobileNo": this.state.mobileno,
                                "modeOfCall": this.state.mode_name,
                                "modeofTravel": this.state.travel_name,
                                "priority": this.state.priority_name,
                                "processType": this.state.processType,
                                "remarks": this.state.remarks,
                                "salesPerson": this.state.user_name,
                                "stage": this.state.stage_name,
                                "toTime": this.state.toTime,
                                "typeOfCall": this.state.calltype_name,
                                "qty": this.state.qty,
                                "revenue": this.state.revenue,
                                "reffer": this.state.reffer,
                                "division_name": this.state.division_name,
                                "cust_id": this.state.cust_id,
                            });
                            //alert(params);
                            this.setState({
                                loading: false
                            });
                            fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/addorupdatedar", {
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
                                            "Dar registered successfully",
                                            ToastAndroid.LONG,
                                            ToastAndroid.BOTTOM,
                                            25,
                                            50
                                        );
                                        this.props.navigation.goBack(null);
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                    this.setState({
                                        loading: false
                                    });
                                });
                        } else {
                            ToastAndroid.showWithGravityAndOffset(
                                "Please enter expected closing date",
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                                25,
                                50
                            );
                        }
                    } else {
                        ToastAndroid.showWithGravityAndOffset(
                            "Please enter lead description",
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );
                    }
                } else {
                    ToastAndroid.showWithGravityAndOffset(
                        "Please enter to time",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }
            } else {
                ToastAndroid.showWithGravityAndOffset(
                    "Please enter from time",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
            }
        } else {
            ToastAndroid.showWithGravityAndOffset(
                "Please select customer name",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
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
    autocomplete: {
        flex: 1,
        zIndex: 1,
        position: 'absolute',
        marginTop: 40,
        width: WIDTH,
    },
    autoCom: {
        width: WIDTH - 20
    },
    IconSize: {
        fontSize: 35,
        color: "#000000"
    },
    FontSize: {
        fontSize: 15
    },
    DropDown: {
        marginRight: 10,
        marginTop: 5
    },
    Dates: {
        marginVertical: 10,
        marginLeft: 0
    },
    Container: {
        paddingRight: 15,
        backgroundColor: "#e6fae3"
    },
    itemContainer: {
        borderBottomWidth: 1,
        padding: 10,
        borderColor: '#ccc'
    },
    iconContainer: {
        paddingRight: 10
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