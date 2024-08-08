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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function ProfileScreen({navigation}: any): React.JSX.Element {
  const [user, setUser] = useState<UserDTO | null>();
  const isDarkMode = useColorScheme() === 'dark';
  const [profiles, setProfiles] = useState<ProfileDTO[]>([]);
  const [currentTheme, setCurrentTheme] = useState<string>('');
  const [profilePopup, setProfilePopup] = useState<number>(-1);

  let theme = getMaterialYouCurrentTheme(isDarkMode);


  const toggleCreateProfilePopup = async (index: number, username?: string, password?: string, baseURL?: string) => {
    setProfilePopup(index);
    if (index == -1) {

        if (NameInput === "" || username == undefined || password == undefined || baseURL == undefined) {
          return;
        }

        await storeData("name", NameInput);

        await storeData("username", username);
        await storeData("password", password);

        // if last character is a slash remove it
        if (baseURL[baseURL.length - 1] === '/') {
          baseURL = baseURL.slice(0, -1);
        }
        await storeData("url", baseURL);

        const usersData = await retrieveData("users");
        var users = usersData ? JSON.parse(usersData) : null;

        if (users) {
          users++;
        }

        await storeData("users", users);

        var profile = {
          name: NameInput,
          url: baseURL,
          username: username,
          password: password
        };

        setProfiles([...profiles, profile]);
        await storeData("profiles", [...profiles, profile]);
        setSelectedProfile(users);

        retrieveUser().then((data) => {
          setUser(data);
        });

        setInput('');
        setNameInput('');
    }
  }



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
  const [baseURL, setBaseURL] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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
          className='flex-1 flex-col h-full min-h-screen'
          style={{
            backgroundColor: theme.background,
          }}>
          <Text className='text-2xl p-4 font-bold items-start' style={{
            color: theme.primary,
          }}>Profile</Text>
          <View className='flex flex-col justify-center items-center w-full pt-2'>
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
          <View className='flex flex-col justify-center items-center w-full pt-8'>
            <SelectDropdown
              key={selectedProfile}
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
                      <TouchableOpacity
                        onPress={() => {
                          var newProfiles = profiles;
                          newProfiles.splice(index, 1);
                          setProfiles(newProfiles);
                          storeData("profiles", newProfiles);
                            setSelectedProfile(-1);
                        }}
                      >
                        <Icon name={'trash-can-outline'} style={{ color: theme.secondary, fontSize: 24 }} />
                      </TouchableOpacity>
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
          {/* <View className='flex-1 flex-col justify-center items-center w-full pt-8'>
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
          </View> */}
          <View className='flex flex-col justify-center items-center w-full pt-8'>
            <TouchableOpacity
              className='rounded-lg p-2 justify-center items-center'
              style={{backgroundColor: theme.primary}}
              onPress={() => {
                navigation.push('BucketList');
              }}
            >
              <MaterialCommunityIcons name='bucket' size={24} color={theme.textColored} />
            </TouchableOpacity>
          </View>
          {/* plus button at the bottom right as a floating button to add an account */}
          <View className='absolute bottom-0 right-0 m-4 pb-[7.5rem] w-11/12'>
            <SelectDropdown
              data={
                [ { name: 'Add with Username & Password' },
                  { name: 'Add with M3U URL' },
                ]
              }
              onSelect={(selectedItem, index) => {
                toggleCreateProfilePopup(index);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <TouchableOpacity
                    className='rounded-full flex items-end w-[98%]'
                  >
                    <View
                      className='rounded-full flex justify-center items-center w-16 h-16'
                    style={{backgroundColor: theme.primary}}>
                      <MaterialCommunityIcons name='plus' size={24} color={theme.textColored} />
                    </View>
                  </TouchableOpacity>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View className='items-center w-full'>
                    <View className='h-12 justify-center items-center px-3 flex flex-row rounded-lg w-full' style={{backgroundColor: theme.card}}>
                      <Text numberOfLines={1} ellipsizeMode="tail" className='text-lg w-full flex font-semibold'>{item?.name}</Text>
                    </View>
                    {(index !== 1) && (
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
        {(profilePopup == 0 || profilePopup == 1) && (
          <View className='absolute items-center justify-center align-middle h-screen w-screen bg-black/50'
          >
            <View className='w-96' style={{
              backgroundColor: theme.background,
              borderRadius: 8,
            }}>
              {/* x at top right to close */}
              <View className='flex flex-row w-full justify-between align-middle text-center'>
                <Text className='text-2xl p-4 font-bold items-start' style={{
                  color: theme.primary,
                }}>Create a Profile</Text>

                <TouchableOpacity
                  className='m-4'
                  onPress={() => {
                    toggleCreateProfilePopup(-1);
                  }}
                >
                  <MaterialCommunityIcons name='close' size={24} color={theme.primary} />
                </TouchableOpacity>
              </View>
              <View className='rounded-lg items-center flex px-4 pt-4'>
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
              <View style={{
                display: profilePopup == 0 ? 'flex' : 'none',
              }}>
                <View className='rounded-lg items-center flex px-4 pt-6'>
                  <TextInput
                    className='w-full p-2 rounded-lg'
                    autoCorrect={false}
                    style={{
                      backgroundColor: theme.card,
                      color: theme.text,
                    }}
                    placeholderTextColor={theme.secondary}
                    placeholder='Base URL'
                    onChangeText={text => setBaseURL(text)}
                  />
                </View>
                <View className='rounded-lg items-center flex px-4 pt-4'>
                  <TextInput
                    className='w-full p-2 rounded-lg'
                    autoCorrect={false}
                    style={{
                      backgroundColor: theme.card,
                      color: theme.text,
                    }}
                    placeholderTextColor={theme.secondary}
                    placeholder='Username'
                    onChangeText={text => setUsername(text)}
                  />
                </View>
                <View className='rounded-lg items-center flex p-4'>
                  <TextInput
                    className='w-full p-2 rounded-lg'
                    autoCorrect={false}
                    style={{
                      backgroundColor: theme.card,
                      color: theme.text,
                    }}
                    placeholderTextColor={theme.secondary}
                    placeholder='Password'
                    onChangeText={text => setPassword(text)}
                  />
                </View>
                <View className='rounded-lg items-center flex p-4'>
                  <TouchableOpacity
                    className='rounded-lg w-1/2 p-2 justify-center items-center'
                    style={{backgroundColor: theme.primary}}
                    onPress={() => {
                      toggleCreateProfilePopup(-1, username, password, baseURL);
                    }}
                  >
                    <Text style={{color: theme.textColored}}>Create Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{
                display: profilePopup == 1 ? 'flex' : 'none',
              }}>
                <View className='rounded-lg items-center flex px-4 pt-6'>
                  <TextInput
                    className='w-full p-2 rounded-lg'
                    autoCorrect={false}
                    style={{
                      backgroundColor: theme.card,
                      color: theme.text,
                    }}
                    placeholderTextColor={theme.secondary}
                    placeholder='M3U URL'
                    onChangeText={text => setInput(text)}
                  />
                </View>
                <View className='rounded-lg items-center flex p-4'>
                  <TouchableOpacity
                    className='rounded-lg w-1/2 p-2 justify-center items-center'
                    style={{backgroundColor: theme.primary}}
                    onPress={() => {
                      const splitURL = input.split("?");
              
                      console.log(splitURL);
              
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
              
                      const usr = searchParams["username"];
                      const pass = searchParams["password"];
                      var url: string = splitURL[0];
                      url = url.substring(0, url.lastIndexOf("/"));
                      toggleCreateProfilePopup(-1, usr, pass, url);
                    }}
                  >
                    <Text style={{color: theme.textColored}}>Create Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
    </SafeAreaView>
  );
}
export default ProfileScreen;

