/* Prospect Header Imports */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, SafeAreaView, FlatList, Text } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'; //Icons
import AddProspect from './AddProspect';
import { max } from 'moment';

const Data = [
    {id : '1', name : 'Simon Mignolets', mobile: '7708042321'}, {id : '2', name : 'Nathaniel Clyne', mobile: '7708042321'}, 
    {id : '3', name : 'Dejan Lovren', mobile: '7708042321'}, {id : '4', name: 'Mama Sakho', mobile: '7708042321'}, 
    {id : '5', name: 'Alberto Moreno', mobile: '7708042321'}, {id : '6', name: 'Emre Can', mobile: '7708042321'},
    {id : '7', name: 'Alberto Moreno', mobile: '7708042321'}, {id : '8', name: 'Emre Can', mobile: '7708042321'},
    {id : '9', name: 'Alberto Moreno', mobile: '7708042321'}, {id : '10', name: 'Emre Can', mobile: '7708042321'},
    {id : '11', name: 'Alberto Moreno', mobile: '7708042321'}, {id : '12', name: 'Emre Can', mobile: '7708042321'},
    {id : '13', name: 'Alberto Moreno', mobile: '7708042321'}, {id : '14', name: 'Emre Can', mobile: '7708042321'},
    {id : '15', name: 'Alberto Moreno', mobile: '7708042321'}, {id : '16', name: 'Emre Can', mobile: '7708042321'},
    {id : '17', name: 'Alberto Moreno', mobile: '7708042321'}, {id : '18', name: 'Emre Can', mobile: '7708042321'},
];

/* Prospect Body */
export default class Prospect extends React.Component {
    static navigationOptions = {
        title: 'Prospect',
        headerTintColor: "#fff",
        headerStyle: {
        backgroundColor: '#2196F3',
        },
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={Data}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => 
                        <View style={styles.listContainer}>
                            <View style={styles.colOne}>
                                <Text style={styles.title}>Name</Text>
                                <Text>{item.name}</Text>
                            </View>
                            <View style={styles.colOne}>
                                <Text style={styles.title}>Mobile</Text>
                                <Text>{item.mobile}</Text>
                            </View>
                            <View style={styles.btnContainer}>
                                <Text style={styles.button}>Move</Text>
                            </View>
                        </View>
                    }
                />
                <TouchableHighlight style={styles.addBtn} onPress={() => this.props.navigation.navigate('AddProspect')}>
                    <View style={styles.fabButton}>
                        <Icon name="plus" size={25} color="#ffff" />
                    </View>
                </TouchableHighlight>
            </SafeAreaView>
        );
    }
}

/* Prospect StyleSheet */
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listContainer: {
        flex:1,
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor: '#edebeb',
        alignItems:"center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
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
        elevation: 5,
    },
    addBtn: {
        position: 'absolute',
        bottom:0,
        right:0
    }
});