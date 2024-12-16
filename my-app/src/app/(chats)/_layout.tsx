import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import ChatRoom from './index';

const Drawer = createDrawerNavigator();

const Layout = () => {
  return (
    <Drawer.Navigator initialRouteName="Chat Room">
      <Drawer.Screen
        name="Chat Room"
        component={ChatRoom}
        options={{
          headerTitle: 'Chat Room',
          drawerLabel: 'Main Chat Room',
        }}
      />
      <Drawer.Screen
        name="Chat Room 2"
        component={ChatRoom}
        options={{
          headerTitle: 'Chat Room 2',
          drawerLabel: 'Chat Room 2',
        }}
      />
      <Drawer.Screen
        name="Chat Room 3"
        component={ChatRoom}
        options={{
          headerTitle: 'Chat Room 3',
          drawerLabel: 'Chat Room 3',
        }}
      />
    </Drawer.Navigator>
  );
};

export default Layout;
