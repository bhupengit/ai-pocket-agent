import UserCreatedAgent from '@/components/Explore/UserCreatedAgent'
import AgentListComponent from '@/components/Home/AgentListComponent'
import CreateAgentBanner from '@/components/Home/CreateAgentBanner'
import React from 'react'
import { Text, View } from 'react-native'

export default function Explore() {
  return (
    <View style={{
      padding: 15,
    }}>
      <CreateAgentBanner />

      {/* User Created Agent */}
      <UserCreatedAgent />
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
      }}>Featured Agent</Text>
      <AgentListComponent isFeatured={true} />
    </View>
  )
}