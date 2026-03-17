import React from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar, View } from 'react-native';
import { WebView } from 'react-native-webview';

// PetFrendly - Expo Wrapper
// Bu dosya yerel HTML/CSS/JS kodlarını WebView içerisinde çalıştırır.

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
        ${require('./style.css')}
        
        /* Mobil WebView Düzeltmeleri */
        body {
            background: #fdfbfb !important;
            height: 100vh;
            width: 100vw;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .app-wrapper {
            max-width: none !important;
            max-height: none !important;
            width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
            box-shadow: none !important;
        }
    </style>
</head>
<body>
    <div id="app-container" class="app-wrapper">
        <!-- Welcome Screen -->
        <div id="selection-screen" class="screen full-screen active">
            <div class="glass-panel selection-panel text-center">
                <h1 class="welcome-title text-center">Petin</h1>
                <p class="subtitle text-muted text-center mb-4">En iyi arkadaşını seç!</p>
                <div class="pet-grid icon-only-grid mb-4" id="pet-selection-grid"></div>
                <button id="selection-continue-btn" class="primary-btn w-100" disabled>Devam Et</button>
            </div>
        </div>

        <!-- Naming Screen -->
        <div id="naming-screen" class="screen full-screen hidden">
            <div class="glass-panel selection-panel text-center scale-in-center">
                <div class="selected-pet-preview mb-4" id="naming-pet-preview">🐱</div>
                <h2 class="title-medium mb-2">Petine İsim Ver</h2>
                <p class="subtitle text-muted mb-4">Yeni arkadaşına bir isim ver!</p>
                <input type="text" id="pet-name-input" class="modern-input mb-4" placeholder="İsim girin..." maxlength="12">
                <button id="confirm-name-btn" class="primary-btn w-100">Maceraya Başla!</button>
            </div>
        </div>

        <!-- Main Game Screen -->
        <div id="main-screen" class="screen main-layout hidden">
            <header class="header">
                <div class="pet-info">
                    <h1 class="pet-name" id="display-pet-name">Luna</h1>
                    <p class="pet-type" id="display-pet-type">Cat</p>
                </div>
                <div class="level-badge" id="level-badge">
                    <span id="level-text">Seviye 1</span>
                </div>
            </header>

            <section class="stats-container">
                <div class="stat-row">
                    <div class="stat-label"><i class="fa-solid fa-utensils text-pink"></i> <span>Açlık</span></div>
                    <div class="progress-bar-bg"><div id="hunger-bar" class="progress-bar-fill bg-pink" style="width: 50%;"></div></div>
                </div>
                <div class="stat-row">
                    <div class="stat-label"><i class="fa-solid fa-face-smile text-purple"></i> <span>Mutluluk</span></div>
                    <div class="progress-bar-bg"><div id="happiness-bar" class="progress-bar-fill bg-purple" style="width: 80%;"></div></div>
                </div>
                <div class="stat-row xp-row mt-2">
                    <div class="stat-label"><i class="fa-solid fa-star text-yellow"></i> <span>TP</span> <span id="xp-text" class="xp-value">0 / 500</span></div>
                    <div class="progress-bar-bg xp-bg"><div id="xp-bar" class="progress-bar-fill bg-yellow" style="width: 0%;"></div></div>
                </div>
            </section>

            <main class="pet-stage" id="pet-stage">
                <div class="pet-wrapper" id="pet"><div class="pet-emoji" id="pet-image">🐱</div></div>
                <div id="animation-layer"></div>
            </main>

            <div id="food-tray" class="food-tray hidden">
                <p class="tray-text">Beslemek için yemeği sürükle!</p>
                <div class="food-item-container">
                    <div class="food-item" id="draggable-food" draggable="true"><span id="food-emoji">🐟</span></div>
                </div>
            </div>

            <footer class="actions">
                <button class="action-btn feed-btn" id="feed-toggle-btn">
                    <div class="icon-wrapper bg-pink-gradient"><i class="fa-solid fa-bowl-food"></i></div>
                    <span>Besle</span>
                </button>
                <button class="action-btn play-btn" id="play-menu-btn">
                    <div class="icon-wrapper bg-purple-gradient"><i class="fa-solid fa-gamepad"></i></div>
                    <span>Oyna</span>
                </button>
            </footer>
        </div>

        <!-- Modals and Game Containers -->
        <div id="games-modal" class="modal hidden">
            <div class="modal-overlay" id="games-modal-bg"></div>
            <div class="modal-content glass-panel">
                <button class="close-btn" id="close-games-btn"><i class="fa-solid fa-xmark"></i></button>
                <h2 class="title-medium mb-4 text-center">Mini Oyunlar</h2>
                <div class="games-list">
                    <button class="game-card" data-game="maze">
                        <div class="game-icon-bg bg-blue-light"><i class="fa-solid fa-route text-blue"></i></div>
                        <div class="game-card-text"><h3>Labirent Koşucusu</h3><p>Çıkışı bul!</p></div>
                    </button>
                    <button class="game-card" data-game="tower">
                        <div class="game-icon-bg bg-orange-light"><i class="fa-solid fa-layer-group text-orange"></i></div>
                        <div class="game-card-text"><h3>Kule Yığma</h3><p>Blokları üst üste diz!</p></div>
                    </button>
                    <button class="game-card" data-game="puzzle">
                        <div class="game-icon-bg bg-green-light"><i class="fa-solid fa-puzzle-piece text-green"></i></div>
                        <div class="game-card-text"><h3>Evcil Hayvan Yapbozu</h3><p>Parçaları sürükle ve eşleştir!</p></div>
                    </button>
                </div>
            </div>
        </div>

        <div id="minigame-container" class="screen full-screen hidden bg-gradient-dark">
            <header class="game-header">
                <h2 id="minigame-title" class="text-white">Oyun</h2>
                <button id="exit-game-btn" class="close-btn text-white"><i class="fa-solid fa-xmark"></i></button>
            </header>
            <div id="game-area" class="game-area text-white">
                <div id="game-instructions" class="text-center mt-xl">
                    <p class="mb-4">Hazır ol!</p>
                    <button id="start-game-btn" class="primary-btn">Başla</button>
                </div>
                <canvas id="game-canvas" class="hidden"></canvas>
                <div id="maze-controls" class="controls-overlay hidden">
                    <button class="ctrl-btn up" data-dir="up"><i class="fa-solid fa-chevron-up"></i></button>
                    <div class="mid-ctrl">
                        <button class="ctrl-btn left" data-dir="left"><i class="fa-solid fa-chevron-left"></i></button>
                        <button class="ctrl-btn right" data-dir="right"><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                    <button class="ctrl-btn down" data-dir="down"><i class="fa-solid fa-chevron-down"></i></button>
                </div>
                <div id="puzzle-area" class="puzzle-wrapper hidden">
                    <div id="puzzle-preview-container">
                        <div id="puzzle-preview-overlay"></div>
                        <button id="puzzle-start-btn" class="primary-btn">Başla</button>
                    </div>
                    <div id="puzzle-grid-container" class="hidden">
                        <div id="puzzle-grid" class="puzzle-slots"></div>
                        <div id="puzzle-pieces" class="puzzle-bench"></div>
                        <div class="puzzle-actions mt-4">
                            <button id="puzzle-restart-btn" class="secondary-btn">Yeniden Başlat</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="game-result-overlay hidden" id="game-over-overlay">
                <div class="glass-panel text-center result-panel">
                    <h3 class="title-large text-gradient-purple">Oyun Bitti!</h3>
                    <p class="score-text mt-2">Puan: <span id="game-score-value">0</span></p>
                    <p class="points-text text-green mt-1">+<span id="game-points-earned">0</span> TP</p>
                    <div class="result-actions mt-4">
                        <button id="game-claim-btn" class="primary-btn w-100">Ödülü Al</button>
                        <button id="game-retry-btn" class="secondary-btn w-100 mt-2">Tekrar Dene</button>
                    </div>
                </div>
            </div>
        </div>
        <canvas id="confetti-canvas" class="confetti-layer"></canvas>
        <div id="level-up-modal" class="modal hidden"><div class="modal-overlay"></div><div class="modal-content glass-panel text-center scale-in-center"><div class="level-up-icon">🎉</div><h2 class="title-large text-gradient-orange mb-2">Seviye Atladın!</h2><p class="text-muted mb-4">Seviye <span id="new-level-display">2</span> oldun!</p><button id="close-level-up-btn" class="primary-btn w-100">Harika!</button></div></div>
    </div>

    <script>
        ${require('./script.js')}
    </script>
</body>
</html>
`;

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <WebView 
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          scrollEnabled={false}
          bounces={false}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfbfb',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
});
