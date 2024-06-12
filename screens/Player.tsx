import { DimensionValue, PanResponder, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { getMaterialYouCurrentTheme } from "../utils/theme";
import Video, {SelectedTrackType, VideoRef } from "react-native-video";
import { useEffect, useRef, useState } from "react";
import { AudioTrackDTO } from "../dto/audioTrack.dto";
import { SubtitleTrackDTO } from "../dto/subtitleTrack.dto";
import { globalVars } from '../App';
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatTime } from "../utils/formatTime";
import { Slider } from "@rneui/base";
import { getLanguageName } from "../utils/languages";

function PlayerScreen({route, navigation}: any) {

  const [controls, setControls] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const {url} = route.params;
  const {name} = route.params;

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

  let theme = getMaterialYouCurrentTheme(isDarkMode);

  const [volume, setVolume] = useState(0.1);

  navigation.addListener('beforeRemove', (e: any) => {
    globalVars.isPlayer = false;
  });

  useEffect(() => {
    if (player) {
      player.seek(seek);
    }
  }, [seek]);

  useEffect(() => {
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
        <View className="justify-center items-center rounded-lg p-4" style={{backgroundColor: theme.background}}>
          <View className="flex flex-row justify-between items-center pb-4">
            <Text style={{ color: theme.primary }} className="text-lg font-bold">Select an Audio Track</Text>
            <TouchableOpacity
              onPress={() => {
                setPopupOpened(0);
              }}
              className="rounded-full bg-transparent pl-4 bottom-0"
            >
              <MaterialCommunityIcons name={"close"} size={25} color={theme.icon} />
            </TouchableOpacity>
          </View>
          {options.map((option: AudioTrackDTO) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  selectAudioTrack(option.id);
                  setPopupOpened(0);
                }}
                key={option.id}
                className="rounded-lg p-2 w-full text-center m-1"
                style={{backgroundColor: option.id == selectedTrack ? theme.secondary : theme.card}}
              >
                <Text
                  style={{color: theme.text}}
                >{option.title} - {getLanguageName(option.language)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    )
  };

  const openSubtitlePopup = (options: SubtitleTrackDTO[]) => {
    const subtitleTrack = subtitles.find((sub: SubtitleTrackDTO) => sub.selected === true);
    const selectedTrack = selectedTextTrack == null ? subtitleTrack?.id : selectedTextTrack.id;

    return (
      <View className={'h-full z-10 flex-col items-center justify-center w-full bg-black/50 '}>
        <View className="justify-center items-center rounded-lg p-4" style={{backgroundColor: theme.background}}>
          <View className="flex flex-row justify-between items-center pb-4">
            <Text style={{ color: theme.primary }} className="text-lg font-bold">Select Subtitles</Text>
            <TouchableOpacity
              onPress={() => {
                setPopupOpened(0);
              }}
              className="rounded-full bg-transparent pl-4 bottom-0"
            >
              <MaterialCommunityIcons name={"close"} size={25} color={theme.icon} />
            </TouchableOpacity>
          </View>
          {options.map((option: SubtitleTrackDTO) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (selectedTextTrack && selectedTextTrack.id === option.id) {
                    setSelectedTextTrack(null);
                    setPopupOpened(0);
                    return;
                  }
                  selectTextTrack(option.id);
                  setPopupOpened(0);
                }}
                key={option.id}
                className="rounded-lg p-2 w-5/12 text-center m-1"
                style={{backgroundColor: option.id == selectedTrack ? theme.secondary : theme.card}}
              >
                <Text>{option.title} - {getLanguageName(option.language)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
                <View className="flex flex-row align-middle text-center items-center">
                  <TouchableOpacity
                    onPress={() => {
                      navigation.goBack();
                    }}
                    className="rounded-full bg-transparent p-2 bottom-0"
                  >
                    <MaterialCommunityIcons name={"chevron-left"} size={40} color={theme.primary} />
                  </TouchableOpacity>
                  <Text style={{ color: theme.primary }} className="text-lg font-bold items-start">
                    {name}
                  </Text>
                </View>
                <View className="flex flex-row">
                  {audioTracks.length > 1 ?
                    <TouchableOpacity
                      className="rounded-full bg-transparent p-2 bottom-0"
                      onPress={() => {
                        if (popupOpened == 1)
                          setPopupOpened(0);
                        else {
                          const track: AudioTrackDTO = (audioTracks.find((audioTrack) => audioTrack.id === selectedAudioTrack?.id) || audioTracks.find((audioTrack) => audioTrack.selected === true)) as AudioTrackDTO;
                          selectAudioTrack(track.id);
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
                  : null}
                  {subtitles.length > 0 ?
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
                  : null}
                </View>
              </View>
            </View>
            <View className="justify-end flex flex-col h-1/4 items-end">
              <View className="flex gap-2 items-center">
                <MaterialCommunityIcons name={volume == 0.2 ?
                                              "volume-mute" :
                                                volume <= 0.1 ? "volume-high" :
                                              "volume-medium"
                                            } color={theme.primary} size={24} />
                <Slider
                  key="volumeSlider"
                  value={volume}
                  maximumValue={0.2}
                  step={0.005}
                  onValueChange={(volume) => {
                    setVolume(volume)
                  }}
                  orientation="vertical"
                  allowTouchTrack={true}
                  thumbTintColor={theme.primary}
                  minimumTrackTintColor={theme.text}
                  maximumTrackTintColor={theme.secondary}
                  thumbStyle={{ width: 15, height: 15, borderRadius: 15 }}
                  style={{ height: "80%" }}
                />
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
            <Slider
              key={duration}
              value={position}
              maximumValue={duration}
              allowTouchTrack={true}
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
            setSelectedAudioTrack(audioTrack);
          }}
          onPlaybackRateChange={(data: any) => {
            setPlayBackRate(data.playbackRate);
          }}
          onProgress={(data: any) => {
            setPosition(data.currentTime);
            setDuration(data.seekableDuration < 0 ? 0 : data.seekableDuration);
          }}
          selectedAudioTrack={{
            type: selectedAudioTrack ? SelectedTrackType.TITLE : SelectedTrackType.DISABLED,
            value: selectedAudioTrack ? selectedAudioTrack.title : 0
          }}
          selectedTextTrack={{
            type: selectedTextTrack ? SelectedTrackType.TITLE : SelectedTrackType.DISABLED,
            value: selectedTextTrack ? selectedTextTrack.title : 0
          }}
          volume={0.2 - volume}
        />
        {/* <Text style={{ position: 'absolute', top: 20, left: 20, color: 'white' }}>
            Brightness: {brightness.toFixed(2)}
        </Text>
        <Text style={{ position: 'absolute', top: 50, left: 20, color: 'white' }}>
            Volume: {volume.toFixed(2)}
        </Text> */}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

PlayerScreen.navigationOptions = {
  tabBarVisible: false,
  headerShown: false,
};
export default PlayerScreen;