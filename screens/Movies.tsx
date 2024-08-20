import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { getMaterialYouCurrentTheme } from '../utils/theme';
import { retrieveCategories } from '../utils/retrieveInfo';
import { MediaType } from '../utils/MediaType';
import { CategoryDTO } from '../dto/category.dto';
import { getFlagEmoji } from '../utils/flagEmoji';

function MoviesScreen({navigation}: any): React.JSX.Element {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const isDarkMode = useColorScheme() === 'dark';

  const theme = getMaterialYouCurrentTheme(isDarkMode);

  retrieveCategories(MediaType.MOVIE).then((data) => {
    if (categories.length === 0) {
      setCategories(data);
      return;
    } else {
      console.log('Categories already loaded');
    }
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
          }}>Movies</Text>
          <View
          className='flex-1 flex-col justify-center items-center w-full'
          > 
            {categories.map((category) => {
              var flag = category.name.split(' ')[0];
              flag = getFlagEmoji(flag);
              var name = category.name.split(' ').slice(1).join(' ');
              return (
                <TouchableOpacity className='rounded-lg w-10/12 h-10 m-2 flex justify-center items-center transition-all duration-500'
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
export default MoviesScreen;
