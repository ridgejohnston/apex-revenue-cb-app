// APEX REVENUE - Callback Handler
// *** FULL REPLACEMENT – paste this into the "Callback" handler ***

if ($callback.label === 'auto_announce') {
  // Existing periodic extension announcement
  sendRoomAnnouncement();
  $room.reloadPanel();
} else if ($callback.label === 'recurring_banner') {
  // —— New: Recurring custom banner ———————————————————————————————————————
  sendRecurringBanner();
  $room.reloadPanel();
}
