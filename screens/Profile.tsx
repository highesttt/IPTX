import React, { useEffect, useState } from 'react';
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
import { retrieveData, storeData } from '../utils/data';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProfileDTO } from '../dto/profile.dto';

function ProfileScreen({navigation}: any): React.JSX.Element {
  const [user, setUser] = useState<UserDTO | null>();
  const isDarkMode = useColorScheme() === 'dark';
  const [profiles, setProfiles] = useState<ProfileDTO[]>([]);
  const [currentTheme, setCurrentTheme] = useState<string>('');

  const theme = getMaterialYouCurrentTheme(isDarkMode);

  useEffect(() => {
    retrieveUser().then((data) => {
      setUser(data);
    });
    
    retrieveData("profiles").then((data) => {
      if (data === null || data.length === 0) {
        setSelectedProfile(-1);
        return;
      }
      setProfiles(JSON.parse(data || "[]"));
      retrieveData("name").then((data) => {
        var name = JSON.parse(data || "[]");
        var profile = profiles.findIndex((profile) => profile.name === name);
        setSelectedProfile(profile);
      })
    });
  }, []);

  const backgroundColor = theme.textColored + '50';

  const [input, setInput] = useState<string>('');
  const [NameInput, setNameInput] = useState<string>('');
  const [selectedProfile, setSelectedProfile] = useState<number>(-1);

  retrieveData("theme").then((data) => {
    if (data === null || data.length === 0) {
      return;
    }
    setCurrentTheme(JSON.parse(data || ""));
  });

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
          <View className='flex-1 flex-col justify-center items-center w-full pt-8'>
            <SelectDropdown
              key={profiles.length}
              data={profiles}
              onSelect={(selectedItem, index) => {
                setSelectedProfile(index);
                storeData("name", selectedItem.name);
                storeData("username", selectedItem.username);
                storeData("password", selectedItem.password);
                storeData("url", selectedItem.url);

                retrieveUser().then((data) => {
                  setUser(data);
                });
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View className='w-10/12 h-12 justify-center items-center px-3 flex flex-row rounded-lg ' style={{backgroundColor: theme.card}}>
                    <Text numberOfLines={1} ellipsizeMode="tail" className='text-lg font-semibold flex-1' style={{color: theme.text}}>
                      {selectedProfile === -1 ? 'Select Profile' : profiles[selectedProfile]?.name}
                    </Text>
                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={{ color: theme.secondary, fontSize: 24 }} />
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View className='items-center'>
                    <View className='h-12 justify-center items-center px-3 flex flex-row rounded-lg' style={{backgroundColor: theme.card}}>
                      <Text numberOfLines={1} ellipsizeMode="tail" className='text-lg flex-1 font-semibold'>{item?.name}</Text>
                      <Icon name={selectedProfile === index ? 'check' : 'checkbox-blank-outline'} style={{ color: theme.secondary, fontSize: 24 }} />
                    </View>
                    {(index !== profiles.length - 1) && (
                      <View className='h-0.5 w-11/12' style={{backgroundColor: theme.primary}}></View>
                    )}
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{backgroundColor: theme.card, borderRadius: 8}}
            />
          </View>
          <View 
            className='flex-1 flex-col justify-center items-center w-full'
          >
            <View className='w-10/12 m-2 pt-2 justify-center flex flex-col gap-3'>
              <View className='rounded-lg'>
                <TextInput
                  className='w-full p-2 rounded-lg'
                  autoCorrect={false}
                  style={{
                    backgroundColor: theme.card,
                    color: theme.text,
                  }}
                  placeholderTextColor={theme.secondary}
                  placeholder='New Profile Name'
                  onChangeText={text => setNameInput(text)}
                />
              </View>
              <View className='rounded-lg'>
                <TextInput
                  className='w-full p-2 rounded-lg'
                  autoCorrect={false}
                  style={{
                    backgroundColor: theme.card,
                    color: theme.text,
                  }}
                  placeholderTextColor={theme.secondary}
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

                  if (!splitURL[1].includes("username=") || !splitURL[1].includes("password=")) {
                    return;
                  }

                  if (NameInput === "") {
                    return;
                  }
        
                  const searchParams = splitURL[1].split("&").reduce((acc: { [key: string]: any }, cur) => {
                    const [key, value] = cur.split("=");
                    acc[key] = value;
                    return acc;
                  }, {});
        
                  const username = searchParams["username"];
                  const password = searchParams["password"];

                  await storeData("name", NameInput);
        
                  await storeData("username", username);
                  await storeData("password", password);
        
                  var url: string = splitURL[0];
                  url = url.substring(0, url.lastIndexOf("/"));
        
                  await storeData("url", url);

                  const usersData = await retrieveData("users");
                  var users = usersData ? JSON.parse(usersData) : null;

                  if (users) {
                    users++;
                  }

                  await storeData("users", users);

                  var profile = {
                    name: NameInput,
                    url: url,
                    username: username,
                    password: password
                  };

                  setProfiles([...profiles, profile]);
                  await storeData("profiles", [...profiles, profile]);
                  setSelectedProfile(users);

                  retrieveUser().then((data) => {
                    setUser(data);
                  });
                }}
              >
                <Text style={{color: theme.textColored}}>Add Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className='flex-1 flex-col justify-center items-center w-full pt-8'>
            <SelectDropdown
              data={[
                {
                  name: 'System Preferences',
                  setting: ''
                },
                {
                  name: 'Dark Mode',
                  setting: 'dark'
                },
                {
                  name: 'Light Mode',
                  setting: 'light'
                },
              ]}
              onSelect={(selectedItem, index) => {
                storeData("theme", selectedItem.setting);
                console.log(selectedItem);
                setCurrentTheme(selectedItem.setting);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View className='w-10/12 h-12 justify-center items-center px-3 flex flex-row rounded-lg ' style={{backgroundColor: theme.card}}>
                    <Text numberOfLines={1} ellipsizeMode="tail" className='text-lg font-semibold flex-1' style={{color: theme.text}}>
                      {selectedItem == null ? 'System Preferences' : selectedItem.name}
                    </Text>
                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={{ color: theme.secondary, fontSize: 24 }} />
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View className='items-center'>
                    <View className='h-12 justify-center items-center px-3 flex flex-row rounded-lg' style={{backgroundColor: theme.card}}>
                      <Text numberOfLines={1} ellipsizeMode="tail" className='text-lg flex-1 font-semibold'>{currentTheme == '' ? 'System Preferences' : item.name}</Text>
                      <Icon name={currentTheme == item.setting ? 'check' : 'checkbox-blank-outline'} style={{ color: theme.secondary, fontSize: 24 }} />
                    </View>
                    {(index !== 2) && (
                      <View className='h-0.5 w-11/12' style={{backgroundColor: theme.primary}}></View>
                    )}
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{backgroundColor: theme.card, borderRadius: 8}}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default ProfileScreen;

