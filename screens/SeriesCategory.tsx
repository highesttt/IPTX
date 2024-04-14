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

import { getMaterialYouCurrentTheme } from '../utils/theme';
import { retrieveCategoryInfo } from '../utils/retrieveInfo';
import { MediaType } from '../utils/MediaType';
import { getFlagEmoji } from '../utils/flagEmoji';
import { Card } from 'react-native-paper';
import { SeriesDTO } from '../dto/media/series.dto';
import { useIsFocused } from '@react-navigation/native';
import { retrieveData } from '../utils/data';

function SeriesCategoryScreen({ route, navigation }: any): React.JSX.Element {
  const [categories, setCategories] = useState<SeriesDTO[]>([]);
  const [profile, setProfile] = useState<string | null>('');
  const [loading, setLoading] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';
  const { category } = route.params;
  const [visibleCategories, setVisibleCategories] = useState<SeriesDTO[]>([]);
  const CHUNK_SIZE = 30;

  let theme = getMaterialYouCurrentTheme(isDarkMode);

  const focused = useIsFocused();

  useEffect(() => {
    retrieveData('name').then((name) => {
      if (categories.length === 0 || name !== profile) {
        setCategories([]);
        setProfile(name);
        retrieveCategoryInfo(MediaType.SERIES, category.id).then((data) => {
            setCategories(data);
            setVisibleCategories(data.slice(0, CHUNK_SIZE));
            setLoading(false);
            return;
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

  const renderItem = ({ item }: { item: SeriesDTO }) => {
    var flag = item.name.split(' ')[0];
    var name = item.name.split(' ').slice(1).join(' ');
    if (flag.length < 2) {
      flag = item.name.split(' ')[1];
      name = item.name.split(' ').slice(2).join(' ');
    }
    flag = getFlagEmoji(flag);

    return (
      <Card
        key={item.id}
        style={{ backgroundColor: theme.card }}
        className={'rounded-lg w-44 h-[17rem] relative flex flex-col'}
        onPress={async () => {
          navigation.push('View', { series: item });
        }}>
        <View>
          <Card.Title
            className="flex-initial"
            title={item.name}
            titleStyle={{
              color: theme.text,
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
                item.stream_icon != ''
                  ? item.stream_icon
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

  const windowWidth = useWindowDimensions().width;
  const numColumns = Math.floor(windowWidth / 180);

  return (
    <SafeAreaView className='h-full flex ' style={{ backgroundColor: theme.background }}>
      <Text className='text-2xl p-4 font-bold' style={{
        color: theme.primary,
      }}>
        {category.name}
      </Text>
      {loading ? (
        <View className='flex-1 pb-4 items-center justify-center align-middle'>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          key={numColumns}
          numColumns={numColumns}
          data={visibleCategories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          columnWrapperStyle={{ gap: 7 }}
          contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', gap: 7}}
        />
      )}
    </SafeAreaView>
  );
}

export default SeriesCategoryScreen;
