import dotenv from 'dotenv';

import { createClient } from '@supabase/supabase-js';
import { FOOD_ITEMS } from '../src/data.js';

dotenv.config({ path: '.env.migration' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.migration'
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const normalizeName = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, ' ');

async function migrateProducts() {
  console.log('Starting product migration...\n');

  // Get existing products from Supabase
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, name');

  if (fetchError) {
    throw new Error(`Could not fetch products: ${fetchError.message}`);
  }

  if (!products || products.length === 0) {
    throw new Error('No products were found in the Supabase products table.');
  }

  let updated = 0;
  let unmatched = 0;

  for (const foodItem of FOOD_ITEMS) {
    const normalizedFoodName = normalizeName(foodItem.name);

    const matches = products.filter(
      (product) => normalizeName(product.name) === normalizedFoodName
    );

    // Don't guess if there is no exact normalized match
    if (matches.length === 0) {
      console.log(`❌ Not found: ${foodItem.name}`);
      unmatched++;
      continue;
    }

    // Don't guess if duplicate product names exist
    if (matches.length > 1) {
      console.log(`⚠️ Duplicate name in Supabase: ${foodItem.name}`);
      unmatched++;
      continue;
    }

    const product = matches[0];

    const { error: updateError } = await supabase
      .from('products')
      .update({
        rating: Number(foodItem.rating ?? 0),
        prep_time: foodItem.prepTime || null,
        is_featured: foodItem.isFeatured ?? false,
        options: foodItem.options ?? [],
      })
      .eq('id', product.id);

    if (updateError) {
      console.log(
        `❌ Failed: ${foodItem.name} → ${updateError.message}`
      );
      continue;
    }

    console.log(`✅ Updated: ${foodItem.name}`);
    updated++;
  }

  console.log('\n------------------------------');
  console.log('Migration complete!');
  console.log(`Updated: ${updated}`);
  console.log(`Not matched: ${unmatched}`);
  console.log('------------------------------\n');
}

migrateProducts().catch((error) => {
  console.error('\nMigration failed:');
  console.error(error.message);
  process.exit(1);
});