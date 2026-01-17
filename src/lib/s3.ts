import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
})

const BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME

/**
 * Upload image to S3 and return public URL
 */
export async function uploadImageToS3(
  file: File,
  folder: string = 'rooms'
): Promise<string> {
  try {
    const fileExtension = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`

    // Convert File to ArrayBuffer, then to Uint8Array
    // This avoids the streaming API issue
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: uint8Array, // Use Uint8Array instead of File
      ContentType: file.type,
      // ACL removed - bucket uses bucket policies instead
    })

    await s3Client.send(command)

    // Return public URL
    const publicUrl = `https://${BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileName}`
    
    console.log('✅ Image uploaded to S3:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('❌ Error uploading to S3:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Upload multiple images to S3
 */
export async function uploadMultipleImagesToS3(
  files: File[],
  folder: string = 'rooms'
): Promise<string[]> {
  console.log(`📸 Uploading ${files.length} images to S3...`)
  const uploadPromises = files.map((file) => uploadImageToS3(file, folder))
  const urls = await Promise.all(uploadPromises)
  console.log(`✅ ${urls.length} images uploaded successfully!`)
  return urls
}