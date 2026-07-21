# Images Directory Structure

This directory contains all static images for the website.

## Directory Organization

```
images/
├── avatars/           # Profile pictures and user avatars
│   └── avatar.png     # Main profile picture (used in hero section)
├── qrcodes/           # QR codes for contact information
│   ├── wechat-qr.png  # WeChat contact QR code
│   └── email-qr.png   # Email contact QR code
└── README.md          # This file
```

## File Naming Guidelines

- Use lowercase letters
- Use hyphens (-) to separate words (kebab-case)
- No spaces or special characters
- Use descriptive names
- Include appropriate file extensions (.png, .jpg, .svg, etc.)

### Examples

✅ Good:
- `avatar.png`
- `wechat-qr.png`
- `company-logo.svg`

❌ Bad:
- `Avatar.PNG`
- `WeChat QR.png`
- `my image 2024.jpg`

## Adding New Images

### Avatars
Place user profile pictures and avatars in the `avatars/` directory.

### QR Codes
Place contact QR codes in the `qrcodes/` directory.

### Other Images
If you need to add other types of images (logos, icons, etc.), create a new subdirectory:
- `logos/` - Brand logos
- `icons/` - Icon images
- `blog/` - Blog post images
- `projects/` - Project screenshots

## Image Optimization

Before adding images:
1. Compress images to reduce file size
2. Use appropriate formats (PNG for transparency, JPG for photos, SVG for graphics)
3. Recommended size for avatars: 400x400px or higher
4. Recommended size for QR codes: 400x400px

## Usage in Code

Import images using absolute paths from the public directory:

```tsx
<Image src="/images/avatars/avatar.png" alt="Profile" />
<Image src="/images/qrcodes/wechat-qr.png" alt="WeChat QR" />
```
