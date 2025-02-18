import { useChatList } from '@/contexts/ChatContext';
import { ChatIdEnum } from '@/types/chat';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { chatRooms } = useChatList();

  const handleChatRoomSelect = (chatId: number) => {
    props.navigation.navigate('[chatId]', { chatId: chatId });
    props.navigation.closeDrawer();
  };

  const handleNewChatRoom = () => {
    props.navigation.navigate('index');
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNewChatRoom} style={styles.newChatButton}>
          <Text style={styles.newChatButtonText}>+ Add New Chat</Text>
        </TouchableOpacity>

        <Text style={styles.title}>History:</Text>

        {chatRooms.map(room => (
          <TouchableOpacity
            key={room.chat_id}
            onPress={() => handleChatRoomSelect(room.chat_id)}
            style={styles.chatRoomButton}
          >
            <Text style={styles.chatRoomText}>Chat Room {room.chat_id}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </DrawerContentScrollView>
  );
};

const Layout = () => {
  const { chatRooms } = useChatList();

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
          name="[chatId]"
          options={({ route }) => {
            const chatId = (route.params as { chatId?: string })?.chatId;

            if (chatId === ChatIdEnum.NEW_CHAT) {
              return {
                drawerLabel: 'Home',
                title: 'AI Expert Bot',
              };
            } else {
              const currentChat = chatRooms.find(room => room.chat_id === Number(chatId));
              return {
                drawerLabel: `Chat Room ${currentChat?.chat_id}`,
                title: `Chat Room ${currentChat?.chat_id}`,
              };
            }
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
