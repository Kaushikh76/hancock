import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Animated, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ChatScreen from '@/components/ChatScreen';
import ChatsScreen from '@/components/ChatsScreen';

const ChatApp = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const fakeBackend = {
    chats: [
      { id: '1', name: 'Alice', lastMessage: 'Hey there!', timestamp: '2024-10-11T10:00:00Z' },
      { id: '2', name: 'Bob', lastMessage: 'How are you?', timestamp: '2024-10-11T09:30:00Z' },
      { id: '3', name: 'Charlie', lastMessage: 'See you later', timestamp: '2024-10-11T08:45:00Z' },
    ],
    messages: {
      '1': [
        { id: '1', text: 'Hey there!', sender: 'Alice', timestamp: '2024-10-11T10:00:00Z' },
        { id: '2', text: 'Hi Alice!', sender: 'You', timestamp: '2024-10-11T10:01:00Z' },
      ],
      '2': [
        { id: '1', text: 'How are you?', sender: 'Bob', timestamp: '2024-10-11T09:30:00Z' },
      ],
      '3': [
        { id: '1', text: 'See you later', sender: 'Charlie', timestamp: '2024-10-11T08:45:00Z' },
      ],
    },
    addMessage: function(chatId, message) {
      this.messages[chatId].push(message);
      this.chats.find(chat => chat.id === chatId).lastMessage = message.text;
      this.chats.find(chat => chat.id === chatId).timestamp = message.timestamp;
    },
    getMessages: function(chatId) {
      return this.messages[chatId];
    },
    getChats: function() {
      return this.chats;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {selectedChat!=null ? (
        <ChatScreen 
          selectedChat={selectedChat}
          fakeBackend={fakeBackend}
          onSelectChat={setSelectedChat}
        />
      ) : (
        <ChatsScreen
          fakeBackend={fakeBackend}
          onSelectChat={setSelectedChat}
        />
       )} 
    </SafeAreaView>
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

export default ChatApp;