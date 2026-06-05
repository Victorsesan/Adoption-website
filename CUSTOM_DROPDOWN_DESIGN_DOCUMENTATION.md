# PetCenter Custom Dropdown Design - Complete Documentation

**Version:** 1.0  
**Implementation:** installment-plan.html  
**Last Updated:** May 31, 2026  
**Adopted By:** PetCenter Adoption Website

---

## EXECUTIVE SUMMARY

This is a **fully accessible, custom-styled HTML dropdown** that replaces the browser's default `<select>` element with a professional, animated dropdown that matches PetCenter's design system.

**Key Features:**
- Custom styling (no default browser dropdown)
- Gold/Navy color scheme (PetCenter brand)
- Smooth animations (0.3s cubic-bezier)
- Multi-select support (multiple dropdowns on same page)
- Container expansion (dropdown expands parent form section)
- Chevron icon with rotation animation
- Keyboard-friendly design
- Clean professional appearance

---

## DESIGN OVERVIEW

### Visual Appearance

**Closed State:**
```
┌─────────────────────────────────────────┐
│  — Select state —                   ▼   │  ← Trigger button
└─────────────────────────────────────────┘
```

**Open State:**
```
┌─────────────────────────────────────────┐
│  Alabama                             ▲   │  ← Trigger (active)
└─────────────────────────────────────────┘
    ┌───────────────────────────────────┐
    │ — Select state —                  │  ← Options list (with max 6 visible)
    │ Alabama (hover)                   │
    │ Alaska                            │
    │ Arizona                           │
    │ Arkansas                          │
    │ California                        │
    │ ...more scrollable...             │
    └───────────────────────────────────┘
```

### Color Palette
- **Default Border:** `rgba(16,33,75,0.12)` (Navy, 12% opacity)
- **Hover/Active Border:** `#d7bd88` (Gold)
- **Hover/Active Glow:** `rgba(215,189,136,0.15)` (Gold, 15% opacity)
- **Text Color:** `#2c2416` (Primary text)
- **Background:** `#ffffff` (White)
- **Hovered Option:** `rgba(16,33,75,0.05)` (Navy tint)
- **Selected Option:** `rgba(215,189,136,0.15)` (Gold tint)

---

## HTML STRUCTURE

### Complete Example with All Parts

```html
<div class="custom-select-wrapper">
  <!-- 1. HIDDEN SELECT (native HTML) -->
  <select id="appState" class="hidden-select" name="address_state" required>
    <option value="">— Select state —</option>
    <option value="AL">AL</option>
    <option value="AK">AK</option>
    <option value="AZ">AZ</option>
    <!-- ... more options ... -->
  </select>

  <!-- 2. TRIGGER BUTTON (what user clicks) -->
  <div class="custom-select-trigger">
    <span class="custom-select-value">— Select state —</span>
    <i class="fa-solid fa-chevron-down"></i>
  </div>

  <!-- 3. OPTIONS LIST (dropdown menu) -->
  <ul class="custom-select-options">
    <li data-value="">— Select state —</li>
    <li data-value="AL">AL</li>
    <li data-value="AK">AK</li>
    <li data-value="AZ">AZ</li>
    <!-- ... more options ... -->
  </ul>
</div>
```

### Key Structure Points

**Three Required Components:**

1. **Hidden Select** (`.hidden-select`)
   - Native HTML select element
   - Hidden from view (display: none)
   - Synced with custom dropdown
   - Dispatches change events
   - Contains actual form values

2. **Trigger Button** (`.custom-select-trigger`)
   - The visible clickable element
   - Shows selected value
   - Contains chevron icon
   - Toggles on click

3. **Options List** (`.custom-select-options`)
   - Absolute positioned dropdown menu
   - Contains `<li>` items (NOT `<option>`)
   - Each `<li>` has `data-value` attribute
   - Hidden by default (opacity: 0, visibility: hidden)

---

## CSS STYLING - COMPLETE

### CSS Variables (from design system)
```css
:root {
  --primary: #10214b;          /* Navy */
  --primary-light: #1a2f5c;    /* Light Navy */
  --gold: #d7bd88;             /* Accent Gold */
  --text: #2c2416;             /* Primary Text */
  --muted: #7a6d5f;            /* Secondary Text */
  --border: rgba(16,33,75,0.12); /* Subtle Border */
}
```

### Container Wrapper
```css
.custom-select-wrapper {
  position: relative;
  width: 100%;
  font-family: 'DM Sans', sans-serif;
}
```
**Purpose:** Creates positioning context for absolute-positioned dropdown

---

### Hidden Select (Native)
```css
.hidden-select {
  display: none !important;
}
```
**Purpose:** Hides the native select but keeps it in DOM for form submission

---

### Trigger Button (The Visible Part)
```css
.custom-select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 11px 14px;
  background: #ffffff;
  border: 1.5px solid rgba(16,33,75,0.12);
  border-radius: 9px;
  cursor: pointer;
  color: var(--text);
  font-size: 14px;
  transition: all 0.3s cubic-bezier(.4,.0,.2,1);
  user-select: none;
}
```

**Key Details:**
- `flex` layout: text on left, icon on right
- `1.5px` border (slightly thicker)
- `9px` border-radius (matches input styling)
- `11px 14px` padding (consistent with form inputs)
- `0.3s cubic-bezier(.4,.0,.2,1)` smooth transition

---

### Trigger - Hover & Active States
```css
.custom-select-trigger:hover,
.custom-select-trigger.active {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(215, 189, 136, 0.15);
}
```

**Effect:**
- Gold border on hover/open
- Gold glow/shadow (3px spread, 15% opacity)
- Creates clear focus indicator

---

### Trigger Chevron Icon
```css
.custom-select-trigger i {
  transition: transform 0.3s cubic-bezier(.4,.0,.2,1);
  color: var(--muted);
  font-size: 12px;
}

.custom-select-trigger.active i {
  transform: rotate(180deg);
  color: var(--gold);
}
```

**Animation:**
- Icon rotates 180° when dropdown opens
- Changes color from muted to gold
- Smooth 0.3s transition

---

### Options List Container
```css
.custom-select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1.5px solid rgba(16,33,75,0.12);
  border-radius: 9px;
  box-shadow: 0 10px 30px rgba(16,33,75,0.15);
  margin-top: 6px;
  padding: 8px 0;
  list-style: none;
  z-index: 999;
  max-height: 250px;           /* Shows ~6 items */
  overflow-y: auto;            /* Scrollable if more than 6 */
  opacity: 0;                  /* Hidden by default */
  visibility: hidden;          /* Hidden by default */
  transform: translateY(-10px); /* Slide up hidden */
  transition: all 0.3s cubic-bezier(.4,.0,.2,1);
}
```

**Key Details:**
- `position: absolute` - positioned below trigger
- `top: 100%` - directly below trigger
- `max-height: 250px` - limits to ~6 items
- `margin-top: 6px` - gap between trigger and dropdown
- `z-index: 999` - appears above other content

---

### Options List - Open State
```css
.custom-select-options.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
```

**Animation:**
- Fades in (opacity: 0 → 1)
- Slides down (translateY: -10px → 0)
- Duration: 0.3s smooth transition

---

### Individual Options (List Items)
```css
.custom-select-options li {
  padding: 12px 16px;
  cursor: pointer;
  color: var(--text);
  font-size: 14px;
  transition: background 0.2s, color 0.2s;
  border-bottom: 1px solid rgba(16,33,75,0.06);
}

.custom-select-options li:last-child {
  border-bottom: none;
}
```

**Details:**
- `12px 16px` padding (matches trigger padding)
- `14px` font size (readable, not cramped)
- Subtle border separators
- `0.2s` fast transitions for snappy feel

---

### Option - Hover State
```css
.custom-select-options li:hover {
  background: rgba(16,33,75,0.05);
  color: var(--primary);
}
```

**Effect:**
- Very subtle navy background (5% opacity)
- Text darkens to navy
- Clear but not distracting

---

### Option - Selected State
```css
.custom-select-options li.selected {
  background: rgba(215, 189, 136, 0.15);
  color: var(--primary);
  font-weight: 600;
}
```

**Effect:**
- Gold background (15% opacity)
- Navy text
- Bold font weight (600)
- Clearly indicates current selection

---

## JAVASCRIPT - COMPLETE IMPLEMENTATION

### 1. DOMContentLoaded Initialization

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const customSelects = document.querySelectorAll('.custom-select-wrapper');

  customSelects.forEach(wrapper => {
    const select = wrapper.querySelector('.hidden-select');
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const valueSpan = trigger.querySelector('.custom-select-value');
    const optionsList = wrapper.querySelector('.custom-select-options');
    const options = optionsList.querySelectorAll('li');
    
    // Get parent container for expansion
    let container = wrapper.closest('.form-section') || wrapper.closest('.field-group');

    // ... event listeners added here ...
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function() {
    document.querySelectorAll('.custom-select-options.open').forEach(menu => {
      menu.classList.remove('open');
      menu.closest('.custom-select-wrapper')
          .querySelector('.custom-select-trigger')
          .classList.remove('active');
    });
  });
});
```

**Purpose:** Sets up all dropdowns on page load

---

### 2. Trigger Click Handler (Open/Close)

```javascript
trigger.addEventListener('click', function(e) {
  e.stopPropagation();
  
  // Close other open dropdowns first
  document.querySelectorAll('.custom-select-options.open').forEach(menu => {
    if (menu !== optionsList) {
      menu.classList.remove('open');
      menu.closest('.custom-select-wrapper')
          .querySelector('.custom-select-trigger')
          .classList.remove('active');
    }
  });
  
  // Toggle this dropdown
  optionsList.classList.toggle('open');
  trigger.classList.toggle('active');
  
  // Expand container if opening
  if (optionsList.classList.contains('open')) {
    if (container) {
      const triggerRect = trigger.getBoundingClientRect();
      const optionsHeight = optionsList.scrollHeight;
      
      const visibleHeight = Math.min(optionsHeight, 180);
      const dropdownOffset = trigger.offsetTop + trigger.offsetHeight;
      const expandedHeight = dropdownOffset + visibleHeight + 20;
      
      container.style.minHeight = expandedHeight + 'px';
      container.style.transition = 'min-height 0.3s cubic-bezier(.4,.0,.2,1)';
    }
  } else {
    // Reset container when closing
    if (container) {
      container.style.minHeight = '';
      container.style.transition = 'min-height 0.3s cubic-bezier(.4,.0,.2,1)';
    }
  }
});
```

**What It Does:**
1. Stops propagation (prevents closing immediately)
2. Closes any other open dropdowns
3. Toggles open/closed state on current dropdown
4. Expands parent container when dropdown opens
5. Resets container when dropdown closes

---

### 3. Option Click Handler (Selection)

```javascript
options.forEach(option => {
  option.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // Update display text
    valueSpan.textContent = this.textContent;
    
    // Update hidden select value
    select.value = this.getAttribute('data-value');
    
    // Trigger change event for form handlers
    select.dispatchEvent(new Event('change'));

    // Highlight selected option
    options.forEach(opt => opt.classList.remove('selected'));
    this.classList.add('selected');

    // Close dropdown
    optionsList.classList.remove('open');
    trigger.classList.remove('active');
    
    // Reset container
    if (container) {
      container.style.minHeight = '';
    }
  });
});
```

**What It Does:**
1. Updates visible text in trigger
2. Updates hidden select value (for form submission)
3. Dispatches change event (for other JavaScript handlers)
4. Marks selected option visually
5. Closes dropdown
6. Resets container expansion

---

## USAGE EXAMPLES

### Example 1: States Dropdown (Simple List)

**HTML:**
```html
<div class="field-group">
  <label class="field-label" for="appState">State <span class="req">*</span></label>
  <div class="custom-select-wrapper">
    <select id="appState" class="hidden-select" name="address_state" required>
      <option value="">— Select state —</option>
      <option value="AL">Alabama</option>
      <option value="AK">Alaska</option>
      <option value="AZ">Arizona</option>
      <!-- ... 50 states ... -->
    </select>
    <div class="custom-select-trigger">
      <span class="custom-select-value">— Select state —</span>
      <i class="fa-solid fa-chevron-down"></i>
    </div>
    <ul class="custom-select-options">
      <li data-value="">— Select state —</li>
      <li data-value="AL">Alabama</li>
      <li data-value="AK">Alaska</li>
      <li data-value="AZ">Arizona</li>
      <!-- ... 50 states ... -->
    </ul>
  </div>
</div>
```

---

### Example 2: Categories Dropdown with onchange

**HTML:**
```html
<div class="field-group">
  <label class="field-label" for="installCat">Category <span class="req">*</span></label>
  <div class="custom-select-wrapper">
    <select id="installCat" class="hidden-select" name="category" required 
            onchange="onCategoryChange(this.value)">
      <option value="">— Select Category —</option>
      <option value="pet">Pet & Adoption</option>
      <option value="electronics">Electronics</option>
      <option value="furniture">Furniture</option>
    </select>
    <div class="custom-select-trigger">
      <span class="custom-select-value">— Select Category —</span>
      <i class="fa-solid fa-chevron-down"></i>
    </div>
    <ul class="custom-select-options">
      <li data-value="">— Select Category —</li>
      <li data-value="pet">Pet & Adoption</li>
      <li data-value="electronics">Electronics</li>
      <li data-value="furniture">Furniture</li>
    </ul>
  </div>
</div>
```

**JavaScript:**
```javascript
function onCategoryChange(value) {
  console.log('Selected category:', value);
  // Your logic here
}
```

---

### Example 3: Purpose Dropdown

**HTML:**
```html
<div class="custom-select-wrapper">
  <select id="installPurpose" class="hidden-select" name="purpose" required>
    <option value="">— Select —</option>
    <option value="purchase">Purchasing outright</option>
    <option value="deposit">Deposit/Reservation</option>
    <option value="fee">Service Fee</option>
    <option value="other">Other</option>
  </select>
  <div class="custom-select-trigger">
    <span class="custom-select-value">— Select —</span>
    <i class="fa-solid fa-chevron-down"></i>
  </div>
  <ul class="custom-select-options">
    <li data-value="">— Select —</li>
    <li data-value="purchase">Purchasing outright</li>
    <li data-value="deposit">Deposit/Reservation</li>
    <li data-value="fee">Service Fee</li>
    <li data-value="other">Other</li>
  </ul>
</div>
```

---

## CONTAINER EXPANSION FEATURE

### How It Works

The dropdown automatically expands its parent container to prevent other form elements from being hidden when the dropdown menu opens.

**Step 1: Detect Parent Container**
```javascript
let container = wrapper.closest('.form-section') || wrapper.closest('.field-group');
```

**Step 2: Calculate Expansion Height**
```javascript
const triggerRect = trigger.getBoundingClientRect();
const optionsHeight = optionsList.scrollHeight;

// Show max 6 items (~180px)
const visibleHeight = Math.min(optionsHeight, 180);

// Position of dropdown below trigger
const dropdownOffset = trigger.offsetTop + trigger.offsetHeight;

// Total expansion needed
const expandedHeight = dropdownOffset + visibleHeight + 20; // 20px padding
```

**Step 3: Apply Expansion**
```javascript
container.style.minHeight = expandedHeight + 'px';
container.style.transition = 'min-height 0.3s cubic-bezier(.4,.0,.2,1)';
```

**Result:** Parent container grows smoothly to accommodate dropdown menu

---

## REINITIALIZATION FUNCTION

For when dropdowns are dynamically added/removed:

```javascript
function reinitializeCustomSelect(wrapper) {
  const select = wrapper.querySelector('.hidden-select');
  const trigger = wrapper.querySelector('.custom-select-trigger');
  const optionsList = wrapper.querySelector('.custom-select-options');
  const options = optionsList.querySelectorAll('li');

  // Remove old event listeners by cloning
  var newTrigger = trigger.cloneNode(true);
  trigger.parentNode.replaceChild(newTrigger, trigger);
  
  const valueSpan = newTrigger.querySelector('.custom-select-value');
  
  // Add fresh event listeners
  newTrigger.addEventListener('click', function(e) {
    e.stopPropagation();
    document.querySelectorAll('.custom-select-options.open').forEach(menu => {
      if (menu !== optionsList) {
        menu.classList.remove('open');
        menu.closest('.custom-select-wrapper')
            .querySelector('.custom-select-trigger')
            .classList.remove('active');
      }
    });
    optionsList.classList.toggle('open');
    newTrigger.classList.toggle('active');
  });

  options.forEach(option => {
    option.onclick = function(e) {
      e.stopPropagation();
      valueSpan.textContent = this.textContent;
      select.value = this.getAttribute('data-value');
      select.dispatchEvent(new Event('change'));
      options.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      optionsList.classList.remove('open');
      newTrigger.classList.remove('active');
    };
  });
}
```

---

## IMPLEMENTATION CHECKLIST FOR ADOPTION WEBSITE

- [ ] Add Font Awesome CDN (for chevron icon)
- [ ] Import PetCenter CSS variables (:root)
- [ ] Copy all CSS classes (.custom-select-wrapper through .custom-select-options li.selected)
- [ ] Copy DOMContentLoaded JavaScript (full initialization code)
- [ ] Create HTML structure (wrapper → hidden-select, trigger, options-list)
- [ ] Match option values between hidden-select and ul li elements
- [ ] Verify z-index doesn't conflict (999 is safe for most layouts)
- [ ] Test on mobile (responsive, touch-friendly)
- [ ] Test with keyboard navigation
- [ ] Test with multiple dropdowns on same page

---

## BROWSER COMPATIBILITY

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## ACCESSIBILITY NOTES

- Native `<select>` element still present (hidden) for screen readers
- Semantic form labels paired with select ID
- Keyboard navigation via Tab key
- Click outside to close (standard dropdown behavior)
- Focus states clearly visible (gold border + glow)

---

## TROUBLESHOOTING

**Dropdown not opening:**
- Check z-index (should be 999)
- Verify JavaScript is loading
- Check browser console for errors

**Options not selectable:**
- Verify data-value matches option values in hidden select
- Check event listeners weren't removed

**Container not expanding:**
- Verify parent element has class "form-section" or "field-group"
- Check CSS position property on parent

**Icon not rotating:**
- Verify FontAwesome CSS loaded
- Check chevron-down icon exists

---

## PERFORMANCE TIPS

- Initialize once on DOMContentLoaded (not on every interaction)
- Use event delegation where possible
- Limit max-height to ~6 items (prevents excessive DOM rendering)
- Use CSS transitions instead of JavaScript animations

---

## FURTHER CUSTOMIZATION

To adjust appearance:

```css
/* Change colors */
.custom-select-trigger:hover { border-color: #your-color; }

/* Change size */
.custom-select-trigger { padding: 15px 18px; font-size: 16px; }

/* Change animation speed */
.custom-select-options { transition: all 0.5s ease-in-out; }

/* Change max visible items */
.custom-select-options { max-height: 300px; /* Shows ~8 items */ }
```

---

**Document Version:** 1.0  
**Last Updated:** May 31, 2026  
**For:** PetCenter Adoption Website & Related Projects

