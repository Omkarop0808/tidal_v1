const fs = require('fs');
const path = require('path');

const replacements = [
  {
    file: 'src/components/analytics/AccuracyEvaluator.tsx',
    replacements: [
      { search: /Scale,\s*/g, replace: '' }
    ]
  },
  {
    file: 'src/components/dashboard/ComparisonVisual.tsx',
    replacements: [
      { search: /Sparkles,\s*/g, replace: '' }
    ]
  },
  {
    file: 'src/components/dashboard/DispatchPlanModal.tsx',
    replacements: [
      { search: /Clock,\s*/g, replace: '' },
      { search: /Weight,\s*/g, replace: '' }
    ]
  },
  {
    file: 'src/pages/CircularRecovery.tsx',
    replacements: [
      { search: /import\s*\{\s*motion\s*\}\s*from\s*'framer-motion';\n?/g, replace: '' },
      { search: /CheckCircle2,\s*/g, replace: '' }
    ]
  },
  {
    file: 'src/pages/Hotspots.tsx',
    replacements: [
      { search: /Sparkles,\s*/g, replace: '' },
      { search: /Recycle,\s*/g, replace: '' },
      { search: /Compass,\s*/g, replace: '' }
    ]
  },
  {
    file: 'src/pages/ModelLab.tsx',
    replacements: [
      { search: /BarChart2,\s*/g, replace: '' }
    ]
  },
  {
    file: 'src/pages/Overview.tsx',
    replacements: [
      { search: /BarChart3,\s*/g, replace: '' },
      { search: /Compass,\s*/g, replace: '' },
      { search: /Eye,\s*/g, replace: '' },
      { search: /Clock,\s*/g, replace: '' },
      { search: /Sparkles,\s*/g, replace: '' },
      { search: /ChevronRight,\s*/g, replace: '' }
    ]
  }
];

replacements.forEach(item => {
  const filePath = path.join(__dirname, item.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    item.replacements.forEach(r => {
      content = content.replace(r.search, r.replace);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${item.file}`);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});
