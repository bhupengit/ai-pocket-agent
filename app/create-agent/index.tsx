import { firestoreDb } from '@/config/FirebaseConfig'
import Colors from '@/shared/Colors'
import { useUser } from '@clerk/clerk-expo'
import { useNavigation, useRouter } from 'expo-router'
import { doc, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import EmojiPicker from 'rn-emoji-keyboard'

export default function CreateAgent() {
    const navigation = useNavigation()
    const [emoji, setEmoji]= useState('👾')
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [agentName, setAgentName] = useState<string>()
    const [instruction, setInstruction] = useState<string>()
    const {user} = useUser()
    const router = useRouter()

    useEffect(()=>{
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Create Agent',
        });

    }, [])

    const createNewAgent= async()=>{
        if(!agentName || !instruction || !emoji){
            Alert.alert('Please enter all details')
            return;
        }
        const agentId = Date.now().toString()
        await setDoc(doc(firestoreDb, 'agents', agentId), {
            emoji: emoji,
            agentName: agentName,
            prompt: instruction,
            agentId: agentId,
            userEmail: user?.primaryEmailAddress?.emailAddress
        })

        Alert.alert('Confirmation', "Agent created successfully!",
            [
                {
                    text: 'Ok',
                    onPress: ()=>console.log('Ok'),
                    style: 'cancel'
                },
                {
                    text: 'Try Now',
                    onPress: ()=>{router.push({
                        pathname: '/chat',
                        params: {
                            agentName: agentName,
                            initialText: '',
                            agentPrompt: instruction,
                            agentId: agentId,
                            emoji: emoji
                        }
                    })}
                }
            ]
        )

        setAgentName('')
        setInstruction('')
        setEmoji('👾')
    }

  return (
    <View style={{
        padding: 20
    }}>
        <View style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
        <TouchableOpacity style={{
            padding: 15,
            borderWidth: 1,
            borderRadius: 15,
            borderColor: Colors.light_gray,
            backgroundColor: Colors.white
        }}
        onPress={()=>setIsOpen(true)}>
            <Text style={{
                fontSize: 30
            }}>{emoji}</Text>
        </TouchableOpacity>
        <EmojiPicker onEmojiSelected={(event)=> setEmoji(event.emoji)} open={isOpen} onClose={() => setIsOpen(false)}/>
        </View>
       
       <View style={{marginTop: 15}}>
        <Text>Agent/Assistant Name</Text>
        <TextInput
         value={agentName}
         style={styles.input} 
         placeholder='Agent name'
         onChangeText={(v)=> setAgentName(v)}
         />
       </View>
       <View style={{
        paddingVertical: 15,
       }}>
        <Text>Instruction</Text>
        <TextInput 
            value={instruction}
            style={[styles.input,{height: 200, textAlignVertical: 'top'}]} 
            placeholder='Ex. You are a professional teacher' 
            multiline={true}
            onChangeText={(v)=> setInstruction(v)}
            />
       </View>

       <TouchableOpacity style={{
        padding: 15,
        backgroundColor: Colors.primary,
        marginTop: 15,
        borderRadius: 15
       }}
       onPress={createNewAgent}
       >
        <Text style={styles.button}>Create Agent</Text>
       </TouchableOpacity>
      
    </View>
  )
}

const styles = StyleSheet.create({
    input:{
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 15,
        paddingVertical: 15,
        fontSize: 18,
        marginTop: 5
    },
    button:{
        color: Colors.white,
        textAlign: 'center',
        fontSize: 18
    }
})