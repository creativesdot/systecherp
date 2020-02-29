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
    Button,
    FlatList
} from 'react-native';
import { Container, Content, Text, Right, Left, Footer, Item, Input, Label, Thumbnail, List, ListItem, Separator, Title } from 'native-base';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/* Get Screen Width */
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

/* SalesRepReg body */
export default class SalesReceiptRegisterDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false, //do not show the body by default
        }
    }

    render() {
        const { navigation } = this.props;
        const details = navigation.getParam('details');
        let Icons = "ios-arrow-down";
        if (this.state.collapsed) {
            Icons = "ios-arrow-up"
        }

        return (
            <FlatList
                style={styles.Container}
                data={details}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={({ item, index }) => (
                    <View style={{marginTop: 5,marginBottom: 5}}>
                        <Collapse
                            style={styles.CollapseContainer}
                            isCollapsed={this.state.collapsed}
                            onToggle={(isCollapsed) => this.setState({ collapsed: isCollapsed })}>
                            <CollapseHeader>
                                <View style={styles.CollapseView}>
                                    <View style={styles.CollapseHeaderText}>
                                        <Text style={styles.CollapseTitle}>Invoice No</Text>
                                        <Text style={styles.CollapseContent}>{item.invoice_no}</Text>
                                    </View>
                                    <View style={styles.CollapseHeaderText}>
                                        <Text style={styles.CollapseTitle}>Customer</Text>
                                        <Text style={styles.CollapseContent}
                                            multiline={true}>{item.customerName}</Text>
                                    </View>
                                    <View style={styles.CollapseHeaderText}>
                                        <Icon name={Icons} size={25} onPress={() => this.setState({ collapsed: !this.state.collapsed })} />
                                    </View>
                                </View>
                            </CollapseHeader>
                            <CollapseBody style={styles.CollapseBody}>
                                <View style={styles.ContentFlex}>
                                    <Text>Receipt No</Text>
                                    <Text style={styles.TextLable}>{item.salesreceipt_id}</Text>
                                </View>
                                <View style={styles.ContentFlex}>
                                    <Text>Receipt Date</Text>
                                    <Text style={styles.TextLable}>{item.receipt_date}</Text>
                                </View>
                                <View style={styles.ContentFlex}>
                                    <Text>Invoice No</Text>
                                    <Text style={styles.TextLable}>{item.invoice_no}</Text>
                                </View>
                                <View style={styles.ContentFlex}>
                                    <Text>Customer</Text>
                                    <Text style={styles.TextLable}>{item.customerName}</Text>
                                </View>
                                <View style={styles.ContentFlex}>
                                    <Text>Receipt Type</Text>
                                    <Text style={styles.TextLable}>{item.receipt_type}</Text>
                                </View>
                                <View style={styles.ContentFlex}>
                                    <Text>Basic Value</Text>
                                    <Text style={styles.TextLable}>{item.basic_amount}</Text>
                                </View>
                                <View style={styles.ContentFlex}>
                                    <Text>Invoice Amount</Text>
                                    <Text style={styles.TextLable}>{item.invoice_value}</Text>
                                </View>
                                <View style={styles.ContentFlex}>
                                    <Text>Amount</Text>
                                    <Text style={styles.TextLable}>{item.amount}</Text>
                                </View>
                                <View style={styles.ContentFlex}>
                                    <Text>Payment Mode</Text>
                                    <Text style={styles.TextLable}>{item.payment_mode}</Text>
                                </View>
                            </CollapseBody>
                        </Collapse>
                    </View>
                )}
            />

        )
    }
}

/* ReceiptDetails StyleSheet */
const styles = StyleSheet.create({
    Container: {
        padding: 15,
        backgroundColor: '#e6fae3',
        height: HEIGHT
    },
    CollapseContainer: {
        backgroundColor: '#fff',
        padding: 15,
        elevation: 2,
        borderRadius: 5
    },
    CollapseView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    CollapseHeaderText: {
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    ContentFlex: {
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e3e4e6'
    },
    TextLable: {
        fontWeight: '700'
    },
    CollapseTitle: {
        color: '#7c7c7c',
        fontSize: 12
    },
    CollapseContent: {
        fontWeight: '700',
        color: '#4a4848',
        fontSize: 14
    },
    CollapseBody: {
        paddingTop: 10
    }
});