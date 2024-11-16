
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatsScreen = ({ fakeBackend, onSelectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    setChats(fakeBackend.getChats());
  }, []);

  console.log("WHy no")

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => onSelectChat(item)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>
      <View style={styles.chatItemContent}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.chatListHeader}>
        <Text style={styles.chatListTitle}>Messages</Text>
      </View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
      />
    </View>
  );
};


const styles = StyleSheet.create({
    revealbtn: {
      color: '#000000FF',
      backgroundColor: '#FFFFFFFF',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 10,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      fontWeight: '600',
      borderWidth: 3,
      paddingTop: 12,
  
    },
    container: {
      flex: 1,
      backgroundColor: '#F6F6F6',
    },
    chatListHeader: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#000000FF',
    },
    chatListTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#000000',
    },
    chatList: {
      backgroundColor: '#FFFFFF',
    },
    chatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#EFEFEF',
    },
    avatarContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#000000FF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '600',
    },
    chatItemContent: {
      flex: 1,
      marginRight: 12,
    },
    chatName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000000',
      marginBottom: 4,
    },
    lastMessage: {
      fontSize: 14,
      color: '#666666',
    },
    timestamp: {
      fontSize: 12,
      color: '#000000FF',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: '#FFFFFF',
      borderBottomColor: '#EFEFEF',
      zIndex: 1,
      borderWidth: 3,
      borderColor: '#000000FF',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 12,
    },
    headerAvatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 36,
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#000000FF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    headerAvatarText: {
      color: '#000000FF',
      fontSize: 18,
      fontWeight: '900',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#000000',
    },
    infoButton: {
      padding: 8,
    },
    infoPanel: {
      backgroundColor: '#FFFFFF',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#EFEFEF',
      position: 'absolute',
      top: 69,
      left: 0,
      right: 0,
      zIndex: 0,
    },
    infoPanelText: {
      fontSize: 14,
      color: '#666666',
      lineHeight: 20,
    },
    chatScreen: {
      flex: 1,
    },
    messageList: {
      flex: 1,
      backgroundColor: '#F6F6F6',
    },
    messageListContent: {
      padding: 16,
      paddingTop: 100,
    },
    messageContainer: {
      marginVertical: 4,
      borderWidth: 2,
      borderColor: '#000',
      maxWidth: '80%',
      borderRadius: 20,
      padding: 12,
    },
    ownMessage: {
      alignSelf: 'flex-end',
  
      backgroundColor: '#f9e587',
      color: '#000000FF',
    },
    otherMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#FFFFFF',
    },
    messageText: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 20,
    },
    ownMessageText: {
      color: '#000000FF',
    },
    otherMessageText: {
      color: '#000000',
    },
    messageTimestamp: {
      fontSize: 11,
      color: '#999999',
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 2,
      borderColor: '#000000FF',
    },
    attachButton: {
      padding: 8,
      marginRight: 8,
    },
    input: {
      flex: 1,
      backgroundColor: '#F6F6F6',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 16,
      marginRight: 8,
      borderColor: '#000000FF',
      borderWidth: 2,
      color: '#000000',
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FFFFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonActive: {
      backgroundColor: '#000000FF',
    },
  });


  export default ChatsScreen