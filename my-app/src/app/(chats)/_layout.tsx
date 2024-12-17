import { useChatList } from '@/contexts/ChatContext';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { chatRooms } = useChatList();
  const router = useRouter();

  const handleChatRoomSelect = (chatId: number) => {
    router.push(`/${chatId}`);
    props.navigation.closeDrawer();
  };

  const handleNewChatRoom = () => {
    router.push(`/index`);
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNewChatRoom} style={styles.newChatButton}>
          <Text style={styles.newChatButtonText}>+ 新對話</Text>
        </TouchableOpacity>

        <Text style={styles.title}>對話列表</Text>

        {chatRooms.map(room => (
          <TouchableOpacity
            key={room.id}
            onPress={() => handleChatRoomSelect(room.id)}
            style={styles.chatRoomButton}
          >
            <Text style={styles.chatRoomText}>{room.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </DrawerContentScrollView>
  );
};

const Layout = () => {
  return (
    <GestureHandlerRootView style={styles.rootView}>
      <Drawer
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerTintColor: '#fff',
          drawerStyle: styles.drawerStyle,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: '首頁',
            title: 'AI Expert Bot',
          }}
        />
        <Drawer.Screen
          name="[chatId]"
          options={{
            title: '聊天室',
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  chatRoomButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#E0E0E0',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 12,
  },
  chatRoomText: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  drawerStyle: {
    backgroundColor: '#f5f5f5',
  },
  headerStyle: {
    backgroundColor: '#2196F3',
  },
  newChatButton: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    marginBottom: 16,
    padding: 12,
  },
  newChatButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  rootView: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default Layout;
