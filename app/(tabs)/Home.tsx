import AgentListComponent from '@/components/Home/AgentListComponent'
import CreateAgentBanner from '@/components/Home/CreateAgentBanner'
import Colors from '@/shared/Colors'
import { useNavigation } from 'expo-router'
import { Settings } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'

export default function Home() {
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18
        }}>AI Pocket Agent</Text>
      ),
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity style={{ marginStart: 15, display: 'flex', flexDirection: 'row', gap: 6, backgroundColor: Colors.primary, padding: 5, paddingHorizontal: 10, borderRadius: 5 }}>
          <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/diamond.png')} />
          <Text style={{ color: Colors.white, fontWeight: 'bold' }}>Pro</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Settings style={{ marginRight: 15 }} />
      )
    })
  })
  return (
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={
        <View style={{
          padding: 15,
        }}>
          <AgentListComponent isFeatured={true} />
          <CreateAgentBanner />
          <AgentListComponent isFeatured={false} />
        </View>
      } />

  )
}