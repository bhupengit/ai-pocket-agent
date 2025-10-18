import { firestoreDb } from '@/config/FirebaseConfig'
import Colors from '@/shared/Colors'
import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { ArrowRight } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'

type Agent={
    agentId: string,
    agentName: string,
    prompt: string,
    emoji: string,
}
export default function UserCreatedAgent() {
    const {user} = useUser()
    const router = useRouter()
    const [agentList, setAgentList] = useState<Agent[]>([])
    useEffect(()=>{
        user && GetUserAgents()
    }, [user])

    const GetUserAgents = async()=>{
        const q = query(collection(firestoreDb, 'agents'), where("userEmail", '==', user?.primaryEmailAddress?.emailAddress))
        const querySnapshot = await getDocs(q)
        setAgentList([])
        querySnapshot.forEach((doc)=>{
            console.log(doc.data())
            //@ts-ignore
            setAgentList((prev)=>[...prev,{
                ...doc.data(),
                agentId: doc.id
            }])
        })
    }

  return (
    <View style={{marginVertical: 10}}>
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold'
      }}>My Agent/Assistant</Text>

      <FlatList 
        data={agentList}
        renderItem={({item, index})=>(
            <TouchableOpacity style={{
                display: 'flex',
                flexDirection: 'row',
                padding: 15,
                borderWidth:1,
                borderColor: Colors.light_gray,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: Colors.white,
                marginTop: 10
            }}
            onPress={()=>{router.push({
                pathname: '/chat',
                params: {
                    agentName: item.agentName,
                    initialText: '',
                    agentPrompt: item.prompt,
                    agentId: item.agentId,
                    emoji: item.emoji
                }
            })}}
            >
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center'
                }}>
                <Text style={{fontSize: 25}}>{item.emoji}</Text>
                <Text style={{fontSize: 18, fontWeight: 'semibold'}}>{item.agentName}</Text>
                </View>
                
                <ArrowRight />
            </TouchableOpacity>
        )}
      />
    </View>
  )
}