# GPO SaaS Platform - UX Flow Documentation

## Authentication Flow (Page 2)

### Registration Flow

```
User → Homepage → "Create Account" → Registration Form → OTP Verification → Dashboard
```

**Key Components:**
1. **Registration Form**
   - Fields: Full Name, Email, Country (dropdown), Initial Role (Client/Supplier/Freelancer/Browser)
   - No password field (OTP-based authentication)
   - Submit button: "Create My Account"
   - Security: Input validation, CSRF protection

2. **OTP Verification Screen**
   - 6-digit code input field with digit separation
   - Message: "Verification code sent to your email"
   - Countdown timer for resend option (60 seconds)
   - "Verify" button
   - "Resend Code" option (appears after timer)
   - "Back to Edit Email" option

3. **Backend Process**
   - Generate secure random OTP
   - Store OTP with expiration (5-10 minutes)
   - Rate limiting: Max 3 OTP requests per email in 30 minutes
   - Email delivery with professional template
   - Verification attempts limited to 5 before lockout

### Login Flow

```
User → Homepage → "Login" → Email Input → OTP Verification → Dashboard
```

**Key Components:**
1. **Login Form**
   - Email input field
   - "Send Verification Code" button
   - Alternative: "Create Account" link

2. **OTP Verification** (same as registration)
   - 6-digit code input
   - Resend option with rate limiting
   - Security notifications for new device login

3. **Security Measures**
   - Rate limiting on login attempts
   - Device fingerprinting for suspicious activity
   - Email notification for new device login
   - Session management with secure cookies

## Homepage Design (Page 1)

### Layout Structure

```
Top Header → Hero Section → Service Cards → Search Bar → Open Offers → Footer
```

**Key Components:**
1. **Top Header Bar (Fixed)**
   - Logo (left): "GPO" with Smart Cooperation Platform tagline
   - Language Selector: EN/AR toggle with RTL support
   - Country/Currency Dropdown: All countries with flags
   - Navigation Links: About Us, How It Works, Support
   - Auth Buttons: Login/Register (right)

2. **Hero Section**
   - Background: Subtle gradient or professional illustration
   - Headline: "Smart Contract Platform for Buyers, Suppliers and Freelancers"
   - Subheading: Brief value proposition (1-2 lines)
   - CTA Button: "Start Now" (prominent, centered)

3. **Main Service Cards (4 Gateways)**
   - Card Layout: 2x2 grid on desktop, vertical stack on mobile
   - Each Card:
     - Icon representing service
     - Title (Cooperative Buying, Marketing, Freelancers, Suppliers)
     - Brief description (max 2 lines)
     - "Start" button with arrow icon
     - Visual indicator of individual/group options

4. **Search & Filter Bar**
   - Search input with placeholder "Search the platform..."
   - Filter buttons: All, Sectors dropdown, Regions dropdown
   - Clean, minimal design with clear visual hierarchy

5. **Open Offers Section**
   - Tabbed interface: Groups seeking members, Suppliers, Freelancers
   - Card for each offer showing:
     - Group/Mission name
     - Activity type
     - Country with flag icon
     - Status with color indicator
     - Creation date
     - "View Details" button
   - Limited to 3-4 cards per category with "View More" option

6. **Footer**
   - Links: Privacy Policy, Terms of Use, Site Map, Contact
   - Language/Country selectors (duplicated from header)
   - Support button with chat icon
   - Copyright information

### Security & UX Considerations
- No sensitive data displayed before login
- Clear visual hierarchy and consistent styling
- Mobile-responsive design with appropriate breakpoints
- Performance optimization for images and assets
- Accessibility compliance (WCAG 2.1 AA)

## Group Creation Flow (Page 5)

```
Dashboard → "Create Group" → Type Selection → Form → Submission → Confirmation
```

**Key Components:**
1. **Type Selection**
   - Simple modal with two options:
     - "Group Contract" (collaborative)
     - "Solo Contract" (individual)
   - Visual distinction between options
   - Brief explanation of each type

2. **Gateway Selection**
   - Second step in modal:
     - "Cooperative Buying"
     - "Cooperative Marketing"
     - "Request Freelancers" (if applicable)
   - Icons matching homepage service cards

3. **Group Creation Form**
   - Clean, step-based form with progress indicator
   - Fields:
     - Group Name (with validation)
     - Country/City (dropdown with search)
     - Purpose/Sector (categorized dropdown)
     - Detailed Description (rich text editor)
     - Supplier Type (if applicable)
     - Target Member Count (number input)
     - Negotiation Rounds (1-3+ dropdown)
     - Minimum Entry (number input)
     - RFQ Option (yes/no toggle)
     - File Attachments (drag & drop area)
   - "Create My Group" submit button

4. **Security & Validation**
   - File type restriction (.pdf, .docx, .jpg, .zip only)
   - Size limits on uploads (10MB per file)
   - Input sanitization for all fields
   - Preview option before submission

5. **Confirmation Screen**
   - Success message with group ID
   - Timeline for review process (24 hours)
   - "View My Groups" button
   - Email notification confirmation

## Group Management Flow (Page 6)

```
Dashboard → "My Groups" → Tabs (Created/Joined) → Group Cards → Actions
```

**Key Components:**
1. **Tabbed Interface**
   - "Groups I Created" (default tab)
   - "Groups I Joined"
   - Counter showing number of groups in each tab

2. **Group Card Design**
   - Clean card layout with:
     - Group name (prominent)
     - Activity/Sector with icon
     - Member count with progress indicator (e.g., "5/10 members")
     - Status badge with color coding:
       - Gray: Under Review
       - Green: Open/Active
       - Blue: Voting Phase
       - Yellow: Supplier Selection
       - Red: Closed
     - Creation date
     - Action buttons based on status and role

3. **Action Buttons**
   - "View Details" (always present)
   - Conditional buttons:
     - "New Join Requests" (for founder, with counter)
     - "Request Freelancers" (if applicable)
     - "Edit Group" (first 24h or with permission)

4. **Status Notifications**
   - Visual indicators for time-sensitive actions
   - Countdown for expiring phases
   - Alert for pending votes or decisions

5. **Security & Permissions**
   - Role-based button visibility
   - Data masking for sensitive information
   - Audit logging for all actions

## Group Detail View (Page 7)

```
My Groups → Group Card → Group Room → Tabbed Interface → Actions
```

**Key Components:**
1. **Header Information**
   - Group name and ID
   - Type indicator (Group/Solo, Buying/Marketing)
   - Country/Sector with icons
   - Founder name (with optional avatar)
   - Member count with visual indicator
   - Creation date
   - Status badge

2. **Tabbed Interface**
   - "Overview" (default)
     - Full description
     - Goal statement
     - Requirements list
   - "Members"
     - List view with:
       - Member name/ID
       - Role (Founder/Member/Supervisor)
       - Join date
       - Status indicator
     - Join requests section (for founder)
   - "Voting" (if active)
     - Decision statement
     - Options with visual indicators
     - Current results (percentage bars)
     - Voting buttons
     - Deadline countdown
   - "Supplier Offers" (if applicable)
     - Card view of reviewed offers
     - Summary information
     - "View Full Details" option
     - RFQ download button
     - "Open/Close Submissions" toggle (founder only)
   - "Freelancer Requests" (if applicable)
     - Task descriptions
     - Offer cards
     - Accept/Reject buttons

3. **Action Buttons**
   - "Back to My Groups"
   - "Request Withdrawal" (with confirmation)
   - "End Group" (founder only, with confirmation)
   - "Request Arbitration" (ORDA)

4. **Security & UX Considerations**
   - Role-based content visibility
   - Responsive design for all device sizes
   - Clear visual hierarchy
   - Confirmation dialogs for critical actions

## Supplier Offer Flow (Page 8)

```
Group Details → "Submit Offer" → Offer Form → Submission → Confirmation
```

**Key Components:**
1. **Target Group Information**
   - Group name and ID
   - Activity/Sector
   - Member count
   - Submission deadline

2. **Offer Form**
   - Company/Supplier name (auto-filled)
   - Offer description (rich text editor)
   - Price/Quantity table (dynamic rows)
   - Delivery schedule (date picker)
   - Payment terms (dropdown with custom option)
   - Supporting files upload
   - Offer validity period
   - Additional notes

3. **Security Measures**
   - File type restrictions
   - Content filtering for professional language
   - Preview before submission
   - Non-editable after submission

4. **Confirmation Screen**
   - Success message with offer ID
   - Review timeline (24 hours)
   - "View My Offers" button
   - Email notification confirmation

## Freelancer Offer Flow (Page 10)

```
Mission Details → "Submit Offer" → Offer Form → Submission → Confirmation
```

**Key Components:**
1. **Target Mission Information**
   - Mission name and ID
   - Task type
   - Requesting entity (group/individual)
   - Deadline

2. **Offer Form**
   - Offer description (what, how, methodology)
   - Execution timeline (days/weeks)
   - Price quote (with currency)
   - Sample/portfolio upload (optional)
   - Additional notes

3. **Security & UX Considerations**
   - Clean, focused form design
   - File type restrictions
   - Preview before submission
   - Non-editable after submission

4. **Confirmation Screen**
   - Success message with offer ID
   - Review timeline (48 hours)
   - "View My Tasks" button
   - Email notification confirmation

## Voting System (Within Group Room)

```
Group Room → "Voting" Tab → Decision View → Vote Submission → Results
```

**Key Components:**
1. **Decision Information**
   - Clear title (e.g., "Select Final Supplier")
   - Description of decision context
   - Supporting documents/comparisons
   - Round indicator (e.g., "Round 1 of 3")

2. **Voting Options**
   - Radio button selection
   - Standard options:
     - Approve
     - Reject
     - Abstain
   - Or custom options (e.g., Supplier A, B, C)

3. **Voting Process**
   - Selection of one option
   - "Submit Vote" button
   - Confirmation dialog
   - Success message
   - Non-changeable after submission

4. **Results Display**
   - Percentage bars for each option
   - Vote counts (if appropriate)
   - Status indicator (Open/Closed)
   - Outcome statement after closing

5. **Security & UX Considerations**
   - One vote per member enforcement
   - Anonymous voting (names not displayed)
   - Email notifications for vote start/end
   - Clear visual indicators for deadlines

## Arbitration Request Flow (Page 12)

```
Group Room → "Request Arbitration" → Form → Submission → Case Tracking
```

**Key Components:**
1. **Auto-filled Information**
   - Group name and ID
   - Member ID
   - Current date
   - Generated case ID

2. **Dispute Form**
   - Dispute type dropdown
   - Detailed description (rich text)
   - Evidence upload section
   - Requested action dropdown
   - Optional arbitrator suggestion

3. **Submission Process**
   - Preview before submission
   - "Submit Request" button
   - Confirmation dialog explaining implications
   - Success message with case ID

4. **Case Tracking**
   - Timeline visualization
   - Status updates
   - Communication thread
   - Document repository
   - Final decision display

5. **Security & UX Considerations**
   - Evidence type restrictions
   - Notifications to all parties
   - Confidentiality warnings
   - Clear status indicators

## Notification System

**Types of Notifications:**
1. **Account Notifications**
   - Registration confirmation
   - New device login
   - Password/email changes

2. **Group Notifications**
   - Group creation/approval
   - New member joins
   - Status changes
   - Approaching deadlines

3. **Offer Notifications**
   - Offer submission confirmation
   - Offer review results
   - Selection notifications

4. **Voting Notifications**
   - New vote started
   - Reminder to vote
   - Vote closing soon
   - Vote results

5. **Arbitration Notifications**
   - Case opened
   - Status updates
   - Evidence requests
   - Decision announcements

**Delivery Methods:**
- In-app notification center
- Email notifications (critical only)
- Optional SMS for urgent matters

**UX Considerations:**
- Grouped by category
- Read/unread status
- Actionable notifications
- Clear, concise language
- Frequency controls for users
