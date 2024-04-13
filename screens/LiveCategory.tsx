import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { getMaterialYouCurrentTheme, getMaterialYouThemes } from '../utils/theme';
import { retrieveCategoryInfo } from '../utils/retrieveInfo';
import { MediaType } from '../utils/MediaType';
import { getFlagEmoji } from '../utils/flagEmoji';
import { LiveDTO } from '../dto/media/live.dto';
import { buildURL } from '../utils/buildUrl';
import { globalVars } from '../App';
import FitImage from 'react-native-fit-image';
import { useIsFocused } from '@react-navigation/native';
import { retrieveData } from '../utils/data';

function LiveCategoryScreen({ route, navigation }: any): React.JSX.Element {
  const [categories, setCategories] = useState<LiveDTO[]>([]);
  const [profile, setProfile] = useState<string | null>('');
  const [loading, setLoading] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';
  const { category } = route.params;
  const [visibleCategories, setVisibleCategories] = useState<LiveDTO[]>([]);
  const CHUNK_SIZE = 30;

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
        retrieveCategoryInfo(MediaType.LIVE, category.id).then((data) => {
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

  const renderItem = ({ item }: { item: LiveDTO }) => {
    var flag = item.name.split(' ')[0];
    var name = item.name.split(' ').slice(1).join(' ');
    if (flag.length < 2) {
      flag = item.name.split(' ')[1];
      name = item.name.split(' ').slice(2).join(' ');
    }
    flag = getFlagEmoji(flag);

    return (
      <View className='w-screen justify-center align-middle items-center'>
        <TouchableOpacity
        className={
          "rounded-lg h-16 m-2 flex transition-all duration-500 flex-row justify-start items-center pl-4 w-11/12"
        }
        style={{ backgroundColor: theme.card }}
          onPress={async () => {
            const videoUrl = await buildURL(MediaType.LIVE, item.stream_id);
            globalVars.isPlayer = true;
            navigation.push('Player', { url: videoUrl });
          }}
        >
          {item.stream_icon ? (
            <FitImage
              source={{ uri: item.stream_icon }}
              style={{ width: 30, height: 40, borderRadius: 20, marginRight: 10 }}
              resizeMode='contain'
              onError={(e) => {
                console.log('Error loading image: ', e);}}
            />
          ) : null}
          <Text style={{ color: theme.text }}>{flag} {name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: theme.background }}
    className="flex-1 flex-col h-full">
      <Text style={{ color: theme.primary, fontSize: 20, fontWeight: 'bold', padding: 10 }}>
        {category.name}
      </Text>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <View className="flex-1 flex-col justify-center items-center w-full">
          <FlatList
            data={visibleCategories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            className='w-full h-full'
            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

export default LiveCategoryScreen;
