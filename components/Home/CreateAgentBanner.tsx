import Colors from '@/shared/Colors'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function CreateAgentBanner() {
  return (
    <View style={{
        backgroundColor: Colors.primary,
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 15,
    }}>
        <Image source={require('../../assets/images/agentGroup.png')} 
        style={{
            width: 200,
            height:120,
            resizeMode:'contain'
        }}
        />
        <View style={{
            padding: 10,
            width: 180
        }}>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: Colors.white
            }}>Create You Own Agent</Text>
            <TouchableOpacity style={{
                    backgroundColor: Colors.white,
                    padding: 7,
                    borderRadius: 5,
                    marginTop: 8
                }}>
                <Text style={{
                    color: Colors.primary,
                    textAlign: 'center',
                }}>Create Now</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}