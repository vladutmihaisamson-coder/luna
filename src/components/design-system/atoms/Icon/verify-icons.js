/**
 * Icon Verification Script
 * Run this to verify all icon imports exist in react-icons
 * Usage: node src/components/design-system/atoms/Icon/verify-icons.js
 */

const iconImports = {
  'react-icons/fi': ['FiPlus', 'FiMinus', 'FiTrash2', 'FiRotateCcw', 'FiFilter'],
  'react-icons/md': ['MdAdd', 'MdRemove', 'MdDelete', 'MdRefresh', 'MdFilterList', 'MdDragHandle'],
  'react-icons/bs': ['BsGripVertical'],
};

const results = {
  passed: [],
  failed: [],
};

Object.entries(iconImports).forEach(([packageName, icons]) => {
  try {
    const iconModule = require(packageName);
    icons.forEach(iconName => {
      if (iconName in iconModule) {
        results.passed.push(`${iconName} from ${packageName}`);
      } else {
        results.failed.push(`${iconName} from ${packageName}`);
      }
    });
  } catch (error) {
    results.failed.push(`Failed to load ${packageName}: ${error.message}`);
  }
});

console.log('\n=== Icon Verification Results ===\n');
console.log(`✓ Passed: ${results.passed.length}`);
results.passed.forEach(item => console.log(`  ✓ ${item}`));

if (results.failed.length > 0) {
  console.log(`\n✗ Failed: ${results.failed.length}`);
  results.failed.forEach(item => console.log(`  ✗ ${item}`));
  process.exit(1);
} else {
  console.log('\n✓ All icons verified successfully!\n');
  process.exit(0);
}

