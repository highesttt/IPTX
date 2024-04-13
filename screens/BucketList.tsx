import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
} from 'react-native';

import { getMaterialYouCurrentTheme, getMaterialYouThemes } from '../utils/theme';
import { retrieveCategoryInfo, retrieveMediaInfo } from '../utils/retrieveInfo';
import { MediaType } from '../utils/MediaType';
import { getFlagEmoji } from '../utils/flagEmoji';
import { MovieDTO } from '../dto/media/movie.dto';
import { Card } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { retrieveData } from '../utils/data';
import { MediaDTO } from '../dto/media/media.dto';
import { MediaInfoDTO } from '../dto/media_info/media_info.dto';
import { SeriesDTO } from '../dto/media/series.dto';
import { MovieInfoDTO } from '../dto/media_info/movie_info.dto';
import { SeriesInfoDTO } from '../dto/media_info/series_info.dto';

function BucketListScreen({ route, navigation }: any): React.JSX.Element {
  const [categories, setCategories] = useState<(MovieInfoDTO | SeriesInfoDTO)[]>([]);
  const [profile, setProfile] = useState<string | null>('');
  const [loading, setLoading] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';
  const [visibleCategories, setVisibleCategories] = useState<(MovieInfoDTO | SeriesInfoDTO)[]>([]);
  const CHUNK_SIZE = 30;

  let theme = getMaterialYouThemes().dark
  getMaterialYouCurrentTheme(isDarkMode).then((resolvedTheme) => {
  theme = resolvedTheme;
  });

  const focused = useIsFocused();

  useEffect(() => {
    retrieveData('name').then((name) => {
      if (categories.length === 0 || name !== profile) {
        console.log('Loading categories');
        setCategories([]);
        setProfile(name);
        retrieveData('bucket').then((data) => {
          // every item in the bucket list is a string in the format "type-stream_id"
          const bucketList = JSON.parse(data || '[]');
          console.log(bucketList);
          // retrieve the info for each item in the bucket list
          for (let i = 0; i < bucketList.length; i++) {
            const item = bucketList[i].split('-');
            retrieveMediaInfo((item[0] + '/') as MediaType, item[1]).then((data) => {
              if (data !== null) {
                setCategories((prev) => [...prev, data]);
                if (visibleCategories.length < CHUNK_SIZE) {
                  setVisibleCategories((prev) => [...prev, data]);
                }
              }
              if (i === bucketList.length - 1) {
                setLoading(false);
              }
            });
          }
        });
      } else {
        console.log('Categories already loaded');
      }
    })
  }, [focused]);
  
  const handleLoadMore = () => {
    const currentLength = visibleCategories.length;
    const nextChunk = categories.slice(currentLength, currentLength + CHUNK_SIZE);
    setVisibleCategories([...visibleCategories, ...nextChunk]);
  };

  const renderItem = ({ item }: { item: MovieInfoDTO | SeriesInfoDTO }) => {
    var flag = item.name.split(' ')[0];
    var name = item.name.split(' ').slice(1).join(' ');
    if (flag.length < 2) {
      flag = item.name.split(' ')[1];
      name = item.name.split(' ').slice(2).join(' ');
    }
    flag = getFlagEmoji(flag);

    return (
      <Card
        key={item.name}
        style={{ backgroundColor: theme.card }}
        className={'rounded-lg w-44 h-[17rem] relative flex flex-col'}
        onPress={async () => {
          if (item.type === MediaType.SERIES) {
            navigation.push('SeriesView', { info: item });
          } else if (item.type === MediaType.MOVIE) {
            navigation.push('MovieView', { info: item });
          }
        }}>
        <View>
          <Card.Title
            className="flex-initial"
            title={item.name}
            titleStyle={{
              color: theme?.text,
              fontSize: 12,
              marginVertical: 10,
            }}
            titleNumberOfLines={1}
          />
        </View>
        <View className="items-center">
          <Card.Cover
            source={{
              uri:
                item.cover != ''
                  ? item.cover
                  : 'https://cdn.dribbble.com/users/2639810/screenshots/9403030/media/d1c8b21cbd1972075ea236b1953f884f.jpg',
            }}
            style={{
              resizeMode: 'stretch',
              width: 130,
              height: 172,
              borderRadius: 6,
              justifyContent: 'center',
              position: 'relative',
              marginTop: 4,
            }}
            resizeMethod="auto"
          />
        </View>
      </Card>
    );
  };

  // calculate how many columns we can fit
  const windowWidth = useWindowDimensions().width;
  const numColumns = Math.floor(windowWidth / 180);

  return (
    <SafeAreaView className='h-full flex ' style={{ backgroundColor: theme?.background }}>
      <Text className='text-2xl p-4 font-bold' style={{
        color: theme?.primary,
      }}>
        Bucket List
      </Text>
      {loading ? (
        <View className='flex-1 pb-4 items-center justify-center align-middle'>
          <ActivityIndicator size="large" color={theme?.primary} />
        </View>
      ) : (
        <FlatList
          key={numColumns}
          numColumns={numColumns}
          data={visibleCategories}
          renderItem={renderItem}
          keyExtractor={(item) => item.name.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          columnWrapperStyle={{ gap: 4 }}
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', gap: 4}}
        />
      )}
    </SafeAreaView>
  );
}

export default BucketListScreen;
