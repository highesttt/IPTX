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
import { retrieveCategoryInfo } from '../utils/retrieveInfo';
import { MediaType } from '../utils/MediaType';
import { getFlagEmoji } from '../utils/flagEmoji';
import { LiveDTO } from '../dto/media/live.dto';
import { buildURL } from '../utils/buildUrl';
import { globalVars } from '../App';
import FitImage from 'react-native-fit-image';

function LiveCategoryScreen({route, navigation}: any): React.JSX.Element {
  const [categories, setCategories] = useState<LiveDTO[]>([]);
  const isDarkMode = useColorScheme() === 'dark';
  const {category} = route.params;

  const theme = getMaterialYouCurrentTheme(isDarkMode);

  retrieveCategoryInfo(MediaType.LIVE, category.id).then((data) => {
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
        style={{backgroundColor: theme.background}}>
        <View
          className='flex-1 flex-col h-full'
          style={{
            backgroundColor: theme.background,
          }}>
          <Text className='text-2xl p-4 font-bold' style={{
            color: theme.primary,
          }}>
            {category.name}
          </Text>
          <View
          className='flex-1 flex-col justify-center items-center w-full'
          > 
            {categories.map((cat) => {
              var flag = cat.name.split(' ')[0];
              var name = cat.name.split(' ').slice(1).join(' ');
              if (flag.length < 2) {
                flag = cat.name.split(' ')[1];
                name = cat.name.split(' ').slice(2).join(' ');
              }
              flag = getFlagEmoji(flag);
              return (
                <TouchableOpacity
                  className={'rounded-lg w-10/12 h-16 m-2 flex transition-all duration-500 flex-row items-center justify-center'}
                  style={{backgroundColor: theme.card}}
                  key={cat.id}
                  onPress={async () => {
                    const videoUrl = await buildURL(MediaType.LIVE, cat.stream_id);
                    globalVars.isPlayer = true;
                    navigation.push('Player', {url: videoUrl});
                  }}
                >
                {cat.stream_icon != "" ? (
                  <Text key={cat.id} style={{color: theme.text}} className='flex-initial mr-2'>
                    {flag} {name}
                  </Text>
                ) :
                <Text key={cat.id} style={{color: theme.text}} className='text-center'>
                  {flag} {name}
                </Text>
              }
              {cat.stream_icon ? (
                
                <FitImage
                  source={{uri: cat.stream_icon}}
                  className='h-10 w-10 rounded-lg mx-2 absolute left-2 flex-initial'
                  resizeMode='cover'
                />
              ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default LiveCategoryScreen;
