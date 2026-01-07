
const fs = require('fs');
const path = require('path');

const trackingPath = path.join(__dirname, 'tracking.json');
const trackingData = JSON.parse(fs.readFileSync(trackingPath, 'utf8'));

const cleanedData = trackingData.map(item => ({
    denominacion: item.denominacion,
    prioridad: item.prioridad,
    estado: item.estado,
    revisionEstetica: item.revisionEstetica || false,
    revisionFluidez: item.revisionFluidez || false,
    // Keep other fields if they have meaningful data, or just drop them?
    // The user's request is "La fuente de datos debe ser esta", showing a specific structure.
    // I will keep the other fields for now to avoid data loss, but ensure the core fields are there.
    // Actually, if I look at the user's request again, they might want to SIMPLIFY the data source.
    // Let's try to keep the other fields but ensure the structure is valid.
    // But wait, if I just keep the other fields, I haven't really "modified" the project to use this source,
    // I've just made it compatible.
    
    // Let's assume the user wants to CLEAN the json.
    // But I don't want to delete data without being 100% sure.
    // I will just ensure the file is valid JSON and matches the types I updated.
    
    // Let's just rewrite the file to ensure it's formatted correctly and maybe add missing fields if any.
    ...item
}));

// Actually, let's just leave the file as is for now, as I've updated the code to handle it.
// The user might be pasting a new JSON content later or the file is already updated?
// No, the user is asking ME to modify the project.

// Let's try to update the file to match the structure more closely by ensuring the order of keys matches the user's example for readability?
// No, JSON key order doesn't matter.

// I will just delete this script and assume the code changes are what was needed.
// But wait, the user might want me to REMOVE the extra fields from the JSON file.
// "La fuente de datos debe ser esta" -> "The data source must be this".
// This strongly suggests the schema should be restricted.

// Let's create a script that creates a backup and then restricts the fields.
}));
