// Auto-listing script for directories
// Uses Playwright/Puppeteer for automation

import { chromium } from 'playwright';

const directories = [
  {
    name: 'FutureTools',
    url: 'https://futuretools.io/submit',
    fields: {
      name: 'PagePulse v2',
      description: 'AI-powered tool that analyzes competitor SaaS pages in 10 seconds',
      url: 'https://pagepulse-v2.vercel.app',
      category: 'AI Productivity'
    }
  },
  {
    name: 'TAAFT',
    url: 'https://theresanaiforthat.com/submit',
    fields: {
      name: 'PagePulse',
      description: 'AI competitor monitoring and intelligence reports',
      url: 'https://pagepulse-v2.vercel.app'
    }
  }
];

export async function autoSubmitDirectory(directoryName: string) {
  const dir = directories.find(d => d.name === directoryName);
  if (!dir) return { success: false, error: 'Directory not found' };

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(dir.url, { waitUntil: 'networkidle' });
    
    // Check for CAPTCHA
    const hasCaptcha = await page.$('text=CAPTCHA') || 
                       await page.$('text=captcha') ||
                       await page.$('.g-recaptcha') ||
                       await page.$('[data-sitekey]');
    
    if (hasCaptcha) {
      console.log(`CAPTCHA detected on ${dir.name}, skipping...`);
      return { success: false, error: 'CAPTCHA detected', skipped: true };
    }
    
    // Fill form fields (generic selectors)
    for (const [key, value] of Object.entries(dir.fields)) {
      try {
        // Try common input selectors
        const selectors = [
          `input[name*="${key}"]`,
          `input[id*="${key}"]`,
          `textarea[name*="${key}"]`,
          `textarea[id*="${key}"]`,
          `[placeholder*="${key}"]`
        ];
        
        for (const selector of selectors) {
          const element = await page.$(selector);
          if (element) {
            await element.fill(value);
            break;
          }
        }
      } catch (e) {
        console.log(`Could not fill field ${key}`);
      }
    }
    
    // Note: Actually submitting forms without CAPTCHA is risky
    // This script identifies forms but manual review recommended
    
    return { 
      success: true, 
      message: 'Form fields filled, manual submission required',
      url: dir.url
    };
    
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    if (browser) await browser.close();
  }
}

// Run for all directories
export async function runAutoListing() {
  const results = [];
  for (const dir of directories) {
    console.log(`Processing ${dir.name}...`);
    const result = await autoSubmitDirectory(dir.name);
    results.push({ directory: dir.name, ...result });
  }
  return results;
}
