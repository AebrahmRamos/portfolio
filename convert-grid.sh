#!/bin/bash
# Script to convert Grid to Grid2 in all component files

# List of files to convert
files=(
  "src/components/sections/Projects.jsx"
  "src/components/sections/Education.jsx"
  "src/components/sections/Experience.jsx"
  "src/components/sections/Contact.jsx"
  "src/components/sections/Skills.jsx"
  "src/components/sections/Resume.jsx"
)

for file in "${files[@]}"; do
  echo "Converting $file..."
  
  # 1. Replace import statement
  sed -i '' 's/Grid,/Grid2,/g' "$file"
  sed -i '' 's/ Grid } from/ Grid2 } from/g' "$file"
  
  # 2. Replace opening tags
  sed -i '' 's/<Grid /<Grid2 /g' "$file"
  
  # 3. Replace closing tags
  sed -i '' 's/<\/Grid>/<\/Grid2>/g' "$file"
  
  # 4. Replace item prop pattern: item xs={12} md={6} -> size={{ xs: 12, md: 6 }}
  # This handles xs/sm/md/lg/xl combinations
  sed -i '' -E 's/item xs=\{([0-9]+)\} sm=\{([0-9]+)\} md=\{([0-9]+)\}/size={{ xs: \1, sm: \2, md: \3 }}/g' "$file"
  sed -i '' -E 's/item xs=\{([0-9]+)\} md=\{([0-9]+)\}/size={{ xs: \1, md: \2 }}/g' "$file"
  sed -i '' -E 's/item xs=\{([0-9]+)\} sm=\{([0-9]+)\}/size={{ xs: \1, sm: \2 }}/g' "$file"
  sed -i '' -E 's/item xs=\{([0-9]+)\}/size={{ xs: \1 }}/g' "$file"
  sed -i '' -E 's/item md=\{([0-9]+)\}/size={{ md: \1 }}/g' "$file"
  
  echo "✓ Converted $file"
done

echo "All files converted!"
