#!/usr/bin/env node

// Script de diagnostic pour vérifier la configuration et la connectivité

/**
 * Script de vérification des variables d'environnement
 * Usage: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const requiredVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'BACKEND_URL',
];

const optionalVars = [
  'CLERK_PUBLISHABLE_KEY',
  'DASHBOARD_ADMIN_URL',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
];

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  const envLocalPath = path.join(process.cwd(), '.env.local');
  
  let envExists = fs.existsSync(envPath);
  let envLocalExists = fs.existsSync(envLocalPath);
  
  console.log('\n📋 Vérification des fichiers .env\n');
  console.log(`   .env:        ${envExists ? '✅ Trouvé' : '❌ Non trouvé'}`);
  console.log(`   .env.local:  ${envLocalExists ? '✅ Trouvé' : '❌ Non trouvé'}`);
  
  if (!envExists && !envLocalExists) {
    console.log('\n⚠️  Aucun fichier .env trouvé !');
    console.log('   Créez un fichier .env à la racine du projet.');
    console.log('   Consultez ENV_COMPLETE.md pour le format attendu.\n');
    return false;
  }
  
  return true;
}

function checkEnvVars() {
  console.log('\n🔍 Vérification des variables d\'environnement\n');
  
  let allPresent = true;
  const missing = [];
  const present = [];
  
  // Vérifier les variables obligatoires
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      missing.push(varName);
      allPresent = false;
      console.log(`   ❌ ${varName}: MANQUANT`);
    } else {
      present.push(varName);
      // Masquer la valeur pour la sécurité
      const displayValue = varName.includes('SECRET') || varName.includes('KEY')
        ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
        : value;
      console.log(`   ✅ ${varName}: ${displayValue}`);
    }
  });
  
  // Vérifier les variables optionnelles
  console.log('\n   Variables optionnelles:');
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      console.log(`   ⚠️  ${varName}: Non définie (optionnel)`);
    } else {
      const displayValue = varName.includes('SECRET') || varName.includes('KEY')
        ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
        : value;
      console.log(`   ✅ ${varName}: ${displayValue}`);
    }
  });
  
  if (!allPresent) {
    console.log('\n❌ Variables manquantes:');
    missing.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n💡 Solution:');
    console.log('   1. Créez ou modifiez le fichier .env à la racine du projet');
    console.log('   2. Ajoutez les variables manquantes');
    console.log('   3. Redémarrez le serveur de développement');
    console.log('   4. Consultez ENV_COMPLETE.md pour plus d\'informations\n');
    return false;
  }
  
  console.log('\n✅ Toutes les variables obligatoires sont présentes !\n');
  return true;
}

async function checkBackendConnectivity() {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
  console.log('\n🌐 Vérification de la connectivité au backend\n');
  console.log(`   URL: ${backendUrl}`);
  
  return new Promise((resolve) => {
    const url = new URL(backendUrl);
    const client = url.protocol === 'https:' ? https : http;
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: '/api/health', // Les routes sont montées sous /api dans app.ts
      method: 'GET',
    };

    let resolved = false; // Flag pour éviter les résolutions multiples

    const req = client.request(options, (res) => {
      if (resolved) return; // Éviter les résolutions multiples
      resolved = true;
      console.log(`   ✅ Backend accessible (Status: ${res.statusCode})`);
      resolve(true);
    });

    // Gérer les erreurs
    req.on('error', (err) => {
      if (resolved) return; // Éviter les résolutions multiples
      resolved = true;
      
      if (err.code === 'ECONNREFUSED') {
        console.log(`   ❌ Backend non accessible: Connexion refusée`);
        console.log(`   💡 Vérifiez que le backend est démarré sur ${backendUrl}`);
      } else if (err.code === 'ETIMEDOUT') {
        console.log(`   ❌ Backend non accessible: Timeout`);
        console.log(`   💡 Le backend ne répond pas dans les 5 secondes`);
      } else {
        console.log(`   ❌ Backend non accessible: ${err.message}`);
      }
      resolve(false);
    });

    // Configurer le timeout avec setTimeout pour pouvoir l'annuler
    const timeoutId = setTimeout(() => {
      if (resolved) return; // Éviter les résolutions multiples
      resolved = true;
      req.destroy();
      console.log(`   ❌ Backend non accessible: Timeout`);
      console.log(`   💡 Le backend ne répond pas dans les 5 secondes`);
      resolve(false);
    }, 5000);

    // Annuler le timeout si la requête réussit
    req.on('response', () => {
      clearTimeout(timeoutId);
    });

    req.end();
  });
}

// Vérifier si on est dans le bon répertoire
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Erreur: Ce script doit être exécuté depuis la racine du projet gearconnect-landing');
  process.exit(1);
}

// Charger les variables d'environnement depuis .env si disponible
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

// Exécuter les vérifications
async function runChecks() {
  const envFileExists = checkEnvFile();
  const envVarsOk = checkEnvVars();

  if (!envFileExists || !envVarsOk) {
    process.exit(1);
  }

  // Tester la connectivité au backend si BACKEND_URL est défini
  if (process.env.BACKEND_URL) {
    const backendOk = await checkBackendConnectivity();
    if (!backendOk) {
      console.log('\n⚠️  Le backend n\'est pas accessible.');
      console.log('   Cela peut causer des erreurs de timeout lors de l\'envoi de messages.\n');
    }
  }

  console.log('\n✅ Vérification terminée !\n');
}

runChecks().catch(err => {
  console.error('Erreur lors de la vérification:', err);
  process.exit(1);
});
