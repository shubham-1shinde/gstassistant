# Fix Auth Issues: Unauthorized Requests & Login Page Blocking

## Step 1: [PENDING] Create TODO.md ✅
- Done: This file created.

## Step 2: ✅ Fix SignIn.jsx redirect
- Replace early return with proper Navigate if auth.status true.

## Step 3: ✅ Update authSlice.js
- Add accessToken to state.
- Update login/logout actions.

## Step 4: ✅ Create axios utils with interceptor
- frontend/src/utils/axios.js: Add Authorization header interceptor using token from Redux/localStorage.

## Step 5: ✅ Add fetch invoices to SalesInvoices.jsx
- useEffect: GET /v1/invoice/invoices on mount, handle errors.

## Step 6: ✅ Update create-invoice POST
- Ensure uses axios instance with interceptor.

## Step 7: ✅ Add logout flow
- Clear state, localStorage, call /logout.

## Step 8: ✅ Test full flow
- Login, create invoice, logout, unauthorized handling.

Current progress: 8/8 ✅ All steps complete!

