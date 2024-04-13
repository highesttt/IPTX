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
  ToastAndroid,
} from 'react-native';

import { getMaterialYouCurrentTheme, getMaterialYouThemes } from '../utils/theme';
import { retrieveMediaInfo } from '../utils/retrieveInfo';
import { MediaType } from '../utils/MediaType';
import { buildURL } from '../utils/buildUrl';
import { MovieDTO } from '../dto/media/movie.dto';
import { Button } from 'react-native-paper';
import { MovieInfoDTO } from '../dto/media_info/movie_info.dto';
import { globalVars } from '../App';
import { retrieveData, storeData } from '../utils/data';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function MoviesViewScreen({ route, navigation }: any): React.JSX.Element {
  const [movieInfo, setMovieInfo] = useState<MovieInfoDTO>();
  const isDarkMode = useColorScheme() === 'dark';
  const { movie }: { movie: MovieDTO } = route.params;
  const { info }: { info: MovieInfoDTO } = route.params;

  let theme = getMaterialYouCurrentTheme(isDarkMode);

  useEffect(() => {
    if (info) {
      setMovieInfo(info);
      return;
    }
    retrieveMediaInfo(MediaType.MOVIE, movie.stream_id).then((data) => {
      if (data === null) {
        return;
      }
      setMovieInfo(data as MovieInfoDTO);
    });
  }, []);

  return (
    // set the background of the view to "movieInfo.background", add a title, plot and a button to play the movie
    <SafeAreaView>
      <ImageBackground className='w-full h-full' source={{ uri: movieInfo?.background }} imageStyle={{ opacity: 0.15 }} resizeMode='cover'>
        <View className='flex flex-row justify-between'>
          <Text className='text-2xl p-4 font-bold' style={{
            color: theme.primary,
          }}>
            {movieInfo?.name}
          </Text>
          <TouchableOpacity
            className="rounded-full bg-transparent p-2 bottom-0"
            onPress={async () => {
              const bucket = await retrieveData('bucket');
              var currentBucketList = await JSON.parse(bucket || '[]');
              var currentItem = "movie-" + movieInfo?.stream_id;
              if (currentBucketList && currentBucketList.includes(currentItem)) {
                await storeData('bucket', currentBucketList);
                ToastAndroid.show(
                  "Already in Bucket List",
                  ToastAndroid.LONG,
                );
                return;
              };
              currentBucketList = [...currentBucketList, currentItem];
              await storeData('bucket', currentBucketList);
              ToastAndroid.show(
                "Added to Bucket List",
                ToastAndroid.LONG,
              );
            }}
          >
            <MaterialCommunityIcons name={"bucket"} size={40} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView className='h-full mb-12' 
        contentContainerStyle={{ alignItems: 'center' }}
        >
          <View className='flex flex-row items-center justify-between w-10/12 pb-4'>
            <Text style={{ color: theme.text }} className='text-lg'>{movieInfo?.duration}</Text>
            <Text style={{ color: theme.primary }} className='text-xl'>•</Text>
            <Text style={{ color: theme.text}} className='text-lg'>TMDb  {movieInfo?.rating}/10</Text>
            <Text style={{ color: theme.primary }} className='text-xl'>•</Text>
            <Text style={{ color: theme.text }} className='text-lg'>{movieInfo?.release_date?.split('-')[0]}</Text>
          </View>

          <Text style={{ color: theme.secondary }} className='pb-1 font-extrabold text-xl w-11/12'>Plot</Text>
          <Text style={{ color: theme.text }} className='pb-4 w-11/12'>{movieInfo?.plot}</Text>
          
          <Text style={{ color: theme.secondary }} className='pb-1 font-extrabold text-xl w-11/12'>Genres</Text>
          <Text style={{ color: theme.text }} className='pb-4 w-11/12'>{movieInfo?.genre}</Text>

          <Text style={{ color: theme.secondary }} className='pb-1 font-extrabold text-xl w-11/12'>Director</Text>
          <Text style={{ color: theme.text }} className='pb-4 w-11/12'>{movieInfo?.director}</Text>
          
          <Text style={{ color: theme.secondary }} className='pb-1 font-extrabold text-xl w-11/12'>Cast</Text>
          <Text style={{ color: theme.text }} className='pb-4 w-11/12'>{movieInfo?.cast}</Text>

        </ScrollView>
        <View className='bottom-0 mb-3 absolute w-full gap-2 px-2 items-center flex flex-row'>
          <Button
            style={{ backgroundColor: theme.textColored }}
            className='rounded-lg p-2 w-5/12 flex-1'
            onPress={async () => {
              const videoUrl = await buildURL(MediaType.MOVIE, movieInfo?.stream_id || '', movieInfo?.extension || '');
              globalVars.isPlayer = true;
              navigation.push('Player', { url: videoUrl, name: movieInfo?.name });
            }}>
            <Text style={{ color: theme.primary }}>Play</Text>
          </Button>

          <Button
            style={{ backgroundColor: theme.card }}
            className='rounded-lg p-2 w-5/12 flex-1'
            onPress={async () => {
              Linking.openURL(`https://www.themoviedb.org/movie/${movieInfo?.tmdb_id}`);
            }}>
            <Text style={{ color: theme.primary }}>View on TMDb</Text>
          </Button>
        </View>

      </ImageBackground>
    </SafeAreaView>
  );
}

export default MoviesViewScreen;
