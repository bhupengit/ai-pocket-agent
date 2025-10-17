import Colors from '@/shared/Colors'
import React from 'react'
import { Image, Text, View } from 'react-native'
import { Agent } from './AgentCard'

type Props = {
    agent: Agent   
}
export default function NonFeaturedAgentCard({agent} : Props) {
    return (
        <View style={{
            backgroundColor: Colors.white,
            borderRadius: 15,
            minHeight: 180,
            padding: 10,
            overflow: 'hidden'
        }}>   

<View style={{
            
          }}>
          {/* @ts-ignore */}
          <Image source={agent.image} style={{
            width:70,
            height:70,
            resizeMode: 'contain'
          }}/>
          </View>
        <View style={{
            marginTop: 5
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
          }}>{agent.name}</Text>
          <Text
          numberOfLines={2}
           style={{
            color: Colors.gray,
            marginTop: 2
          }}>{agent.desc}</Text>
          </View>
         
        </View>
      )
}