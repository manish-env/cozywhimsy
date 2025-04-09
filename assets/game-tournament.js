/**
 * CozyWhimsy Game Tournament
 * A simple game system for running customer engagement tournaments
 */

class GameTournament {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'cozywhimsy_tournament';
    this.apiEndpoint = options.apiEndpoint || '/apps/tournament/api';
    this.gameContainer = document.getElementById(options.gameContainerId || 'game-wrapper');
    this.leaderboardContainer = document.getElementById(options.leaderboardContainerId || 'leaderboard-list');
    this.timerElement = document.getElementById(options.timerElementId || 'timer-value');
    this.scoreElement = document.getElementById(options.scoreElementId || 'game-score');
    this.playerData = {
      name: '',
      email: '',
      registered: false
    };
    
    this.gameState = {
      active: false,
      score: 0,
      highScore: this.getStoredHighScore(),
      endDate: null
    };
    
    this.init();
  }
  
  /**
   * Initialize the tournament system
   */
  init() {
    this.loadTournamentData();
    this.initEventListeners();
    
    // Check if user is already registered
    const storedPlayerData = localStorage.getItem(`${this.storageKey}_player`);
    if (storedPlayerData) {
      try {
        this.playerData = JSON.parse(storedPlayerData);
        
        if (this.playerData.registered) {
          this.showRegisteredState();
        }
      } catch (e) {
        console.error('Error parsing stored player data:', e);
      }
    }
  }
  
  /**
   * Load tournament data from API or fallback to demo data
   */
  loadTournamentData() {
    // In a real implementation, this would fetch data from your tournament API
    // For demo purposes, we'll use hardcoded data
    
    // Set tournament end date (7 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    this.gameState.endDate = endDate;
    
    // Start timer
    this.startTimer();
    
    // Load leaderboard
    this.loadLeaderboard();
  }
  
  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Registration form
    const registrationForm = document.getElementById('tournament-registration');
    if (registrationForm) {
      registrationForm.addEventListener('submit', this.handleRegistration.bind(this));
    }
    
    // Game controls
    const startButton = document.getElementById('game-start');
    const restartButton = document.getElementById('game-restart');
    
    if (startButton) {
      startButton.addEventListener('click', this.startGame.bind(this));
    }
    
    if (restartButton) {
      restartButton.addEventListener('click', this.startGame.bind(this));
    }
    
    // Game canvas
    const gameCanvas = document.getElementById('game-canvas');
    if (gameCanvas) {
      gameCanvas.addEventListener('click', this.handleGameInput.bind(this));
      
      // Add keyboard controls
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && this.gameState.active) {
          this.handleGameInput();
        }
      });
    }
  }
  
  /**
   * Handle registration form submission
   */
  handleRegistration(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('player-name');
    const emailInput = document.getElementById('player-email');
    
    if (!nameInput.value || !emailInput.value) {
      this.showNotification('Please fill in all fields', 'error');
      return;
    }
    
    // Store player data
    this.playerData = {
      name: nameInput.value,
      email: emailInput.value,
      registered: true,
      registeredAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem(`${this.storageKey}_player`, JSON.stringify(this.playerData));
    
    // In a real implementation, you would send this data to your server
    // For demo purposes, we'll just show a success message
    this.showRegisteredState();
    
    // Show notification
    this.showNotification('Registration successful! You can now play the game.', 'success');
    
    // Auto-start the game
    setTimeout(() => {
      const startButton = document.getElementById('game-start');
      if (startButton) {
        startButton.click();
      }
    }, 1000);
  }
  
  /**
   * Show registered state UI
   */
  showRegisteredState() {
    const form = document.getElementById('tournament-registration');
    if (form) {
      form.innerHTML = `
        <div class="registration-success">
          <h3>You're Registered!</h3>
          <p>Welcome, ${this.playerData.name}!</p>
          <p>Play the game to compete for prizes.</p>
          <div class="player-stats">
            <div class="stat-item">
              <span class="stat-label">Your High Score:</span>
              <span class="stat-value">${this.gameState.highScore || 0}</span>
            </div>
          </div>
        </div>
      `;
    }
  }
  
  /**
   * Start the countdown timer
   */
  startTimer() {
    if (!this.gameState.endDate) return;
    
    const updateTimer = () => {
      const now = new Date();
      const distance = this.gameState.endDate - now;
      
      // Time calculations
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Display the result
      if (this.timerElement) {
        this.timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
      
      // If the countdown is over
      if (distance < 0) {
        clearInterval(this.timerInterval);
        if (this.timerElement) {
          this.timerElement.textContent = "Tournament ended";
        }
        
        const statusBadge = document.querySelector('.status-badge');
        if (statusBadge) {
          statusBadge.classList.remove('active');
          statusBadge.classList.add('ended');
          statusBadge.textContent = "Ended";
        }
      }
    };
    
    // Update timer immediately and then every second
    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }
  
  /**
   * Load leaderboard data
   */
  loadLeaderboard() {
    if (!this.leaderboardContainer) return;
    
    // In a real implementation, this would fetch data from your tournament API
    // For demo purposes, we'll use hardcoded data
    setTimeout(() => {
      const demoLeaderboard = [
        { rank: 1, name: "Sarah J.", score: 1250 },
        { rank: 2, name: "Michael T.", score: 1120 },
        { rank: 3, name: "Emma R.", score: 980 },
        { rank: 4, name: "David L.", score: 875 },
        { rank: 5, name: "Olivia P.", score: 820 },
        { rank: 6, name: "James K.", score: 790 },
        { rank: 7, name: "Sophia M.", score: 760 },
        { rank: 8, name: "William B.", score: 730 },
        { rank: 9, name: "Ava G.", score: 710 },
        { rank: 10, name: "Noah S.", score: 690 }
      ];
      
      // Insert player's high score if registered
      if (this.playerData.registered && this.gameState.highScore > 0) {
        // Find where the player would rank
        let playerRank = 1;
        for (let i = 0; i < demoLeaderboard.length; i++) {
          if (this.gameState.highScore < demoLeaderboard[i].score) {
            playerRank++;
          } else {
            break;
          }
        }
        
        // Only show if in top 10
        if (playerRank <= 10) {
          // Remove last entry if needed
          if (demoLeaderboard.length >= 10) {
            demoLeaderboard.pop();
          }
          
          // Add player entry
          demoLeaderboard.splice(playerRank - 1, 0, {
            rank: playerRank,
            name: `${this.playerData.name} (You)`,
            score: this.gameState.highScore
          });
          
          // Update ranks
          for (let i = 0; i < demoLeaderboard.length; i++) {
            demoLeaderboard[i].rank = i + 1;
          }
        }
      }
      
      let leaderboardHTML = '';
      
      demoLeaderboard.forEach(entry => {
        const isPlayer = entry.name.includes('(You)');
        leaderboardHTML += `
          <div class="leaderboard-item ${isPlayer ? 'leaderboard-item-player' : ''}">
            <div class="leaderboard-rank">${entry.rank}</div>
            <div class="leaderboard-name">${entry.name}</div>
            <div class="leaderboard-score">${entry.score}</div>
          </div>
        `;
      });
      
      this.leaderboardContainer.innerHTML = leaderboardHTML;
    }, 1500);
  }
  
  /**
   * Start the game
   */
  startGame() {
    // Reset game state
    this.gameState.score = 0;
    this.gameState.active = true;
    
    if (this.scoreElement) {
      this.scoreElement.textContent = '0';
    }
    
    // Hide start button, show restart button
    const startButton = document.getElementById('game-start');
    const restartButton = document.getElementById('game-restart');
    
    if (startButton) {
      startButton.style.display = 'none';
    }
    
    if (restartButton) {
      restartButton.style.display = 'none';
    }
    
    // Initialize game (this would be implemented in a child class)
    this.initializeGameElements();
    
    // Start game loop
    this.gameLoop();
  }
  
  /**
   * Game loop - to be implemented by specific games
   */
  gameLoop() {
    // This would be implemented in a child class
    // For demo purposes, we'll just increment the score
    if (!this.gameState.active) return;
    
    this.gameState.score++;
    
    if (this.scoreElement) {
      this.scoreElement.textContent = this.gameState.score;
    }
    
    // End game after random time (for demo)
    if (Math.random() < 0.001 || this.gameState.score > 100) {
      this.endGame();
      return;
    }
    
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  /**
   * Initialize game elements - to be implemented by specific games
   */
  initializeGameElements() {
    // This would be implemented in a child class
    console.log('Game initialized');
  }
  
  /**
   * Handle game input (click or spacebar)
   */
  handleGameInput() {
    // This would be implemented in a child class
    console.log('Game input received');
  }
  
  /**
   * End the game
   */
  endGame() {
    this.gameState.active = false;
    
    // Check if high score
    if (this.gameState.score > this.gameState.highScore) {
      this.gameState.highScore = this.gameState.score;
      this.saveHighScore();
      this.showNotification(`New high score: ${this.gameState.highScore}!`, 'success');
    }
    
    // Show restart button
    const restartButton = document.getElementById('game-restart');
    if (restartButton) {
      restartButton.style.display = 'block';
    }
    
    // Update leaderboard
    this.loadLeaderboard();
    
    // Update player stats
    this.showRegisteredState();
  }
  
  /**
   * Save high score to localStorage
   */
  saveHighScore() {
    localStorage.setItem(`${this.storageKey}_highscore`, this.gameState.highScore);
  }
  
  /**
   * Get stored high score from localStorage
   */
  getStoredHighScore() {
    const storedScore = localStorage.getItem(`${this.storageKey}_highscore`);
    return storedScore ? parseInt(storedScore, 10) : 0;
  }
  
  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `game-notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

// FlappyBird-style game implementation
class FlappyGame extends GameTournament {
  constructor(options = {}) {
    super(options);
    
    // Game specific variables
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    
    this.gameConfig = {
      gravity: 0.5,
      jumpStrength: -10,
      gameSpeed: 5,
      obstacleFrequency: 0.02
    };
    
    this.player = {
      x: 50,
      y: this.canvas ? this.canvas.height / 2 : 200,
      width: 30,
      height: 30,
      color: '#ff6b9a',
      vy: 0
    };
    
    this.obstacles = [];
  }
  
  /**
   * Initialize game elements
   */
  initializeGameElements() {
    if (!this.canvas || !this.ctx) return;
    
    // Reset player
    this.player.y = this.canvas.height / 2;
    this.player.vy = 0;
    
    // Clear obstacles
    this.obstacles = [];
    
    // Reset game speed
    this.gameConfig.gameSpeed = 5;
  }
  
  /**
   * Game loop
   */
  gameLoop() {
    if (!this.gameState.active || !this.canvas || !this.ctx) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update player
    this.player.vy += this.gameConfig.gravity;
    this.player.y += this.player.vy;
    
    // Keep player within canvas
    if (this.player.y + this.player.height > this.canvas.height) {
      this.player.y = this.canvas.height - this.player.height;
      this.player.vy = 0;
    }
    
    if (this.player.y < 0) {
      this.player.y = 0;
      this.player.vy = 0;
    }
    
    // Draw player
    this.ctx.fillStyle = this.player.color;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Generate obstacles
    if (Math.random() < this.gameConfig.obstacleFrequency) {
      const height = Math.random() * (this.canvas.height / 2) + 50;
      this.obstacles.push({
        x: this.canvas.width,
        y: this.canvas.height - height,
        width: 30,
        height: height,
        color: '#333',
        passed: false
      });
    }
    
    // Update and draw obstacles
    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].x -= this.gameConfig.gameSpeed;
      
      // Draw obstacle
      this.ctx.fillStyle = this.obstacles[i].color;
      this.ctx.fillRect(
        this.obstacles[i].x, 
        this.obstacles[i].y, 
        this.obstacles[i].width, 
        this.obstacles[i].height
      );
      
      // Check collision
      if (
        this.player.x < this.obstacles[i].x + this.obstacles[i].width &&
        this.player.x + this.player.width > this.obstacles[i].x &&
        this.player.y < this.obstacles[i].y + this.obstacles[i].height &&
        this.player.y + this.player.height > this.obstacles[i].y
      ) {
        this.endGame();
        return;
      }
      
      // Check if obstacle passed
      if (!this.obstacles[i].passed && this.obstacles[i].x + this.obstacles[i].width < this.player.x) {
        this.obstacles[i].passed = true;
        
        // Increase score
        this.gameState.score++;
        if (this.scoreElement) {
          this.scoreElement.textContent = this.gameState.score;
        }
        
        // Increase game speed
        if (this.gameState.score % 5 === 0) {
          this.gameConfig.gameSpeed += 0.5;
        }
      }
      
      // Remove obstacles that are off screen
      if (this.obstacles[i].x + this.obstacles[i].width < 0) {
        this.obstacles.splice(i, 1);
        i--;
      }
    }
    
    // Continue game loop
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  
  /**
   * Handle game input (jump)
   */
  handleGameInput() {
    if (this.gameState.active) {
      this.player.vy = this.gameConfig.jumpStrength;
    }
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Hide loading element
  const loadingElement = document.getElementById('game-loading');
  if (loadingElement) {
    setTimeout(() => {
      loadingElement.style.display = 'none';
    }, 1500);
  }
  
  // Initialize the game
  window.game = new FlappyGame();
  
  // Add game notification styles
  const style = document.createElement('style');
  style.textContent = `
    .game-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      background-color: #333;
      color: white;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      transform: translateX(120%);
      transition: transform 0.3s ease;
    }
    
    .game-notification.show {
      transform: translateX(0);
    }
    
    .game-notification.success {
      background-color: #4CAF50;
    }
    
    .game-notification.error {
      background-color: #F44336;
    }
    
    .game-notification.info {
      background-color: #2196F3;
    }
    
    .leaderboard-item-player {
      background-color: rgba(255, 107, 154, 0.1);
      font-weight: bold;
    }
    
    .player-stats {
      margin-top: 15px;
      padding: 10px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }
    
    .stat-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-weight: 500;
    }
    
    .stat-value {
      font-weight: 700;
      color: #ff6b9a;
    }
  `;
  document.head.appendChild(style);
});
