import { db } from './firebase'
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore'
import { migrateImageToStorage, isFirebaseStorageUrl } from './firebaseStorage'

export interface MigrationResult {
  total: number
  migrated: number
  failed: number
  skipped: number
  errors: string[]
}

/**
 * Migrates all existing images to Firebase Storage
 */
export async function migrateAllImagesToStorage(): Promise<MigrationResult> {
  const result: MigrationResult = {
    total: 0,
    migrated: 0,
    failed: 0,
    skipped: 0,
    errors: []
  }

  try {
    console.log('🚀 Starting image migration to Firebase Storage...')

    // Get all generated images that are not already stored in Firebase
    const imagesQuery = query(
      collection(db, 'generatedImages'),
      where('storedInFirebase', '!=', true)
    )
    
    const querySnapshot = await getDocs(imagesQuery)
    result.total = querySnapshot.size

    console.log(`📊 Found ${result.total} images to migrate`)

    for (const docSnapshot of querySnapshot.docs) {
      const imageData = docSnapshot.data()
      const imageId = docSnapshot.id

      try {
        // Skip if already a Firebase Storage URL
        if (isFirebaseStorageUrl(imageData.imageUrl)) {
          console.log(`⏭️ Skipping ${imageId} - already in Firebase Storage`)
          result.skipped++
          
          // Update the document to mark as stored
          await updateDoc(doc(db, 'generatedImages', imageId), {
            storedInFirebase: true,
            storagePath: imageData.storagePath || 'unknown'
          })
          continue
        }

        console.log(`🔄 Migrating image ${imageId}...`)

        // Migrate the image
        const migrationResult = await migrateImageToStorage(
          imageData.imageUrl,
          imageData.prompt || 'untitled',
          imageData.model || 'unknown'
        )

        if (migrationResult.success) {
          // Update Firestore document with new URL and storage info
          await updateDoc(doc(db, 'generatedImages', imageId), {
            originalImageUrl: imageData.imageUrl, // Keep original URL for reference
            imageUrl: migrationResult.url,        // Update to Firebase Storage URL
            storagePath: migrationResult.path,
            storedInFirebase: true,
            migratedAt: new Date()
          })

          console.log(`✅ Successfully migrated ${imageId}`)
          result.migrated++
        } else {
          console.error(`❌ Failed to migrate ${imageId}:`, migrationResult.error)
          result.failed++
          result.errors.push(`${imageId}: ${migrationResult.error}`)
        }

      } catch (error) {
        console.error(`❌ Error processing ${imageId}:`, error)
        result.failed++
        result.errors.push(`${imageId}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Add a small delay to avoid overwhelming Firebase
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('🎉 Migration completed:', result)
    return result

  } catch (error) {
    console.error('❌ Migration failed:', error)
    result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return result
  }
}

/**
 * Migrates a single image to Firebase Storage
 */
export async function migrateSingleImage(imageId: string): Promise<boolean> {
  try {
    console.log(`🔄 Migrating single image: ${imageId}`)

    const docRef = doc(db, 'generatedImages', imageId)
    const docSnapshot = await getDocs(query(collection(db, 'generatedImages'), where('__name__', '==', imageId)))
    
    if (docSnapshot.empty) {
      console.error(`❌ Image ${imageId} not found`)
      return false
    }

    const imageData = docSnapshot.docs[0].data()

    // Skip if already migrated
    if (imageData.storedInFirebase || isFirebaseStorageUrl(imageData.imageUrl)) {
      console.log(`⏭️ Image ${imageId} already migrated`)
      return true
    }

    // Migrate the image
    const migrationResult = await migrateImageToStorage(
      imageData.imageUrl,
      imageData.prompt || 'untitled',
      imageData.model || 'unknown'
    )

    if (migrationResult.success) {
      // Update Firestore document
      await updateDoc(docRef, {
        originalImageUrl: imageData.imageUrl,
        imageUrl: migrationResult.url,
        storagePath: migrationResult.path,
        storedInFirebase: true,
        migratedAt: new Date()
      })

      console.log(`✅ Successfully migrated single image: ${imageId}`)
      return true
    } else {
      console.error(`❌ Failed to migrate single image ${imageId}:`, migrationResult.error)
      return false
    }

  } catch (error) {
    console.error(`❌ Error migrating single image ${imageId}:`, error)
    return false
  }
}

/**
 * Gets migration status for all images
 */
export async function getMigrationStatus(): Promise<{
  total: number
  migrated: number
  pending: number
}> {
  try {
    // Get total count
    const allImagesSnapshot = await getDocs(collection(db, 'generatedImages'))
    const total = allImagesSnapshot.size

    // Get migrated count
    const migratedQuery = query(
      collection(db, 'generatedImages'),
      where('storedInFirebase', '==', true)
    )
    const migratedSnapshot = await getDocs(migratedQuery)
    const migrated = migratedSnapshot.size

    return {
      total,
      migrated,
      pending: total - migrated
    }

  } catch (error) {
    console.error('❌ Error getting migration status:', error)
    return { total: 0, migrated: 0, pending: 0 }
  }
}

/**
 * Checks if migration is needed
 */
export async function isMigrationNeeded(): Promise<boolean> {
  const status = await getMigrationStatus()
  return status.pending > 0
}
