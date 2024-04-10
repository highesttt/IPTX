import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  useColorScheme,
  View,
  ImageBackground,
  Linking,
} from 'react-native';

import { getMaterialYouCurrentTheme } from '../utils/theme';
import { retrieveMediaInfo } from '../utils/retrieveInfo';
import { MediaType } from '../utils/MediaType';
import { Button } from 'react-native-paper';
import { SeriesDTO } from '../dto/media/series.dto';
import { SeriesInfoDTO } from '../dto/media_info/series_info.dto';

function SeriesViewScreen({ route, navigation }: any): React.JSX.Element {
  const [seriesInfo, setSeriesInfo] = useState<SeriesInfoDTO>();
  const isDarkMode = useColorScheme() === 'dark';
  const { series }: { series: SeriesDTO } = route.params;

  const theme = getMaterialYouCurrentTheme(isDarkMode);

  useEffect(() => {
    retrieveMediaInfo(MediaType.SERIES, series.stream_id).then((data) => {
      if (data === null) {
        return;
      }
      setSeriesInfo(data as SeriesInfoDTO);
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
        <View className='h-full items-center'>

          <View className='flex flex-row items-center justify-between w-10/12 pb-4'>
            <Text style={{ color: theme.text }} className='text-lg'>{seriesInfo?.episodes.length} Episodes</Text>
            <Text style={{ color: theme.primary }} className='text-xl'>•</Text>
            <Text style={{ color: theme.text}} className='text-lg'>TMDb  {series.rating}/10</Text>
            <Text style={{ color: theme.primary }} className='text-xl'>•</Text>
            <Text style={{ color: theme.text }} className='text-lg'>{seriesInfo?.release_date.split('-')[0]}</Text>
          </View>

          <Text style={{ color: theme.secondary }} className='pb-1 font-extrabold text-xl w-11/12'>Plot</Text>
          <Text style={{ color: theme.text }} className='pb-4 w-11/12'>{seriesInfo?.plot}</Text>
          
          <Text style={{ color: theme.secondary }} className='pb-1 font-extrabold text-xl w-11/12'>Genres</Text>
          <Text style={{ color: theme.text }} className='pb-4 w-11/12'>{seriesInfo?.genre}</Text>

          <Text style={{ color: theme.secondary }} className='pb-1 font-extrabold text-xl w-11/12'>Director</Text>
          <Text style={{ color: theme.text }} className='pb-4 w-11/12'>{seriesInfo?.director}</Text>
          
          <Text style={{ color: theme.secondary }} className='pb-1 font-extrabold text-xl w-11/12'>Cast</Text>
          <Text style={{ color: theme.text }} className='pb-4 w-11/12'>{seriesInfo?.cast}</Text>

        </View>
        <View className='bottom-0 absolute w-full gap-2 px-2 items-center flex flex-row'>
          <Button
            style={{ backgroundColor: theme.textColored }}
            className='rounded-lg p-2 w-5/12 flex-1'>
            <Text style={{ color: theme.primary }}>Play</Text>
          </Button>

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
