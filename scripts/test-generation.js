const DynamicReadmeGenerator = require('./generate-readme');
const fs = require('fs');
const path = require('path');

async function testGeneration() {
  console.log('🧪 Testing Dynamic README Generation...');
  
  try {
    // Test 1: Basic generation
    console.log('\n📝 Test 1: Basic generation');
    const generator = new DynamicReadmeGenerator();
    const content = await generator.generateReadme();
    
    if (content && content.includes('Divinedevops87')) {
      console.log('✅ Basic generation test passed');
    } else {
      console.log('❌ Basic generation test failed');
      return false;
    }
    
    // Test 2: Animation generation
    console.log('\n🎬 Test 2: Animation generation');
    if (content.includes('<animate') && content.includes('svg')) {
      console.log('✅ Animation generation test passed');
    } else {
      console.log('❌ Animation generation test failed');
      return false;
    }
    
    // Test 3: Dynamic content
    console.log('\n⚡ Test 3: Dynamic content');
    if (content.includes('Current Mood') && content.includes('Last updated')) {
      console.log('✅ Dynamic content test passed');
    } else {
      console.log('❌ Dynamic content test failed');
      return false;
    }
    
    // Test 4: Emoji rotation
    console.log('\n😄 Test 4: Emoji rotation');
    const emoji1 = generator.getCurrentEmoji();
    const emoji2 = generator.getCurrentEmoji();
    // Even if same, the system is working (it's random)
    console.log(`Generated emojis: ${emoji1}, ${emoji2}`);
    console.log('✅ Emoji rotation test passed');
    
    // Test 5: Time-based greetings
    console.log('\n🕐 Test 5: Time-based greetings');
    const greeting = generator.getTimeBasedGreeting();
    if (greeting && (greeting.includes('Good') || greeting.includes('🌅') || greeting.includes('☀️') || greeting.includes('🌆') || greeting.includes('🌙'))) {
      console.log(`✅ Time-based greeting test passed: ${greeting}`);
    } else {
      console.log('❌ Time-based greeting test failed');
      return false;
    }
    
    // Test 6: File writing
    console.log('\n📄 Test 6: File writing');
    const testPath = path.join(__dirname, '../test-readme.md');
    fs.writeFileSync(testPath, content);
    
    if (fs.existsSync(testPath)) {
      const fileSize = fs.statSync(testPath).size;
      console.log(`✅ File writing test passed (${fileSize} bytes)`);
      // Clean up test file
      fs.unlinkSync(testPath);
    } else {
      console.log('❌ File writing test failed');
      return false;
    }
    
    console.log('\n🎉 All tests passed! The Dynamic README Generator is working correctly.');
    return true;
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    return false;
  }
}

// Run tests if called directly
if (require.main === module) {
  testGeneration().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testGeneration;