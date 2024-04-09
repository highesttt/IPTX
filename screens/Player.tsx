import { View, useColorScheme } from "react-native";
import { getMaterialYouCurrentTheme } from "../utils/theme";
import Video from "react-native-video";
import { useState } from "react";
import { AudioTrackDTO } from "../dto/audioTrack.dto";
import { SubtitleTrackDTO } from "../dto/subtitleTrack.dto";
import { globalVars } from '../App';

function PlayerScreen({route, navigation}: any) {

  const [AudioTracks, setAudioTracks] = useState<AudioTrackDTO[]>([]);
  const [Subtitles, setSubtitles] = useState<SubtitleTrackDTO[]>([]);
  const {url} = route.params;
  var player: any = null;

  const isDarkMode = useColorScheme() === 'dark';
  const theme = getMaterialYouCurrentTheme(isDarkMode);

  // when the user presses the back button on android
  navigation.addListener('beforeRemove', (e: any) => {
    globalVars.isPlayer = false;
  });

  return (
    <View className="">
      <Video
        source={{ uri: url }}
        ref={(ref) => {
          player = ref;
        }}
        fullscreenAutorotate={true}
        fullscreen={true}
        controls
        resizeMode="contain"
        style={{ width: "100%", height: "100%" }}
        onLoad={(data) => {
          const audioTracks = data.audioTracks;
          var subtitles = data.textTracks;
          setSubtitles(subtitles.map((sub) => {
            return new SubtitleTrackDTO(sub);
          }));
          setAudioTracks(audioTracks.map((audio) => {
            return new AudioTrackDTO(audio);
          }));
        }}
        // selectedAudioTrack={{
        //   type: SelectedTrackType.TITLE,
        //   value: 2
        // }}
      />
    </View>
  );
  
}

PlayerScreen.navigationOptions = {
  tabBarVisible: false, // Hide the tab bar
  headerShown: false, // Hide the header
};
export default PlayerScreen;