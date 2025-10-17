import Colors from '@/shared/Colors';
import { AIChatModel } from '@/shared/GlobalApi';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Camera, Copy, Plus, Send } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

const initialMessages =[
    {role: 'user', content: 'Hi, How are you?'},
    {role: 'assistant', content: 'I am good!'}
]

type Message={
    role: string,
    content: string
}

export default function ChatUI() {
    const navigation = useNavigation()
    const {agentName, agentPrompt, agentId, initialText} = useLocalSearchParams();
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState<string>()
    useEffect(()=>{
        navigation.setOptions({
            headerShown: true,
            headerTitle: agentName,
            headerRight: () =>(
                <Plus />
            )
        })
    })

    useEffect(()=>{
        setInput(initialText.toString())
        if(agentPrompt){
            setMessages((prev)=>[
                ...prev,
                {role: 'system', content: agentPrompt.toString()}
            ])
        }
    }, [agentPrompt])
    const onSendMessage = async () => {
        if (!input?.trim()) return;
      
        const newMessage = { role: 'user', content: input.trim() };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput('');
      
        // Add loading message
        const loadingMsg = { role: 'assistant', content: '___loading___' };
        setMessages([...updatedMessages, loadingMsg]);
      
        // Get AI response
        const result = await AIChatModel([...updatedMessages, newMessage]);
        console.log(result.aiResponse);
      
        // Replace the loading message with the actual response
        setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'assistant',
              content: result.aiResponse, // wrap in message object
            };
            return updated;
          });
      };

      const copyToClipboard= async(message: string)=>{
        await Clipboard.setStringAsync(message )
        if(Platform.OS == 'ios')
            alert('Copied to clipboard')
        else
            ToastAndroid.show('Copied to clipboard', ToastAndroid.BOTTOM)
      }
  return (
    <KeyboardAvoidingView
    keyboardVerticalOffset={80}
    behavior={Platform.OS === 'ios' ?'padding' : undefined}
    style={{
        padding: 10,
        flex: 1,
    }}>
      <FlatList 
      data={messages}
      //@ts-ignore
      renderItem={({item, index}) => item.role !== 'system' &&(
        <View style={[styles.messageContainer,
            item.role == 'user' ? styles.userMessage : styles.assistantMessage
        ]}>
            {
                item.content == '___loading___'?
                <ActivityIndicator size={'small'} color={Colors.black}/> :
                <Text style={[styles.messageText,
                    item.role == 'user' ? styles.userText : styles.assistantText
                ]}>{item.content}</Text>
            }
            {
                item.role == 'assistant' && item.content !== '___loading___' &&
                <Pressable onPress={() => copyToClipboard(item.content)} style={{marginTop: 8}}>
                    <Copy color={Colors.gray}/>
                </Pressable>
            }
        </View>
      )}
      />

      {/* Input Box */}
      <View style={styles.inputContainer}>
      <TouchableOpacity style={{
            marginRight : 6
        }}>
            <Camera size={28}/>
        </TouchableOpacity>
        <TextInput 
            placeholder='Type a message...'
            value={input}
            style={styles.input}
            onChangeText={(v) => setInput(v)}
        />
        <TouchableOpacity style={{
            padding: 8,
            backgroundColor: Colors.primary,
            borderRadius: 99
        }}
        onPress={onSendMessage}
        >
            <Send color={Colors.white} size={20}/>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    messageContainer:{
        maxWidth: '75%',
        marginVertical: 4,
        padding: 10,
        borderRadius: 10,
    },
    userMessage:{
        backgroundColor: Colors.primary,
        borderBottomRightRadius: 2,
        alignSelf: 'flex-end'
    },
    assistantMessage:{
        backgroundColor: Colors.light_gray,
        borderBottomLeftRadius: 2,
        alignSelf: 'flex-start'
    },
    messageText: {fontSize : 16},
    userText: {color: Colors.white},
    assistantText: {color: Colors.black},
    inputContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth :1,
        borderRadius: 12
    },
    input:{
        flex:1,
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#CCC',
        backgroundColor: Colors.white,
        marginRight: 8,
        paddingHorizontal: 15
    }
})