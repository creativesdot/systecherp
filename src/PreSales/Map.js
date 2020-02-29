/* eslint-disable prettier/prettier */
/* Map header */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Modal,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import { Item } from 'native-base';
/* Map body */
export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      address: ''
    }
  };

  render() {
    const { navigation } = this.props;
    const latitude = navigation.getParam('latitude');
    const longitude = navigation.getParam('longitude');
    const location = navigation.getParam('location');
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + "AIzaSyCFqR8A4WFZUZ1L-8FQbVSFyibrTl0CAT0")
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson.results,
        })
        this.setState({
          address: this.state.dataSource[0].formatted_address
        })
      })

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker
            coordinate={{ latitude: latitude, longitude: longitude }}
            title={this.state.address}
          />
        </MapView>
      </View>
    )
  }
}

/* Map StyleSheet */
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    /* height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center', */
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});