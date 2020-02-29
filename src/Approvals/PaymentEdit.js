/* eslint-disable prettier/prettier */
/* PurchaseInvoiceEdit header */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import Modal, { ModalContent } from 'react-native-modals';


/* PurchaseInvoiceEdit body */
export default class PaymentEdit extends Component {
  static navigationOptions = {
    title: 'Payment',
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: '#2196F3',
    },
  };
  constructor(props) {
    super(props)

    this.state = {
      comments: '',
      dataSource: {},
      loading: false,
    }
  }

  render() {
    const { navigation } = this.props;
    const details = navigation.getParam('details');
    const visibility = navigation.getParam('visibility');
    const reject = navigation.getParam('reject');
    const approved = navigation.getParam('approved');
    return (
      <View style={styles.container}>
        <Container>
          <Content>
            {/* PurchaseInvoiceForm */}
            <Form>
              <Item stackedLabel>
                <Label>Transactions No</Label>
                <Input disabled>{details.transno}</Input>
              </Item>
              <Item stackedLabel last>
                <Label>Date</Label>
                <Input disabled>{details.date}</Input>
              </Item>
              <Item stackedLabel last>
                <Label>Payment Type</Label>
                <Input disabled>{details.paymenttype}</Input>
              </Item>
              <Item stackedLabel last>
                <Label>Supplier Name</Label>
                <Input disabled>{details.custname}</Input>
              </Item>
              <Item stackedLabel last>
                <Label>Invoice No</Label>
                <Input disabled>{details.invoice}</Input>
              </Item>
              <Item stackedLabel last>
                <Label>Payment Amount</Label>
                <Input disabled>{details.amount}</Input>
              </Item>
              <Item stackedLabel last>
                <Label>Advance Amount</Label>
                <Input disabled>{details.advance}</Input>
              </Item>
              <Item stackedLabel last>
                <Label>Payment Mode</Label>
                <Input disabled>{details.paymentmode}</Input>
              </Item>
              {visibility ?
                <Form>
                  <Item stackedLabel last>
                    <Label>Previous Approver</Label>
                    <Input disabled>{details.pre_approver}</Input>
                  </Item>
                  <Item stackedLabel last>
                    <Label>Ageing</Label>
                    <Input disabled>{details.age}</Input>
                  </Item>
                  <Item stackedLabel last>
                    <Label>Comments</Label>
                    <Input onChangeText={(comments) => this.setState({ comments })} />
                  </Item>
                </Form>
                : null}
                {reject ?
                <Form>
                  <Item stackedLabel last>
                    <Label>Rejected by</Label>
                    <Input disabled>{details.pre_approver}</Input>
                  </Item>
                  <Item stackedLabel last>
                    <Label>Rejected Date</Label>
                    <Input disabled>{details.pre_approver_date}</Input>
                  </Item>
                </Form>
                : null}
              {approved ?
                <Form>
                  <Item stackedLabel last>
                    <Label>Approved_By</Label>
                    <Input disabled>{details.pre_approver}</Input>
                  </Item>
                  <Item stackedLabel last>
                    <Label>Approved Date</Label>
                    <Input disabled>{details.pre_approver_date}</Input>
                  </Item>
                </Form>
                : null}
            </Form>
            <View style={styles.butView}>
            {visibility ?
                <View style={{ flexDirection: "row" }}>
                  <Button success style={styles.butStyle} onPress={() => { this.approveClickListener(details.transno, "approve") }}><Text> Approve </Text></Button>
                  <Button danger style={styles.butStyle} onPress={() => { this.approveClickListener(details.transno, "reject") }}><Text> Reject </Text></Button>
                </View>
                : null}
              {/* <Button dark style={styles.butStyle} onPress={() => { this.props.navigation.navigate('ItemDetails', { id: details.transno, type: "Invoice" }) }}><Text> Item Details </Text></Button> */}
            </View>

          </Content>
        </Container>
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

    )
  }

  approveClickListener = (transaction_id, status_approve) => {
    const { comments } = this.state;
    const { navigation } = this.props;
    const user_id = navigation.getParam('user_id');
    this.setState({
      loading: true,
    });
    var params = JSON.stringify({
      comments: this.state.comments,
      id: transaction_id,
      type: "Payment",
      user_id: user_id,
      status: status_approve
    });
    //alert(params);
    fetch("http://106.51.49.166:8090/MMS/rest/api/latest/android/payment_approval", {
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
        let a = this.state.dataSource.success;
        //alert(a)
        if (a === '1') {
          if (status_approve === "approve") {
            ToastAndroid.showWithGravityAndOffset(
              "Approved Successfully",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              "Rejected Successfully",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          }
          this.props.navigation.state.params.Payment.onRefresh();
          this.props.navigation.goBack();
        }
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
}

/* PurchaseInvoiceEdit StyleSheet */
const styles = StyleSheet.create({
  butView: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 20
  },
  butStyle: {
    marginRight: 10
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  butContainer: {
    width: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#EF5350",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  modalView: {
    margin: 20
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
  container: {
    flex: 1,
    backgroundColor: "#DCDCDC"
  },
});