import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Animated, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen = ({ selectedChat, fakeBackend, onSelectChat }) => {
  // Early return if selectedChat is not provided
  if (!selectedChat) {
    return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.canGoBack()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color="#000000FF" />
      </TouchableOpacity>
      <Text style={styles.errorText}>No chat selected</Text>
    </View>
    );
  }
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const slideAnim = new Animated.Value(0);
  
  useEffect(() => {
    setMessages(fakeBackend.getMessages(selectedChat.id));
    const interval = setInterval(() => {
    setMessages(fakeBackend.getMessages(selectedChat.id));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedChat, fakeBackend]);
  
  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
    Animated.timing(slideAnim, {
    toValue: isInfoVisible ? 0 : 1,
    duration: 300,
    useNativeDriver: true,
    }).start();
  };
  
  const sendMessage = () => {
    if (inputText.trim() === '') return;
  
    const newMessage = {
    id: Date.now().toString(),
    text: inputText,
    sender: 'You',
    timestamp: new Date().toISOString(),
    };
  
    fakeBackend.addMessage(selectedChat.id, newMessage);
    setInputText('');
  };
  
  const renderMessage = ({ item }) => (
    <View style={[
    styles.messageContainer,
    item.sender === 'You' ? styles.ownMessage : styles.otherMessage
    ]}>
    <Text style={[
      styles.messageText,
      item.sender === 'You' ? styles.ownMessageText : styles.otherMessageText
    ]}>{item.text}</Text>
    <Text style={styles.messageTimestamp}>
      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.chatScreen}>
      
      <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => onSelectChat(null)} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000000FF" />
        </TouchableOpacity>
        <View style={styles.headerAvatarContainer}>
        <Text style={styles.headerAvatarText}>{selectedChat.name[0]}</Text>
        </View>
        <Text style={styles.headerTitle}>{selectedChat.name}</Text>
      </View>
      <TouchableOpacity onPress={toggleInfo} style={styles.infoButton}>
        <Text style={styles.revealbtn}>Reveal</Text>
      </TouchableOpacity>
      </View>
  
      <Animated.View style={[
      styles.infoPanel,
      {
        transform: [{
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        })
        }],
        opacity: slideAnim,
        height: isInfoVisible ? 100 : 0,
      }
      ]}>
      <Text style={styles.infoPanelText}>
        Member since: October 2024{'\n'}
        Messages: {messages.length}{'\n'}
        Status: Active
      </Text>
      </Animated.View>
      <ImageBackground source={require('../assets/images/bgnoun.jpg')} style={styles.backgroundImage}>

      <FlatList
      data={[...messages]}
      renderItem={renderMessage}
      keyExtractor={(item) => item.id}
      style={styles.messageList}
      contentContainerStyle={[
        styles.messageListContent,
        { flexDirection: 'column-reverse' }
      ]}
      inverted
      />
  
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Message"
        placeholderTextColor="#000"
      />
      <TouchableOpacity 
        style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : null]}
        onPress={sendMessage}
        disabled={!inputText.trim()}
      >
        <Ionicons name="send" size={24} color={inputText.trim() ? "#FFFFFF" : "#000"} />
      </TouchableOpacity>
      </View>

      
    </ImageBackground>
    </SafeAreaView>
  );
  };

const styles = StyleSheet.create({
  backgroundImage: {
  flex: 1,
  resizeMode: 'cover',
  },
  errorText: {
  fontSize: 16,
  color: '#666666',
  textAlign: 'center',
  marginTop: 20,
  },
  revealbtn: {
  color: '#FFFFFFFF',
  backgroundColor: '#FF2160FF',
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
  backgroundColor: '#a3a3a3a3',
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

export default ChatScreen;