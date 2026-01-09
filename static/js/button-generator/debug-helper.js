// Debug helper - add this temporarily to main.js to see what's happening

export function debugControlValues(generator) {
  console.log('=== DEBUG: Control Values ===');
  const values = generator.getControlValues();

  // Text controls
  console.log('Text controls:');
  console.log('  button-text:', values['button-text']);
  console.log('  font-size:', values['font-size']);
  console.log('  text-x:', values['text-x']);
  console.log('  text-y:', values['text-y']);

  // Check which effects are enabled
  console.log('\nEnabled effects:');
  generator.getAllEffects().forEach(effect => {
    const enabled = effect.isEnabled(values);
    if (enabled) {
      console.log(`  ✓ ${effect.name} (${effect.id})`);
    }
  });

  console.log('\nAll control values:', values);
  console.log('=== END DEBUG ===');
}
