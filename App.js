/* eslint-disable prettier/prettier */
/* Header Import */
import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { createAppContainer, SafeAreaView } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import HomeScreen from './src/Homescreen';
import LoginScreen from './src/Login';


import LinearGradient from 'react-native-linear-gradient';
import { fromLeft, zoomIn, zoomOut, fromRight } from 'react-navigation-transitions';
import Icon from 'react-native-vector-icons/AntDesign'
import FontIcon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import logo from './assets/image/user_logo.png'
import bgImage from './assets/image/login-bg-one.jpg'
import SplashScreen from './src/SplashScreen';
import ApprovalHome from './src/Approvals/Homescreen';
import Purchase from './src/Approvals/Purchase';
import Sales from './src/Approvals/Sales';
import PurchaseOrder from './src/Approvals/PurchaseOrder';
import Payment from './src/Approvals/Payment';
import PurchaseIndent from './src/Approvals/PurchaseIndent';
import PurchaseIndentEdit from './src/Approvals/PurchaseIndentEdit';
import SalesOrder from './src/Approvals/SalesOrder';
import SalesInvoice from './src/Approvals/SalesInvoice';
import PaymentEdit from './src/Approvals/PaymentEdit'
import PurchaseOrderEdit from './src/Approvals/PurchaseOrderEdit'
import SalesOrderEdit from './src/Approvals/SalesOrderEdit';
import SalesInvoiceEdit from './src/Approvals/SalesInvoiceEdit';
import ItemDetails from './src/Approvals/ItemDetails';
import WorkOrder from './src/Approvals/WorkOrder';
import WorkOrderEdit from './src/Approvals/WorkOrderEdit';

//Presales Screens
import Prospect from './src/Presales/Prospect';
import AddProspect from './src/Presales/AddProspect';
import Dar from './src/Presales/Dar';


/* Menu Button */
class NavigationDrawerStructure extends Component {
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <MaterialIcon name="menu" size={30} color={'#fff'} style={{paddingLeft:10}}/>
        </TouchableOpacity>
      </View>
    );
  }
}

/* Stack Menu */
//Dashboard
const Homestack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Dashboard',
        headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#2196F3'
        },
      }),
    },
    Login: {
      screen: LoginScreen,
        navigationOptions: {
          header: null
      }
    },
    SplashScreen: {
      screen: SplashScreen,
        navigationOptions: {
          header: null
      }
    },
    Purchase: {
      screen: Purchase,
      navigationOptions: ({ navigation }) => ({
        title: 'Purchase',
        headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    PurchaseOrder: {
      screen: PurchaseOrder,
      navigationOptions: ({ navigation }) => ({
        title: 'Purchase Order',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    PurchaseOrderEdit: {
      screen: PurchaseOrderEdit,
      navigationOptions: ({ navigation }) => ({
        title: 'Purchase Order',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    Payment: {
      screen: Payment,
      navigationOptions: ({ navigation }) => ({
        title: 'Payment',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    PurchaseIndent: {
      screen: PurchaseIndent,
      navigationOptions: ({ navigation }) => ({
        title: 'Purchase Indent',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    PurchaseIndentEdit: {
      screen: PurchaseIndentEdit,
      navigationOptions: ({ navigation }) => ({
        title: 'Purchase Indent',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    PaymentEdit: {
      screen: PaymentEdit,
      navigationOptions: ({ navigation }) => ({
        title: 'Payment',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    ItemDetails: {
      screen: ItemDetails,
      navigationOptions: ({ navigation }) => ({
        title: 'Item Details',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    Sales: {
      screen: Sales,
      navigationOptions: ({ navigation }) => ({
        title: 'Sales',
        headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff', 
      }),
    },
    SalesInvoice: {
      screen: SalesInvoice,
      navigationOptions: ({ navigation }) => ({
        title: 'Sales Invoice',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    SalesOrder: {
      screen: SalesOrder,
      navigationOptions: ({ navigation }) => ({
        title: 'Sales Order',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    SalesInvoiceEdit: {
      screen: SalesInvoiceEdit,
      navigationOptions: ({ navigation }) => ({
        title: 'Sales Invoice',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    SalesOrderEdit: {
      screen: SalesOrderEdit,
      navigationOptions: ({ navigation }) => ({
        title: 'Sales Order',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    ApprovalHome: {
      screen: ApprovalHome,
      navigationOptions: ({ navigation }) => ({
        title: 'Approvals',
        headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    WorkOrder: {
      screen: WorkOrder,
      navigationOptions: ({ navigation }) => ({
        title: 'Work Order',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    WorkOrderEdit: {
      screen: WorkOrderEdit,
      navigationOptions: ({ navigation }) => ({
        title: 'Work Order',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    Prospect: {
      screen: Prospect,
      navigationOptions: ({ navigation }) => ({
        title: 'Prospect',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    AddProspect: {
      screen: AddProspect,
      navigationOptions: ({ navigation }) => ({
        title: 'Add New Prospect',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
    Dar: {
      screen: Dar,
      navigationOptions: ({ navigation }) => ({
        title: 'DAR',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
      }),
    },
  },
  {
    initialRouteName: "AddProspect",
    transitionConfig: () => fromLeft(),
  });



/* Custome Drawer Navigation */
const CustomDrawerContentComponent = props => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <SafeAreaView
      style={styles.container}
      forceInset={{ top: 'always', horizontal: 'never' }}>
      <LinearGradient colors={['#1abc9c', '#2ecc71']} style={{flex:1}}>
        <View style={styles.IconContainer}>
            <Image source={logo} style={styles.UserImage} />
            <Text style={styles.UserText}>Systech Infovations</Text>
        </View>
      </LinearGradient>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

/* DrawerNavigator */
const DrawerNavigator = createDrawerNavigator(
  {
    HomeScreen: {
      screen: Homestack,
      navigationOptions: {
        drawerLabel: 'Dashboard',
        drawerIcon: () => (
          <Icon name="home" size={25} color={'#2ecc71'} />
        ),
      }
    },
    Logout: {
      screen: LoginScreen,
      navigationOptions: {
        drawerLabel: 'Logout',
        drawerIcon: () => (
          <Icon name="logout" size={25} color={'#2ecc71'} />
        )
      }
    }
  },
  {contentComponent: CustomDrawerContentComponent},
  {transitionConfig: () => zoomOut()},
  {contentOptions: {labelStyle: {fontFamily: 'sans-serif-condensed'}}},
);

export default createAppContainer(DrawerNavigator);

const styles = StyleSheet.create({
  container: {
    fontFamily: 'sans-serif-condensed',
  },
  IconContainer: { 
    alignItems:"center", 
    justifyContent:"center",
    paddingVertical: 30,
  },
  UserImage: {
    width:80,
    height: 80,
    borderRadius: 50,
    borderWidth:1,
    borderColor:"#dfe1e5",
  },
  UserText: {
    fontSize: 18,
    fontWeight: "700",
    paddingTop: 10,
    fontFamily: 'sans-serif-condensed',
    color: "#fff"
  }
})