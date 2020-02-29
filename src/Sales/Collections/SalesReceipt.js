/* eslint-disable prettier/prettier */
/* SalesRep header */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Modal,
    StatusBar,
    Image,
    Dimensions,
    TouchableOpacity,
    Alert,
    TouchableHighlight,
    ScrollView,
    FlatList,
    ToastAndroid,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import { Container, Content, Text, Item, Input, Label, Picker, Button, Icon } from 'native-base';
import { DataTable } from 'react-native-paper';


/* Get Screen Width */
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
import Autocomplete from 'react-native-autocomplete-input';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';


/* SalesRep body */
export default class SalesRep extends Component {

    /* Select Box and Date Picker */
    constructor(props) {
        super(props);
        /* Select Box */
        this.state = {
            receipttype: 'Against Invoice',
            paymentmode: 'Cash',
            check_advance: false,
            check_cheque: false,
            customerslist: [],
            query: '',
            filtereddata: [],
            empid: '',
            dataSource: [],
            cust_id: '',
            amount: '',
            total: '',
            advance_amount: '',
            ddno: '',
            remarks: '',
            fromDate: '',
            refno: '',
            bankname: '',
            companybankname: '',
            loading: false,
            banknames: [],
            bankcompanynames: [],
            banknameid: undefined,
            companybanknameid: undefined,
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
        const API = 'http://106.51.49.166:8090/MMS/rest/api/latest/android/customer';
        const BANKAPI = 'http://106.51.49.166:8090/MMS/rest/api/latest/android/banksearchRN';
        fetch(`${API}`)
            .then(res => res.json())
            .then(json => {
                this.setState({ customerslist: json });
                //setting the data in the films state
            });
        fetch(`${BANKAPI}`)
            .then(res => res.json())
            .then(json => {
                this.setState({ banknames: json.bank, bankcompanynames: json.bankcompany });
                if (this.state.banknames.length > 0) {
                    this.setState({
                        banknamesid: this.state.banknames[0].id,
                    })
                }
                if (this.state.bankcompanynames.length > 0) {
                    this.setState({
                        bankcompanynamesid: this.state.bankcompanynames[0].id
                    })
                }
                //setting the data in the films state
            });
    }
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

    /* Select Box */
    onValueChange1(itemValue, itemIndex) {
        if (itemValue === 'Advance') {
            this.setState(
                {
                    receipttype: itemValue,
                    check_advance: true,
                }
            );
        } else {
            this.setState(
                {
                    receipttype: itemValue,
                    check_advance: false,
                }
            );
        }
    }
    onValueChange2(itemValue, itemIndex) {
        if (itemValue === 'Cheque') {
            this.setState(
                {
                    paymentmode: itemValue,
                    check_cheque: true
                }
            );
        } else {
            this.setState(
                {
                    paymentmode: itemValue,
                    check_cheque: false
                }
            );
        }
    }
    CallApiCustomersInvoice = (cust_id, customerName) => {
        Keyboard.dismiss();
        this.setState(
            {
                query: customerName,
                filtereddata: [],
                dataSource: [],
                total: 0
            });
        var params = JSON.stringify({
            "cust_id": cust_id,
            "user_id": this.state.empid,
        });
        //alert(params);
        fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/customerreceiptsearchrn", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: params,
        })
            .then(response => response.json())
            .then(responseText => {
                this.setState({
                    dataSource: responseText.data[0].rec_details,
                    loading: false
                });
                let a = this.state.dataSource;
                //alert(JSON.stringify(a))
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    loading: false
                });
            });
    }

    render() {
        const { show, date, mode } = this.state;
        const { query } = this.state;
        const filteredcustomer = this.state.filtereddata;
        return (
            <Container>
                <Content showsVerticalScrollIndicator={false}>

                    <View style={styles.MainContainter}>
                        <Item stackedLabel>
                            <Label>Customer Name</Label>
                            <Autocomplete
                                autoCapitalize="none"
                                autoCorrect={false}
                                //data to show in suggestion
                                data={filteredcustomer}
                                style={styles.AutoCom}
                                //default value if you want to set something in input
                                defaultValue={query}
                                //default value if you want to set something in input
                                /*onchange of the text changing the state of the query whi
                                ch will trigger
                                the findFilm method to show the suggestions*/
                                onChangeText={(text) => this.searchText(text)}
                                placeholder="Enter the customer name"
                                renderItem={({ item }) => (
                                    //you can change the view you want to show in suggestion from here
                                    <TouchableOpacity onPress={() => this.CallApiCustomersInvoice(item.cust_id, item.customerName)}>
                                        <Text style={styles.itemText}>
                                            {item.customerName}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </Item>

                        <Item stackedLabel>
                            <Label>Receipt Type</Label>
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={styles.DropDown}
                                    placeholder="--Receipt Type--"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.receipttype}
                                    onValueChange={this.onValueChange1.bind(this)}
                                >
                                    <Picker.Item label="Against Invoice" value="Against Invoice" />
                                    <Picker.Item label="Advance" value="Advance" />
                                    <Picker.Item label="Duty Drawback" value="Duty Drawback" />
                                    <Picker.Item label="Rebate Claim" value="Rebate Claim" />
                                    <Picker.Item label="DGFT" value="DGFT" />
                                </Picker>
                            </Item>
                        </Item>

                        <Item stackedLabel>
                            <Label>Payment Mode</Label>
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={styles.DropDown}
                                    placeholder="--Payment Mode--"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.paymentmode}
                                    onValueChange={this.onValueChange2.bind(this)}
                                >
                                    <Picker.Item label="Cash" value="Cash" />
                                    <Picker.Item label="Cheque" value="Cheque" />
                                </Picker>
                            </Item>
                        </Item>
                        {this.state.check_advance ? <View>
                            <Item stackedLabel>
                                <Label>Amount</Label>
                                <Input keyboardType={'numeric'}
                                    onChangeText={(advance_amount) => this.setState({ advance_amount })}
                                />
                            </Item>
                        </View>
                            : null}
                        {this.state.check_cheque ? <View>
                            <Item stackedLabel>
                                <Label>Cheque/DD No</Label>
                                <Input keyboardType={'numeric'}
                                    onChangeText={(ddno) => this.setState({ ddno })}
                                />
                            </Item>

                            <Item>
                                <Label>Cheque/DD Date : </Label>
                                <Input value={this.state.fromDate}
                                    disabled
                                />
                                <Icon active name='calendar' onPress={() => this.datepicker()} style={styles.IconSize} />
                            </Item>

                            <Item stackedLabel>
                                <Label>Bank Name</Label>
                                <Item picker>
                                    <Picker
                                        selectedValue={this.state.bankname}
                                        onValueChange={(itemValue, itemIndex) => this.setState({ bankname: itemValue, banknameid: this.state.banknames[itemIndex].id })} >
                                        {this.state.banknames.map((item, key) => (
                                            <Picker.Item label={item.bankname} value={item.bankname} key={key} />)
                                        )}
                                    </Picker>
                                </Item>
                            </Item>
                            <Item stackedLabel>
                                <Label>Company Bank Name</Label>
                                <Item picker>
                                    <Picker
                                        selectedValue={this.state.companybankname}
                                        onValueChange={(itemValue, itemIndex) => this.setState({ companybankname: itemValue, companybanknameid: this.state.bankcompanynames[itemIndex].id })} >
                                        {this.state.bankcompanynames.map((item, key) => (
                                            <Picker.Item label={item.bankcompanyname} value={item.bankcompanyname} key={key} />)
                                        )}

                                    </Picker>
                                </Item>
                            </Item>
                            <Item stackedLabel>
                                <Label>Reference No</Label>
                                <Input onChangeText={(refno) => this.setState({ refno })} />
                            </Item>
                        </View>
                            : null}
                        <Item stackedLabel>
                            <Label>Remarks</Label>
                            <Input onChangeText={(remarks) => this.setState({ remarks })} />
                        </Item>
                    </View>
                    {!this.state.check_advance ? <View>
                        {/* Customer Invoice List */}
                        <DataTable>
                            <DataTable.Header style={{ backgroundColor: '#2ecc71' }}>
                                <DataTable.Title>Invoice No</DataTable.Title>
                                <DataTable.Title numeric>Invoice Value</DataTable.Title>
                                <DataTable.Title numeric>Outstanding</DataTable.Title>
                                <DataTable.Title numeric>Amount</DataTable.Title>
                            </DataTable.Header>

                            <FlatList
                                data={this.state.dataSource}
                                ItemSeparatorComponent={this.FlatListItemSeparator}
                                renderItem={({ item, index }) => (
                                    <View style={styles.row}>
                                        <Text style={styles.inputWrap1}>{item.invoice_no}</Text>
                                        <Text style={styles.inputWrap2} multiline={true}>{item.invoice_value}</Text>
                                        <Text style={styles.inputWrap2}>{item.outstand_amount}</Text>
                                        <Input style={styles.inputWrap2}
                                            keyboardType={'numeric'}
                                            onChangeText={(amount) => this.ModifyAmount(amount, index)}>{item.amount}</Input>
                                    </View>
                                )}
                            />
                        </DataTable>
                        {/* Total Amount */}
                        <View style={styles.Total}>
                            <Text>Total</Text>
                            <Text>{this.state.total}</Text>
                        </View>
                        {/* Submit Data */}
                    </View>
                        : null}
                    {/* Calender View */}
                    {show && <DateTimePicker value={new Date()}
                        mode={mode}
                        is24Hour={true}
                        display="spinner"
                        onChange={this.setDate} />
                    }
                    <View style={styles.MainContainter}>
                        <Button block style={styles.ButtonBg} onPress={() => this.Submit()}>
                            <Text>Submit</Text>
                        </Button>
                    </View>


                </Content>
                {
                    this.state.loading ? <ActivityIndicator
                        style={styles.loading}
                        size="large" /> : null
                }
            </Container>
        )
    }

    datepicker = () => {
        this.show('date');
    }

    setDate = (event, date) => {
        date = date || this.state.date;
        this.setState({
            show: Platform.OS === 'ios' ? true : false,
            date,
            fromDate: moment(date).format('DD-MM-YYYY'),
        });
    }

    show = mode => {
        this.setState({
            show: true,
            mode,
        });
    }


    ModifyAmount = (amount, index) => {
        if (amount === '') {
            this.state.dataSource[index].amount = 0
        } else {
            this.state.dataSource[index].amount = amount
        }
        var invoicelist = this.state.dataSource;
        var Total = 0;
        for (let i = 0; i < invoicelist.length; i++) {
            Total = parseInt(Total) + parseInt(this.state.dataSource[i].amount)
        }
        this.setState({
            total: Total
        })
    }

    Submit = () => {
        if (this.state.query != "") {

            if (this.state.receipttype === 'Advance') {
                if (this.state.advance_amount != '') {
                    if (this.state.paymentmode === 'Cash') {
                        this.setState({
                            loading: true,
                        });
                        var params = JSON.stringify({
                            remarks: this.state.remarks,
                            process_type: "insert",
                            payment_mode: this.state.paymentmode,
                            receipt_type: this.state.receipttype,
                            cust_name: this.state.query,
                            advance_amount: this.state.advance_amount,
                            user_id: this.state.empid,
                        });
                        this.Call_api(params)
                    } else {
                        if (this.state.ddno != '') {
                            if (this.state.fromDate != '') {
                                if (this.state.refno != '') {
                                    this.setState({
                                        loading: true,
                                    });
                                    var params = JSON.stringify({
                                        remarks: this.state.remarks,
                                        process_type: "insert",
                                        payment_mode: this.state.paymentmode,
                                        dddate: this.state.fromDate,
                                        ddno: this.state.ddno,
                                        receipt_type: this.state.receipttype,
                                        refno: this.state.refno,
                                        cust_name: this.state.query,
                                        advance_amount: this.state.advance_amount,
                                        user_id: this.state.empid,
                                        company_bankname: this.state.companybanknameid,
                                        bank_name: this.state.banknameid,
                                    });
                                    this.Call_api(params)
                                } else {
                                    ToastAndroid.showWithGravityAndOffset(
                                        "Please enter reference no",
                                        ToastAndroid.LONG,
                                        ToastAndroid.BOTTOM,
                                        25,
                                        50
                                    );
                                }
                            } else {
                                ToastAndroid.showWithGravityAndOffset(
                                    "Please enter dd date",
                                    ToastAndroid.LONG,
                                    ToastAndroid.BOTTOM,
                                    25,
                                    50
                                );
                            }
                        } else {
                            ToastAndroid.showWithGravityAndOffset(
                                "Please enter dd no",
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                                25,
                                50
                            );
                        }
                    }
                } else {
                    ToastAndroid.showWithGravityAndOffset(
                        "Please enter amount",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }


            } else {
                if (this.state.paymentmode === 'Cash') {
                    if (this.state.total != '') {
                        this.setState({
                            loading: true,
                        });
                        var params = JSON.stringify({
                            remarks: this.state.remarks,
                            process_type: "insert",
                            payment_mode: this.state.paymentmode,
                            receipt_type: this.state.receipttype,
                            cust_name: this.state.query,
                            user_id: this.state.empid,
                            invoice_details: this.state.dataSource
                        });
                        this.Call_api(params)
                    } else {
                        ToastAndroid.showWithGravityAndOffset(
                            "Please enter amount",
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );
                    }

                } else {
                    if (this.state.ddno != '') {
                        if (this.state.fromDate != '') {
                            if (this.state.refno != '') {
                                if (this.state.total != '') {
                                    this.setState({
                                        loading: true,
                                    });
                                    var params = JSON.stringify({
                                        remarks: this.state.remarks,
                                        process_type: "insert",
                                        payment_mode: this.state.paymentmode,
                                        dddate: this.state.fromDate,
                                        ddno: this.state.ddno,
                                        receipt_type: this.state.receipttype,
                                        refno: this.state.refno,
                                        cust_name: this.state.query,
                                        user_id: this.state.empid,
                                        company_bankname: this.state.companybanknameid,
                                        bank_name: this.state.banknameid,
                                        invoice_details: this.state.dataSource
                                    });
                                    this.Call_api(params)
                                } else {
                                    ToastAndroid.showWithGravityAndOffset(
                                        "Please enter amount",
                                        ToastAndroid.LONG,
                                        ToastAndroid.BOTTOM,
                                        25,
                                        50
                                    );
                                }
                            } else {
                                ToastAndroid.showWithGravityAndOffset(
                                    "Please enter reference no",
                                    ToastAndroid.LONG,
                                    ToastAndroid.BOTTOM,
                                    25,
                                    50
                                );
                            }
                        } else {
                            ToastAndroid.showWithGravityAndOffset(
                                "Please enter dd date",
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                                25,
                                50
                            );
                        }
                    } else {
                        ToastAndroid.showWithGravityAndOffset(
                            "Please enter dd no",
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );
                    }
                }
            }


        } else {
            ToastAndroid.showWithGravityAndOffset(
                "Please select customer",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
    }

    Call_api = (params) => {
        fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/salesreceiptentry", {
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
                        "Sales receipt added successfully",
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
    }
}

/* SalesRep StyleSheet */
const styles = StyleSheet.create({
    MainContainter: {
        paddingHorizontal: 10,
        paddingTop: 10
    },
    ButtonBg: {
        backgroundColor: '#2ecc71'
    },
    Total: {
        flexDirection: "row",
        justifyContent: 'space-between',
        backgroundColor: '#a2ebc1',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    autocomplete: {
        flex: 1,
        zIndex: 1,
        position: 'absolute',
        marginTop: 40,
        width: WIDTH,
    },
    AutoCom: {
        width: WIDTH
    },
    itemText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#e3e4e6'
    },
    inputWrap: {
        flex: 4,
        marginLeft: 5,
        marginTop: 5,
        marginBottom: 5
    },
    inputWrap1: {
        flex: 3,
        marginTop: 3,
        marginBottom: 3,
        marginLeft: 3
    },
    inputWrap2: {
        flex: 1.4,
        marginTop: 3,
        marginBottom: 3,
        justifyContent: "center",
        alignItems: "flex-end",
        textAlign: 'center'
    },
    row: {
        flex: 1,
        flexDirection: "row"
    },
    IconSize: {
        fontSize: 35,
        color: "#2ecc71"
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
});