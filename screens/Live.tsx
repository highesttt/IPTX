import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { getMaterialYouCurrentTheme, getMaterialYouThemes } from '../utils/theme';
import { retrieveCategories } from '../utils/retrieveInfo';
import { MediaType } from '../utils/MediaType';
import { CategoryDTO } from '../dto/category.dto';
import { getFlagEmoji } from '../utils/flagEmoji';
import { retrieveData } from '../utils/data';
import { useIsFocused } from '@react-navigation/native';

function LiveScreen({navigation}: any): React.JSX.Element {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [profile, setProfile] = useState<string | null>('');
  const isDarkMode = useColorScheme() === 'dark';

    let theme = getMaterialYouThemes().dark
    getMaterialYouCurrentTheme(isDarkMode).then((resolvedTheme) => {
      theme = resolvedTheme;
    });

  const focused = useIsFocused();

  useEffect(() => {
    retrieveData('name').then((name) => {
      if (categories.length === 0 || name !== profile) {
        setCategories([]);
        setProfile(name);
        retrieveCategories(MediaType.LIVE).then((data) => {
            setCategories(data);
            return;
        });
      } else {
        console.log('Categories already loaded');
      }
    })
  }, [focused]);
  
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
          }}>Live TV</Text>
          <View
          className='flex-1 flex-col justify-center items-center w-full'
          > 
            {categories.map((category) => {
              var flag = category.name.split(' ')[0];
              flag = getFlagEmoji(flag);
              var name = category.name.split(' ').slice(1).join(' ');
              return (
                <TouchableOpacity
                className='rounded-lg w-10/12 h-10 m-2 p-2 flex justify-center items-center transition-all duration-500'
                  style={{backgroundColor: theme.card}}
                  key={category.id}
                  onPress={() =>
                    navigation.push('Category', {
                      category: category,
                    })
                  }
                >
                  <Text key={category.id} style={{color: theme.text}}>
                    {flag} {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default LiveScreen;
