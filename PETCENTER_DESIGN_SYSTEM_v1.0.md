════════════════════════════════════════════════════════════════════════════════════════════════════════
                      PETCENTER PLATFORM - DESIGN SYSTEM & PROJECT SUMMARY
════════════════════════════════════════════════════════════════════════════════════════════════════════

📋 DOCUMENT PURPOSE
This is the official design system guide for all PetCenter pages (present and future). Every page, component,
and UI element must follow these specifications. This ensures consistency, professionalism, and brand unity
across the entire PetCenter platform.

VERSION: 1.0
LAST UPDATED: April 25, 2026
IMPLEMENTED IN: merchandise.html, merchandise-live.html

════════════════════════════════════════════════════════════════════════════════════════════════════════
                                    1. PROJECT OVERVIEW
════════════════════════════════════════════════════════════════════════════════════════════════════════

PROJECT NAME: PetPay Merchant Portal
PURPOSE: Professional storefront creation and management for pet product vendors
TARGET AUDIENCE: Pet business owners, retailers, and content creators
DESIGN PHILOSOPHY: Sophisticated yet warm, premium pet industry aesthetic

WHAT HAS BEEN COMPLETED:
├─ merchandise.html (Create New Storefront)
│  ├─ Full form with merchant information
│  ├─ Pet type selector (15 pet types)
│  ├─ Product image upload
│  ├─ Recommended products section
│  ├─ Success modal with confirmation details
│  └─ Complete styling and animations
│
└─ merchandise-live.html (Edit Existing Storefront)
   ├─ Authentication gate (passkey entry)
   ├─ Merchant information section
   ├─ Pet type selector
   ├─ Product management
   ├─ Save changes functionality
   └─ Complete styling and animations

════════════════════════════════════════════════════════════════════════════════════════════════════════
                                2. COLOR PALETTE SYSTEM
════════════════════════════════════════════════════════════════════════════════════════════════════════

🎨 PRIMARY PETCENTER COLORS (MUST ALWAYS USE):

1. NAVY BLUE: #10214b
   ├─ Usage: Primary buttons, borders, text, section numbers, primary UI elements
   ├─ Variants: Light Navy (#1a2f5c) for gradients
   ├─ Represents: Trust, professionalism, stability
   ├─ Background: Works on light/white backgrounds
   └─ When to Use: Headers, form labels, primary CTAs, focus states

2. GOLD / ACCENT: #d7bd88
   ├─ Usage: Hover states, focus glows, input borders on focus, premium accents
   ├─ Variants: Dark Gold (#b89968) for hover effects
   ├─ Represents: Elegance, premium quality, luxury
   ├─ Background: Works on light backgrounds as accents
   └─ When to Use: Hover borders, focus box-shadows, accent highlights

3. WARM GRAY: #d0c3ba ⭐ SPECIAL USE
   ├─ Usage: ONLY for header badges and hero tags (special background color)
   ├─ Text Color On This: Chocolate (#3d2817)
   ├─ Represents: Warmth, sophistication
   ├─ Purpose: Makes text headers stand out with premium feel
   └─ Critical Rule: Apply ONLY to header-badge and hero-tag elements
   
   CSS Example:
   .header-badge{background:#d0c3ba; color:#3d2817;}
   .hero-tag{background:#d0c3ba; color:#3d2817;}

4. CHOCOLATE: #3d2817
   ├─ Usage: Text color on warm gray (#d0c3ba) backgrounds
   ├─ Represents: Warm, earthy, natural
   ├─ Contrast: High contrast on #d0c3ba background
   └─ When to Use: Text on warm gray only

5. CREAM: #ebe7e1
   ├─ Usage: Very light backgrounds, subtle highlights
   ├─ Represents: Lightness, approachability
   └─ When to Use: Rare - mainly for special background variations

6. ORANGE: #ED7624 
   ├─ Represents: Brand identity
   
FUNCTIONAL COLORS:

7. Success Green: #10b981
   ├─ Usage: Success messages, confirmation states
   └─ Example: "✓ Saved successfully"

8. Error Red: #ef4444
   ├─ Usage: Error messages, delete buttons hover
   └─ Example: "✗ Error: Please fill all fields"

SUPPORTING COLORS:

9. Muted Text: #7a6d5f
   ├─ Usage: Secondary text, placeholders, helper text
   └─ Contrast: Lower contrast than primary text

10. Primary Text: #2c2416
    ├─ Usage: Body text, form labels, main content
    └─ Contrast: High contrast on light backgrounds

11. Background: #f9f7f4
    ├─ Usage: Page background (light cream/beige)
    └─ Warmth: Slightly warm to complement the color palette

12. Surface: #ffffff
    ├─ Usage: Form sections, cards, modal boxes
    └─ Effect: Clean, professional appearance

13. Border Color: rgba(16,33,75,0.12)
    ├─ Usage: Input borders, form section borders, dividers
    ├─ Transparency: 12% opacity Navy on light background
    └─ Subtlety: Professional, not harsh

════════════════════════════════════════════════════════════════════════════════════════════════════════
                              3. COLOR USAGE RULES (CRITICAL)
════════════════════════════════════════════════════════════════════════════════════════════════════════

✅ DO USE:
├─ Navy for: Primary buttons, borders, text, section headers
├─ Gold for: Hover states, focus borders, accents
├─ Warm Gray (#d0c3ba) for: Header badge ONLY, Hero tag ONLY
├─ Chocolate for: Text on warm gray backgrounds only
├─ Green for: Success messages and confirmations
├─ Red for: Error states and warnings
└─ Orange for: Brand identity 

❌ DON'T USE:
├─ Warm gray on anything except header-badge and hero-tag
├─ Chocolate on anything except warm gray backgrounds
├─ Multiple conflicting colors in one component
└─ Old color scheme from previous versions

EXAMPLE COLOR COMBINATIONS:

Navigation/Header:
├─ White background
├─ Orange logo (brand)
├─ Navy text and icons
└─ Warm gray (#d0c3ba) badge

Form Input:
├─ White background
├─ Navy 1.5px border
├─ Navy text
├─ Gold border + glow on focus
└─ Light gray placeholder

Button Primary:
├─ Navy gradient (Navy → Light Navy)
├─ White text
├─ Navy shadow
├─ Gold border on hover (optional)
└─ Lift effect on hover

Modal Popup:
├─ Frosted glass background (white 95% opacity)
├─ Navy border 1.5px
├─ Gold accents
├─ Navy icons
└─ Shadow: 0 20px 60px Navy 20% opacity

════════════════════════════════════════════════════════════════════════════════════════════════════════
                                4. TYPOGRAPHY SYSTEM
════════════════════════════════════════════════════════════════════════════════════════════════════════

🔤 FONT FAMILIES (Must Import):

@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap');

FONT 1: CORMORANT GARAMOND (Serif - Display)
├─ Used For: Page titles (H1), section headers (H2), hero text
├─ Style: Elegant, sophisticated, premium
├─ Weights: 600 (semi-bold), 700 (bold)
├─ Line Height: 1.1
├─ Letter Spacing: -0.5px to -1px
├─ Color: Navy (#10214b)
├─ Size Examples:
│  ├─ H1 (Page Title): 54px (or clamp(32px, 5vw, 54px))
│  ├─ H2 (Section): 20px
│  └─ H3 (Subsection): 18px

Usage Examples:
<!-- Page Title -->
<h1 style="font-family: 'Cormorant Garamond'; font-size: 54px; font-weight: 700;">
  Create Your Storefront
</h1>

<!-- Section Header -->
<h2 style="font-family: 'Cormorant Garamond'; font-size: 20px; font-weight: 700;">
  Merchant Information
</h2>

FONT 2: SORA (Sans-Serif - Body)
├─ Used For: Body text, labels, form text, buttons, UI text
├─ Style: Modern, clean, friendly, readable
├─ Weights: 300 (light), 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)
├─ Line Height: 1.6 for body, 1.4 for labels
├─ Letter Spacing: 0.04em for uppercase labels
├─ Color: Primary text (#2c2416) or Navy (#10214b)
├─ Size Examples:
│  ├─ Body Text: 14-16px
│  ├─ Form Labels: 13px uppercase
│  ├─ Placeholder: 14px
│  ├─ Helper Text: 12px
│  └─ Button Text: 15-16px

Usage Examples:
<!-- Form Label -->
<label style="font-family: 'Sora'; font-size: 13px; font-weight: 600; letter-spacing: 0.04em;">
  Full Name
</label>

<!-- Body Text -->
<p style="font-family: 'Sora'; font-size: 16px; line-height: 1.7;">
  Enter your full name as it appears on your business license.
</p>

<!-- Button Text -->
<button style="font-family: 'Sora'; font-size: 16px; font-weight: 700;">
  Publish My Storefront
</button>

FONT 3: DM SANS (Fallback)
├─ If Sora fails to load, use DM Sans
├─ Similar characteristics to Sora
├─ Ensure this font is in Google Fonts import as backup

TYPOGRAPHY HIERARCHY:

Level 1 (H1 - Page Title):
├─ Font: Cormorant Garamond 700
├─ Size: 54px (responsive: clamp(32px, 5vw, 54px))
├─ Color: Navy
├─ Line Height: 1.1
└─ Example: "PetCenter Merchant Portal"

Level 2 (H2 - Section Header):
├─ Font: Cormorant Garamond 700
├─ Size: 20px
├─ Color: Navy
├─ Line Height: 1.2
└─ Example: "Merchant Information"

Level 3 (H3 - Subsection):
├─ Font: Cormorant Garamond 700
├─ Size: 18px
├─ Color: Navy
└─ Example: "Edit Your Storefront"

Body Text:
├─ Font: Sora 400
├─ Size: 16px
├─ Color: Primary text (#2c2416)
├─ Line Height: 1.7
└─ Max Width: 520px for readability

Form Labels:
├─ Font: Sora 600
├─ Size: 13px
├─ Text Transform: uppercase
├─ Letter Spacing: 0.04em
├─ Color: Navy
└─ Example: "FULL NAME"

Form Input Text:
├─ Font: Sora 400
├─ Size: 14px
├─ Color: Navy
└─ Placeholder: Muted (#7a6d5f)

Button Text:
├─ Font: Sora 700
├─ Size: 15-16px
├─ Color: White
├─ Transform: None (mixed case okay)
└─ Example: "Publish My Storefront"

Helper/Secondary Text:
├─ Font: Sora 400
├─ Size: 12-13px
├─ Color: Muted (#7a6d5f)
└─ Example: "(used to match relevant customer reviews)"

════════════════════════════════════════════════════════════════════════════════════════════════════════
                            5. UI LOADING ANIMATIONS & DESIGNS
════════════════════════════════════════════════════════════════════════════════════════════════════════

⚙️ AVAILABLE LOADING ANIMATIONS 

DESIGN 1: LOAD BAR 
└─ What: Horizontal sliding rectangle animation
├─ Duration: 1.2s
├─ Easing: ease-in-out
├─ Direction: Left to right (0 → 40px translateX)
├─ Opacity: Pulses slightly (1 → 0.5 → 1)
├─ Color: White bar on dark/colored button background
├─ Smoothness: Very professional, elegant
├─ Use Case: Button loaders, submission progress
├─ CSS Animation:
   @keyframes slideLoad {
     0% { transform: translateX(0); opacity: 1; }
     50% { opacity: 0.5; }
     100% { transform: translateX(40px); opacity: 1; }
   }
├─ HTML Implementation:
   <svg viewBox="0 0 60 4" xmlns="http://www.w3.org/2000/svg">
     <rect x="0" y="1" width="20" height="2" fill="#ffffff"
       style="animation:slideLoad 1.2s ease-in-out infinite;"/>
   </svg>
└─ Best For: Publish buttons, save buttons, form submissions

DESIGN 2: SPINNER GRADIENT 
└─ Description: Circular spinner with gradient rotation
├─ Duration: 1.5s
├─ Color: Gradient (blue to gold)
├─ Not Recommended For: This design (use Load Bar instead)
└─ Available If: Legacy support needed

DESIGN 3: SQUARES 
└─ Description: Animated squares shifting positions
├─ Duration: 1.2s
├─ Movement: Square morphs
├─ Not Recommended For: This project
└─ Available If: Alternative UI needed

DESIGN 4: PULSE 
└─ Description: Simple pulse/glow animation
├─ Duration: 1s
├─ Effect: Fade in/out
├─ Not Recommended For: Complex loading
└─ Available If: Subtle indication needed

DESIGN 5: THREE DOTS 
└─ Description: Animated dots appearing/disappearing
├─ Duration: 1.2s
├─ Effect: Sequential dot animation
├─ Not Recommended For: Professional contexts
└─ Available If: Casual design needed

⭐ RECOMMENDED: LOAD BAR (Currently Implemented)

LOAD BAR IMPLEMENTATION DETAILS:

CSS (In <style> section):
@keyframes slideLoad {
  0% { transform: translateX(0); opacity: 1; }
  50% { opacity: 0.5; }
  100% { transform: translateX(40px); opacity: 1; }
}

.loading-spinner-inline {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  vertical-align: middle;
}

.loading-spinner-inline svg {
  animation: slideLoad 1.2s ease-in-out infinite;
}

HTML (In Button):
<button class="submit-btn" id="submitBtn">
  <span id="submitBtnText">Publish My Storefront</span>
</button>

JavaScript (On Click - Show Animation):
const btnText = document.getElementById('submitBtnText');
btnText.innerHTML = `
  <span class="loading-spinner-inline">
    <svg viewBox="0 0 60 4" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="1" width="20" height="2" fill="#ffffff"
        style="animation:slideLoad 1.2s ease-in-out infinite;"/>
    </svg>
  </span>Publishing...
`;

ALTERNATIVE: ANIMATED DOTS (If variation needed)
@keyframes dotBlink {
  0%, 20%, 50%, 80%, 100% { opacity: 1; }
  40% { opacity: 0.3; }
  60% { opacity: 0.7; }
}

<span class="loading-dots">
  <span style="animation: dotBlink 1.4s infinite;">.</span>
  <span style="animation: dotBlink 1.4s infinite; animation-delay: 0.2s;">.</span>
  <span style="animation: dotBlink 1.4s infinite; animation-delay: 0.4s;">.</span>
</span>

WHEN TO SHOW LOADING ANIMATION:
├─ Form submission (publish, save changes)
├─ File upload (not after)
├─ Authentication attempts
├─ Data synchronization
└─ Any async operation (3+ seconds expected)

LOADING ANIMATION TIMING:
├─ Show: Immediately on button click
├─ Duration: Until server responds (3-30 seconds)
├─ Hide: When response received
├─ Button State: Disabled during loading
└─ Button Text: "Publishing..." or "Saving..." or "Loading..."

════════════════════════════════════════════════════════════════════════════════════════════════════════
                        6. MODAL & POPUP NOTIFICATION DESIGN (GLASSMORPHISM)
════════════════════════════════════════════════════════════════════════════════════════════════════════

🎯 POPUP NOTIFICATION STYLE: GLASSMORPHIC TRANSPARENT DESIGN

What is Glassmorphism?
A modern design trend using semi-transparent frosted glass effects with backdrop blur.
Creates a premium, modern, premium aesthetic perfect for overlays.

MODAL STRUCTURE (Success Modal Example):

HTML Structure:
<div class="modal-overlay" id="successModal">
  <div class="modal-box">
    <div class="modal-icon">
      <!-- SVG Icon (NO EMOJI) -->
    </div>
    <h3>Your Storefront is Live!</h3>
    <p>Your merchant portal has been successfully published.</p>
    
    <!-- Content -->
    <div class="merchant-link-display">
      https://petpay.petcenterco.com/merchants/ID-12345
    </div>
    
    <div class="passkey-display">
      MC-5A3F-7K2M-9N1B
    </div>
    
    <!-- Warning -->
    <div class="warning-box">
      <svg><!-- Icon --></svg>
      Save these details now! Cannot be recovered.
    </div>
    
    <!-- Actions -->
    <button class="copy-btn">Copy Link</button>
    <button class="copy-btn">Copy Passkey</button>
    <button class="modal-close-btn">Got it, close</button>
  </div>
</div>

CSS STYLING:

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(16, 33, 75, 0.4);           /* Navy 40% opacity */
  backdrop-filter: blur(8px);                   /* Frosted glass effect */
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-overlay.show {
  display: flex;
}

.modal-box {
  background: rgba(255, 255, 255, 0.95);       /* White 95% opacity */
  border: 1.5px solid rgba(215, 189, 136, 0.3); /* Gold semi-transparent */
  border-radius: 18px;
  padding: 36px 32px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  backdrop-filter: blur(10px);                  /* Extra blur for glass */
  box-shadow: 0 20px 60px rgba(16, 33, 75, 0.2); /* Navy shadow */
  animation: modalScale 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalScale {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

KEY GLASSMORPHIC FEATURES:
├─ Backdrop Blur: blur(8-10px) creates frosted glass
├─ Semi-Transparent Background: 95% white opacity
├─ Border: 1.5px gold with transparency
├─ Shadow: Strong but subtle (20px 60px navy 20%)
├─ Animation: Smooth scale entrance
└─ Effect: Premium, modern, trustworthy

MODAL COMPONENTS STYLING:

.modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: modalIconBounce 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalIconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.modal-box h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--primary);
}

.modal-box p {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.65;
  margin-bottom: 18px;
}

.merchant-link-display {
  background: rgba(215, 189, 136, 0.12);
  border: 1.5px solid var(--accent);
  border-radius: 9px;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  word-break: break-all;
  margin-bottom: 10px;
}

.passkey-display {
  background: rgba(16, 33, 75, 0.08);
  border: 1.5px solid rgba(16, 33, 75, 0.2);
  border-radius: 9px;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 700;
  color: var(--chocolate);
  letter-spacing: 0.15em;
  margin-bottom: 20px;
  font-family: monospace;
}

.warning-box {
  background: rgba(239, 68, 68, 0.08);
  border: 1.5px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #c2185b;
  margin-bottom: 20px;
  line-height: 1.55;
}

.copy-btn {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: 7px;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--primary);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: 8px;
  font-weight: 600;
}

.copy-btn:hover {
  border-color: var(--accent);
  color: var(--accent-dark);
  background: rgba(215, 189, 136, 0.08);
}

.copy-btn:active {
  transform: scale(0.98);
}

.modal-close-btn {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  border: none;
  border-radius: 9px;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(16, 33, 75, 0.2);
}

.modal-close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 33, 75, 0.3);
}

.modal-close-btn:active {
  transform: translateY(0);
}

JAVASCRIPT (Show/Hide):

// Show modal
function showSuccessModal() {
  const modal = document.getElementById('successModal');
  modal.classList.add('show');
}

// Hide modal
function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  modal.classList.remove('show');
}

ICON DESIGN (No Emojis - Use SVG):

Success Celebration Icon:
<svg width="48" height="48" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="1.5" style="color:var(--accent-dark);">
  <polyline points="20 21 9 13 20 5 20 21"></polyline>
  <polyline points="4 21 15 13 4 5 4 21"></polyline>
</svg>

Info/Alert Icon:
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="8" x2="12" y2="12"></line>
  <line x1="12" y1="16" x2="12.01" y2="16"></line>
</svg>

Lock/Security Icon:
<svg width="44" height="44" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="1.5" style="color:var(--primary);">
  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
</svg>

MODAL ANIMATION SEQUENCE:
1. Overlay fades in (0.3s)
2. Modal scales up from 0.95 to 1.0 (0.4s)
3. Icon bounces (0.6s) - celebratory effect
4. Content appears smoothly

ACCESSIBILITY:
├─ Modal has z-index: 9999 (above all other content)
├─ Overlay prevents interaction with page
├─ Close button always available
├─ Keyboard support (ESC to close) - recommended
└─ High contrast colors for readability

════════════════════════════════════════════════════════════════════════════════════════════════════════
                            7. FORM STYLING & INPUT COMPONENTS
════════════════════════════════════════════════════════════════════════════════════════════════════════

📝 TEXT INPUT FIELDS:

Standard Input Styling:

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.field label .opt {
  color: var(--muted);
  font-weight: 400;
  font-size: 12px;
  text-transform: none;
  letter-spacing: 0;
}

.field input,
.field textarea {
  background: #ffffff;
  border: 1.5px solid var(--border);              /* Navy semi-transparent */
  border-radius: 9px;
  padding: 11px 14px;
  font-size: 14px;
  color: var(--text);
  font-family: inherit;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.field input:focus,
.field textarea:focus {
  border-color: var(--accent);                    /* Gold border on focus */
  background: #fafaf8;
  box-shadow: 0 0 0 3px rgba(215, 189, 136, 0.15); /* Gold glow */
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--muted);
}

.field textarea {
  resize: vertical;
  min-height: 78px;
}

INPUT STATES:

Default:
├─ Background: White
├─ Border: Navy 1.5px (subtle)
├─ Text: Navy
└─ Placeholder: Muted gray

Hover (optional, not required):
├─ Background: Same white
├─ Border: Same navy
└─ Cursor: text

Focus (CRITICAL - visible on interaction):
├─ Background: Light cream (#fafaf8)
├─ Border: Gold 1.5px (bright)
├─ Box-shadow: Gold glow (3px radius)
└─ Visual feedback: Clear and obvious

Disabled:
├─ Opacity: 0.5
├─ Cursor: not-allowed
└─ Border: Same navy (faded)

Error (for validation):
├─ Border: Red 1.5px
├─ Background: Light red tint optional
└─ Message below field in red

════════════════════════════════════════════════════════════════════════════════════════════════════════
                        8. BUTTON STYLING & INTERACTION STATES
════════════════════════════════════════════════════════════════════════════════════════════════════════

🔘 PRIMARY BUTTON (Main CTAs):

.submit-btn {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 16px 48px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(16, 33, 75, 0.25);
  position: relative;
  overflow: hidden;
}

/* Shine effect on hover */
.submit-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(16, 33, 75, 0.35);
}

.submit-btn:hover::before {
  transform: translateX(100%);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

BUTTON STATES:

Default:
├─ Background: Navy gradient
├─ Shadow: Medium navy shadow
└─ Icon: White text/icon

Hover:
├─ Transform: Lift up 3px (translateY(-3px))
├─ Shadow: Stronger shadow (larger offset)
├─ Icon: Shine effect sweeps across
└─ Cursor: pointer

Active/Pressed:
├─ Transform: Slight lift 1px (pressed effect)
└─ Maintains focus-visible state

Focus (keyboard navigation):
├─ Border: Gold outline (for accessibility)
└─ Effect: Clear for keyboard users

Disabled:
├─ Opacity: 0.5 (faded)
├─ Cursor: not-allowed
└─ No hover effects

Loading (During submission):
├─ Text: "Publishing..." or "Saving..."
├─ Icon: Load bar animation
├─ State: Disabled (no clicking)
└─ Duration: Until server responds

SECONDARY BUTTONS (Less important CTAs):

.add-rec-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(215, 189, 136, 0.12);
  border: 1.5px dashed var(--accent);
  border-radius: 9px;
  padding: 12px 18px;
  color: var(--accent-dark);
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.add-rec-btn:hover {
  background: rgba(215, 189, 136, 0.2);
  border-color: var(--accent-dark);
  transform: translateY(-2px);
}

.add-rec-btn:active {
  transform: translateY(0);
}

.add-rec-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

TERTIARY BUTTONS (Copy, Delete, Remove):

.copy-btn {
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: 7px;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--primary);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
}

.copy-btn:hover {
  border-color: var(--accent);
  color: var(--accent-dark);
  background: rgba(215, 189, 136, 0.08);
}

.small-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #ef4444;
}

════════════════════════════════════════════════════════════════════════════════════════════════════════
                        9. PET TYPE SELECTOR COMPONENT
════════════════════════════════════════════════════════════════════════════════════════════════════════

🐾 COMPACT HORIZONTAL PET SELECTOR (15 Pet Types):

CSS Styling:

.pet-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.pet-option {
  position: relative;
  flex: 0 0 auto;
}

.pet-option input[type="radio"] {
  display: none;
}

.pet-option label {
  display: inline-block;
  padding: 8px 12px;
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.pet-option label:hover {
  border-color: var(--accent);
  background: rgba(215, 189, 136, 0.08);
}

.pet-option input[type="radio"]:checked + label {
  border-color: var(--accent);
  background: linear-gradient(135deg, rgba(215, 189, 136, 0.2) 0%, 
                                       rgba(215, 189, 136, 0.1) 100%);
  color: var(--accent-dark);
  box-shadow: 0 0 0 2px rgba(215, 189, 136, 0.2);
  transform: scale(1.01);
}

HTML Structure:

<div class="field">
  <label>Type of Pet <span style="font-size:12px;color:var(--muted);">
    (updates customer reviews)</span></label>
  <div class="pet-selector">
    <div class="pet-option">
      <input type="radio" id="pet_dogs" name="mPetType" value="dogs" required>
      <label for="pet_dogs">Dogs</label>
    </div>
    <div class="pet-option">
      <input type="radio" id="pet_cats" name="mPetType" value="cats">
      <label for="pet_cats">Cats</label>
    </div>
    <!-- ... repeat for all 15 types ... -->
  </div>
</div>

AVAILABLE PET TYPES (15 total):
1. Dogs
2. Cats
3. Rabbits
4. Birds
5. Fish
6. Hamsters
7. Guinea Pigs
8. Ferrets
9. Reptiles
10. Turtles
11. Chinchillas
12. Hedgehogs
13. Sugar Gliders
14. Snakes
15. Mice & Rats

FEATURES:
├─ Horizontal flex layout (wraps on small screens)
├─ Compact buttons (not full-width like old dropdown)
├─ 8px gaps between options
├─ Interactive hover (border + background change)
├─ Visual feedback on selection (glow + gradient)
├─ Slight scale animation on select (1.01)
├─ Professional appearance
└─ Mobile responsive (buttons wrap naturally)

KEYBOARD NAVIGATION:
├─ Tab: Navigate between options
├─ Space/Enter: Select option
└─ Fully accessible

JAVASCRIPT (Get Selected Value):

const selectedPet = document.querySelector('input[name="mPetType"]:checked')?.value;
// Returns: "dogs", "cats", etc.

════════════════════════════════════════════════════════════════════════════════════════════════════════
                            10. FILE UPLOAD COMPONENT
════════════════════════════════════════════════════════════════════════════════════════════════════════

📤 FILE DROP ZONE STYLING:

.file-drop {
  padding: 14px 16px;
  border-radius: 9px;
  border: 2px dashed var(--accent);         /* Gold dashed */
  background: rgba(215, 189, 136, 0.08);   /* Light gold tint */
  cursor: pointer;
  text-align: center;
  font-size: 13.5px;
  color: var(--muted);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.file-drop:hover,
.file-drop.dragover {
  border-color: var(--primary);             /* Navy on hover */
  background: rgba(16, 33, 75, 0.06);      /* Navy tint */
  color: var(--text);
}

UPLOAD PREVIEW STYLING:

.uploaded-list {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uploaded-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: rgba(215, 189, 136, 0.08);
  border-radius: 7px;
  border: 1px solid var(--border);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.uploaded-item img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--border);
}

.uploaded-item-meta {
  flex: 1;
  min-width: 0;
}

.uploaded-item-meta strong {
  display: block;
  font-size: 13px;
  color: var(--text);
  font-weight: 600;
}

.uploaded-item-meta .small {
  font-size: 12px;
  color: var(--muted);
}

.small-btn {
  background: #ffffff;
  border-radius: 6px;
  padding: 5px 9px;
  border: 1px solid var(--border);
  color: var(--text);
  cursor: pointer;
  font-size: 12px;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.small-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.small-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #ef4444;
}

FEATURES:
├─ Drag & drop support
├─ Click to upload
├─ Image preview thumbnails
├─ File name display
├─ File size display
├─ Delete button
├─ Visual feedback on drag
└─ Smooth animations

ACCEPTED FILE TYPES:
├─ image/jpeg
├─ image/jpg
├─ image/png
└─ Max size: 5MB per file

════════════════════════════════════════════════════════════════════════════════════════════════════════
                        11. ANIMATION SYSTEM & TRANSITION STANDARDS
════════════════════════════════════════════════════════════════════════════════════════════════════════

⚡ UNIVERSAL TIMING FUNCTION (Used everywhere):

cubic-bezier(0.4, 0, 0.2, 1)

Why this curve?
├─ Professional and smooth (Apple/Google standard)
├─ Feels natural and responsive
├─ Not bouncy (cubic), not abrupt
└─ 0.3s duration is optimal for UI

STANDARD DURATIONS:

Quick Interactions (0.2s):
├─ Border color changes
├─ Small opacity shifts
└─ Example: Focus state change

Standard Transitions (0.3s):
├─ Button hover effects
├─ Input focus effects
├─ Modal/overlay fades
├─ Dropdown opens
└─ Most UI interactions

Animations (0.4-0.8s):
├─ Modal entrance: 0.4s
├─ Icon bounce: 0.6s
├─ Form slides: 0.3s
└─ Item appears: 0.3s

Loading Animations (1.2-1.5s):
├─ Load bar: 1.2s
├─ Spinner: 1s-1.5s
└─ Pulse: 1s

Page Transitions (0.5s):
├─ Fade in/out: 0.3-0.5s
└─ Slide in: 0.4s

KEY ANIMATIONS:

fadeIn:
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
Duration: 0.3s

slideIn:
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
Duration: 0.3s

slideUp:
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
Duration: 0.3s

modalScale:
@keyframes modalScale {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
Duration: 0.4s

modalIconBounce:
@keyframes modalIconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
Duration: 0.6s

slideLoad (Loading Bar):
@keyframes slideLoad {
  0% { transform: translateX(0); opacity: 1; }
  50% { opacity: 0.5; }
  100% { transform: translateX(40px); opacity: 1; }
}
Duration: 1.2s

BUTTON HOVER ANIMATION:

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);              /* Lift effect */
  box-shadow: 0 10px 30px rgba(16,33,75,0.35); /* Shadow grows */
  /* Plus shine effect from ::before */
}

Timing: 0.3s transition
Effect: Feels responsive and premium

INPUT FOCUS ANIMATION:

.field input:focus {
  border-color: var(--accent);
  background: #fafaf8;
  box-shadow: 0 0 0 3px rgba(215,189,136,0.15); /* Gold glow */
}

Timing: 0.3s transition
Effect: Clear visual feedback

════════════════════════════════════════════════════════════════════════════════════════════════════════
                            12. SPACING & LAYOUT SYSTEM
════════════════════════════════════════════════════════════════════════════════════════════════════════

📐 SPACING SCALE:

Base Unit: 4px (though we use 8px increments mostly)

Common Spacing Values:
├─ 6px: Gap between label and input
├─ 8px: Gap between form sections, pet options
├─ 12px: Gap between form fields, button gaps
├─ 14px: Gap between major sections
├─ 16px: Padding inside containers
├─ 18px: Padding on form sections
├─ 20px: Top margin on sections
├─ 24px: Horizontal padding on main wrapper
├─ 32px: Large padding, hero section
└─ 40px: Page max-width padding

FORM LAYOUT:

Max Width: 820px (for readability)
Horizontal Padding: 24px
Vertical Padding: 40px top, 80px bottom

Field Spacing:
├─ Label to Input: 6px gap
├─ Between Fields: 14px gap
├─ Between Sections: 20px margin
└─ Section Padding: 22px internal

BORDER RADIUS SCALE:

6px: Small buttons, tags
7px: Small components
8px: Pet selector, smaller cards
9px: Form inputs, moderate components
10px: Cards, moderate containers
12px: Large buttons
14px: Form sections, major containers
18px: Modals
999px: Fully rounded (pills/badges)

════════════════════════════════════════════════════════════════════════════════════════════════════════
                        13. RESPONSIVE DESIGN & MOBILE CONSIDERATIONS
════════════════════════════════════════════════════════════════════════════════════════════════════════

📱 BREAKPOINTS:

Desktop: 1200px+
Tablet: 768px - 1199px
Mobile: < 768px

RESPONSIVE RULES:

Form Sections:
@media(max-width: 640px) {
  .form-section-body { padding: 16px; }
}

Grid Layouts:
@media(max-width: 540px) {
  .field-row.col2 { grid-template-columns: 1fr; }
}

Pet Selector:
├─ Always: flex with wrapping
├─ Buttons: Inline-block, wrap naturally
└─ No media query needed (already responsive)

Modal:
@media(max-width: 480px) {
  .modal-box { padding: 24px 20px; }
}

Header:
@media(max-width: 640px) {
  .header { padding: 14px 16px; }
}

MOBILE OPTIMIZATIONS:
├─ Larger touch targets (min 44px)
├─ Simpler layouts (single column)
├─ Readable font sizes (14px minimum)
├─ Adequate spacing (8px minimum)
└─ Clear visual feedback on touch

════════════════════════════════════════════════════════════════════════════════════════════════════════
                            14. SVG ICONS (No Emojis Rule)
════════════════════════════════════════════════════════════════════════════════════════════════════════

🎯 ICON STRATEGY: Always use SVG, NEVER use emojis

Why SVG over Emojis?
├─ Consistent across browsers and devices
├─ Customizable colors (using currentColor)
├─ Scalable without quality loss
├─ Professional appearance
├─ Full control over styling
└─ Better accessibility

REQUIRED ICONS (with SVG examples):

1. SUCCESS/CELEBRATION ICON (Modal)
<svg width="48" height="48" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="1.5" 
     style="color: var(--accent-dark);">
  <polyline points="20 21 9 13 20 5 20 21"></polyline>
  <polyline points="4 21 15 13 4 5 4 21"></polyline>
</svg>
Purpose: Success modal icon
Color: Gold (--accent-dark)

2. INFO/ALERT ICON (Warning Box)
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="12" y1="8" x2="12" y2="12"></line>
  <line x1="12" y1="16" x2="12.01" y2="16"></line>
</svg>
Purpose: Warning/info indicator
Color: Red (for warning)

3. LOCK/SECURITY ICON (Auth Gate)
<svg width="44" height="44" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="1.5" 
     style="color: var(--primary);">
  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
</svg>
Purpose: Security/authentication
Color: Navy (--primary)

4. BACK ARROW (Navigation)
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="2" stroke-linecap="round">
  <polyline points="15 18 9 12 15 6"></polyline>
</svg>
Purpose: Back navigation
Color: Muted text

5. PLUS ICON (Add More)
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="2" stroke-linecap="round">
  <line x1="12" y1="5" x2="12" y2="19"></line>
  <line x1="5" y1="12" x2="19" y2="12"></line>
</svg>
Purpose: Add more items
Color: Gold or Navy

6. TRASH/DELETE ICON (Remove)
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
     stroke="currentColor" stroke-width="2" stroke-linecap="round">
  <polyline points="3 6 5 6 21 6"></polyline>
  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
</svg>
Purpose: Delete/remove action
Color: Red on hover

SVG SIZING STANDARDS:
├─ Small icons: 16px (info, close)
├─ Medium icons: 20px (navigation)
├─ Modal icons: 44-48px (large focal point)
└─ Button icons: 14-16px

SVG COLOR USAGE:
<!-- Use currentColor to inherit text color -->
<svg fill="currentColor" ... ><!-- Blue from text-color --></svg>

<!-- Or explicit variable -->
<svg style="color: var(--accent-dark);"><!-- Gold --></svg>

<!-- Or hardcoded if necessary -->
<svg stroke="#10214b"><!-- Navy --></svg>

ICON LIBRARY SOURCES:
├─ Feather Icons (icons.getbootstrap.com)
├─ Heroicons (heroicons.com)
├─ Tabler Icons (tabler-icons.io)
└─ Font Awesome (solid/pro)

════════════════════════════════════════════════════════════════════════════════════════════════════════
                            15. IMPLEMENTATION CHECKLIST
════════════════════════════════════════════════════════════════════════════════════════════════════════

✅ FOR EVERY NEW PAGE, USE THIS CHECKLIST:

COLORS:
☐ Import CSS variables in :root
☐ Navy (#10214b) for primary elements
☐ Gold (#d7bd88) for accents
☐ Warm Gray (#d0c3ba) ONLY on header-badge and hero-tag
☐ Chocolate (#3d2817) ONLY for text on warm gray
☐ Orange (#ED7624) ONLY on logo
☐ Verify all colors match this document

TYPOGRAPHY:
☐ Import Google Fonts (Sora, Cormorant Garamond)
☐ H1: Cormorant Garamond 700, 54px, Navy
☐ H2: Cormorant Garamond 700, 20px, Navy
☐ Body: Sora 400, 16px, Primary text
☐ Labels: Sora 600, 13px uppercase, Navy
☐ Buttons: Sora 700, 15-16px, White

FORMS:
☐ Input borders: Navy 1.5px
☐ Input focus: Gold border + glow
☐ Form labels: Navy uppercase, letter-spacing
☐ Form sections: White background, Navy border
☐ Submit button: Navy gradient, lift hover
☐ Loading animation: Load bar slideLoad 1.2s

MODALS:
☐ Glassmorphic design: 95% white + 8px blur
☐ Border: Gold 1.5px with transparency
☐ Shadow: Navy 20px 60px 20%
☐ Entry animation: modalScale 0.4s
☐ Icons: SVG only (NO emojis)
☐ Close button: Navy gradient

ANIMATIONS:
☐ All transitions: 0.3s cubic-bezier(.4,.0,.2,1)
☐ Button hover: translateY(-3px)
☐ Input focus: Gold glow
☐ Modal entry: Scale + fade
☐ Loading: slideLoad 1.2s infinite

RESPONSIVE:
☐ Max-width: 820px for content
☐ Mobile breakpoint: 640px
☐ Padding adjusts for mobile
☐ Grid layouts stack on mobile
☐ Touch targets: 44px minimum

ACCESSIBILITY:
☐ Semantic HTML structure
☐ Focus states visible
☐ Color not only differentiator
☐ SVG icons have alt text
☐ Buttons are keyboard accessible
☐ Modals trap focus

════════════════════════════════════════════════════════════════════════════════════════════════════════
                            16. COMMON MISTAKES TO AVOID
════════════════════════════════════════════════════════════════════════════════════════════════════════

❌ DON'T DO THIS:

2. Use Emoji Instead of SVG
   WRONG: <span>🎉 Success!</span>
   RIGHT: <span><svg><!-- celebration icon --></svg> Success!</span>

3. Apply Warm Gray to Non-Header Elements
   WRONG: <div style="background: #d0c3ba;">Content</div>
   RIGHT: Only use on .header-badge and .hero-tag

4. Forget Focus States
   WRONG: Input without :focus styling
   RIGHT: .field input:focus { border-color: gold; box-shadow: ...; }

5. Use Inconsistent Transitions
   WRONG: .btn { transition: background 0.1s linear; }
   RIGHT: .btn { transition: all 0.3s cubic-bezier(.4,.0,.2,1); }

6. Make Buttons Too Small
   WRONG: <button style="padding: 5px 8px;">Small</button>
   RIGHT: <button style="padding: 16px 48px;">Big</button>

7. Forget Loading Animation
   WRONG: Button changes text without animation
   RIGHT: Button shows slideLoad animation while loading

8. Use Dark Theme Colors on Light Background
   WRONG: rgba(255,255,255,0.1) border on light background
   RIGHT: rgba(16,33,75,0.12) border (Navy transparent)

9. Miss Pet Selector Responsiveness
   WRONG: Display all 15 pets in straight row
   RIGHT: Use flex-wrap to wrap on mobile

10. Overcomplicate Modal Styling
    WRONG: Solid black background, harsh borders
    RIGHT: Glassmorphic with blur, soft borders

════════════════════════════════════════════════════════════════════════════════════════════════════════
                            17. FILE STRUCTURE & CODE ORGANIZATION
════════════════════════════════════════════════════════════════════════════════════════════════════════

📁 RECOMMENDED FILE STRUCTURE:

/petpay-merchant-platform/
├── /design-system/
│   ├── DESIGN_SYSTEM.md (this file)
│   ├── COLOR_PALETTE.txt
│   ├── TYPOGRAPHY.txt
│   ├── COMPONENTS.txt
│   └── ANIMATIONS.txt
│
├── /pages/
│   ├── merchandise.html (Create Storefront)
│   ├── merchandise-live.html (Edit Storefront)
│   ├── index.html (Dashboard)
│   ├── checkout.html (Checkout)
│   └── [future pages...]
│
├── /assets/
│   ├── /icons/ (SVG icons)
│   ├── /images/
│   └── /fonts/
│
├── /styles/ (optional, if CSS extracted)
│   ├── variables.css
│   ├── typography.css
│   ├── components.css
│   └── animations.css
│
└── /js/ (optional, if JS extracted)
    ├── form-validation.js
    ├── modal-handler.js
    ├── file-upload.js
    └── animations.js

CSS ORGANIZATION (within <style> block):

1. CSS Variables (:root)
2. Universal Styles (*, html, body)
3. Typography & Fonts
4. Layout & Spacing (header, nav, main, footer)
5. Components (forms, buttons, cards, modals)
6. Animations (@keyframes)
7. Responsive Media Queries

════════════════════════════════════════════════════════════════════════════════════════════════════════
                            18. FUTURE PAGE GUIDE
════════════════════════════════════════════════════════════════════════════════════════════════════════

🚀 CREATING NEW PAGES:

Step 1: Copy HTML Template
From merchandise.html or merchandise-live.html, copy the structure:
├─ DOCTYPE and meta tags
├─ Google Fonts import
├─ CSS variable definitions
├─ Basic structure (header, main, footer)
└─ JavaScript framework

Step 2: Apply Color Palette
├─ Use defined CSS variables
├─ No hardcoded colors (use var(--primary), etc.)
├─ Ensure Navy, Gold, Warm Gray usage matches guide
└─ Logo always Orange

Step 3: Set Typography
├─ Cormorant Garamond for headings
├─ Sora for body and UI
├─ Follow sizing hierarchy (54px H1 → 16px body)
└─ Use letter-spacing for uppercase

Step 4: Build Components
├─ Inputs: White bg, Navy border, Gold focus
├─ Buttons: Navy gradient, lift hover, load bar
├─ Modals: Glassmorphic, SVG icons, bouncing animation
├─ Cards: White bg, Navy border, hover effects
└─ Forms: Navy labels, proper spacing

Step 5: Implement Animations
├─ All transitions: 0.3s cubic-bezier
├─ Button hover: -3px lift
├─ Modal entrance: Scale + fade
├─ Loading: slideLoad 1.2s
└─ Ensure smooth, professional feel

Step 6: Test Responsive
├─ Desktop: 1200px+
├─ Tablet: 768px-1199px
├─ Mobile: <768px
├─ Verify all layouts adapt
└─ Touch targets ≥44px

Step 7: Verify Accessibility
├─ Keyboard navigation works
├─ Focus states visible
├─ Color contrast sufficient
├─ SVG icons have alt text
├─ ARIA labels where needed
└─ Semantic HTML

EXAMPLE: Creating a Dashboard Page

1. Start with template structure
2. Set header/nav styling (Navy, Sora)
3. Create card components (white bg, Navy borders)
4. Add forms with our input styling
5. Use pet selector component (copy-paste)
6. Implement buttons (Navy gradient)
7. Add modals (glassmorphic)
8. Test on mobile
9. Verify animations smooth
10. Check color consistency

════════════════════════════════════════════════════════════════════════════════════════════════════════
                            19. SUPPORT & REFERENCE
════════════════════════════════════════════════════════════════════════════════════════════════════════

📚 QUICK REFERENCE:

When implementing something, ask:
├─ "What color should this be?" → Check Color Palette section
├─ "What font size?" → Check Typography Hierarchy
├─ "How should this animate?" → Check Animation section
├─ "Should this use emoji?" → NO! Use SVG instead
├─ "What's the transition timing?" → 0.3s cubic-bezier(.4,.0,.2,1)
├─ "Is this mobile responsive?" → Test at 640px breakpoint
└─ "Does this follow the design?" → Use Implementation Checklist

COMMON COLORS TO COPY:

Navy: #10214b
Gold: #d7bd88
Warm Gray: #d0c3ba
Chocolate: #3d2817
Orange: #ED7624
Background: #f9f7f4
White: #ffffff
Border: rgba(16,33,75,0.12)
Muted: #7a6d5f

COMMON CSS TO COPY:

Standard Transition:
transition: all 0.3s cubic-bezier(.4,.0,.2,1);

Input Styling:
border: 1.5px solid var(--border);
border-radius: 9px;
padding: 11px 14px;

Button Gradient:
background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);

Glassmorphic Modal:
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(10px);
border: 1.5px solid rgba(215, 189, 136, 0.3);

════════════════════════════════════════════════════════════════════════════════════════════════════════
                            20. VERSION HISTORY & UPDATES
════════════════════════════════════════════════════════════════════════════════════════════════════════

Version 1.0 (April 25, 2026) - INITIAL RELEASE
✅ Complete design system documented
✅ Color palette (5 primary colors + 8 functional)
✅ Typography (Cormorant Garamond + Sora)
✅ UI components fully styled
✅ Animation system (0.3s cubic-bezier standard)
✅ Loading animations (slideLoad 1.2s selected)
✅ Glassmorphic modal design
✅ File upload component
✅ Pet type selector (15 types)
✅ Form styling complete
✅ Responsive design verified
✅ SVG icon standards (NO emojis)
✅ Accessibility checklist
✅ Implementation guide for future pages

Pages Completed:
├─ merchandise.html (Create Storefront)
├─ merchandise-live.html (Edit Storefront)
└─ [Ready for new pages]

════════════════════════════════════════════════════════════════════════════════════════════════════════
                                    CONCLUSION
════════════════════════════════════════════════════════════════════════════════════════════════════════

This design system is the OFFICIAL standard for all PetPay merchant platform pages. Every designer and
developer must follow these specifications to ensure:

✅ Professional, cohesive brand appearance
✅ Premium pet industry aesthetic
✅ Consistent user experience across all pages
✅ Smooth, responsive interactions
✅ Accessibility for all users
✅ Future-proof design scalability

The color palette (Navy + Gold + Warm Gray + Chocolate + Orange) is carefully chosen to represent
sophistication, warmth, and premium quality. These colors must be used consistently across all pages.

Typography (Cormorant Garamond + Sora) creates an elegant yet modern voice that appeals to pet business
owners while maintaining professionalism.

Animations (0.3s cubic-bezier) provide smooth, responsive feedback that feels premium and intentional.

Loading animations (slideLoad 1.2s) show progress without distraction, using subtle but professional
motion.

Glassmorphic modals (frosted glass + blur) create modern, trustworthy popups that feel contemporary
and premium.

By following this guide, all PetPay pages will feel like a cohesive, well-designed platform that
inspires confidence in pet business owners.

════════════════════════════════════════════════════════════════════════════════════════════════════════
Document prepared for: PetPay Merchant Platform
For questions or updates: Contact design team
Last reviewed: April 25, 2026
════════════════════════════════════════════════════════════════════════════════════════════════════════
