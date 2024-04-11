import { DimensionValue, Text, TouchableOpacity, TouchableWithoutFeedback, View, useColorScheme, useWindowDimensions } from "react-native";
import { getMaterialYouCurrentTheme } from "../utils/theme";
import Video, { SelectedTrackType, VideoRef } from "react-native-video";
import { useEffect, useState } from "react";
import { AudioTrackDTO } from "../dto/audioTrack.dto";
import { SubtitleTrackDTO } from "../dto/subtitleTrack.dto";
import { globalVars } from '../App';
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatTime } from "../utils/formatTime";
import { Slider } from "react-native-elements";

function PlayerScreen({route, navigation}: any) {

  const [controls, setControls] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));  // Initial value for opacity: 1
  const {url} = route.params;

  const [audioTracks, setAudioTracks] = useState<AudioTrackDTO[]>([]);
  const [subtitles, setSubtitles] = useState<SubtitleTrackDTO[]>([]);
  const [playBackRate, setPlayBackRate] = useState<number>(1);
  const [position, setPosition] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [percentage, setPercentage] = useState<DimensionValue>('0%');
  const [seek, setSeek] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<number>(0);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<AudioTrackDTO | null>(null);
  const [selectedTextTrack, setSelectedTextTrack] = useState<SubtitleTrackDTO | null>(null);
  const [popupOpened, setPopupOpened] = useState<number>(0);

  var player: VideoRef | null = null;

  const isDarkMode = useColorScheme() === 'dark';
  const theme = getMaterialYouCurrentTheme(isDarkMode);

  // when the user presses the back button on android
  navigation.addListener('beforeRemove', (e: any) => {
    globalVars.isPlayer = false;
  });

  useEffect(() => {
    if (player) {
      player.seek(seek);
    }
  }, [seek]);

  useEffect(() => {
    console.log(isSeeking);
    return () => {
      if (player && isSeeking != 0) {
        player.pause();
      }
    }
  }, [isSeeking]);


  const handleItemClick = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setControls(true);
    });
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setControls(false);
      });
    }, 2500);
    setTimeoutId(id);
  };


  const handleScreenClick = () => {
    if (controls) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setControls(false);
      });
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setControls(true);
      });
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const id = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(() => {
          setControls(false);
        });
      }, 2500);
      setTimeoutId(id);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);


  useEffect(() => {
    // when the position changes
    const percent = (position / duration * 100).toFixed(2) + '%';
    setPercentage(percent as DimensionValue);
  }, [position, duration]);

  const selectAudioTrack = (index: number) => {
    const audioTrack = audioTracks.find((audioTrack) => audioTrack.id === index);
    setSelectedAudioTrack(audioTrack || null);
  };
  const selectTextTrack = (index: number) => {
    const subtitleTrack = subtitles.find((sub: SubtitleTrackDTO) => sub.id === index);
    setSelectedTextTrack(subtitleTrack || null);
  };


  const openAudioPopup = (options: AudioTrackDTO[]) => {
    const audioTrack = audioTracks.find((audioTrack: AudioTrackDTO) => audioTrack.selected === true);
    const selectedTrack = selectedAudioTrack == null ? audioTrack?.id : selectedAudioTrack.id;

    return (
      <View className={'h-full z-10 flex-col items-center justify-center w-full bg-black/50 '}>
        {options.map((option: AudioTrackDTO) => {
          return (
            <TouchableOpacity
              onPress={() => {
                selectAudioTrack(option.id);
                setPopupOpened(0);
              }}
              key={option.id}
              className="rounded-lg p-2 w-5/12 text-center m-1"
              style={{backgroundColor: theme.card}}
            >
              <Text>{option.title} - {option.language} - {(option.id == selectedTrack).toString()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    )
  };

  const openSubtitlePopup = (options: SubtitleTrackDTO[]) => {
    const subtitleTrack = subtitles.find((sub: SubtitleTrackDTO) => sub.selected === true);
    const selectedTrack = selectedTextTrack == null ? subtitleTrack?.id : selectedTextTrack.id;

    return (
      <View className={'h-full z-10 flex-col items-center justify-center w-full bg-black/50 '}>
        {options.map((option: SubtitleTrackDTO) => {
          return (
            <TouchableOpacity
              onPress={() => {
                selectTextTrack(option.id);
                setPopupOpened(0);
              }}
              key={option.id}
              className="rounded-lg p-2 w-5/12 text-center m-1"
              style={{backgroundColor: theme.card}}
            >
              <Text>{option.title} - {option.language} - {(option.id == selectedTrack).toString()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    )
  };

  return (
    <SafeAreaView style={{backgroundColor: '#000000'}}>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          backgroundColor: '#000000',
          width: "100%",
          height: "100%",
        }}
        onPress={() => {
          handleScreenClick();
        }}
        
      >
        {popupOpened == 1 ?
          <View className={'h-full absolute z-10 flex-1 flex-col items-center justify-center w-full bg-black/50 ' + (popupOpened == 1 ? '' : 'pointer-events-none')}>
            {openAudioPopup(audioTracks)}
          </View>
          : popupOpened == 2 ?
          <View className={'h-full absolute z-10 flex-1 flex-col items-center justify-center w-full bg-black/50 ' + (popupOpened == 2 ? '' : 'pointer-events-none')}>
            {openSubtitlePopup(subtitles)}
          </View>
          : null
          
        }
          <Animated.View 
            style={{
              opacity: fadeAnim,
            }}
            className={'h-full absolute z-10 flex-1 flex-col justify-between items-stretch w-full bg-black/50 ' + (controls ? '' : 'pointer-events-none')}
          >
            <View>
              <View className="flex flex-row justify-between">
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                  className="rounded-full bg-transparent p-2 bottom-0"
                >
                  <MaterialCommunityIcons name={"chevron-left"} size={40} color={theme.primary} />
                </TouchableOpacity>
                <View className="flex flex-row">
                  <TouchableOpacity
                    className="rounded-full bg-transparent p-2 bottom-0"
                    onPress={() => {
                      if (popupOpened == 1)
                        setPopupOpened(0);
                      else {
                        setPopupOpened(1);
                        Animated.timing(fadeAnim, {
                          toValue: 0,
                          duration: 100,
                          useNativeDriver: true,
                        }).start(() => {
                          setControls(false);
                        });
                      }
                    }}
                  >
                    <MaterialCommunityIcons name={"translate"} size={40} color={theme.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="rounded-full bg-transparent p-2 bottom-0"
                    onPress={() => {
                      if (popupOpened == 2)
                        setPopupOpened(0);
                      else {
                        setPopupOpened(2);
                        Animated.timing(fadeAnim, {
                          toValue: 0,
                          duration: 100,
                          useNativeDriver: true,
                        }).start(() => {
                          setControls(false);
                        });
                      }
                    }}
                  >
                    <MaterialCommunityIcons name={"subtitles"} size={40} color={theme.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className="items-center">
              <View className="flex flex-row">
                <TouchableOpacity
                  onPress={() => {
                    if (!player) return;
                    player.seek(position - 10);
                    handleItemClick();
                  }}
                  className="rounded-full bg-transparent p-2 bottom-0"
                >
                  <MaterialCommunityIcons name="rewind-10" size={40} color={theme.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!player) return;

                    if (playBackRate > 0) {
                      player.pause();
                    } else {
                      player.resume();
                    }
                    handleItemClick();
                  }}
                  className="rounded-full bg-transparent p-2 bottom-0"
                >
                  <MaterialCommunityIcons name={playBackRate > 0 ? "pause" : "play"} size={40} color={theme.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!player) return;
                    player.seek(position + 10);
                    handleItemClick();
                  }}
                  className="rounded-full bg-transparent p-2 bottom-0"
                >
                  <MaterialCommunityIcons name="fast-forward-10" size={40} color={theme.primary} />
                </TouchableOpacity>
              </View>
            {/* make the seek bar */}
            <Slider
              key={duration}
              value={position}
              maximumValue={duration}
              onSlidingComplete={
                (value) => {
                  setSeek(value);
                  setIsSeeking(0);
                }
              }
              onValueChange={(position) => {
                setPosition(position);
                handleItemClick();
              }}
              onSlidingStart={
                (value) => {
                  setIsSeeking(value);
                }}
              thumbTintColor={theme.primary}
              minimumTrackTintColor={theme.secondary}
              maximumTrackTintColor={theme.text}
              thumbStyle={{ width: 30, height: 30, borderRadius: 15 }}
              style={{ width: "91.6667%" }}

            />
            <View className="flex flex-row justify-between items-stretch w-full p-2">
              <Text style={{ color: theme.primary }} className="text-lg">{formatTime(position)}</Text>
              <Text style={{ color: theme.primary }} className="text-lg">{formatTime(duration)}</Text>
            </View>
            </View>
          </Animated.View>
        <Video
          source={{ uri: url }}
          ref={(ref) => {
            player = ref;
          }}
          fullscreenAutorotate={true}
          fullscreen={true}
          controls={false}
          resizeMode="contain"
          style={{ width: "100%", height: "100%" }}
          onLoad={(data: any) => {
            const audioTracks = data.audioTracks;
            var subtitles = data.textTracks;
            setSubtitles(subtitles.map((sub: any) => {
              return new SubtitleTrackDTO(sub);
            }));
            setAudioTracks(audioTracks.map((audio: any) => {
              return new AudioTrackDTO(audio);
            }));
            const audioTrack = audioTracks.find((audioTrack: AudioTrackDTO) => audioTrack.selected === true);
            console.log(audioTrack);
            setSelectedAudioTrack(audioTrack);
            console.log(subtitles);
          }}
          onPlaybackRateChange={(data: any) => {
            setPlayBackRate(data.playbackRate);
          }}
          onProgress={(data: any) => {
            setPosition(data.currentTime);
            setDuration(data.seekableDuration);
          }}
          selectedAudioTrack={{
            type: selectedAudioTrack ? SelectedTrackType.TITLE : SelectedTrackType.DISABLED,
            value: selectedAudioTrack ? selectedAudioTrack.title : 0
          }}
          selectedTextTrack={{
            type: selectedTextTrack ? SelectedTrackType.TITLE : SelectedTrackType.DISABLED,
            value: selectedTextTrack ? selectedTextTrack.title : 0
          }}
          onTextTracks={(data: any) => {
            console.log(data);
          }}

          // selectedAudioTrack={{
          //   type: SelectedTrackType.TITLE,
          //   value: 2
          // }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
  
}

PlayerScreen.navigationOptions = {
  tabBarVisible: false, // Hide the tab bar
  headerShown: false, // Hide the header
};
export default PlayerScreen;