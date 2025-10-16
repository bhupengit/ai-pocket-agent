import { firestoreDb } from "@/config/FirebaseConfig";
import Colors from "@/shared/Colors";
import { useAuth, useSSO, useUser } from "@clerk/clerk-expo";
import * as AuthSession from 'expo-auth-session';
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import { doc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Platform, Text, TouchableOpacity, View } from "react-native";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export default function Index() {

  const { isSignedIn } = useAuth()
  const router = useRouter()
  const {user} = useUser()
  const [isLoading, setIsLoading] = useState(true)

  console.log(user?.primaryEmailAddress?.emailAddress)

  useEffect(() => {
    if (isSignedIn) {
      //redirect home screen
      router.replace('/(tabs)/Home')
    }
    if(isSignedIn != undefined){
      setIsLoading(false)
    }
  }, [isSignedIn])

  useWarmUpBrowser()

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO()

  const onLoginPress = useCallback(async () => {
    try {
      console.log("onLoginPress")
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri({ scheme: 'aipocketagent' }),
      })

      if(signUp){
        await setDoc(doc(firestoreDb, 'users', signUp.emailAddress?? ''),{
          email: signUp.emailAddress,
          name: signUp.firstName+" "+signUp.lastName,
          joinDate: Date.now(),
          credits: 20
        })
      }

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          // Check for session tasks and navigate to custom UI to help users resolve them
          // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask)
              // router.push('/sign-in/tasks')
              return
            }

            router.replace('/(tabs)/Home')
          },
        })
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/images/agentGroup.png")}
        style={{ 
          width: Dimensions.get("screen").width*0.85, 
          height: 280,
          resizeMode : "contain"
      }}
      />
      <View >
        <Text style={{ 
        marginVertical: 10,
        fontSize: 26,
        fontWeight: "bold",
        color: Colors.primary,
        textAlign: "center",
        fontFamily: "Poppins-Bold",
        }}>Welcome to AI Pocket Agent</Text>
        <Text style={{ 
          marginHorizontal: 20,
          fontSize: 16,
          color: Colors.gray,
          textAlign: "center",
          fontFamily: "Poppins-Regular",
        }}>Your Ultimate AI Personal Agent to make life easier. Try it taday, Completely Free!</Text>
       
      </View>
      { !isLoading && <TouchableOpacity onPress={onLoginPress} style={{ 
          marginTop: 50,
          width: "90%",
          padding: 15,
          backgroundColor: Colors.primary,
          borderRadius: 12,
        }}>
          <Text style={{
            width: "100%",
            color: Colors.white,
            textAlign: "center",
            fontFamily: "Poppins-Bold",
            fontSize: 16,
            fontWeight: "bold",
          }}>Get Started</Text>
        </TouchableOpacity>}

        {
          isLoading== undefined &&
          <ActivityIndicator size={'large'}/>
        }
    </View>
  );
}
