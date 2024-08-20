import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { getMaterialYouCurrentTheme } from '../utils/theme';
import { retrieveCategoryInfo } from '../utils/retrieveInfo';
import { MediaType } from '../utils/MediaType';
import { getFlagEmoji } from '../utils/flagEmoji';
import { buildURL } from '../utils/buildUrl';
import { MovieDTO } from '../dto/media/movie.dto';
import { Card } from 'react-native-paper';

function MoviesCategoryScreen({route, navigation}: any): React.JSX.Element {
  const [categories, setCategories] = useState<MovieDTO[]>([]);
  const isDarkMode = useColorScheme() === 'dark';
  const {category} = route.params;

  const theme = getMaterialYouCurrentTheme(isDarkMode);

  retrieveCategoryInfo(MediaType.MOVIE, category.id).then((data) => {
    if (categories.length === 0) {
      setCategories(data);
      return;
    } else {
      console.log('Categories already loaded');
    }
  });

  // for every cat that has a stream_icon preload the image

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
            className='gap-2 flex-1 flex-row w-full flex-wrap justify-center items-center'
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
                
                <Card
                  key={cat.id}
                  style={{backgroundColor: theme.card}}
                  className={'rounded-lg w-44 h-[17rem] relative flex flex-col'}
                  onPress={async () => {
                    const videoUrl = await buildURL(MediaType.MOVIE, cat.stream_id, cat.extension);
                    navigation.navigate('Player', {url: videoUrl});
                  }}
                  >
                  <View>
                    <Card.Title className='flex-initial' title={cat.name} titleStyle={{color: theme.text, fontSize: 12, marginVertical: 10}} titleNumberOfLines={1}/>
                  </View>
                  <View className='items-center'>
                    <Card.Cover
                      source={{uri: cat.stream_icon != "" ? cat.stream_icon : 'https://cdn.dribbble.com/users/2639810/screenshots/9403030/media/d1c8b21cbd1972075ea236b1953f884f.jpg'}} 
                      style={{resizeMode: 'stretch', width: 130, height: 172, borderRadius: 6, justifyContent: 'center', position: 'relative', marginTop: 4}}
                      resizeMethod='auto'
                      />
                  </View>
                </Card>
                // <Card
                //   key={cat.id}
                //   style={{backgroundColor: theme.card}}
                //   className={'rounded-lg w-4/12 h-48 flex flex-row '}
                //   onPress={async () => {
                //     const videoUrl = await buildURL(MediaType.MOVIE, cat.stream_id, cat.extension);
                //     navigation.navigate('Player', {url: videoUrl});
                //   }}
                // >
                //   {cat.stream_icon == "" ? (
                //       null
                //   ) : (
                //     <Card.Cover
                //       source={{uri: cat.stream_icon}}
                //       style={{resizeMode: 'stretch'}}
                //     />
                //   )}
                //   <Card.Title className='flex-initial m-2'>
                //     <Text key={cat.id} style={{color: theme.text}} className='flex-initial mr-2'>
                //       {flag} {name}
                //     </Text>
                //   </Card.Title>
                // </Card>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default MoviesCategoryScreen;
