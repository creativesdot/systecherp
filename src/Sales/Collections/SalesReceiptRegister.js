/* eslint-disable prettier/prettier */
/* SalesRepReg header */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Modal,
    StatusBar,
    TextInput,
    Image,
    Dimensions,
    TouchableOpacity,
    Alert,
    TouchableHighlight,
    ScrollView,
    FlatList,
    ToastAndroid,
} from 'react-native';
import { Container, DatePicker, Content, Text, Right, Left, Footer, Item, Input, Label, Picker } from 'native-base';
import { DataTable } from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatGrid } from 'react-native-super-grid';


/* Get Screen Width */
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

/* SalesRepReg body */
export default class SalesRepReg extends Component {

    /* Date Picker Bind Value */
    constructor(props) {
        super(props);
        this.state = {
            chosenDate: new Date(), // Date Picker
            selected1: undefined, // Select Box
            select: false,
            dataSource: [],
            dataSource1: {}
        };
        this.setDate = this.setDate.bind(this);
        this.submitdar("Today");
    }
    // Date Picker
    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }
    // Select Box
    onValueChange1(itemValue, itemIndex) {
        this.setState({ selected1: itemValue });
        /* if (itemValue == 'key3') {
            this.setState({ select: true })
        }
        else {
            this.setState({ select: false })
        } */
        this.submitdar(itemValue);
    }

    render() {
        return (
            <Container>
                <Content showsVerticalScrollIndicator={false}>
                    <View style={styles.MainContainter}>
                        <Item stackedLabel>
                            <Label>Custome Date</Label>
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    placeholder="--Custome Date--"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.selected1}
                                    onValueChange={this.onValueChange1.bind(this)}>
                                    <Picker.Item label="Today" value="Today" />
                                    <Picker.Item label="Last Week" value="Last Week" />
                                    <Picker.Item label="Last Month" value="Last Month" />
                                    <Picker.Item label="Last Six Month" value="Last Six Month" />
                                </Picker>
                            </Item>
                        </Item>
                        {/* Select Particular Day Data */}
                        {this.state.select ?
                            <View style={styles.DatePick}>
                                <DatePicker
                                    defaultDate={new Date(2018, 4, 4)}
                                    minimumDate={new Date(2018, 1, 1)}
                                    maximumDate={new Date(2018, 12, 31)}
                                    locale={"en"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Select date"
                                    textStyle={{ color: "#2ecc71" }}
                                    placeHolderTextStyle={{ color: "#2ecc71" }}
                                    onDateChange={this.setDate}
                                    disabled={false}
                                />
                            </View>
                            : null}
                    </View>

                    <DataTable style={styles.TableContainer}>
                        <DataTable.Header style={styles.TableHeadBg}>
                            <DataTable.Title>Receipt No</DataTable.Title>
                            <DataTable.Title>Customer Name</DataTable.Title>
                            <DataTable.Title numeric>Amount</DataTable.Title>
                        </DataTable.Header>
                        <FlatList
                            data={this.state.dataSource}
                            ItemSeparatorComponent={this.FlatListItemSeparator}
                            renderItem={item => this.renderItem(item)}
                        />
                    </DataTable>
                </Content>

                <Footer style={styles.FooterBg}>
                    <View style={styles.FooterContainer}>
                        <View style={styles.CashContainer}>
                            <Text style={styles.TextStyle}>Cash</Text>
                            <Text style={styles.TextStyle}>{this.state.dataSource1.cash_total}</Text>
                        </View>
                        <View style={styles.CashContainer}>
                            <Text style={styles.TextStyle}>Cheque</Text>
                            <Text style={styles.TextStyle}>{this.state.dataSource1.cheque_total}</Text>
                        </View>
                        <View style={styles.CashContainer}>
                            <Text style={styles.TextStyle}>Amount</Text>
                            <Text style={styles.TextStyle}>{this.state.dataSource1.all_total}</Text>
                        </View>
                    </View>
                </Footer>
            </Container>
        )
    }

    renderItem = (data) =>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('SalesReceiptRegisterDetails', {
            details: data.item.details
        })} >
            <Item style={styles.row} stackedLabel>
                <Text style={styles.inputWrap1}>{data.item.salesreceipt_id}</Text>
                <Text style={styles.inputWrap} multiline={true}>{data.item.customerName}</Text>
                <Text style={styles.inputWrap2}>{parseInt(data.item.amount)}</Text>
            </Item>
        </TouchableOpacity>

    submitdar = (type) => {

        this.setState({
            loading: true,
        });
        var params = JSON.stringify({
            "type": type
        });
        fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/salesreceiptregisterlists", {
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
                    dataSource1: responseText,
                    loading: false
                });
            })
            .catch((error) => {
                this.setState({
                    loading: false
                });
                if (error == 'TypeError: Network request failed') {
                    /* ToastAndroid.showWithGravityAndOffset(
                        "Please check your internet connection",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    ); */
                }
            });
    }
}

/* SalesRepReg StyleSheet */
const styles = StyleSheet.create({
    MainContainter: {
        paddingHorizontal: 10,
        paddingTop: 10
    },
    DatePick: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#2ecc71',
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    FooterBg: {
        backgroundColor: '#2ecc71',
        height: 65
    },
    FooterContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        color: '#fff',
        paddingVertical: 10
    },
    TextStyle: {
        color: '#fff',
        justifyContent: "center",
        textAlign: "center",
        fontWeight: "700"
    },
    CashContainer: {
        flexDirection: "column"
    },
    TableHeadBg: {
        backgroundColor: '#2ecc71'
    },
    TableContainer: {
        marginVertical: 10
    },
    inputWrap: {
        flex: 4,
        marginLeft: 5,
    },
    inputWrap1: {
        flex: 3,
    },
    inputWrap2: {
        flex: 1.4,
        justifyContent: "center",
        alignItems: "flex-end",
        textAlign: 'center'
    },
    row: {
        flex: 1,
        flexDirection: "row"
    },
});