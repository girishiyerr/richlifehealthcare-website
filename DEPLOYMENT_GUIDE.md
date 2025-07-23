# Website Deployment Guide for richlifehealthcare.in

## Option 1: GoDaddy Web Hosting (Recommended)

### Step 1: Purchase GoDaddy Web Hosting
1. Log into your GoDaddy account
2. Go to "Web Hosting" section
3. Choose a hosting plan (Basic plan is sufficient)
4. Complete the purchase

### Step 2: Upload Your Files
1. Access your hosting control panel
2. Open File Manager
3. Navigate to the `public_html` folder
4. Upload all your website files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `performance.js`
   - `sw.js`
   - `logo.svg`
   - `PHOTOS/` folder (with all images)

### Step 3: Connect Domain
1. In your GoDaddy control panel, go to "Domains"
2. Find `richlifehealthcare.in`
3. Click "Manage"
4. Go to "DNS" settings
5. Add an A record pointing to your hosting IP address
6. Add a CNAME record for "www" pointing to your domain

## Option 2: Netlify (Free & Easy)

### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with your email or GitHub account

### Step 2: Deploy Website
1. Click "New site from Git" or drag your website folder
2. Upload your website files
3. Netlify will give you a temporary URL

### Step 3: Connect Custom Domain
1. Go to "Domain settings" in your Netlify dashboard
2. Click "Add custom domain"
3. Enter `richlifehealthcare.in`
4. Follow the DNS configuration instructions

### Step 4: Update DNS Records
In your GoDaddy DNS settings, add these records:
- Type: A, Name: @, Value: [Netlify IP]
- Type: CNAME, Name: www, Value: [your-netlify-site].netlify.app

## Option 3: Vercel (Free & Fast)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub, GitLab, or Bitbucket

### Step 2: Deploy Website
1. Click "New Project"
2. Import your website files
3. Deploy

### Step 3: Connect Domain
1. Go to "Settings" > "Domains"
2. Add `richlifehealthcare.in`
3. Follow DNS configuration

## DNS Configuration for GoDaddy

### Required DNS Records:
```
Type: A
Name: @
Value: [Your hosting IP address]
TTL: 600

Type: CNAME
Name: www
Value: richlifehealthcare.in
TTL: 600
```

## Important Notes:

1. **SSL Certificate**: Enable HTTPS for security
2. **Email**: Set up professional email (info@richlifehealthcare.in)
3. **Backup**: Keep a backup of your website files
4. **Testing**: Test your website after deployment

## File Structure for Upload:
```
public_html/
├── index.html
├── styles.css
├── script.js
├── performance.js
├── sw.js
├── logo.svg
└── PHOTOS/
    ├── 51uAEUBdUVL.jpg
    ├── images.jpeg
    ├── images (1).jpeg
    ├── My-S052j-Medical-Products-Portable-Quantum-Magnetic-Resonance-Body-Analyzer.avif
    └── [other images]
```

## Support:
- GoDaddy Support: 24/7 phone and chat support
- Netlify Support: Community forum and documentation
- Vercel Support: Documentation and community

Choose the option that best fits your budget and technical comfort level! 