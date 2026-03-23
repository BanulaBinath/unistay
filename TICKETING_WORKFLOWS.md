# Unistay Ticketing System - Workflows

## 📋 Table of Contents
1. [Student Workflow](#student-workflow)
2. [Admin Workflow](#admin-workflow)
3. [Ticket Status Flow](#ticket-status-flow)
4. [Priority Assignment](#priority-assignment)
5. [Warning System](#warning-system)
6. [Escalation Process](#escalation-process)

---

## 👨‍🎓 Student Workflow

### Creating a Complaint

```
Student Dashboard
       ↓
Click "Submit New Complaint"
       ↓
Create Complaint Form
       ↓
Fill Required Fields:
  - Title
  - Service Category
  - Complaint Type
  - Description
       ↓
Optional Fields:
  - Select Vendor
  - Vendor Reference
  - Service Reference
       ↓
Submit
       ↓
Ticket Created
  - Auto-generated number (TCK-2026-XXXX)
  - Auto-assigned priority
  - Status: "open"
       ↓
Redirect to "My Complaints"
```

### Managing a Ticket

```
My Complaints Page
       ↓
View List of Tickets
  - Filter by status
  - Filter by priority
  - Filter by category
       ↓
Click on Ticket
       ↓
Ticket Details Page
       ↓
Available Actions:
  ├─ Add Reply
  │    └─ Type message → Send
  │         └─ Status may change to "waiting_vendor"
  │
  ├─ Escalate
  │    └─ Provide reason → Confirm
  │         └─ Status: "escalated"
  │         └─ Escalation level +1 (max 3)
  │
  ├─ Close
  │    └─ Confirm
  │         └─ Status: "closed"
  │         └─ closedAt timestamp set
  │
  └─ Reopen (if closed/resolved)
       └─ Provide reason → Confirm
            └─ Status: "reopened"
```

---

## 👨‍💼 Admin Workflow

### Viewing Tickets

```
Admin Dashboard
       ↓
Click "Manage Tickets"
       ↓
Admin Tickets Page
       ↓
View Statistics:
  - Total tickets
  - Open tickets
  - Escalated tickets
  - Resolved tickets
  - Urgent tickets
  - Warned vendors
       ↓
Filter Tickets:
  - Search by number/title
  - Filter by status
  - Filter by priority
  - Filter by category
  - Filter by type
       ↓
View Tickets Table
       ↓
Click "View" on Ticket
```

### Managing a Ticket

```
Admin Ticket Details Page
       ↓
Review Information:
  ├─ Ticket details
  ├─ Student info
  ├─ Vendor info
  ├─ Conversation history
  ├─ Action history
  ├─ Warning recommendations
  └─ Misuse alerts
       ↓
Available Actions:
       ↓
┌──────────────────────────────────────┐
│                                      │
├─ Change Status                       │
│    └─ Select new status              │
│    └─ Add notes (optional)           │
│    └─ Confirm                         │
│                                      │
├─ Change Priority                     │
│    └─ Select new priority            │
│    └─ Add notes (optional)           │
│    └─ Confirm                         │
│                                      │
├─ Assign Ticket                       │
│    └─ Select admin                   │
│    └─ Add notes (optional)           │
│    └─ Confirm                         │
│                                      │
├─ Resolve Ticket                      │
│    └─ Add resolution notes           │
│    └─ Confirm                         │
│    └─ Status: "resolved"             │
│    └─ resolvedAt timestamp set       │
│                                      │
├─ Close Ticket                        │
│    └─ Add closing notes              │
│    └─ Confirm                         │
│    └─ Status: "closed"               │
│    └─ closedAt timestamp set         │
│                                      │
├─ Warn Vendor                         │
│    └─ Review warning recommendation  │
│    └─ Enter warning reason           │
│    └─ Confirm                         │
│    └─ warningIssued: true            │
│    └─ Warning details recorded       │
│                                      │
├─ Reject Ticket                       │
│    └─ Enter rejection reason         │
│    └─ Confirm                         │
│    └─ Status: "rejected"             │
│    └─ Check student misuse alert     │
│                                      │
└─ Add Message                         │
     └─ Type admin message             │
     └─ Send                            │
     └─ Message added to thread        │
                                       │
└──────────────────────────────────────┘
```

---

## 🔄 Ticket Status Flow

### Complete Status Diagram

```
                    [CREATED]
                        ↓
                    ┌───────┐
                    │ OPEN  │ ← (Initial status)
                    └───┬───┘
                        ↓
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
  ┌──────────┐   ┌─────────────┐   ┌──────────┐
  │ESCALATED │   │ IN_PROGRESS │   │REJECTED  │
  └────┬─────┘   └──────┬──────┘   └──────────┘
       │                ↓                (End)
       │         ┌──────────────┐
       │         │WAITING_VENDOR│
       │         └──────┬───────┘
       │                ↓
       │         ┌──────────────┐
       │         │WAITING_STUDENT│
       │         └──────┬───────┘
       │                ↓
       └────────→ ┌─────────┐
                  │RESOLVED │
                  └────┬────┘
                       ↓
                  ┌────────┐
                  │CLOSED  │
                  └────┬───┘
                       ↓
                  ┌────────┐
                  │REOPENED│
                  └────┬───┘
                       │
                       └──→ (Back to IN_PROGRESS)
```

### Status Transitions

```
FROM              TO                  WHO CAN DO IT
────────────────────────────────────────────────────
open           → in_progress         Admin
open           → escalated           Student, Admin
open           → rejected            Admin

in_progress    → waiting_vendor      Admin
in_progress    → waiting_student     Admin
in_progress    → escalated           Student, Admin
in_progress    → resolved            Admin, Vendor
in_progress    → rejected            Admin

waiting_vendor → waiting_student     Vendor (via reply)
waiting_vendor → resolved            Admin, Vendor

waiting_student→ waiting_vendor      Student (via reply)
waiting_student→ resolved            Admin

escalated      → in_progress         Admin
escalated      → resolved            Admin
escalated      → rejected            Admin

resolved       → closed              Student, Admin
resolved       → reopened            Student

closed         → reopened            Student

reopened       → in_progress         Admin
reopened       → resolved            Admin
```

---

## 🎯 Priority Assignment

### Auto-Assignment Logic

```
Complaint Type              →  Priority
─────────────────────────────────────────
late_delivery              →  LOW
other                      →  LOW

poor_quality               →  MEDIUM
wrong_item                 →  MEDIUM
cleanliness_issue          →  MEDIUM

service_not_delivered      →  HIGH
bad_behavior               →  HIGH
payment_issue              →  HIGH

fraud_or_fake_service      →  URGENT
```

### Priority Override

```
Auto-Assigned Priority
         ↓
    ┌─────────┐
    │ CREATED │
    └────┬────┘
         ↓
    Admin Review
         ↓
    ┌─────────────────┐
    │ Manual Override?│
    └────┬────────┬───┘
         │        │
        YES      NO
         ↓        ↓
    New Priority  Keep Auto-Priority
```

---

## ⚠️ Warning System

### Vendor Warning Flow

```
Ticket Created/Updated
         ↓
Check Vendor History
         ↓
Count Valid Complaints (Last 30 Days)
         ↓
┌────────────────────────────────────┐
│                                    │
│  Fraud/Safety Complaint?           │
│  └─ YES → URGENT ESCALATION        │
│                                    │
│  2+ Urgent Complaints?             │
│  └─ YES → IMMEDIATE REVIEW         │
│                                    │
│  8+ Valid Complaints?              │
│  └─ YES → SUSPENSION RECOMMENDED   │
│                                    │
│  5+ Valid Complaints?              │
│  └─ YES → UNDER REVIEW             │
│                                    │
│  3+ Valid Complaints?              │
│  └─ YES → FIRST WARNING            │
│                                    │
└────────────────────────────────────┘
         ↓
Display Recommendation to Admin
         ↓
Admin Reviews
         ↓
┌─────────────────┐
│ Issue Warning?  │
└────┬────────┬───┘
     │        │
    YES      NO
     ↓        ↓
Issue Warning  Skip
     ↓
warningIssued = true
warningDetails recorded
     ↓
Vendor Flagged
```

### Student Misuse Detection

```
Ticket Rejected by Admin
         ↓
Count Student's Rejected Tickets (Last 30 Days)
         ↓
┌────────────────────────┐
│                        │
│  3+ Rejected?          │
│  └─ YES → FLAG STUDENT │
│  └─ NO  → No Action    │
│                        │
└────────────────────────┘
         ↓
Display Alert to Admin
         ↓
Admin Takes Action
  - Review student account
  - Issue warning
  - Restrict access (manual)
```

---

## 📈 Escalation Process

### Student-Initiated Escalation

```
Student Views Ticket
         ↓
Ticket Status: Not Closed/Resolved
         ↓
Current Escalation Level < 3
         ↓
Click "Escalate"
         ↓
Provide Escalation Reason
         ↓
Confirm
         ↓
┌──────────────────────────┐
│ Escalation Level +1      │
│ Status → "escalated"     │
│ Action Logged            │
└──────────────────────────┘
         ↓
Admin Notified (future: email)
         ↓
Admin Reviews Escalated Ticket
         ↓
Admin Takes Action
```

### Escalation Levels

```
Level 0 (Default)
  └─ Normal ticket
       ↓
Level 1 (First Escalation)
  └─ Student needs attention
       ↓
Level 2 (Second Escalation)
  └─ Issue not resolved
       ↓
Level 3 (Final Escalation)
  └─ Critical - requires immediate action
       └─ Cannot escalate further
```

---

## 💬 Message Flow

### Student Message

```
Student Opens Ticket
         ↓
Type Message
         ↓
Send
         ↓
┌──────────────────────────┐
│ Message Added            │
│ senderRole: student      │
│ Timestamp Recorded       │
└──────────────────────────┘
         ↓
If Status = "waiting_student"
         ↓
Status → "waiting_vendor"
         ↓
Vendor Notified (future)
```

### Admin Message

```
Admin Opens Ticket
         ↓
Type Message
         ↓
Send
         ↓
┌──────────────────────────┐
│ Message Added            │
│ senderRole: admin        │
│ Timestamp Recorded       │
└──────────────────────────┘
         ↓
Student Notified (future)
```

### Vendor Message (API)

```
Vendor Views Ticket (API)
         ↓
Type Reply
         ↓
Send via API
         ↓
┌──────────────────────────┐
│ Message Added            │
│ senderRole: vendor       │
│ Timestamp Recorded       │
└──────────────────────────┘
         ↓
If Status = "waiting_vendor"
         ↓
Status → "waiting_student"
         ↓
Student Notified (future)
```

---

## 🔍 Admin Decision Tree

### When Reviewing a Ticket

```
                    Ticket Received
                          ↓
                    ┌──────────┐
                    │ Is Valid?│
                    └─┬──────┬─┘
                      │      │
                     YES    NO
                      ↓      ↓
                 Investigate  Reject
                      ↓         └─→ Provide reason
                      │             └─→ Check student misuse
                      ↓
              ┌───────────────┐
              │ Vendor Issue? │
              └─┬───────────┬─┘
                │           │
               YES         NO
                ↓           ↓
         Contact Vendor   Resolve Directly
                ↓           ↓
         Wait for Reply   Mark Resolved
                ↓           ↓
         ┌──────────────┐  │
         │ Resolved?    │  │
         └─┬──────────┬─┘  │
           │          │    │
          YES        NO    │
           ↓          ↓    │
      Mark Resolved  │    │
           │         │    │
           │    Escalate? │
           │         ↓    │
           │    ┌────────┐│
           │    │ Warn?  ││
           │    └─┬────┬─┘│
           │      │    │  │
           │     YES  NO  │
           │      ↓    │  │
           │  Issue   │  │
           │  Warning │  │
           │      │    │  │
           └──────┴────┴──┘
                  ↓
              Close Ticket
```

---

## 📊 Complete Lifecycle

### From Creation to Closure

```
1. CREATION
   Student submits complaint
   ↓
   Ticket created (open)
   Priority auto-assigned
   Ticket number generated
   
2. INITIAL REVIEW
   Admin views ticket
   ↓
   Validates complaint
   ↓
   ┌─ Valid → Continue
   └─ Invalid → Reject

3. INVESTIGATION
   Admin changes status to "in_progress"
   ↓
   Assigns to admin (optional)
   ↓
   Contacts vendor if needed
   ↓
   Status → "waiting_vendor"

4. VENDOR RESPONSE
   Vendor replies (API)
   ↓
   Status → "waiting_student"
   ↓
   Student reviews response

5. RESOLUTION
   Issue resolved
   ↓
   Admin/Vendor marks as "resolved"
   ↓
   Student confirms

6. CLOSURE
   Admin/Student closes ticket
   ↓
   Status → "closed"
   ↓
   Ticket archived

7. POSSIBLE REOPEN
   If issue persists
   ↓
   Student reopens
   ↓
   Status → "reopened"
   ↓
   Back to step 3
```

---

## 🎯 Quick Reference

### Student Actions
- ✅ Create complaint
- ✅ View own tickets
- ✅ Add messages
- ✅ Escalate (max 3 times)
- ✅ Close ticket
- ✅ Reopen ticket

### Admin Actions
- ✅ View all tickets
- ✅ Change status
- ✅ Change priority
- ✅ Assign ticket
- ✅ Add messages
- ✅ Resolve ticket
- ✅ Close ticket
- ✅ Warn vendor
- ✅ Reject ticket

### Vendor Actions (API)
- ✅ View own tickets
- ✅ Add replies
- ✅ Resolve ticket

### Automatic Actions
- ✅ Ticket number generation
- ✅ Priority assignment
- ✅ Warning recommendations
- ✅ Misuse detection
- ✅ Action logging

---

## 📝 Notes

1. All workflows are implemented and functional in Part A
2. Email notifications are placeholders for Part B
3. Vendor UI workflows will be added in Part B
4. All actions are logged for audit trail
5. Status transitions are validated by backend
6. Authorization is enforced on all actions

---

This workflow documentation provides a complete visual guide to how the Unistay Ticketing System operates in Part A.
