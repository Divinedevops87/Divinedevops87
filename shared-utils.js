// Divine DevOps Low/No-Code Suite - Shared JavaScript Utilities

// Theme Management
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  document.body.classList.toggle('dark-theme', currentTheme === 'dark');
  updateThemeIcon(currentTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  const theme = isDark ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Utility Functions
function copyToClipboard(text, elementId = null) {
  navigator.clipboard.writeText(text).then(() => {
    showAlert('Copied to clipboard!', 'success');
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        const originalText = element.textContent;
        element.textContent = 'Copied!';
        setTimeout(() => {
          element.textContent = originalText;
        }, 1000);
      }
    }
  }).catch(err => {
    console.error('Failed to copy: ', err);
    showAlert('Failed to copy to clipboard', 'error');
  });
}

function downloadFile(content, filename, contentType = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showAlert(`Downloaded ${filename}`, 'success');
}

function showAlert(message, type = 'info') {
  const alertContainer = document.getElementById('alert-container') || createAlertContainer();
  
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  alertContainer.appendChild(alert);
  
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

function createAlertContainer() {
  const container = document.createElement('div');
  container.id = 'alert-container';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1001;
    max-width: 300px;
  `;
  document.body.appendChild(container);
  return container;
}

function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <span>Loading...</span>
      </div>
    `;
  }
}

function hideLoading(elementId, content = '') {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = content;
  }
}

// Form Utilities
function validateForm(formData, rules) {
  const errors = [];
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = formData[field];
    
    if (rule.required && (!value || value.trim() === '')) {
      errors.push(`${rule.label || field} is required`);
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors.push(`${rule.label || field} must be at least ${rule.minLength} characters`);
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors.push(`${rule.label || field} must be no more than ${rule.maxLength} characters`);
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors.push(`${rule.label || field} format is invalid`);
    }
  }
  
  return errors;
}

function getFormData(formId) {
  const form = document.getElementById(formId);
  if (!form) return {};
  
  const formData = new FormData(form);
  const data = {};
  
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  return data;
}

// API Utilities
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// GitHub API Utilities
function getGitHubApiUrl(endpoint) {
  return `https://api.github.com${endpoint}`;
}

async function fetchGitHubData(endpoint) {
  try {
    const response = await fetch(getGitHubApiUrl(endpoint));
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('GitHub API error:', error);
    throw error;
  }
}

// Canvas Utilities
function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function downloadCanvas(canvas, filename) {
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showAlert(`Downloaded ${filename}`, 'success');
  });
}

// Color Utilities
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Text Utilities
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function truncate(text, length = 100) {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

// Badge Generation
function generateShieldsBadge(label, message, color = 'blue') {
  return `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color}`;
}

// Template Utilities
function interpolateTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
  });
}

// QR Code Generation (using qrcode-generator library)
function generateQRCode(text, size = 256) {
  try {
    // This would require the qrcode-generator library to be loaded
    if (typeof qrcode !== 'undefined') {
      const qr = qrcode(0, 'M');
      qr.addData(text);
      qr.make();
      return qr.createDataURL(4);
    } else {
      // Fallback to QR Server API
      return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
    }
  } catch (error) {
    console.error('QR Code generation error:', error);
    return null;
  }
}

// Icon Generation Utilities
function generateSVGIcon(options) {
  const {
    size = 64,
    backgroundColor = '#667eea',
    textColor = '#ffffff',
    text = '🦄',
    shape = 'circle'
  } = options;
  
  const shapeElement = shape === 'circle' 
    ? `<circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${backgroundColor}"/>`
    : `<rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size * 0.1}"/>`;
  
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      ${shapeElement}
      <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-size="${size * 0.5}" fill="${textColor}">
        ${text}
      </text>
    </svg>
  `;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  
  // Add copy buttons to code blocks
  document.querySelectorAll('pre code').forEach(block => {
    const button = document.createElement('button');
    button.textContent = 'Copy';
    button.className = 'btn btn-outline';
    button.style.cssText = 'position: absolute; top: 8px; right: 8px; font-size: 0.8rem; padding: 4px 8px;';
    
    const pre = block.parentElement;
    pre.style.position = 'relative';
    pre.appendChild(button);
    
    button.addEventListener('click', () => {
      copyToClipboard(block.textContent, button.id);
    });
  });
  
  // Add smooth scrolling to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Export utilities for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initTheme,
    toggleTheme,
    copyToClipboard,
    downloadFile,
    showAlert,
    showLoading,
    hideLoading,
    validateForm,
    getFormData,
    fetchData,
    fetchGitHubData,
    createCanvas,
    downloadCanvas,
    hexToRgb,
    rgbToHex,
    slugify,
    capitalize,
    truncate,
    generateShieldsBadge,
    interpolateTemplate,
    generateQRCode,
    generateSVGIcon
  };
}