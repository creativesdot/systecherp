/* eslint-disable prettier/prettier */
import React, { Component } from 'react';

import { StyleSheet, View, Alert, Platform, Button } from 'react-native';

class Common extends Component {

    FirebaseNotification = (transaction_id, transaction_type) => {
        var params = JSON.stringify({
            "to": "dAZEORhwmt4:APA91bE1f5y4oj9fdghnOzp1kI_-mqebfeMmLQLOE_VPKKLI0dOyjj-FQCdEa6vSjs9KrbDtZUx7JITA-MkRO8HMDwhMKRjaxR-phLCGF--C5uOGdZZ1cNbieVIXEh9fIyLX8Wz2idZz",
            "notification": {
                "body": transaction_id + " Approved successfully",
                "title": transaction_type,
                "content_available": true,
                "priority": "high"
            },
            "data": {
                "body": "The first message from the React Native and Firebase",
                "title": "React Native Firebase",
                "content_available": true,
                "priority": "high"
            }
        });
        fetch("https://fcm.googleapis.com/fcm/send", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAR-3sBxk:APA91bHrRV5fFIGWdsI7Y5OUQsu02snOfspzMz-FBRSgWuJKSypD-WDbsXyhVG-eAQf0PZmtKL_QvkluDUso4DzLX6_10LidKF4Z0ed6DGKIRXghicsXahXBqYe0NhtJk8vI8i82ryHH'
            },
            body: params,
        })
        .then(response => response.json())
        .then(responseText => {
            
        })
        .catch((error) => {
        console.error(error);
        });
    }
}