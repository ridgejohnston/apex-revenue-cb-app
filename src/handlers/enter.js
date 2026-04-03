// APEX REVENUE - User Enter Handler
// *** FULL REPLACEMENT – paste this into the "User Enter" handler ***

$kv.incr('session_user_enters');

var onboardingEnabled = $settings.onboardingEnabled;
var onboarded = $kv.get('onboarded_users', {});
var username = $user.username;
var tipperTotals = $kv.get('session_tipper_totals', {});

// Onboarding for new users
if (onboardingEnabled && !onboarded[username]) {
  sendOnboardingWelcome(username);
  onboarded[username] = true;
  $kv.set('onboarded_users', onboarded);
}

// Custom welcome message (from display settings)
if ($settings.welcomeMessage && !onboarded[username]) {
  apexWhisper(username, $settings.welcomeMessage);
}

// —— Enter Banner for known tippers ———————————————————————————————————————
sendEnterBanner(username);

// —— Viewer Milestone Check ———————————————————————————————————————————————
checkViewerMilestone();

// Send help menu to mods/owner
if ($user.isMod || username === $room.owner) {
  // Only on first enter
  if (!onboarded['_mod_' + username]) {
    sendHelpMenu(username, username === $room.owner);
    onboarded['_mod_' + username] = true;
    $kv.set('onboarded_users', onboarded);
  }
}
