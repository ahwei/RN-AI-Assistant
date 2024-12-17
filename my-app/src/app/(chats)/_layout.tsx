import { useChatList } from '@/contexts/ChatContext';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Layout = () => {
  const { chatRooms } = useChatList();

  return (
    <GestureHandlerRootView>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Add New Chat Room',
            title: 'AI Expert Bot',
          }}
        />
        {chatRooms.map(room => (
          <Drawer.Screen
            key={room.id}
            name="[chatId]"
            options={{
              drawerLabel: room.label,
              title: room.label,
            }}
            initialParams={{ chatId: room.id }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default Layout;
