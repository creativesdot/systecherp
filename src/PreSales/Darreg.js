/* eslint-disable prettier/prettier */
/* DarReg header */
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
    ActivityIndicator,
    Linking,
    PermissionsAndroid
} from 'react-native';
import { Container, Tab, Tabs, Card, CardItem, Body, Text, Right, Left } from 'native-base';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { FlatGrid } from 'react-native-super-grid';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });

/* Get Screen Width */
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

/* DarReg body */
export default class DarReg extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataSource: [],
            dataSource1: [],
            loading: true,
            isFetching: false,
            FlatListItems: [],
            user_id: ''
        }
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
                    type: "Today",
                });
                fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/todaydarregister", {
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
                        //alert(JSON.stringify(this.state.dataSource))
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                var params1 = JSON.stringify({
                    id: this.state.FlatListItems[0].user_id,
                    type: "Appointment",
                });
                fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/todaydarregister", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: params1,
                })
                    .then(response => response.json())
                    .then(responseText => {
                        this.setState({
                            dataSource1: responseText.data,
                            loading: false,
                            isFetching: false
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });

        });

    }



    dialCall = (number) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
        else { phoneNumber = `telprompt:${number}`; }
        Linking.openURL(phoneNumber);
    };

    splittext = (splittext) => {
        var myArray = splittext.split(',');
        var lat = myArray[1];
        var lang = myArray[0];
        this.props.navigation.navigate('Map', { latitude: Number(lat), longitude: Number(lang), location: "test" })
    }

    ListEmptyView = () => {
        return (
            <View style={styles.MainContainer}>
                <Text style={{ textAlign: 'center', fontSize: 20 }}> Data Not Available</Text>
            </View>
        );
    }

    render() {
        const items = this.state.dataSource;
        const items1 = this.state.dataSource1;
        const { loading } = this.state;
        return (
            <Container>
                <Tabs>
                    <Tab heading="TODAY'S DAR"
                        textStyle={styles.TabText}
                        tabStyle={styles.TabBg}
                        activeTabStyle={styles.ActiveBg}>
                        <FlatGrid
                            onRefresh={() => this.onRefresh()}
                            refreshing={this.state.isFetching}
                            itemDimension={270}
                            items={items}
                            style={styles.container}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <Card>
                                    <CardItem>
                                        <View style={styles.CardBody}>
                                            <Text><Text style={{ fontWeight: "700" }}>Customer :</Text> {item.customername}</Text>
                                            <Text><Text style={{ fontWeight: "700" }}>Phone :</Text> {item.mobileno}</Text>
                                            <Text><Text style={{ fontWeight: "700" }}>Date :</Text> {item.date}</Text>
                                        </View>
                                        <Right>
                                            <TouchableOpacity onPress={() => this.splittext(item.latlng)}>
                                                <Icon name="location-on" size={50} color={'#2196F3'} />
                                            </TouchableOpacity>
                                        </Right>
                                    </CardItem>
                                </Card>
                            )}
                            ListEmptyComponent={this.ListEmptyView}
                        />

                    </Tab>
                    <Tab heading="APPOINTMENTS"
                        textStyle={styles.TabText}
                        tabStyle={styles.TabBg}
                        activeTabStyle={styles.ActiveBg}>
                        <FlatGrid
                            onRefresh={() => this.onRefresh()}
                            refreshing={this.state.isFetching}
                            itemDimension={270}
                            items={items1}
                            style={styles.container}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <Card>
                                    <CardItem>
                                        <View style={styles.CardBody}>
                                            <Text><Text style={{ fontWeight: "700" }}>Customer :</Text> {item.customername}</Text>
                                            <Text><Text style={{ fontWeight: "700" }}>Phone :</Text> {item.mobileno}</Text>
                                            <Text><Text style={{ fontWeight: "700" }}>Date :</Text> {item.date}</Text>
                                        </View>
                                        <Right>
                                            <TouchableOpacity onPress={() => { this.dialCall(item.mobileno) }}>
                                                <Icon name="phone-in-talk" size={50} color={'#2196F3'} />
                                            </TouchableOpacity>
                                        </Right>
                                    </CardItem>
                                </Card>
                            )}
                            ListEmptyComponent={this.ListEmptyView}
                        />
                        {
                            this.state.loading ? <ActivityIndicator
                                style={styles.loading}
                                size="large" /> : null
                        }

                    </Tab>
                </Tabs>
            </Container>
        )
    }
}

/* DarReg StyleSheet */
const styles = StyleSheet.create({
    CardContainer: {
        paddingHorizontal: 10,
        paddingTop: 10
    },
    CardBody: {
        flex: 1,
        flexDirection: "column",
        fontSize: 18
    },
    TabText: {
        color: "#fff",
        fontFamily: 'sans-serif-condensed'
    },
    TabBg: {
        backgroundColor: "#2ecc71"
    },
    ActiveBg: {
        backgroundColor: "#21bf64"
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
    MainContainer: {
        padding: 10,
        marginTop: Dimensions.get('window').height / 2,
        height: 40,
    },
    
});