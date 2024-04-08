import { useColorScheme } from 'react-native';
import MaterialYou from 'react-native-material-you-colors';
import type { MaterialYouPalette } from 'react-native-material-you-colors';

const fallbackSeedColor = '#00ffc8';
const palette = MaterialYou.getMaterialYouPalette(fallbackSeedColor);

function generateTheme(palette: MaterialYouPalette) {
  const light = {
    isDark: false,
    primary: palette.system_accent1[7], // shade 500
    text: palette.system_accent1[9], // shade 700
    textColored: palette.system_accent1[2], // shade 50
    background: palette.system_neutral1[1], // shade 10
    card: palette.system_accent2[2], // shade 50
    icon: palette.system_accent1[10], // shade 800
    secondary: palette.system_accent1[5], // shade 300
  };
  const dark: typeof light = {
    isDark: true,
    primary: palette.system_accent1[4], // shade 200
    text: palette.system_accent1[3], // shade 100
    textColored: palette.system_accent1[9], // shade 700
    background: palette.system_neutral1[11], // shade 900
    card: palette.system_accent2[10], // shade 800
    icon: palette.system_accent1[3], // shade 100
    secondary: palette.system_accent1[6], // shade 400
  };
  return { light, dark };
}

export const getMaterialYouThemes = () => {
  const theme = generateTheme(palette);
  return theme;
}

export const getMaterialYouCurrentTheme = (isDarkMode: boolean) => {
  const styles = generateTheme(palette);
  
  const style = {
    background: isDarkMode ? styles.dark.background : styles.light.background,
    primary: isDarkMode ? styles.dark.primary : styles.light.primary,
    text: isDarkMode ? styles.dark.text : styles.light.text,
    textColored: isDarkMode ? styles.dark.textColored : styles.light.textColored,
    card: isDarkMode ? styles.dark.card : styles.light.card,
    icon: isDarkMode ? styles.dark.icon : styles.light.icon,
    secondary: isDarkMode ? styles.dark.secondary : styles.light.secondary,
  };

  return style;
}