// APEX REVENUE - Broadcast Panel Update Handler
// *** FULL REPLACEMENT — paste this into the "Broadcast Panel Update" handler ***

(function() {
  var panelStyle = $settings.panelStyle || 'Tips & Top Tipper';
  if (panelStyle === 'Disabled') return;

  var totalTips = $kv.get('session_total_tips', 0);
  var tipCount = $kv.get('session_tip_count', 0);
  var highestTip = $kv.get('session_highest_tip', 0);
  var highestTipper = $kv.get('session_highest_tipper', '');
  var uniqueTippers = ($kv.get('session_unique_tippers', [])).length;

  var options = {};

  // Row 1: Session total
  options.row1_label = 'Session Tips';
  options.row1_value = totalTips + ' tk (' + tipCount + ' tips)';

  if (panelStyle === 'Tips & Top Tipper') {
    // Row 2: Top tipper
    if (highestTipper) {
      options.row2_label = 'Top Tipper';
      options.row2_value = highestTipper + ' (' + highestTip + ' tk)';
    } else {
      options.row2_label = 'Top Tipper';
      options.row2_value = 'Be the first!';
    }

    // Row 3: Goal progress or unique tippers
    if ($settings.tipGoalEnabled && $settings.tipGoalAmount > 0) {
      var goal = $settings.tipGoalAmount;
      var pct = Math.min(100, Math.floor((totalTips / goal) * 100));
      var bar = '';
      var filled = Math.floor(pct / 10);
      for (var i = 0; i < 10; i++) {
        bar += i < filled ? '█' : '░';
      }
      options.row3_label = 'Goal (' + pct + '%)';
      options.row3_value = bar + ' ' + totalTips + '/' + goal + ' tk';
    } else {
      options.row3_label = 'Unique Tippers';
      options.row3_value = uniqueTippers + ' viewers tipped';
    }
  }

  $room.setPanelTemplate(options);
})();
