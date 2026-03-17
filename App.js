import React from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

// Not: Bu App.js, yerel HTML/CSS/JS dosyalarınızı bir WebView içerisinde görüntüler.
// Expo Go ile açıldığında tam bir mobil uygulama gibi çalışır.

const htmlContent = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>PetFrendly</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Nunito:wght@700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* CSS INLINE */
        ${require('./style.css')}
    </style>
</head>
<body>
    <!-- HTML CONTENT -->
    <div id="app-root">
        <!-- index.html içeriği buraya gelecek şekilde veya WebView üzerinden doğrudan dosya okuyarak yapılabilir. -->
        <!-- Ancak Expo Go için en garantisi dosyaları tek bir HTML stringinde birleştirmektir. -->
    </div>
    <script>
        /* JS INLINE */
        ${require('./script.js')}
    </script>
</body>
</html>
`;

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView 
        originWhitelist={['*']}
        source={{ html: require('./index.html') }} // Not: Bazı Expo sürümlerinde doğrudan dosya require edilebilir
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
});
