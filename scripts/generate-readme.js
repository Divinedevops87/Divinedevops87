const axios = require('axios');
const moment = require('moment');

class DynamicReadmeGenerator {
  constructor() {
    this.username = process.env.GITHUB_USERNAME || 'Divinedevops87';
    this.token = process.env.GITHUB_TOKEN;
    this.currentTime = moment();
    
    // Dynamic emoji sets based on time and context
    this.emojiSets = {
      morning: ['🌅', '☕', '🌞', '🌱', '💫'],
      afternoon: ['🌞', '💻', '🚀', '⭐', '🔥'],
      evening: ['🌙', '✨', '🌟', '💫', '🌃'],
      night: ['🌙', '💤', '⭐', '🌟', '✨'],
      weekend: ['🎉', '🎊', '🌈', '🦄', '🎈'],
      coding: ['💻', '⚡', '🔥', '🚀', '💫'],
      spiritual: ['🙏', '✨', '👌', '😍', '💯']
    };
    
    // Color schemes that adapt to activity
    this.colorSchemes = {
      active: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      moderate: ['#74B9FF', '#A29BFE', '#6C5CE7', '#FD79A8'],
      low: ['#636E72', '#B2BEC3', '#DDD', '#EEE']
    };
  }

  // Get current emoji based on time and context
  getCurrentEmoji() {
    const hour = this.currentTime.hour();
    const isWeekend = this.currentTime.day() === 0 || this.currentTime.day() === 6;
    
    let emojiSet = 'coding';
    
    if (isWeekend) {
      emojiSet = 'weekend';
    } else if (hour >= 5 && hour < 12) {
      emojiSet = 'morning';
    } else if (hour >= 12 && hour < 18) {
      emojiSet = 'afternoon';
    } else if (hour >= 18 && hour < 22) {
      emojiSet = 'evening';
    } else {
      emojiSet = 'night';
    }
    
    const emojis = this.emojiSets[emojiSet];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  // Fetch GitHub user data
  async fetchUserData() {
    try {
      const headers = this.token ? { Authorization: `token ${this.token}` } : {};
      
      const [userResponse, reposResponse] = await Promise.all([
        axios.get(`https://api.github.com/users/${this.username}`, { headers }),
        axios.get(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`, { headers })
      ]);
      
      return {
        user: userResponse.data,
        repos: reposResponse.data
      };
    } catch (error) {
      console.error('Error fetching GitHub data:', error.message);
      return { user: {}, repos: [] };
    }
  }

  // Generate animated typing effect SVG
  generateTypingAnimation(text, delay = 0) {
    const chars = text.split('');
    const charElements = chars.map((char, i) => 
      `<tspan opacity="0" fill="#4ECDC4">
        ${char === ' ' ? '&#160;' : char}
        <animate attributeName="opacity" values="0;1" dur="0.1s" begin="${delay + i * 0.1}s" fill="freeze"/>
      </tspan>`
    ).join('');
    
    return `
      <svg width="800" height="60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FF6B6B"/>
            <stop offset="50%" style="stop-color:#4ECDC4"/>
            <stop offset="100%" style="stop-color:#45B7D1"/>
          </linearGradient>
        </defs>
        <text x="20" y="35" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="url(#textGradient)">
          ${charElements}
        </text>
        <rect x="0" y="0" width="800" height="60" fill="none" stroke="url(#textGradient)" stroke-width="2" opacity="0.3" rx="10">
          <animate attributeName="stroke-dasharray" values="0,3200;1600,1600;3200,0" dur="3s" begin="0s" fill="freeze"/>
        </rect>
      </svg>
    `;
  }

  // Generate skill progress bars with animations
  generateSkillBars(skills) {
    return skills.map(skill => `
      <div style="margin: 10px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span style="font-weight: bold; color: #333;">${skill.name}</span>
          <span style="color: #666;">${skill.level}%</span>
        </div>
        <div style="background: #f0f0f0; border-radius: 10px; height: 20px; overflow: hidden;">
          <div style="
            width: ${skill.level}%;
            height: 100%;
            background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
            border-radius: 10px;
            transition: width 2s ease-in-out;
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
              animation: shimmer 2s infinite;
            "></div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Generate repository showcase
  generateRepoShowcase(repos) {
    const topRepos = repos
      .filter(repo => !repo.fork && repo.name !== this.username)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    return topRepos.map(repo => `
      <div style="
        border: 1px solid #e1e4e8;
        border-radius: 10px;
        padding: 15px;
        margin: 10px;
        width: 300px;
        display: inline-block;
        vertical-align: top;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      ">
        <h3 style="margin: 0 0 10px 0; color: #fff;">
          📁 ${repo.name}
        </h3>
        <p style="margin: 0 0 10px 0; opacity: 0.9; font-size: 14px;">
          ${repo.description || 'No description available'}
        </p>
        <div style="display: flex; justify-content: space-between; font-size: 12px; opacity: 0.8;">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
          <span>${repo.language || 'Unknown'}</span>
        </div>
      </div>
    `).join('');
  }

  // Generate activity heatmap (simplified version)
  generateActivityHeatmap() {
    const days = 7;
    const maxCommits = 10;
    let heatmapRows = '';
    
    for (let i = 0; i < days; i++) {
      const commits = Math.floor(Math.random() * maxCommits);
      const intensity = commits / maxCommits;
      const color = `rgba(76, 175, 80, ${0.1 + intensity * 0.9})`;
      
      heatmapRows += `
        <rect x="${i * 20}" y="0" width="18" height="18" 
              fill="${color}" 
              stroke="#e1e4e8" 
              stroke-width="1"
              rx="3">
          <title>${commits} contributions on day ${i + 1}</title>
        </rect>
      `;
    }
    
    return `
      <svg width="180" height="40" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="35" font-size="12" fill="#666">Activity:</text>
        <g transform="translate(60, 10)">
          ${heatmapRows}
        </g>
      </svg>
    `;
  }

  // Generate the complete README content
  async generateReadme() {
    console.log('🎨 Starting README generation...');
    
    const { user, repos } = await this.fetchUserData();
    const currentEmoji = this.getCurrentEmoji();
    const timeBasedGreeting = this.getTimeBasedGreeting();
    
    const skills = [
      { name: 'Android Development', level: 85 },
      { name: 'JavaScript', level: 90 },
      { name: 'Node.js', level: 80 },
      { name: 'DevOps', level: 75 },
      { name: 'Faith & Spirituality', level: 100 }
    ];

    const readmeContent = `<!-- This README is auto-generated -->
<div align="center">

${this.generateTypingAnimation(`${timeBasedGreeting} I'm @Divinedevops87 ${currentEmoji}`)}

</div>

## 🌟 About Me

<div align="center">

![Profile Views](https://komarev.com/ghpvc/?username=Divinedevops87&color=brightgreen&style=flat-square)
![GitHub followers](https://img.shields.io/github/followers/Divinedevops87?style=social)
![GitHub stars](https://img.shields.io/github/stars/Divinedevops87?style=social)

</div>

<img align="right" alt="Coding" width="400" src="https://raw.githubusercontent.com/abhisheknaiidu/abhisheknaiidu/master/code.gif">

- 👋 **${timeBasedGreeting}** I'm @Divinedevops87 ${currentEmoji}
- 👀 I'm passionate about **Coding & Yeshua** 👌🙏✨😍
- 🌱 Currently diving deep into **Android Development** 📱
- 💞️ Looking to **LEARN & EXPLORE** new technologies 🤩
- 📫 **Reach me:** [Email](mailto:your-email@example.com) ${this.getCurrentEmoji()}
- 😄 **Pronouns:** CHILD OF GOD ✨
- ⚡ **Fun fact:** Recovered alcoholic, mother of 6 amazing children, and I love learning everything! 😂😉😁👌😎😊👏📌💯

---

## 🛠️ Skills & Technologies

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">

${this.generateSkillBars(skills)}

</div>

## 📊 GitHub Statistics

<div align="center">

<img height="180em" src="https://github-readme-stats.vercel.app/api?username=Divinedevops87&show_icons=true&theme=radical&include_all_commits=true&count_private=true"/>
<img height="180em" src="https://github-readme-stats.vercel.app/api/top-langs/?username=Divinedevops87&layout=compact&langs_count=7&theme=radical"/>

</div>

## 🔥 Recent Activity

${this.generateActivityHeatmap()}

**Total Repositories:** ${repos.length} | **Updated:** ${this.currentTime.format('MMMM Do YYYY, h:mm:ss a')} UTC

## 🚀 Featured Projects

<div style="display: flex; flex-wrap: wrap; justify-content: center;">

${this.generateRepoShowcase(repos)}

</div>

## 🎨 Fun Animations

<div align="center">

<!-- Particle Animation -->
<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="particle" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#4ECDC4"/>
      <stop offset="100%" style="stop-color:#FF6B6B"/>
    </radialGradient>
  </defs>
  
  <circle r="3" fill="url(#particle)">
    <animateMotion dur="4s" repeatCount="indefinite">
      <path d="M20,50 Q200,20 380,50 Q200,80 20,50"/>
    </animateMotion>
  </circle>
  
  <circle r="2" fill="#45B7D1">
    <animateMotion dur="3s" repeatCount="indefinite" begin="1s">
      <path d="M50,30 Q200,70 350,30 Q200,10 50,30"/>
    </animateMotion>
  </circle>
  
  <circle r="4" fill="#96CEB4">
    <animateMotion dur="5s" repeatCount="indefinite" begin="2s">
      <path d="M30,70 Q200,30 370,70 Q200,90 30,70"/>
    </animateMotion>
  </circle>
</svg>

</div>

## 🌈 Dynamic Content

<div align="center">

**Current Mood:** ${this.getCurrentMood()} | **Coding Status:** ${this.getCodingStatus()}

Last updated: **${this.currentTime.format('dddd, MMMM Do YYYY [at] h:mm:ss a')}** ${this.getCurrentEmoji()}

---

<img src="https://github.com/Divinedevops87/Divinedevops87/blob/output/github-contribution-grid-snake.svg" alt="Snake animation" />

*✨ This README is automatically updated every day with fresh content and animations! ✨*

</div>

<!-- Auto-generated with ❤️ by Dynamic README Generator -->`;

    return readmeContent;
  }

  getTimeBasedGreeting() {
    const hour = this.currentTime.hour();
    if (hour >= 5 && hour < 12) return 'Good morning! 🌅';
    if (hour >= 12 && hour < 18) return 'Good afternoon! ☀️';
    if (hour >= 18 && hour < 22) return 'Good evening! 🌆';
    return 'Good night! 🌙';
  }

  getCurrentMood() {
    const moods = ['🎯 Focused', '🚀 Energetic', '🌟 Inspired', '💻 Productive', '🔥 Motivated', '✨ Creative'];
    return moods[Math.floor(Math.random() * moods.length)];
  }

  getCodingStatus() {
    const statuses = ['💻 Active', '☕ Break time', '🔥 In the zone', '🧠 Learning', '🎨 Creating', '🐛 Debugging'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
}

// Main execution
async function main() {
  try {
    console.log('🤖 Starting Dynamic README Generation...');
    
    const generator = new DynamicReadmeGenerator();
    const readmeContent = await generator.generateReadme();
    
    // Write to README.md
    const fs = require('fs');
    const path = require('path');
    
    const readmePath = path.join(process.cwd(), 'README.md');
    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    
    console.log('✅ README.md successfully generated!');
    console.log(`📍 Generated at: ${new Date().toISOString()}`);
    
  } catch (error) {
    console.error('❌ Error generating README:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = DynamicReadmeGenerator;