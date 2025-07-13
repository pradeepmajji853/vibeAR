# 📱 Mobile AR Testing Guide - Fix "Could Not Load Object" Error

## 🚨 Critical Setup Steps (Do These First!)

### 1. Trust SSL Certificate on Mobile Device

**The #1 cause of "could not load object" is untrusted SSL certificates!**

#### For iOS:
1. Open Safari on your iPhone/iPad
2. Go to `https://192.168.194.46:5174/ar-debug-final.html`
3. You'll see a security warning → Tap "Advanced"
4. Tap "Proceed to 192.168.194.46 (unsafe)"
5. In Settings app → General → About → Certificate Trust Settings
6. Enable full trust for the localhost certificate

#### For Android:
1. Open Chrome on your Android device
2. Go to `https://192.168.194.46:5174/ar-debug-final.html`
3. You'll see "Your connection is not private" → Tap "Advanced"
4. Tap "Proceed to 192.168.194.46 (unsafe)"
5. Chrome may show address bar warning - this is normal for dev

### 2. Test Pages in Order

Test these URLs on your mobile device **in this exact order**:

1. **File Access Test**: `https://192.168.194.46:5174/ar-debug-final.html`
   - Check if GLB files load correctly
   - Verify MIME types are correct

2. **Simple AR Test**: `https://192.168.194.46:5174/simple-ar-fix.html`
   - Minimal AR implementation
   - Small sofa model (3.4MB)

3. **Main App**: `https://192.168.194.46:5174/`
   - Full VibeKitAR experience
   - Go to VibeKit AR section

## 🔧 Troubleshooting "Could Not Load Object"

### Error Patterns & Solutions:

| Error Message | Most Likely Cause | Solution |
|---------------|-------------------|----------|
| "Could not load object" | SSL certificate not trusted | Trust certificate in device settings |
| "Network error" | File not accessible | Check file exists at `/sofa.glb` |
| "AR not supported" | Desktop browser | Must use actual mobile device |
| "Timeout" | File too large | Try smaller models first |

### Quick Fixes to Try:

1. **Force Refresh**: Pull down page to refresh completely
2. **Clear Cache**: Chrome → Settings → Privacy → Clear Browsing Data
3. **Try Different Model**: Some models work better than others
4. **Check Network**: Ensure mobile is on same WiFi as development machine

## 📊 AR Support Requirements

### Device Requirements:
- **iOS**: iPhone 6s or newer, iOS 11+
- **Android**: ARCore supported device, Android 7.0+
- **Browser**: Safari (iOS) or Chrome (Android)

### Network Requirements:
- **Same WiFi**: Mobile device and dev machine on same network
- **HTTPS**: Required for AR features
- **File Access**: GLB files must be accessible via HTTPS

## 🧪 Step-by-Step Testing Process

### Step 1: Basic Connectivity
```
1. On mobile, go to: https://192.168.194.46:5174/ar-debug-final.html
2. Accept SSL certificate warnings
3. Check "Device Information" section shows your mobile device
4. Verify "GLB File Access Test" shows ✅ success
```

### Step 2: Model Loading
```
1. Scroll to "Minimal AR Test" section
2. Wait for model to load (should show ✅ success)
3. If model fails to load, note the exact error message
```

### Step 3: AR Launch
```
1. Tap "📱 Test AR Now" button in model viewer
2. OR try "Direct AR Launch" buttons
3. Camera should open with AR view
4. Point at flat surface and tap to place furniture
```

### Step 4: Full App Test
```
1. Go to main app: https://192.168.194.46:5174/
2. Navigate to "VibeKit AR" section
3. Complete the room scan flow
4. Try placing furniture in AR
```

## 🐛 Common Issues & Fixes

### Issue: "Could not load object" on model-viewer
**Fix**: Usually SSL certificate. Trust the certificate in device settings.

### Issue: AR button doesn't work
**Fix**: Try the "Direct AR Launch" buttons in debug page.

### Issue: Camera doesn't open
**Fix**: 
- Grant camera permissions
- Ensure you're on HTTPS
- Try different browser (Chrome/Safari)

### Issue: Models load but AR fails
**Fix**:
- Try smaller models first (test-cube.glb)
- Check AR support with device info
- Ensure flat surface with good lighting

## 🔍 Debug Information to Collect

If AR still doesn't work, collect this info from the debug page:

1. **Device Info**: What device/browser/OS version?
2. **File Access**: Do GLB files load successfully?
3. **Model Loading**: Do models show in 3D viewer?
4. **AR Launch**: What happens when you tap AR buttons?
5. **Error Messages**: Exact error text from browser console

## 📱 Direct AR URLs for Quick Testing

**Android Scene Viewer**:
```
intent://arvr.google.com/scene-viewer/1.0?file=https://192.168.194.46:5174/sofa.glb&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;
```

**iOS Quick Look** (copy GLB URL):
```
https://192.168.194.46:5174/sofa.glb
```

## ✅ Success Indicators

You'll know AR is working when:
- ✅ GLB files load without errors
- ✅ 3D models display in model-viewer
- ✅ AR button opens camera
- ✅ You can place virtual furniture on flat surfaces
- ✅ Furniture appears realistically scaled in your space

## 🆘 If Nothing Works

1. **Try Wired Connection**: Connect mobile via USB and use port forwarding
2. **Use Production URL**: Deploy to a real HTTPS domain
3. **Check Device Compatibility**: Verify your device supports ARCore/ARKit
4. **Update Browser**: Ensure latest Chrome (Android) or Safari (iOS)

---

**Remember**: AR only works on actual mobile devices with proper AR support. Desktop browsers will show "AR not supported" which is expected behavior.
