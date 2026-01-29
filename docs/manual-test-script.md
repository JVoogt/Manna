# Manual Test Script for Raspberry Pi Deployment

**Purpose:** Verify all interactive features work on actual hardware
**Estimated Time:** 15-20 minutes
**Prerequisites:** Site deployed and accessible on Raspberry Pi

---

## Pre-Test Setup

1. Open browser on Raspberry Pi
2. Navigate to: `http://localhost/` (or your production URL)
3. Open browser DevTools (F12) - keep Console tab visible
4. Have WhatsApp installed and logged in

---

## Test 1: Navigation (3 minutes)

### Steps:
1. Click "About" in header navigation
   - [ ] URL changes to `/about/`
   - [ ] About page loads
   - [ ] Header "About" link is highlighted

2. Click "Contact" in header navigation
   - [ ] URL changes to `/contact/`
   - [ ] Contact page loads
   - [ ] Header "Contact" link is highlighted

3. Click "Home" in header navigation
   - [ ] URL changes to `/`
   - [ ] Homepage loads
   - [ ] Header "Home" link is highlighted

4. Click footer navigation links
   - [ ] All footer links work same as header

### Expected Result:
✅ All navigation works, URLs stay on correct domain/port
✅ No page reloads (SPA behavior)
✅ Active link styling updates

### Console Check:
- [ ] No errors in console

---

## Test 2: Platter Builder (5 minutes)

### Test 2.1: Select Items
1. Scroll to "Curate Your Perfect Selection" section
2. Click on first product card ("Select for R151.74" button)
   - [ ] Toast notification appears: "Ribblets added to platter!"
   - [ ] Platter slot 1 fills with item name and slot number
   - [ ] Button changes to "✓ Selected (Click to Remove)"
   - [ ] Price updates from R0.00 to R151.74
   - [ ] Pricing label shows "Platter (1/6 items)"
   - [ ] Progress bar fills to 1/6

3. Click 5 more different products
   - [ ] Each fills next empty slot
   - [ ] Price increases with each addition
   - [ ] Progress bar fills incrementally
   - [ ] When 6/6: Pricing label shows "Complete Platter"
   - [ ] When 6/6: "Add Platter to Cart" button becomes enabled (changes color)

4. Try to select a 7th item (platter is full)
   - [ ] Nothing happens (platter stays at 6 items)
   - [ ] Toast notification: "Platter is full! Remove an item first"

### Test 2.2: Deselect Items
5. Click a selected product card again (one with "✓ Selected" button)
   - [ ] Item removed from platter slot
   - [ ] Slot becomes empty with just slot number
   - [ ] Price decreases
   - [ ] Toast notification: "Item removed from platter"
   - [ ] Button changes back to "Select for R[price]"
   - [ ] Progress bar decreases

6. Click the "×" button on a filled slot in platter
   - [ ] Item removed from that specific slot
   - [ ] Price decreases
   - [ ] Toast notification appears

7. Click "Clear All" button
   - [ ] All 6 slots empty
   - [ ] Price resets to R0.00
   - [ ] Pricing label shows "Platter (0/6 items)"
   - [ ] Progress bar empties
   - [ ] All product buttons show "Select for R[price]"

### Test 2.3: Dynamic Pricing
8. Select 3 items with different prices (e.g., R151.74, R80.33, R40.77)
   - [ ] Price shows R272.84 (sum of all 3)
   - [ ] Label shows "Platter (3/6 items)"

### Expected Result:
✅ All platter operations work smoothly
✅ Prices calculate correctly
✅ Toast notifications appear and disappear
✅ UI updates in real-time

### Console Check:
- [ ] No errors in console

---

## Test 3: Cart Functionality (5 minutes)

### Test 3.1: Add to Cart
1. Build a complete 6-item platter
2. Click "Add Platter to Cart" button
   - [ ] Toast notification: "Platter added to cart! Total: R[total]"
   - [ ] Cart icon in header shows badge with "6"
   - [ ] Platter clears (all slots empty)

3. Add a prepared meal to cart (scroll to "This Week's Prepared Meals")
   - [ ] Click "Add to Cart" on a meal card
   - [ ] Toast notification: "[Meal Name] added to cart!"
   - [ ] Cart badge increments to "7"

### Test 3.2: View Cart
4. Click cart icon in header
   - [ ] Redirects to `/cart/` page
   - [ ] Shows all 7 items (6 platter items + 1 meal)
   - [ ] Each item has name, price, quantity controls
   - [ ] Subtotal, delivery, total calculated correctly

### Test 3.3: Modify Cart
5. Click "+" button on any item
   - [ ] Quantity increases
   - [ ] Price updates (item price × quantity)
   - [ ] Subtotal and total update

6. Click "-" button on an item
   - [ ] Quantity decreases
   - [ ] Price updates
   - [ ] Subtotal and total update

7. Decrease an item to quantity 0
   - [ ] Item removed from cart
   - [ ] Toast notification: "Item removed from cart"
   - [ ] Cart badge decreases

8. Click "×" remove button on an item
   - [ ] Item removed immediately
   - [ ] Toast notification appears
   - [ ] Cart badge decreases

### Test 3.4: Cart Persistence
9. Refresh the page (F5)
   - [ ] Cart items still present (loaded from localStorage)
   - [ ] Quantities and prices correct
   - [ ] Cart badge shows correct count

10. Open new browser tab, navigate to site
    - [ ] Cart badge shows same count
    - [ ] Cart contents match original tab

### Expected Result:
✅ Cart operations work smoothly
✅ Calculations always correct
✅ Cart persists across refreshes
✅ Cart badge always accurate

### Console Check:
- [ ] No errors in console

---

## Test 4: Checkout (4 minutes)

### Test 4.1: Form Validation
1. From cart page, click "Proceed to Checkout"
   - [ ] Redirects to `/checkout/` page
   - [ ] Shows order summary with all cart items
   - [ ] Shows delivery fee (R50)
   - [ ] Shows total price

2. Click "Complete Order" without filling form
   - [ ] Validation errors appear below each field
   - [ ] Errors: "Name is required", "Phone is required", etc.
   - [ ] No WhatsApp popup opens

3. Fill only name field, click "Complete Order"
   - [ ] Only name field passes validation (no error)
   - [ ] Other fields still show errors

### Test 4.2: Phone Validation
4. Enter invalid phone: "123"
   - [ ] Error: "Invalid phone number"

5. Enter valid SA phone: "0825795210"
   - [ ] No error (validation passes)

### Test 4.3: Email Validation
6. Enter invalid email: "test@"
   - [ ] Error: "Invalid email address"

7. Enter valid email: "test@example.com"
   - [ ] No error (validation passes)

### Test 4.4: Date Validation
8. Try to select yesterday's date
   - [ ] Date picker should block past dates (or show error)

9. Select tomorrow's date
   - [ ] No error (validation passes)

### Test 4.5: Successful Checkout
10. Fill all fields correctly:
    - Name: "Test User"
    - Phone: "0825795210"
    - Email: "test@example.com"
    - Delivery Date: Tomorrow
    - Delivery Address: "123 Test St, Pretoria North"
    - Special Instructions: "Test order"

11. Click "Complete Order"
    - [ ] WhatsApp opens (web or app)
    - [ ] Message is pre-filled with:
      - Your name
      - Your contact details
      - All cart items with quantities and prices
      - Delivery date and address
      - Special instructions
      - Total price including delivery
    - [ ] Phone number in WhatsApp is: +27825795210

### Expected Result:
✅ Validation works correctly (stops invalid submissions)
✅ WhatsApp opens with formatted order
✅ All order details included in message

### Console Check:
- [ ] No errors in console

---

## Test 5: Responsive Layout (Touch Screen) (2 minutes)

### Test 5.1: Touch Targets
1. Try to tap all navigation links in header
   - [ ] All links are easily tappable (no mis-taps)
   - [ ] Minimum 44px touch target achieved

2. Try to tap product "Add to Cart" buttons
   - [ ] All buttons easily tappable
   - [ ] No accidental double-taps

3. Try to tap platter slot remove buttons (×)
   - [ ] Small ×buttons still tappable
   - [ ] No mis-taps on adjacent slots

### Test 5.2: Scrolling
4. Scroll through product grid
   - [ ] Smooth scrolling
   - [ ] No janky animations
   - [ ] Touch scrolling responsive

5. Scroll to top and observe scroll indicator
   - [ ] Animated arrow bounces
   - [ ] "Scroll to explore treats" text visible
   - [ ] (Mobile only: should be hidden on small screens)

### Test 5.3: Layout Check
6. Check header on mobile screen
   - [ ] Navigation stacks vertically (if screen < 640px)
   - [ ] Brand name centered
   - [ ] Cart icon visible and tappable

7. Check platter grid
   - [ ] Shows 2 columns on mobile
   - [ ] Shows 3 columns on larger screens
   - [ ] Slots are touch-friendly size

8. Check product grid
   - [ ] Shows 1 column on mobile
   - [ ] Shows 2+ columns on larger screens

### Expected Result:
✅ All touch targets easily tappable
✅ Layout responsive and readable
✅ No overlapping elements
✅ Smooth scrolling performance

### Console Check:
- [ ] No errors in console

---

## Test 6: Performance Check (1 minute)

### Test 6.1: Page Load Times
1. Open DevTools Network tab
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check "Load" time in Network tab footer
   - [ ] Homepage loads in < 2 seconds
   - [ ] Ideally < 1 second on Raspberry Pi 4/5

### Test 6.2: Navigation Performance
4. Click between pages (Home → About → Contact → Cart)
   - [ ] Each page loads instantly (< 100ms)
   - [ ] No visible lag or loading spinners

### Test 6.3: Image Loading
5. Scroll through product grid
   - [ ] Product images load quickly from Cloudflare R2
   - [ ] No broken images (404 errors)

### Expected Result:
✅ Fast page loads (< 2 seconds)
✅ Instant navigation between pages
✅ Images load from CDN quickly

### Console Check:
- [ ] No failed network requests (404, 500 errors)

---

## Final Console Check (1 minute)

### Review Console Tab
- [ ] **0 Errors:** No red error messages
- [ ] **0 Warnings:** No yellow warning messages
- [ ] No React hydration mismatches
- [ ] No CORS errors
- [ ] No failed API calls

### Review Network Tab
- [ ] All requests show 200 status codes (green)
- [ ] No 404 (Not Found) errors
- [ ] No 500 (Server Error) errors

---

## Test Summary

**Total Tests:** 6 categories, ~40 individual checks
**Time Spent:** ______ minutes
**Tests Passed:** ______ / 40
**Tests Failed:** ______ / 40

### Issues Found
(List any issues encountered during testing)

1. Issue: ___________________________________
   - Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
   - Description: _________________________________
   - Steps to reproduce: _________________________

2. Issue: ___________________________________
   - Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
   - Description: _________________________________
   - Steps to reproduce: _________________________

---

## Sign-Off

**Tested By:** ___________________________
**Date:** ___________________________
**Device:** Raspberry Pi [ ] 3 [ ] 4 [ ] 5
**Display:** [ ] Official Touch Screen [ ] HDMI Monitor [ ] Other: __________
**Browser:** [ ] Chromium [ ] Firefox [ ] Other: __________

**Approval:** [ ] APPROVED FOR PRODUCTION [ ] FIXES REQUIRED

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
