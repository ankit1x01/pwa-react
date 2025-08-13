#!/usr/bin/env node

/**
 * PWA Migration Assessment Tool
 * Run with: node pwa-assessment.js
 */

const fs = require('fs');
const path = require('path');

class PWAAssessment {
  constructor() {
    this.results = {
      projectType: 'unknown',
      complexity: 'low',
      existingPWA: false,
      recommendations: []
    };
  }

  async assess() {
    console.log('🔍 Assessing your project for PWA migration...\n');
    
    await this.detectProjectType();
    await this.checkExistingPWA();
    await this.analyzeComplexity();
    await this.generateRecommendations();
    
    this.displayResults();
  }

  async detectProjectType() {
    console.log('📋 Detecting project type...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (dependencies['react-scripts']) {
        this.results.projectType = 'Create React App';
        console.log('✅ Found: Create React App');
      } else if (dependencies['vite']) {
        this.results.projectType = 'Vite';
        console.log('✅ Found: Vite Project');
      } else if (dependencies['next']) {
        this.results.projectType = 'Next.js';
        console.log('✅ Found: Next.js Project');
      } else if (fs.existsSync('webpack.config.js') || fs.existsSync('webpack.config.ts')) {
        this.results.projectType = 'Custom Webpack';
        console.log('✅ Found: Custom Webpack');
      } else {
        this.results.projectType = 'Custom Build';
        console.log('⚠️  Found: Custom Build System');
      }
    } catch (error) {
      console.log('❌ Could not read package.json');
    }
  }

  async checkExistingPWA() {
    console.log('\n🔍 Checking for existing PWA features...');
    
    const checks = [
      { file: 'public/manifest.json', name: 'Web App Manifest' },
      { file: 'public/sw.js', name: 'Service Worker' },
      { file: 'public/offline.html', name: 'Offline Page' }
    ];
    
    let existingFeatures = 0;
    
    checks.forEach(check => {
      if (fs.existsSync(check.file)) {
        console.log(`✅ Found: ${check.name}`);
        existingFeatures++;
        this.results.existingPWA = true;
      } else {
        console.log(`❌ Missing: ${check.name}`);
      }
    });
    
    if (existingFeatures === 0) {
      console.log('📝 No existing PWA features found');
    }
  }

  async analyzeComplexity() {
    console.log('\n📊 Analyzing project complexity...');
    
    try {
      // Count components
      const srcFiles = this.countFiles('src', /\.(tsx?|jsx?)$/);
      const componentFiles = this.countFiles('src', /\.(component|page|screen)\.(tsx?|jsx?)$/);
      
      console.log(`📁 Total source files: ${srcFiles}`);
      console.log(`🧩 Component files: ${componentFiles}`);
      
      if (srcFiles > 200) {
        this.results.complexity = 'high';
        console.log('📈 Complexity: HIGH (200+ files)');
      } else if (srcFiles > 50) {
        this.results.complexity = 'medium';
        console.log('📊 Complexity: MEDIUM (50-200 files)');
      } else {
        this.results.complexity = 'low';
        console.log('📉 Complexity: LOW (<50 files)');
      }
      
      // Check for state management
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (dependencies['redux'] || dependencies['@reduxjs/toolkit']) {
        console.log('🗃️  State management: Redux detected');
      } else if (dependencies['zustand'] || dependencies['jotai']) {
        console.log('🗃️  State management: Modern state library detected');
      }
      
    } catch (error) {
      console.log('⚠️  Could not analyze project structure');
    }
  }

  countFiles(dir, pattern) {
    try {
      let count = 0;
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      files.forEach(file => {
        if (file.isDirectory() && file.name !== 'node_modules') {
          count += this.countFiles(path.join(dir, file.name), pattern);
        } else if (file.isFile() && pattern.test(file.name)) {
          count++;
        }
      });
      
      return count;
    } catch {
      return 0;
    }
  }

  async generateRecommendations() {
    console.log('\n💡 Generating recommendations...');
    
    const { projectType, complexity, existingPWA } = this.results;
    
    if (existingPWA) {
      this.results.recommendations.push({
        priority: 'HIGH',
        action: 'Audit existing PWA implementation',
        details: 'Review and upgrade existing PWA features'
      });
    }
    
    switch (projectType) {
      case 'Create React App':
        if (complexity === 'low') {
          this.results.recommendations.push({
            priority: 'MEDIUM',
            action: 'Use CRA PWA template approach',
            details: 'Migrate using built-in PWA support, estimated 1-2 weeks'
          });
        } else {
          this.results.recommendations.push({
            priority: 'HIGH',
            action: 'Incremental PWA migration',
            details: 'Phase-by-phase implementation, estimated 2-4 weeks'
          });
        }
        break;
        
      case 'Vite':
        this.results.recommendations.push({
          priority: 'MEDIUM',
          action: 'Use Vite PWA plugin',
          details: 'vite-plugin-pwa provides easy integration, estimated 1 week'
        });
        break;
        
      case 'Next.js':
        this.results.recommendations.push({
          priority: 'MEDIUM',
          action: 'Use next-pwa plugin',
          details: 'Built-in PWA support with SSR compatibility, estimated 1-2 weeks'
        });
        break;
        
      case 'Custom Webpack':
        this.results.recommendations.push({
          priority: 'HIGH',
          action: 'Workbox integration',
          details: 'Custom service worker setup required, estimated 3-4 weeks'
        });
        break;
        
      default:
        this.results.recommendations.push({
          priority: 'HIGH',
          action: 'Custom PWA implementation',
          details: 'Manual setup required, estimated 4-6 weeks'
        });
    }
    
    if (complexity === 'high') {
      this.results.recommendations.push({
        priority: 'CRITICAL',
        action: 'Enterprise migration strategy',
        details: 'Use feature flags and phased rollout approach'
      });
    }
  }

  displayResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 PWA MIGRATION ASSESSMENT RESULTS');
    console.log('='.repeat(60));
    
    console.log(`\n🏗️  Project Type: ${this.results.projectType}`);
    console.log(`📊 Complexity: ${this.results.complexity.toUpperCase()}`);
    console.log(`🔄 Existing PWA: ${this.results.existingPWA ? 'YES' : 'NO'}`);
    
    console.log('\n📝 RECOMMENDATIONS:');
    console.log('-'.repeat(40));
    
    this.results.recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. [${rec.priority}] ${rec.action}`);
      console.log(`   ${rec.details}`);
    });
    
    console.log('\n📚 NEXT STEPS:');
    console.log('-'.repeat(40));
    console.log('1. Review the MIGRATION_GUIDE.md');
    console.log('2. Check PROJECT_SPECIFIC_GUIDE.md for your project type');
    console.log('3. Set up a feature flag system for safe deployment');
    console.log('4. Start with Phase 1 (Foundation) from the migration guide');
    
    console.log('\n🔗 HELPFUL COMMANDS:');
    console.log('-'.repeat(40));
    
    switch (this.results.projectType) {
      case 'Create React App':
        console.log('npm install workbox-webpack-plugin workbox-window');
        break;
      case 'Vite':
        console.log('npm install -D vite-plugin-pwa workbox-window');
        break;
      case 'Next.js':
        console.log('npm install next-pwa');
        break;
      default:
        console.log('npm install workbox-webpack-plugin workbox-window');
    }
    
    console.log('\n✅ Assessment complete! Good luck with your PWA migration.');
  }
}

// Run assessment
if (require.main === module) {
  const assessment = new PWAAssessment();
  assessment.assess().catch(console.error);
}

module.exports = PWAAssessment;
