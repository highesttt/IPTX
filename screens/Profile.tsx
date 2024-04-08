import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { getMaterialYouCurrentTheme } from '../utils/theme';
import { retrieveUser } from '../utils/retrieveInfo';
import { UserDTO } from '../dto/user.dto';
import { storeData } from '../utils/data';

function ProfileScreen(): React.JSX.Element {
  const [user, setUser] = useState<UserDTO | null>();
  const isDarkMode = useColorScheme() === 'dark';

  const theme = getMaterialYouCurrentTheme(isDarkMode);

  retrieveUser().then((data) => {
    if (user === undefined) {
      setUser(data);
      return;
    } else {
      console.log('User already loaded');
    }
  });

  const backgroundColor = theme.textColored + '50';

  const [input, setInput] = useState<string>('');


  return (
    <SafeAreaView style={{backgroundColor: theme.background}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{backgroundColor: theme.background}}>
        <View
          className='flex-1 flex-col h-full'
          style={{
            backgroundColor: theme.background,
          }}>
          <Text className='text-2xl p-4 font-bold items-start' style={{
            color: theme.primary,
          }}>Profile</Text>
          <View className='flex-1 flex-col justify-center items-center w-full pt-2'>
            <View
              className={'rounded-xl flex h-52 w-10/12'}
              style={{backgroundColor: backgroundColor}}>
              <Text className='text-center text-lg font-semibold pt-2' style={{color: theme.text}}>
                <Text className='text-xl' style={{color: theme.primary}}>
                  { user?.username } 
                </Text>
                &nbsp;
                (
                <Text className='text-lg' style={{color: theme.primary}}>
                  { user?.status }
                  </Text>
                )
              </Text>
              <View className='flex-1 gap-2 justify-center'>
                <Text className='text-xl pl-4' style={{color: theme.text}}>
                  Sessions:&nbsp;
                  <Text className='text-lg' style={{color: theme.primary}}>
                    { user?.active_connections }/{ user?.max_connections }
                  </Text>
                </Text>
                <Text className='text-xl pl-4' style={{color: theme.text}}>
                  Expires:&nbsp;
                  <Text className='text-lg' style={{color: theme.primary}}>
                    { new Date(parseInt((user?.expiration.toString()) + "000")).toLocaleString() }
                  </Text>
                </Text>
                <Text className='text-xl pl-4' style={{color: theme.text}}>
                  &nbsp;
                </Text>
              </View>
              <Text className='absolute text-xl bottom-0 m-2' style={{color: theme.text}}>
                <Text className='text-base' style={{color: theme.primary}}>
                  { user?.server_url }
                </Text>
              </Text>
            </View>
          </View>
          <View 
            className='flex-1 flex-col justify-center items-center w-full pt-6'
          >
          <View className='w-10/12 m-2 justify-center flex flex-col gap-3'>
            <View className='rounded-lg'>
              <TextInput
                className='w-full p-2 rounded-lg'
                autoCorrect={false}
                style={{
                  backgroundColor: theme.card,
                  color: theme.text,
                }}
                placeholderTextColor={theme.text}
                placeholder='Your IPTV URL'
                onChangeText={text => setInput(text)}
              />
            </View>
            <TouchableOpacity
              className='rounded-lg w-full p-2 justify-center items-center'
              style={{backgroundColor: theme.primary}}
              onPress={async () => {
                const splitURL = input.split("?");
      
                if (splitURL.length < 2) {
                  return;
                }
      
                const searchParams = splitURL[1].split("&").reduce((acc: { [key: string]: any }, cur) => {
                  const [key, value] = cur.split("=");
                  acc[key] = value;
                  return acc;
                }, {});
      
                const username = searchParams["username"];
                const password = searchParams["password"];
      
                await storeData("username", username);
                await storeData("password", password);
      
                var url: string = splitURL[0];
                url = url.substring(0, url.lastIndexOf("/"));
      
                await storeData("url", url);

                retrieveUser().then((data) => {
                  setUser(data);
                });
              }}
            >
              <Text style={{color: theme.textColored}}>Submit</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default ProfileScreen;
