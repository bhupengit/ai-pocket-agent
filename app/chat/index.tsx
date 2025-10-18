import { firestoreDb, storage } from '@/config/FirebaseConfig';
import Colors from '@/shared/Colors';
import { AIChatModel } from '@/shared/GlobalApi';
import { useUser } from '@clerk/clerk-expo';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Camera, Copy, Plus, Send, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';

const initialMessages =[]

type Message={
    role: string,
    content: string| any[]
}

export default function ChatUI() {
    const navigation = useNavigation()
    const {agentName, agentPrompt, agentId, initialText, chatId} = useLocalSearchParams();
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState<string>()
    const [file, setFile] = useState<string|null>()
    const [docId, setDocId] = useState<string|null>()
    const {user} = useUser()
    useEffect(()=>{
        navigation.setOptions({
            headerShown: true,
            headerTitle: agentName,
            headerRight: () =>(
                <Plus />
            )
        });

        if(!chatId){
            const id = Date.now().toString()
            setDocId(id)
        }
    }, [])

    useEffect(()=>{
        setInput(initialText.toString())
        if(agentPrompt){
            setMessages((prev)=>[
                ...prev,
                {role: 'system', content: agentPrompt.toString()}
            ])
        }
    }, [agentPrompt])

    useEffect(()=>{ 
        const SaveMessages = async () => {
        if(messages?.length > 0 && docId){
                await setDoc(doc(firestoreDb, 'chats', docId),{
                userEmail: user?.primaryEmailAddress?.emailAddress,
                messages: messages,
                docId: docId,
                agentName, 
                agentPrompt, 
                agentId
            }, {merge: true})
        }
    }
    SaveMessages();
    }, [messages])
    const onSendMessage = async () => {
        if (!input?.trim()) return;

        let newMessage: Message;
        if(file){
            // upload image to storage
            const imageUrl = uploadImageToStorage();
            newMessage = {
                role: 'user',
                content:[
                    {type: 'text', text:input},
                    {type: "image_url", image_url: {url:imageUrl}}
                ]
            }
            setInput('');
            setFile(null)
        }else{
            newMessage = { role: 'user', content: input.trim() };
            setInput('');
        }
      
        
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
      
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

      const uploadImageToStorage = async() =>{
        //@ts-ignore
        const response = await fetch(file)
        const blobFile = response.blob()
        const imageRef = ref(storage, 'ai-pocket-agent/'+Date.now()+'.png')
        //@ts-ignore
        uploadBytes(imageRef, blobFile).then((snapshot)=>
            console.log("file uploaded")
        )
        const imageUrl = getDownloadURL(imageRef)
        console.log(imageUrl)
        return imageUrl
      }
      const pickImage= async() =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.5,
          });

          if(!result.canceled){
                setFile(result.assets[0].uri)
          }
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
                typeof item.content == 'string' ?( item.content == '___loading___'?
                <ActivityIndicator size={'small'} color={Colors.black}/> :
                <Text style={[styles.messageText,
                    item.role == 'user' ? styles.userText : styles.assistantText
                ]}>{item.content}</Text>
            ):(
                <>
                {item.content.find((c:any)=> c.type=='text') && (
                    <Text style={[styles.messageText,
                        item.role == 'user' ? styles.userText : styles.assistantText
                    ]}>{item.content.find((c)=> c.type=='text').text}</Text>
                )}

                {item.content.find((c:any)=> c.type=='image_url') && (
                    <Image source={{uri: item.content.find((c:any)=> c.type=='image_url').image_url}} style={{
                        width: 180,
                        height: 180,
                        borderRadius: 8,
                        marginTop: 6,
                    }}/>
                )}
                </>
            )
            }
            {
                item.role == 'assistant' && item.content !== '___loading___' &&
                <Pressable onPress={() => copyToClipboard(item.content.toString())} style={{marginTop: 8}}>
                    <Copy color={Colors.gray}/>
                </Pressable>
            }
        </View>
      )}
      />

<View>
    {
        file && (
            <View style={{
                marginBottom: 5,
                display: 'flex',
                flexDirection: 'row'
            }}>
                <Image source={{uri: file}} style={{
                    width: 50,
                    height: 50,
                    borderRadius: 6,
                }}/>
                <TouchableOpacity onPress={()=>{setFile(null)}}>
                    <X />
                </TouchableOpacity>
            </View>
        )
    }
{/* Input Box */}
<View style={styles.inputContainer}>
      <TouchableOpacity style={{
            marginRight : 6
        }}
        onPress={pickImage}>
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
        borderColor: Colors.light_gray,
        borderRadius: 12,
        marginBottom: 30,
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