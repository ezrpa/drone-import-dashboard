#!/bin/bash

# Change to the src directory
cd /home/prince/WebstormProjects/drone-import-dashboard/src/

# Function to move file and remove first line
move_and_remove_first_line() {
    local source="$1"
    local destination="$2"
    
    if [ -f "$source" ]; then
        echo "Processing: $source -> $destination"
        # Create directory if needed
        mkdir -p "$(dirname "$destination")"
        # Move file and remove first line
        tail -n +2 "$source" > "$destination"
        rm "$source"
        echo "✓ Moved and processed: $destination"
    else
        echo "✗ File not found: $source"
    fi
}

# Function to rename file
rename_file() {
    local source="$1"
    local destination="$2"
    
    if [ -f "$source" ]; then
        echo "Renaming: $source -> $destination"
        mv "$source" "$destination"
        echo "✓ Renamed: $destination"
    else
        echo "✗ File not found: $source"
    fi
}

echo "Starting file reorganization..."
echo "================================"

# 1. Move drone-alert-service.js to services/AlertService.js
move_and_remove_first_line "drone-alert-service.js" "services/AlertService.js"

# 2. Move drone-calculation-service.js to services/DroneCalculationService.js
move_and_remove_first_line "drone-calculation-service.js" "services/DroneCalculationService.js"

# 3. Move drone-calculations-hook.js to hooks/useDroneCalculations.js
move_and_remove_first_line "drone-calculations-hook.js" "hooks/useDroneCalculations.js"

# 4. Move drone-constants.js to models/constants.js
move_and_remove_first_line "drone-constants.js" "models/constants.js"

# 5. Move drone-formatters.js to utils/formatters.js
move_and_remove_first_line "drone-formatters.js" "utils/formatters.js"

# 6. Move drone-main-dashboard-component.js to components/DroneImportDashboard.jsx
move_and_remove_first_line "drone-main-dashboard-component.js" "components/DroneImportDashboard.jsx"

# 7. Move drone-models-data.js to models/droneData.js
move_and_remove_first_line "drone-models-data.js" "models/droneData.js"

# 8. Move drone-tax-structure.js to models/taxStructure.js
move_and_remove_first_line "drone-tax-structure.js" "models/taxStructure.js"

# 9. Create ui directory and move drone-ui-components-file.js to components/ui/index.js
mkdir -p "components/ui"
move_and_remove_first_line "drone-ui-components-file.js" "components/ui/index.js"

# 10. Rename drone-import-dashboard.tsx to ImportDashboard.tsx
rename_file "drone-import-dashboard.tsx" "ImportDashboard.tsx"

# 11. Rename drone-project-structure.json to projectStructure.json
rename_file "drone-project-structure.json" "projectStructure.json"

echo "================================"
echo "File reorganization complete!"
echo ""
echo "Summary of changes:"
echo "- Moved 9 files to their new locations and removed first line"
echo "- Renamed 2 files in place"
echo "- Created ui subdirectory under components"