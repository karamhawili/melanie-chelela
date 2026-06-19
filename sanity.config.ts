'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure, SINGLETON_TYPES} from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
  document: {
    // Singletons (Site Settings, Home Page, Works Page) are pinned to a
    // fixed document ID each in structure.ts — prevent creating a second
    // instance or deleting/duplicating the only one.
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((item) => !SINGLETON_TYPES.has(item.templateId))
      }
      return prev
    },
    actions: (prev, {schemaType}) => {
      if (SINGLETON_TYPES.has(schemaType)) {
        return prev.filter(({action}) => action !== 'duplicate' && action !== 'delete')
      }
      return prev
    },
  },
})
