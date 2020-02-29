/* eslint-disable prettier/prettier */
/* PurchaseOrder header */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    FlatList,
    ActivityIndicator,
    ToastAndroid
} from 'react-native';
import { DataTable } from 'react-native-paper';
const { width: WIDTH } = Dimensions.get('window')

export default class ItemDetails extends Component {
    static navigationOptions = {
        title: 'Item Details',
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
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        const transid = navigation.getParam('id');
        const type = navigation.getParam('type');
        const url = ""
        var params = JSON.stringify({
            id: transid,
            type: type,
        });
        if(type == 'Work Order'){

        }else{

        }
        fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/purchaseiteminfo", {
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
                //let a = this.state.dataSource[0].ItemName;
                //alert(a)
                //this.setModalVisible(true);

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
        const { loading } = this.state;
        const { navigation } = this.props;
        const type = navigation.getParam('type');
        if (!loading) {
            if (type == 'PO' || type == 'Product Order' || type == 'Sales Quotation') {
                return (
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title style={styles.inputWrap}>Item Name</DataTable.Title>
                            <DataTable.Title style={styles.inputWrap1}>Price</DataTable.Title>
                            <DataTable.Title style={styles.inputWrap2}>Qty</DataTable.Title>
                            <DataTable.Title style={styles.inputWrap1}>Total Value</DataTable.Title>
                        </DataTable.Header>
                        <FlatList
                            data={this.state.dataSource}
                            ItemSeparatorComponent={this.FlatListItemSeparator}
                            renderItem={item => this.renderItem(item)}
                        />
                    </DataTable>
                )
            } else if (type == 'Indent') {
                return (
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title style={styles.inputWrap}>Item Name</DataTable.Title>
                            <DataTable.Title style={styles.inputWrap2}>Qty</DataTable.Title>
                            <DataTable.Title style={styles.inputWrap1}>Uom</DataTable.Title>
                        </DataTable.Header>
                        <FlatList
                            data={this.state.dataSource}
                            ItemSeparatorComponent={this.FlatListItemSeparator}
                            renderItem={item => this.renderItem1(item, type)}
                        />
                    </DataTable>
                )
            } else if (type == 'Work Order') {
                return (
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title style={styles.inputWrap}>Item Name</DataTable.Title>
                            <DataTable.Title style={styles.inputWrap2}>Qty</DataTable.Title>
                            <DataTable.Title style={styles.inputWrap1}>Uom</DataTable.Title>
                        </DataTable.Header>
                        <FlatList
                            data={this.state.dataSource}
                            ItemSeparatorComponent={this.FlatListItemSeparator}
                            renderItem={item => this.renderItem1(item, type)}
                        />
                    </DataTable>
                )
            }
        } else {
            return <ActivityIndicator
                style={styles.loading}
                size="large" />
        }
    }
    renderItem = (data) =>
        <View style={styles.row}>
            <Text style={styles.inputWrap} multiline={true}>{data.item.ItemName}</Text>
            <Text style={styles.inputWrap1}>{parseInt(data.item.ItemPrice)}</Text>
            <Text style={styles.inputWrap2}>{parseInt(data.item.ItemQuantity)}</Text>
            <Text style={styles.inputWrap1}>{parseInt(data.item.TaxableAmount)}</Text>
        </View>

    renderItem1 = (data) =>
        <View style={styles.row}>
            <Text style={styles.inputWrap} multiline={true}>{data.item.ItemName}</Text>
            <Text style={styles.inputWrap2}>{parseInt(data.item.ItemQuantity)}</Text>
            <Text style={styles.inputWrap1}>{data.item.ItemUom}</Text>
        </View>



}

/* PurchaseInvoice StyleSheet */
const styles = StyleSheet.create({
    text: {
        color: "#fff",
        textAlign: "center",
        fontSize: 12
    },
    textContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#2196F3',
        elevation: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    inputWrap: {
        flex: 4,
        marginLeft: 10,
        marginTop: 3,
        marginBottom: 3
    },
    inputWrap1: {
        flex: 2,
        marginTop: 3,
        marginBottom: 3
    },
    inputWrap2: {
        flex: 1.5,
        marginTop: 3,
        marginBottom: 3
    },
    row: {
        flex: 1,
        flexDirection: "row"
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