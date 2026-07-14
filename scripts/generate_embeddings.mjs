import { pipeline, env } from '@xenova/transformers';
import fs from 'fs/promises';
import path from 'path';

// Optional: don't use local models if you want it to auto-download from HuggingFace
env.allowLocalModels = false;

async function generateEmbeddings() {
  console.log('Loading dataset...');
  const dataPath = path.resolve('data', 'legal-precedents.json');
  const dataRaw = await fs.readFile(dataPath, 'utf-8');
  const precedents = JSON.parse(dataRaw);

  console.log('Loading model (this might take a few seconds on first run)...');
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  const embeddingsOutput = {};

  console.log('Generating embeddings...');
  for (let i = 0; i < precedents.length; i++) {
    const item = precedents[i];
    console.log(`Embedding ${i+1}/${precedents.length}: ${item.id}`);
    
    // pooling: 'mean' and normalize: true is standard for MiniLM semantic search
    const output = await extractor(item.text, { pooling: 'mean', normalize: true });
    
    embeddingsOutput[item.id] = Array.from(output.data);
  }

  const outPath = path.resolve('data', 'legal-precedents-embeddings.json');
  await fs.writeFile(outPath, JSON.stringify(embeddingsOutput, null, 2));
  console.log(`Saved embeddings to ${outPath}`);
}

generateEmbeddings().catch(console.error);
