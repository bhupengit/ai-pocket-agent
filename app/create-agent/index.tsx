import Colors from '@/shared/Colors'
import { useNavigation } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import EmojiPicker from 'rn-emoji-keyboard'

export default function CreateAgent() {
    const navigation = useNavigation()
    const [emoji, setEmoji]= useState('👾')
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(()=>{
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Create Agent',
        });

    }, [])
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
       
       <View>
        <Text>Agent/Assistant Name</Text>
        <TextInput placeholder='Agent name'/>
       </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
    input:{

    }
})