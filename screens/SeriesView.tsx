import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  useColorScheme,
  View,
  ImageBackground,
  Linking,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import { getMaterialYouCurrentTheme } from '../utils/theme';
import { retrieveMediaInfo } from '../utils/retrieveInfo';
import { MediaType } from '../utils/MediaType';
import { buildURL } from '../utils/buildUrl';
import { Button } from 'react-native-paper';
import { globalVars } from '../App';
import { SeriesInfoDTO } from '../dto/media_info/series_info.dto';
import { SeriesDTO } from '../dto/media/series.dto';
import SelectDropdown from 'react-native-select-dropdown';

function SeriesViewScreen({ route, navigation }: any): React.JSX.Element {
  const [seriesInfo, setSeriesInfo] = useState<SeriesInfoDTO>();
  const [seasons, setSeasons] = useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const isDarkMode = useColorScheme() === 'dark';
  const { series }: { series: SeriesDTO } = route.params;

  const theme = getMaterialYouCurrentTheme(isDarkMode);

  useEffect(() => {
    retrieveMediaInfo(MediaType.SERIES, series.stream_id).then((data) => {
      if (data === null) {
        return;
      }
      setSeriesInfo(data as SeriesInfoDTO);
      const value = data as SeriesInfoDTO;
      const seasons = value.episodes.filter((episode) => episode.season).map((episode) => episode.season);
      const uniqueSeasons = [...new Set(seasons)];
      console.log(uniqueSeasons);
      setSeasons(uniqueSeasons);
    });
  }, []);

  return (
    <SafeAreaView>
      <ImageBackground className='w-full h-full' source={{ uri: seriesInfo?.background }} imageStyle={{ opacity: 0.15 }} resizeMode='cover'>
        <Text className='text-2xl p-4 font-bold' style={{
          color: theme.primary,
        }}>
          {series.name}
        </Text>
        <ScrollView className='h-full mb-16' 
        contentContainerStyle={{ alignItems: 'center' }}
        >
          <View className='flex flex-row items-center justify-between w-10/12 pb-4'>
            <Text style={{ color: theme.text }} className='text-lg'>{seriesInfo?.episodes.length} Episodes</Text>
            <Text style={{ color: theme.primary }} className='text-xl'>•</Text>
            <Text style={{ color: theme.text}} className='text-lg'>TMDb  {series.rating}/10</Text>
            <Text style={{ color: theme.primary }} className='text-xl'>•</Text>
            <Text style={{ color: theme.text }} className='text-lg'>{seriesInfo?.release_date?.split('-')[0]}</Text>
          </View>

          <Text style={{ color: theme.secondary }} className='pb-1 font-extrabold text-xl w-11/12'>Plot</Text>
          <Text style={{ color: theme.text }} className='pb-4 w-11/12'>{seriesInfo?.plot}</Text>
          
          <Text style={{ color: theme.secondary }} className='pb-1 font-extrabold text-xl w-11/12'>Genres</Text>
          <Text style={{ color: theme.text }} className='pb-4 w-11/12'>{seriesInfo?.genre}</Text>

          <Text style={{ color: theme.secondary }} className='pb-1 font-extrabold text-xl w-11/12'>Director</Text>
          <Text style={{ color: theme.text }} className='pb-4 w-11/12'>{seriesInfo?.director}</Text>
          
          <Text style={{ color: theme.secondary }} className='pb-1 font-extrabold text-xl w-11/12'>Cast</Text>
          <Text style={{ color: theme.text }} className='pb-4 w-11/12'>{seriesInfo?.cast}</Text>

        {/* dropdown to select season */}
        <View className='flex flex-row items-center justify-between w-10/12 pb-4'>
          
          <SelectDropdown
            key={new Date().getTime()}
            data={seasons}
            onSelect={(selectedItem, index) => {
              setSelectedSeason(index + 1);
              console.log(selectedItem);
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View className='w-full h-12 justify-center items-center px-3 flex flex-row rounded-lg ' style={{backgroundColor: theme.textColored}}>
                  <Text numberOfLines={1} ellipsizeMode="tail" className='text-lg font-semibold flex-1' style={{color: theme.text}}>
                    Season {selectedSeason} - {seriesInfo?.episodes.filter((episode) => episode.season === selectedSeason).length} Episodes
                  </Text>
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View className='items-center'>
                  <View className='h-12 justify-center items-center px-3 flex flex-row rounded-lg' style={{backgroundColor: theme.card}}>
                    <Text numberOfLines={1} ellipsizeMode="tail" className='text-lg flex-1 font-semibold'>Season {item}</Text>
                  </View>
                  {(index !== seasons.length - 1) && (
                    <View className='h-0.5 w-11/12' style={{backgroundColor: theme.primary}}></View>
                  )}
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={{backgroundColor: theme.card, borderRadius: 8}}
          />
        </View>

          {
          seriesInfo?.episodes.filter((episode) => episode.season === selectedSeason).map((episode, index) => {
            return (
              <TouchableOpacity key={index} className='flex flex-row items-center justify-center w-11/12 p-2'
                onPress={async () => {
                  const videoUrl = await buildURL(MediaType.SERIES, episode.id, episode.extension);
                  globalVars.isPlayer = true;
                  navigation.navigate('Player', { url: videoUrl });
                }}
              >
                {/* View that takes the whole width of the parent with 2 cols, one where it has the background and the other with the info */}
                <View className='flex-row w-11/12 h-20 m-2 ' style={{ backgroundColor: theme.card, borderRadius: 10 }}>
                  <Image source={{ uri: episode.background }} style={{ borderRadius: 10 }} className='h-fit w-20 flex' />
                  <View className='flex flex-col ml-2'>
                    <Text style={{ color: theme.text }} className='text-base'>Season {episode.season} Episode {episode.episode}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: theme.text }} className='text-sm'></Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: theme.text }} className='text-sm'>{episode.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        }
        </ScrollView>
        <View className='bottom-0 mb-3 absolute w-full gap-2 px-2 items-center flex flex-row'>
          <Button
            style={{ backgroundColor: theme.card }}
            className='rounded-lg p-2 w-5/12 flex-1'
            onPress={async () => {
              Linking.openURL(`https://www.themoviedb.org/tv/${seriesInfo?.tmdb_id}`);
            }}>
            <Text style={{ color: theme.primary }}>View on TMDb</Text>
          </Button>
        </View>

      </ImageBackground>
    </SafeAreaView>
  );
}

export default SeriesViewScreen;
