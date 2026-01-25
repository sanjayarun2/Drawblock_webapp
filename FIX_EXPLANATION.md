# Fix: Error 400 "Could not extract steps" in server.py

## Problem
The server was returning `Error 400: Could not extract steps` even though `main.py` worked correctly in terminal.

## Root Cause
The `server.py` was missing a critical condition from `main.py` that determines when to skip AI processing for explicit lists.

### In main.py (line 48) - CORRECT:
```python
elif is_explicit_list(user_input) and " " not in user_input.strip().replace(",", ""):
```

### In server.py (line 69) - INCORRECT (before fix):
```python
elif is_explicit_list(user_input):
```

## The Issue Explained

The condition `" " not in user_input.strip().replace(",", "")` checks if the input is a **pure comma-separated list without spaces**.

**Example inputs:**

1. ✅ `"Login,Verify,Dashboard"` → Skip AI (pure list, no spaces)
2. ❌ `"Login, Verify, Dashboard"` → Use AI (has spaces after commas)
3. ❌ `"User logs in and verifies"` → Use AI (natural language)

**Without this condition:**
- Input like `"Login, Verify, Dashboard"` was treated as an explicit list
- It bypassed AI and was split directly
- But if the AI was needed for proper parsing, it would fail
- This caused the "Could not extract steps" error

## The Fix

Added the missing condition to `server.py` line 70:

```python
# CASE B: Explicit List (Bypass AI just like main.py)
# "If user directly give what should be in block diagram"
elif is_explicit_list(user_input) and " " not in user_input.strip().replace(",", ""):
    # If it's JUST words separated by commas, skip AI to follow instruction strictly
    print("👉 Detected Explicit List (Skipping AI extraction).")
    labels = [x.strip() for x in re.split(r'[,\n]+', user_input) if x.strip()]
```

Now `server.py` matches `main.py` exactly.

## Test Cases

| Input | is_explicit_list() | has_spaces_after_comma_removal | Action |
|-------|-------------------|-------------------------------|--------|
| `Login,Verify,Dashboard` | ✅ True | ❌ False | Skip AI ✅ |
| `Login, Verify, Dashboard` | ✅ True | ✅ True | Use AI ✅ |
| `User logs in` | ❌ False | ❌ False | Use AI ✅ |
| `Login\nVerify\nDashboard` | ✅ True | ❌ False | Skip AI ✅ |

## Result

The server now correctly:
1. Skips AI for pure comma/newline-separated lists (no spaces)
2. Uses AI for lists with spaces or natural language descriptions
3. Matches the behavior of `main.py` exactly

This fixes the "Could not extract steps" error when the input required AI processing but was incorrectly classified as an explicit list.
