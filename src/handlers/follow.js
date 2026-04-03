// APEX REVENUE - User Follow Handler
// *** FULL REPLACEMENT – paste this into the "User Follow" handler ***

$kv.incr('all_time_follows');

var username = $user.username;

// —— Follow Banner ——————————————————————————————————————————————————————————
sendFollowBanner(username);

// Whisper install guide to new followers
if (username !== $room.owner) {
  sendInstallGuide(username);
}
