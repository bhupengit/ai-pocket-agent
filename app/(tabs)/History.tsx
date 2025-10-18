import { firestoreDb } from '@/config/FirebaseConfig'
import Colors from '@/shared/Colors'
import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { MessageCircle } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'

type History={
  agentId: number,
  agentName: string,
  agentPrompt: string,
  emoji: string,
  imageBanner: string,
  messages: any[],
  lastModified: any,
  chatId: string
}

export default function History() {
  const {user} = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [historyList, setHistoryList] = useState<History[]>([])

  useEffect(()=>{
    user && GetChatHistory()
}, [user])


  const GetChatHistory = async()=>{
    setLoading(true)
    const q = query(collection(firestoreDb, 'chats'), 
    where("userEmail", '==', user?.primaryEmailAddress?.emailAddress),
    orderBy('lastModified', 'desc'))
        const querySnapshot = await getDocs(q)
        setHistoryList([])
        querySnapshot.forEach((doc)=>{
          console.log(doc.data())
          //@ts-ignore
          setHistoryList((prev)=>[...prev,{...doc.data(), chatId: doc.id}])
          
      })
      setLoading(false)
  }

  const OnClickHandle = (item: History) =>{
    router.push({
      pathname: '/chat',
      params: {
          agentName: item.agentName,  
          initialText: '',
          agentPrompt: item.agentPrompt,
          agentId: item.agentId,
          chatId: item.chatId,
          emoji: item.emoji,
          imageBanner: item.imageBanner,
          messagesList: JSON.stringify(item.messages)
      }
  })
  }
  return (
    <View>
      <FlatList 
        data={historyList}
        onRefresh={()=> GetChatHistory()}
        refreshing={loading}
        renderItem={({item,index}) => (
          <TouchableOpacity style={{
            display: 'flex',
            flexDirection: 'row',
            borderWidth: 1,
            borderRadius: 15,
            borderColor: Colors.light_gray,
            backgroundColor: Colors.white,
            padding: 15,
            marginTop: 10,
            marginHorizontal: 15,
            alignItems: 'center'
          }}
          onPress={()=>{OnClickHandle(item)}}>
            <View style={{
              padding: 15,
              backgroundColor: Colors.light_gray,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10
            }}>
            {item.emoji ? <Text style={{fontSize: 20}}>{item.emoji}</Text> : <MessageCircle />}
            </View>
            
            <View style={{
                width: '80%',
                marginStart: 10
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold'
              }}>{item.agentName}</Text>
              <Text numberOfLines={1} style={{
                color: Colors.gray
              }}>{item.messages.length> 2 ? item.messages[item.messages.length-1].content: ''}</Text>
            </View>
          </TouchableOpacity>
  )}
      />
    </View>
  )
}