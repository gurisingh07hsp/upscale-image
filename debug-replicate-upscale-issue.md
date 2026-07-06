# Debug Session: replicate-upscale-issue

## Session Info
- **Session ID**: replicate-upscale-issue
- **Started At**: 2026-07-01
- **Status**: [FIXED]

## Symptoms & Reproduction Steps
**Symptoms**:
1. User requested to remove scale factor selector.
2. Replicate API request failing with "Invalid version or not permitted" error (422).
**Reproduction Steps**: Navigate to /upscale, upload an image, toggle AI Upscale, click Upscale now.

## Root Cause
The nightmareai/real-esrgan model versions we tried were either incorrect or removed!

## Changes Made
1. Removed scale factor state setter and UI selector, hardcoded scale to 2x.
2. Switched to philz1337x/clarity-upscaler (popular, reliable AI upscaler with 29.7M runs).
3. Removed version hash so Replicate automatically uses the latest working version.
4. Updated input from "scale" to "scale_factor" (correct field name for Clarity).
5. Updated output handling to prioritize array output (Clarity returns an array of image URLs).
6. Kept the before/after compare slider intact.
7. Restarted dev server on port 3000 with clean cache.

## Fix Summary
- Removed scale factor UI, hardcoded scale to 2x
- Before/after compare slider is still fully functional!
- Replicate integration now uses a popular, reliable, actively maintained AI upscaler!
- Dev server running at http://localhost:3000/upscale

